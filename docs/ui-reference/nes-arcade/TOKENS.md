# NES Arcade UI Kit — Design Tokens

All tokens are defined as CSS custom properties in
`apps/web/styles/nes/tokens.css` and prefixed with `--nes-`.

## Colors

| Token | Value | Role |
|-------|-------|------|
| `--nes-black` | `#212529` | Dark neutral / border |
| `--nes-white` | `#f8f9fa` | Light text / foreground |
| `--nes-dark` | `#111215` | Page background |
| `--nes-light` | `#e9ecef` | Bright surface |
| `--nes-primary` | `#209cee` | Accent / interactive (NES sky-blue) |
| `--nes-success` | `#92cc41` | Positive feedback (NES green) |
| `--nes-warning` | `#f7d51d` | Caution (NES gold) |
| `--nes-danger` | `#e76e55` | Error / destructive (NES red) |
| `--nes-disabled` | `#adafbc` | Disabled state |
| `--nes-muted` | `#6c757d` | Secondary text |
| `--nes-surface` | `#1a1d23` | Card / panel background |
| `--nes-surface-alt` | `#24272e` | Input / alternate surface |

### Semantic Aliases

| Token | Maps To |
|-------|---------|
| `--nes-bg` | `--nes-dark` |
| `--nes-fg` | `--nes-white` |
| `--nes-border` | `--nes-black` |
| `--nes-accent` | `--nes-primary` |

## Spacing Scale

| Token | Value |
|-------|-------|
| `--nes-space-1` | 4px |
| `--nes-space-2` | 8px |
| `--nes-space-3` | 16px |
| `--nes-space-4` | 24px |
| `--nes-space-5` | 32px |
| `--nes-space-6` | 48px |
| `--nes-space-7` | 64px |

## Border

| Token | Value | Notes |
|-------|-------|-------|
| `--nes-border-width` | 4px | NES.css standard |
| `--nes-radius` | 0px | Boxy by default |
| `--nes-radius-sm` | 2px | Subtle rounding for small elements |

## Typography

| Token | Value | Usage |
|-------|-------|-------|
| `--nes-font-display` | Press Start 2P stack | Headings, badges, HUD |
| `--nes-font-body` | Inter / system-ui stack | Body copy, descriptions |
| `--nes-font-mono` | JetBrains Mono stack | Code blocks, terminal |

### Size Scale

| Token | Value | CSS |
|-------|-------|-----|
| `--nes-text-xs` | 10px | `0.625rem` |
| `--nes-text-sm` | 12px | `0.75rem` |
| `--nes-text-base` | 14px | `0.875rem` |
| `--nes-text-lg` | 16px | `1rem` |
| `--nes-text-xl` | 20px | `1.25rem` |
| `--nes-text-2xl` | 24px | `1.5rem` |
| `--nes-text-3xl` | 32px | `2rem` |

### Line Height

| Token | Value |
|-------|-------|
| `--nes-leading-tight` | 1.3 |
| `--nes-leading-normal` | 1.6 |
| `--nes-leading-loose` | 1.8 |

## Shadows

| Token | Value |
|-------|-------|
| `--nes-shadow` | `4px 4px 0px var(--nes-black)` |
| `--nes-shadow-sm` | `2px 2px 0px var(--nes-black)` |

## Focus Ring

| Token | Value |
|-------|-------|
| `--nes-focus-color` | `var(--nes-primary)` |
| `--nes-focus-width` | 3px |
| `--nes-focus-offset` | 2px |
