#!/usr/bin/env bash
# Installe Pi Academy sur un serveur neuf (Oracle Linux 8/9, Ubuntu ou Debian), sans Dokploy.
#   curl -fsSL https://raw.githubusercontent.com/<compte>/<repo>/<branche>/scripts/installer-serveur.sh | bash -s -- <url-git> <branche>
# Idempotent : relancer le script met le site à jour (git pull + reconstruction).
set -euo pipefail
REPO="${1:?usage : installer-serveur.sh <url-git> [branche]}"
BRANCHE="${2:-main}"
DIR="$HOME/pi-academy"

if command -v dnf >/dev/null; then
  # Oracle Linux : Docker CE + git, et ouverture des ports 80/443 du pare-feu local.
  sudo dnf -y install dnf-plugins-core git
  sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
  # --allowerasing : remplace podman/runc installés d'office sur Oracle Linux.
  sudo dnf -y install --allowerasing docker-ce docker-ce-cli containerd.io docker-compose-plugin
  if systemctl is-active --quiet firewalld; then
    sudo firewall-cmd --permanent --add-service=http --add-service=https && sudo firewall-cmd --reload
  fi
else
  sudo apt-get update && sudo apt-get install -y git ca-certificates curl
  curl -fsSL https://get.docker.com | sudo sh
  # Ubuntu sur Oracle Cloud : règles iptables qui bloquent tout sauf SSH.
  if command -v iptables >/dev/null; then
    sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT || true
    sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT || true
    command -v netfilter-persistent >/dev/null && sudo netfilter-persistent save || true
  fi
fi
sudo systemctl enable --now docker

if [ -d "$DIR/.git" ]; then
  git -C "$DIR" fetch origin "$BRANCHE" && git -C "$DIR" checkout "$BRANCHE" && git -C "$DIR" pull --ff-only origin "$BRANCHE"
else
  git clone --branch "$BRANCHE" "$REPO" "$DIR"
fi
cd "$DIR"

if [ ! -f .env ]; then
  IP=$(curl -fsS https://api.ipify.org || curl -fsS ifconfig.me)
  MDP=$(head -c 18 /dev/urandom | base64 | tr -d '/+=' | cut -c1-20)
  cat > .env <<EOV
SITE_ADDRESS=${IP//./-}.sslip.io
PB_SUPERUSER_EMAIL=admin@pi-academy.local
PB_SUPERUSER_PASSWORD=$MDP
EOV
  chmod 600 .env
fi

sudo docker compose -f docker-compose.prod.yml -f docker-compose.serveur.yml up -d --build
. ./.env
echo
echo "Pi Academy tourne : https://$SITE_ADDRESS"
echo "Administration PocketBase : https://$SITE_ADDRESS/_/  ($PB_SUPERUSER_EMAIL / mot de passe dans ~/pi-academy/.env)"
