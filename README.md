> ## 📦 Archived
>
> **This project is no longer actively maintained.** The repository is kept available for reference and forking, but no further updates, bug fixes, or new features are planned, and issues/pull requests may not be reviewed.
>
> The final build (Cipher Vault Terminal v2.0) still works as documented below — see the commit history for the last changes. If you'd like to take the idea further, feel free to **fork it** (MIT licensed).

# Cipher Vault Terminal

A terminal-style encrypted workspace with a hidden vault unlock, neon command-center HUD, and client-side AES-256-GCM encryption. Zero backend. PWA-ready.

## What it does

- Terminal-style interface with neon glass panels and scanline FX
- Hidden private vault unlocked via `unlock vault` command
- Client-side AES-256-GCM encryption (PBKDF2-SHA-256, 310k iterations)
- Encrypted notes stored locally only; no server, no account, no tracking
- Auto-lock after locking; key kept in memory only
- Installable PWA with offline shell caching

## Run locally

```bash
npm install
npm run dev
# or open index.html directly
```

## Security model

- Encryption happens in the browser before any storage.
- Only the vault workspace is encrypted; ordinary notes are local but unencrypted.
- Passphrase is never transmitted; no recovery key exists.
- Clearing browser data erases encrypted data permanently.

## Project structure

```
index.html        Main terminal UI and crypto logic
manifest.json     PWA manifest
sw.js             Service worker for offline caching
```

## License

MIT

