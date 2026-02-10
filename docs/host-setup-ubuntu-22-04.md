# Host setup: Ubuntu 22.04

This guide prepares a VPS for mobile-first remote development with Tailscale, tmux, Mosh, and ntfy.

## Quick install script
```bash
sudo ./scripts/host-setup-ubuntu.sh
```

## Manual steps (signed package repository path)
1. Install base packages:
```bash
sudo apt-get update
sudo apt-get install -y curl git gnupg mosh tmux
```

2. Add Tailscale signed apt repository and install:
```bash
sudo install -m 0755 -d /usr/share/keyrings
curl -fsSL https://pkgs.tailscale.com/stable/ubuntu/jammy.noarmor.gpg -o /tmp/tailscale-archive-keyring.gpg
curl -fsSL https://pkgs.tailscale.com/stable/ubuntu/jammy.tailscale-keyring.list -o /tmp/tailscale.list
sudo mv /tmp/tailscale-archive-keyring.gpg /usr/share/keyrings/tailscale-archive-keyring.gpg
sudo mv /tmp/tailscale.list /etc/apt/sources.list.d/tailscale.list
sudo chmod 0644 /usr/share/keyrings/tailscale-archive-keyring.gpg /etc/apt/sources.list.d/tailscale.list
sudo apt-get update
sudo apt-get install -y tailscale
```

3. Authenticate Tailscale:
```bash
sudo tailscale up
tailscale status
```

4. Optional: if UFW is enabled and you use public Mosh, allow UDP range:
```bash
sudo ufw allow 60000:61000/udp
```

## Integrity and provenance notes
- Prefer signed package repositories over remote shell bootstrap.
- Review external repository trust decisions before installing on long-lived hosts.
