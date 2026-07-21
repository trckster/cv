const themeToggle = document.getElementById('theme-toggle')
const themeStorageKey = 'cv-theme'

function applyTheme(theme) {
    const normalizedTheme = theme === 'light' ? 'light' : 'dark'

    document.documentElement.dataset.theme = normalizedTheme
    themeToggle.setAttribute(
        'aria-label',
        normalizedTheme === 'light' ? 'Switch to dark theme' : 'Switch to light theme',
    )
}

applyTheme(localStorage.getItem(themeStorageKey))

themeToggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'

    localStorage.setItem(themeStorageKey, nextTheme)
    applyTheme(nextTheme)
})

const copyNoteTimers = new WeakMap()

async function writeToClipboard(text) {
    if (navigator.clipboard?.writeText) {
        try {
            await navigator.clipboard.writeText(text)
            return
        } catch {
            // Fall back for browsers that expose the Clipboard API but deny access.
        }
    }

    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.append(textarea)
    textarea.select()

    const copied = document.execCommand('copy')
    textarea.remove()

    if (!copied) {
        throw new Error('Clipboard copy failed')
    }
}

document.querySelectorAll('.email-copy').forEach((button) => {
    button.addEventListener('click', async () => {
        const note = button.parentElement.querySelector('.copy-note')

        try {
            await writeToClipboard(button.dataset.email)
            note.textContent = 'Copied'
        } catch {
            note.textContent = 'Copy failed'
        }

        note.classList.add('is-visible')
        clearTimeout(copyNoteTimers.get(note))
        copyNoteTimers.set(note, setTimeout(() => note.classList.remove('is-visible'), 1600))
    })
})
