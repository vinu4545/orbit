# orbit

Vite + React + TypeScript migration with strict parity behavior for the original Framer-exported site.

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Notes

- Original static export is preserved under `public/legacy`.
- Legacy static assets are preserved in `public` (`images`, `fonts`, `s`, `sites`, `third-party-assets`).
- React routes load the original HTML pages and execute their existing scripts/styles to preserve appearance and behavior.