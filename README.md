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

---
**ARCHIVE NOTE:** This repository has been archived. The project (Cipher Vault Terminal v2.0) is preserved for reference but no longer actively maintained. For questions or to view the final build, see the commit history or contact the original maintainer.
---


---
**ARCHIVE NOTE:** This repository has been archived. The project (Cipher Vault Terminal v2.0) is preserved for reference but no longer actively maintained. For questions or to view the final build, see the commit history or contact the original maintainer.
---

