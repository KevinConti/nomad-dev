#!/usr/bin/env bash
set -euo pipefail

if [[ ${EUID:-$(id -u)} -ne 0 ]]; then
  echo "Run as root: sudo ./scripts/host-setup-ubuntu.sh" >&2
  exit 1
fi

apt-get update
apt-get install -y curl git gnupg mosh tmux

# Tailscale install via signed apt repository (Ubuntu 22.04/jammy)
install -m 0755 -d /usr/share/keyrings
curl -fsSL https://pkgs.tailscale.com/stable/ubuntu/jammy.noarmor.gpg -o /usr/share/keyrings/tailscale-archive-keyring.gpg
curl -fsSL https://pkgs.tailscale.com/stable/ubuntu/jammy.tailscale-keyring.list -o /etc/apt/sources.list.d/tailscale.list
chmod 0644 /usr/share/keyrings/tailscale-archive-keyring.gpg /etc/apt/sources.list.d/tailscale.list
apt-get update
apt-get install -y tailscale

echo "Host setup complete. Next: run 'sudo tailscale up' and configure ntfy." 
