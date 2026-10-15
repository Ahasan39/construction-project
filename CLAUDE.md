# Project instructions for Claude Code

## Commit attribution

Do **not** add `Co-Authored-By: Claude …` (or any other AI co-author) trailers to commit messages or PR descriptions in this repository.

The project-local `.claude/settings.json` sets `includeCoAuthoredBy: false` to disable Claude Code's default attribution. Do not override that setting, and do not modify global Claude Code or Git configuration.

Commit author identity for this project: `Ahasan39 <154082038+Ahasan39@users.noreply.github.com>` (repository-local git config, already set — do not modify global git config).

## Git workflow

Follow the workflow recorded in `docs/PROGRESS.md` under *Working agreement — Git workflow*:

1. Verify (`npm run lint`, `npm run typecheck`, `npm test`, `npm run build` all green).
2. Review the staged diff and staged file list.
3. One honest checkpoint commit per sprint / checkpoint.
4. Normal push to `origin main`. Never force-push, never rewrite published history.
5. Verify remote SHA matches local HEAD.

Never commit `node_modules`, `dist`, `.env`, caches, personal form data, or tsbuildinfo files.
