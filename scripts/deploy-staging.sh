#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT_DIR"

if [ ! -f ".env.staging" ]; then
  echo ".env.staging is missing on the server."
  exit 1
fi

docker compose -f docker-compose.staging.yml build
docker compose -f docker-compose.staging.yml up -d --force-recreate
docker compose -f docker-compose.staging.yml ps

if command -v curl >/dev/null 2>&1; then
  curl -fsSI http://127.0.0.1 >/dev/null || curl -fsSI http://127.0.0.1:3000 >/dev/null
fi
