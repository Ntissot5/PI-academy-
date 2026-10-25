#!/usr/bin/env bash
# PocketBase jetable pour les tests de bout en bout : base vide, seed, comptes démo.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export PB_DATA="$ROOT/pocketbase/pb_data_e2e"
export PB_HTTP="${PB_HTTP:-127.0.0.1:8091}"
rm -rf "$PB_DATA"
bash "$ROOT/scripts/pocketbase.sh" superuser upsert e2e@example.ch e2e-superuser-2026 >/dev/null
bash "$ROOT/scripts/pocketbase.sh" serve &
PB_PID=$!
trap 'kill $PB_PID 2>/dev/null' EXIT INT TERM
for _ in $(seq 1 50); do curl -fs "http://$PB_HTTP/api/health" >/dev/null && break; sleep 0.2; done
PB_URL="http://$PB_HTTP" PB_SUPERUSER_EMAIL=e2e@example.ch PB_SUPERUSER_PASSWORD=e2e-superuser-2026 node "$ROOT/pocketbase/seed/seed.mjs" --demo
wait $PB_PID
