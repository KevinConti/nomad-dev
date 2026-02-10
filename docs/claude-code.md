Claude Code setup (VPS)

System requirements (per Anthropic)
- 4GB+ RAM recommended.
- Node.js 18+ only if you use the npm install method.

Standard install (npm)
- Requires Node.js 18+.
- Do **not** use `sudo npm install -g` (permission issues).

```bash
npm install -g @anthropic-ai/claude-code
```

Native binary install (alpha)
- Fresh install:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

- If you already have the npm install, use:

```bash
claude install
```

Run in a repo

```bash
cd /path/to/your/repo
claude
```

The first run will prompt for login (Claude.ai or Anthropic Console).

Notes
- Run `claude doctor` to verify the install and troubleshoot.
- If the login URL wraps in your terminal, open it on another device and paste the returned code back into Claude Code.
- If you don't want to use an API key, use the interactive `/login` command inside Claude Code. It will open a browser-based flow that you can complete on another device (phone/desktop) while the CLI waits.
- On small VPS sizes (e.g., 1GB RAM), the native installer may be killed. Add swap or use the npm install instead.

Hook-based notifications (example pattern)
This repo can use Claude Code hooks to trigger ntfy notifications automatically when Claude needs input.

Example `.claude/settings.json`:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup",
        "hooks": [
          { "type": "command", "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/session-startup.sh" }
        ]
      }
    ],
    "Notification": [
      {
        "matcher": "permission_prompt",
        "hooks": [
          { "type": "command", "command": "\"$CLAUDE_PROJECT_DIR\"/scripts/notify-hook" }
        ]
      },
      {
        "matcher": "idle_prompt",
        "hooks": [
          { "type": "command", "command": "\"$CLAUDE_PROJECT_DIR\"/scripts/notify-hook" }
        ]
      }
    ]
  }
}
```

How this works in a target repo:
- `session-startup.sh` prints a timestamp at session start.
- `notify-hook` reads JSON from stdin and sends ntfy notifications for permission or idle prompts.
- `is-mobile` detects a Mosh-backed tmux client before notifying, so desktop sessions stay quiet.

Make sure hook scripts are executable:

```bash
chmod +x .claude/hooks/*.sh scripts/notify-hook scripts/is-mobile
```
