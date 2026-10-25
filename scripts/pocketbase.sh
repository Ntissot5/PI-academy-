#!/usr/bin/env bash
# Télécharge PocketBase (si besoin) puis lance la commande demandée avec les dossiers du projet.
#   bash scripts/pocketbase.sh serve
#   bash scripts/pocketbase.sh superuser upsert admin@example.ch motdepasse
set -euo pipefail
PB_VERSION="${PB_VERSION:-0.40.6}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BIN_DIR="$ROOT/pocketbase/bin"
BIN="$BIN_DIR/pocketbase"

if [ ! -x "$BIN" ] || ! "$BIN" --version | grep -q "$PB_VERSION"; then
  case "$(uname -s)-$(uname -m)" in
    Linux-x86_64) PLATFORM=linux_amd64 ;;
    Linux-aarch64) PLATFORM=linux_arm64 ;;
    Darwin-arm64) PLATFORM=darwin_arm64 ;;
    Darwin-x86_64) PLATFORM=darwin_amd64 ;;
    *) echo "Plateforme non prévue : $(uname -s)-$(uname -m)" >&2; exit 1 ;;
  esac
  mkdir -p "$BIN_DIR"
  echo "Téléchargement de PocketBase $PB_VERSION ($PLATFORM)…"
  curl -fsSL -o "$BIN_DIR/pb.zip" "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_${PLATFORM}.zip"
  unzip -o -q "$BIN_DIR/pb.zip" pocketbase -d "$BIN_DIR"
  rm "$BIN_DIR/pb.zip"
fi

cmd="${1:-serve}"; shift || true
args=(--dir "${PB_DATA:-$ROOT/pocketbase/pb_data}" --migrationsDir "$ROOT/pocketbase/pb_migrations" --hooksDir "$ROOT/pocketbase/pb_hooks")
if [ "$cmd" = "serve" ]; then
  exec "$BIN" serve "${args[@]}" --http "${PB_HTTP:-127.0.0.1:8090}" "$@"
else
  exec "$BIN" "$cmd" "$@" "${args[@]}"
fi
