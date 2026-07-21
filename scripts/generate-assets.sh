#!/usr/bin/env bash

set -euo pipefail

CV_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CV_ASSET_PORT="${CV_ASSET_PORT:-4178}"
CV_TMP_DIR="$(mktemp -d)"
CV_SERVER_PID=""

cleanup() {
    if [[ -n "$CV_SERVER_PID" ]]; then
        kill "$CV_SERVER_PID" 2>/dev/null || true
        wait "$CV_SERVER_PID" 2>/dev/null || true
    fi

    if [[ -d "$CV_TMP_DIR" && "$CV_TMP_DIR" == /tmp/* ]]; then
        rm -r "$CV_TMP_DIR"
    fi
}

trap cleanup EXIT INT TERM

for command in google-chrome pdfinfo curl pnpm; do
    if ! command -v "$command" >/dev/null 2>&1; then
        echo "Missing required command: $command" >&2
        exit 1
    fi
done

cd "$CV_ROOT"
pnpm dev --host 127.0.0.1 --port "$CV_ASSET_PORT" --strictPort >"$CV_TMP_DIR/vite.log" 2>&1 &
CV_SERVER_PID=$!

for _ in {1..50}; do
    if curl --fail --silent "http://127.0.0.1:$CV_ASSET_PORT/lead/" >/dev/null; then
        break
    fi

    sleep 0.1
done

if ! curl --fail --silent "http://127.0.0.1:$CV_ASSET_PORT/lead/" >/dev/null; then
    echo "The local CV server did not start." >&2
    sed -n '1,120p' "$CV_TMP_DIR/vite.log" >&2
    exit 1
fi

render_variant() {
    local route="$1"
    local filename="$2"
    local pdf_path="$CV_ROOT/assets/$filename.pdf"

    google-chrome \
        --headless \
        --disable-gpu \
        --no-sandbox \
        --run-all-compositor-stages-before-draw \
        --virtual-time-budget=5000 \
        --print-to-pdf="$pdf_path" \
        --print-to-pdf-page-size=A4 \
        --no-pdf-header-footer \
        "http://127.0.0.1:$CV_ASSET_PORT/$route/"

    local page_count
    page_count="$(pdfinfo "$pdf_path" | awk '/^Pages:/ {print $2}')"

    if [[ "$page_count" != "2" ]]; then
        echo "$pdf_path contains $page_count pages; expected exactly 2." >&2
        exit 1
    fi

}

render_variant "lead" "daniil-trofimov-team-lead"
render_variant "dev" "daniil-trofimov-senior-engineer"

echo "Generated PDF assets for both CV variants."
