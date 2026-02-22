# Implementation Notes — NES Arcade UI Kit

> Generated: 2026-02-21

## Stack Detection

| Aspect              | Detected                                                       |
| ------------------- | -------------------------------------------------------------- |
| Framework           | Next.js 16.1.6 — App Router (TypeScript, React 19)            |
| Monorepo            | npm workspaces + Turborepo (`apps/web`, `apps/api`)           |
| Package manager     | npm 11.7.0 (`package-lock.json`)                              |
| Styling             | Tailwind CSS v4 via `@tailwindcss/postcss`                    |
| Global CSS entry    | `apps/web/app/globals.css` (imported in `apps/web/app/layout.tsx`) |
| Font loading        | `next/font/google` — Press Start 2P, Inter, JetBrains Mono   |
| CSS variables       | Defined in `:root` and `@theme inline` blocks in globals.css  |
| Component directory | `apps/web/components/` (flat, no sub-folders)                 |
| Path alias          | `@/*` → `apps/web/*` (tsconfig.json)                         |
| Icons (existing)    | `lucide-react`                                                |
| PostCSS config      | `apps/web/postcss.config.mjs` — `@tailwindcss/postcss` only  |

## Integration Strategy

### NES.css Import

Tailwind CSS v4 uses `@import "tailwindcss"` as its entry point. NES.css is a
third-party stylesheet that must be imported **after** Tailwind so our overrides
can take precedence.

Import chain:

```
globals.css
  └─ @import "tailwindcss"           (existing)
  └─ @import "../styles/nes/index.css"  (new — barrel)
       ├─ @import "nes.css/css/nes.min.css"
       ├─ @import "./tokens.css"
       └─ @import "./nes-overrides.css"
```

### Press Start 2P — No @fontsource

The repo already loads Press Start 2P via `next/font/google` in `layout.tsx`,
which generates an optimised self-hosted font with the CSS variable
`--font-display`. Installing `@fontsource/press-start-2p` would duplicate the
font payload. We skip it and reference `--font-display` directly in tokens.

### pixelarticons

Installed as an npm dependency. SVGs are consumed directly from
`node_modules/pixelarticons/svg/` at build time or via inline imports.

### Kenney CC0 Assets

Downloaded to `apps/web/public/vendor/kenney/`. Files in `/public` are served
statically by Next.js and can be referenced as `/vendor/kenney/...` in markup.

### Token Layering (Non-Destructive)

Existing CSS variables (`--neon-purple`, `--neon-green`, etc.) are **kept
intact**. NES tokens are added as a parallel set (`--nes-*` prefix). Existing
pages continue working; new NES components consume the `--nes-*` tokens. A
future migration pass can unify or replace the old variables.

### Folder Conventions

New NES component wrappers go in `apps/web/components/nes/` (a subdirectory of
the existing component folder). Style files go in `apps/web/styles/nes/`.
Documentation and licenses go in `docs/ui-reference/nes-arcade/`.
