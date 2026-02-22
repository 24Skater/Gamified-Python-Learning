# NES Arcade UI Kit — Source Registry

All external resources used in this UI kit. Every entry must have an explicit
open-source license.

| # | Resource | URL | License | Used For | Date Accessed |
|---|----------|-----|---------|----------|---------------|
| 1 | NES.css | https://github.com/nostalgic-css/NES.css | MIT | Base 8-bit CSS component library (buttons, containers, progress bars, badges) | 2026-02-21 |
| 2 | Press Start 2P | https://fonts.google.com/specimen/Press+Start+2P | OFL-1.1 | Pixel display font for headings, badges, and HUD text | 2026-02-21 |
| 3 | pixelarticons | https://github.com/halfmage/pixelarticons | MIT | Pixel-art SVG icon set for UI icons | 2026-02-21 |
| 4 | Kenney UI Pack | https://kenney-assets.itch.io/ui-pack | CC0 1.0 | Panel frames, button textures, HUD sprites | 2026-02-21 |
| 5 | Kenney Pixel UI Pack (750 assets) | https://opengameart.org/content/pixel-ui-pack-750-assets | CC0 1.0 | Pixel-art UI elements, dialog frames, progress bar sprites | 2026-02-21 |

## Installation Method

| Resource | Method | Location in Repo |
|----------|--------|------------------|
| NES.css | npm (`nes.css`) | `node_modules/nes.css/` — imported via `styles/nes/index.css` |
| Press Start 2P | `next/font/google` in `app/layout.tsx` | Self-hosted by Next.js at build time |
| pixelarticons | npm (`pixelarticons`) | `node_modules/pixelarticons/` — SVGs imported in components |
| Kenney UI Pack | Manual download (CC0) | `public/vendor/kenney/ui-pack/` |
| Kenney Pixel UI Pack | Manual download (CC0) | `public/vendor/kenney/pixel-ui-pack/` |

## Reference-Only (Not Installed)

| Resource | URL | Notes |
|----------|-----|-------|
| NES PPU Palettes | https://www.nesdev.org/wiki/PPU_palettes | Reference for authentic NES color values; no assets taken |
| @fontsource/press-start-2p | https://www.npmjs.com/package/@fontsource/press-start-2p | Not used — Press Start 2P already loaded via next/font/google |

## License Files

Full license texts are stored in:
- `docs/ui-reference/nes-arcade/LICENSES/nes-css-MIT.txt`
- `docs/ui-reference/nes-arcade/LICENSES/press-start-2p-OFL.txt`
- `docs/ui-reference/nes-arcade/LICENSES/pixelarticons-MIT.txt`
- `docs/ui-reference/nes-arcade/LICENSES/kenney-ui-pack-CC0.txt`
- `docs/ui-reference/nes-arcade/LICENSES/kenney-pixel-ui-pack-CC0.txt`

Asset packs also include license files at their download location:
- `apps/web/public/vendor/kenney/ui-pack/LICENSE.txt`
- `apps/web/public/vendor/kenney/pixel-ui-pack/LICENSE.txt`
