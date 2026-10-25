#!/usr/bin/env bash
# Lance Pi Academy en local, en une commande : PocketBase, contenu, comptes démo, puis le site.
#   bash scripts/demo.sh      → ouvre http://localhost:3000
# Arrêt : Ctrl + C.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js n'est pas installé. Télécharge la version LTS sur https://nodejs.org puis relance cette commande." >&2
  exit 1
fi

[ -d node_modules ] || { echo "Installation des dépendances (une seule fois, 1 à 2 minutes)…"; npm install --no-fund --no-audit; }

# Compte d'administration PocketBase pour la démo locale uniquement.
SU_EMAIL="admin@localhost.test"
SU_PASSWORD="demo-local-2026"
bash scripts/pocketbase.sh superuser upsert "$SU_EMAIL" "$SU_PASSWORD" >/dev/null

bash scripts/pocketbase.sh serve >/tmp/pi-academy-pocketbase.log 2>&1 &
PB_PID=$!
trap 'kill $PB_PID 2>/dev/null' EXIT INT TERM
for _ in $(seq 1 50); do curl -fs http://127.0.0.1:8090/api/health >/dev/null && break; sleep 0.2; done

PB_SUPERUSER_EMAIL="$SU_EMAIL" PB_SUPERUSER_PASSWORD="$SU_PASSWORD" node pocketbase/seed/seed.mjs --demo | tail -2

echo
echo "Pi Academy démarre sur http://localhost:3000"
echo "Admin PocketBase : http://127.0.0.1:8090/_/  ($SU_EMAIL / $SU_PASSWORD)"
echo "Arrêt : Ctrl + C"
echo
( sleep 6 && (command -v open >/dev/null && open http://localhost:3000 || true) ) &
npx next dev -p 3000
