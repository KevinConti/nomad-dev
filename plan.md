Nomad Dev Plan

Goal
- Build a public-friendly template repo and installer for mobile-first remote development with AI agents.
- Prove the core loop: from iPhone, connect to a VPS, run Codex or Claude Code, ask it to wait 10 seconds, and receive an ntfy push notification.

Success criteria (Phase 1)
- iOS (Blink Shell) can reliably connect to host via Tailscale + Mosh.
- tmux session persists across disconnects.
- A notification arrives on the phone after a 10-second wait using ntfy.

Phase 1: iOS proof of concept
- Host setup guide for Ubuntu 22.04
- Tailscale + Mosh + tmux workflow
- ntfy notification test
- Minimal scripts installed into target repos

Phase 2: Infrastructure as code
- Pulumi (TypeScript) AWS stack for Ubuntu 22.04
- Optional Tailscale auth key bootstrap

Phase 3: Template automation
- `nomad-dev install --target /path` copies required files
- `nomad-dev update --target /path --force` re-syncs
- Per-repo config in `.nomad-dev/config.env`

Phase 4: Android guide
- Add Android client instructions (phase-2-android.md)

Phase 5: Optional upgrades
- Self-hosted ntfy path
- Quality-of-life scripts (session bootstrap, standard tmux layouts)
- Lightweight validation checks
