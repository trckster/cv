#!/bin/bash
pnpm build
docker build -t trckster/cv .
docker push trckster/cv