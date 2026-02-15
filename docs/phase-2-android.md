Phase 2: Android client setup (Termux)

Goal
- From an Android device (e.g., BOOX Palma), connect to a VPS, run Claude Code, and receive ntfy push notifications.
- Same workflow as iOS (Phase 1), different mobile client stack.

Prereqs
- Android device with access to F-Droid or Google Play Store
- Tailscale account (same one used for iOS/VPS)
- VPS already set up per Phase 1 (Ubuntu 22.04, Tailscale, mosh, tmux)
- ntfy topic configured in your target repo (`.nomad-dev/config.env`)

Install required apps

1) Termux (terminal emulator)
   - Recommended: Install from F-Droid (more up to date than Play Store version)
   - F-Droid: https://f-droid.org/packages/com.termux/
   - Alternative: GitHub releases at https://github.com/termux/termux-app/releases

2) Tailscale (VPN mesh)
   - Install from Google Play Store
   - Sign in with the same account used for your VPS

3) ntfy (push notifications)
   - Install from Google Play Store or F-Droid
   - F-Droid: https://f-droid.org/packages/io.heckel.ntfy/

Set up Termux

1) Open Termux and update packages:

```bash
pkg update && pkg upgrade
```

2) Install mosh and openssh:

```bash
pkg install mosh openssh
```

3) Set up storage access (needed for SSH key management):

```bash
termux-setup-storage
```

Grant storage permission when prompted.

SSH key setup

Option A: Generate a new key on the device

```bash
ssh-keygen -t ed25519 -C "nomad-dev-palma" -f ~/.ssh/nomad-dev
```

Then copy the public key to your VPS:

```bash
cat ~/.ssh/nomad-dev.pub
```

On the VPS, append it to `~/.ssh/authorized_keys`:

```bash
echo "PASTE_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
```

Option B: Copy your existing key to the device

If you already have an SSH key authorized on the VPS, copy the private key to the Palma.

1) On your Mac/desktop, display the key:

```bash
cat ~/.ssh/nomad-dev
```

2) On the Palma in Termux, create the .ssh directory and paste the key:

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
cat > ~/.ssh/nomad-dev << 'EOF'
PASTE_PRIVATE_KEY_HERE
EOF
chmod 600 ~/.ssh/nomad-dev
```

3) Add an SSH config entry:

```bash
cat >> ~/.ssh/config << 'EOF'
Host nomad
  HostName TAILNET_IP
  User ubuntu
  IdentityFile ~/.ssh/nomad-dev
  IdentitiesOnly yes
EOF
chmod 600 ~/.ssh/config
```

Replace `TAILNET_IP` with your VPS Tailscale IP (run `tailscale ip -4` on the VPS to find it).

Connect to VPS

1) Open the Tailscale app on the Palma and connect.

2) In Termux, connect via Mosh:

```bash
mosh nomad
```

Or explicitly:

```bash
mosh --ssh="ssh -i ~/.ssh/nomad-dev" ubuntu@TAILNET_IP
```

3) Attach to your tmux session:

```bash
tmux attach -t nomad
```

Or create a new one:

```bash
tmux new -s nomad
```

Set up ntfy notifications

1) Open the ntfy app on the Palma.
2) Tap "+" to subscribe to a topic.
3) Enter your topic from `.nomad-dev/config.env`.
4) Notifications should work automatically on Android (more reliable than iOS).

Test notification loop

1) From the target repo on the VPS:

```bash
./scripts/nomad wait-notify 10 "nomad android test"
```

2) Confirm the notification arrives on the Palma.

Quality of life

Termux font size
- Pinch to zoom adjusts font size in Termux.
- Or: long press → More → Style to change font and color scheme.

Termux keyboard shortcuts
- Volume Down + Q: Show/hide extra keys row
- Volume Up + key: Acts as Ctrl (e.g., Volume Up + C = Ctrl-C)
- Extra keys bar provides Tab, Ctrl, Alt, Esc, arrow keys

Session alias
Add a quick-connect alias to your Termux shell:

```bash
echo 'alias nomad="mosh nomad -- tmux attach -t nomad || tmux new -s nomad"' >> ~/.bashrc
source ~/.bashrc
```

Then just type `nomad` to connect and attach in one step.

Troubleshooting

Mosh timeout
- Confirm Tailscale shows "Connected" in the Android app.
- Test SSH first: `ssh nomad`
- If SSH works but Mosh times out, your network may block UDP. Use SSH as fallback.

Termux closes in background
- Android may kill Termux when it's in the background.
- Fix: Go to Android Settings → Apps → Termux → Battery → set to "Unrestricted" (or disable battery optimization).
- On BOOX devices: check any additional power management settings.

Mosh locale warnings
- If you see locale warnings, set locale in Termux:

```bash
echo 'export LANG=en_US.UTF-8' >> ~/.bashrc
source ~/.bashrc
```

Key not found
- Verify key permissions: `ls -la ~/.ssh/nomad-dev` should show `-rw-------`.
- Verify the key is authorized on the VPS: `cat ~/.ssh/authorized_keys` should contain your public key.

Notes
- Termux receives regular updates via F-Droid. The Play Store version is outdated.
- Mosh in Termux uses the same UDP protocol as Blink on iOS. Same resilience to network changes.
- tmux runs on the VPS, not the device. Same session is accessible from iPhone, Palma, or desktop.
- If Mosh is unavailable, SSH works as a direct fallback: `ssh nomad`.
