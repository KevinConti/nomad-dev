# Public Release Checklist

Use this checklist before publishing Nomad Dev to GitHub.

## 1) Local repo hygiene
- Confirm local secret scan has no real credentials.
- Confirm `claude-login-url.txt` and local-only stack files are absent.
- Confirm example stack file only (`infra/pulumi-aws/Pulumi.dev.example.yaml`).
- Confirm scripts pass syntax checks.

## 2) Fresh history path
If this is the first public release, prefer a clean history:
```bash
git init
git add .
git commit -m "Initial public release"
```

## 3) Create GitHub repository
- Create empty GitHub repo.
- Push `main`.

## 4) Enable required GitHub security settings
- Secret scanning
- Push protection
- Dependency graph + Dependabot alerts
- Private vulnerability reporting

## 5) Branch protection
For `main`, require:
- Pull request before merge
- Passing status checks (`Secret Scan`, `CodeQL`, `Shellcheck`)
- Up-to-date branches before merge
- Dismiss stale approvals on new commits

## 6) Post-publish verification
- Open a test pull request and confirm all workflows run.
- Confirm Dependabot creates update PRs.
- Confirm security advisories can be opened privately.
