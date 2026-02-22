# NES Arcade UI Kit — Component Inventory

All components live in `apps/web/components/nes/` and wrap NES.css classes with
typed React props.

---

## NesButton

Pixel-styled button with variant support.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"primary" \| "success" \| "warning" \| "error"` | (none — default NES style) | Color variant |
| `disabled` | `boolean` | `false` | Disabled state |
| `children` | `ReactNode` | — | Button label |
| ...rest | `ButtonHTMLAttributes` | — | Native button props |

**Usage:**
```tsx
<NesButton variant="primary">Start Quest</NesButton>
<NesButton variant="success">Submit</NesButton>
<NesButton variant="warning">Hint</NesButton>
<NesButton variant="error">Reset</NesButton>
<NesButton disabled>Locked</NesButton>
```

---

## NesPanel

Container panel with optional title, maps to `nes-container`.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Optional panel title |
| `dark` | `boolean` | `true` | Dark background |
| `centered` | `boolean` | `false` | Center-align text |
| `children` | `ReactNode` | — | Panel content |

**Usage:**
```tsx
<NesPanel title="Quest Brief">
  <p>Defeat the glitch by writing a function...</p>
</NesPanel>
```

---

## NesBadge

Small label chip for status indicators.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"primary" \| "success" \| "warning" \| "error"` | (default) | Color |
| `children` | `ReactNode` | — | Badge text |

**Usage:**
```tsx
<NesBadge variant="success">+50 XP</NesBadge>
<NesBadge variant="warning">NEW</NesBadge>
<NesBadge variant="error">LOCKED</NesBadge>
```

---

## NesProgressBar

XP or health bar backed by `<progress>`.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | — | Current value |
| `max` | `number` | `100` | Maximum value |
| `variant` | `"primary" \| "success" \| "warning" \| "error"` | `"primary"` | Color |
| `label` | `string` | — | Accessible label |

**Usage:**
```tsx
<NesProgressBar value={75} max={100} variant="success" label="XP: 75/100" />
```

---

## NesAlert

Feedback message panel for success, warning, and error states.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"success" \| "warning" \| "error"` | `"success"` | Alert type |
| `children` | `ReactNode` | — | Alert message |

**Usage:**
```tsx
<NesAlert variant="success">Quest complete! +100 XP</NesAlert>
<NesAlert variant="warning">Hint: check your indentation</NesAlert>
<NesAlert variant="error">SyntaxError on line 3</NesAlert>
```

---

## NesIcon

Wrapper for pixelarticons SVGs with consistent sizing.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | — | Icon name from pixelarticons |
| `size` | `"sm" \| "md" \| "lg" \| "xl"` | `"md"` | Size (16/24/32/48px) |
| `label` | `string` | — | Accessible label (omit for decorative) |

**Usage:**
```tsx
<NesIcon name="heart" size="md" />
<NesIcon name="coin" size="lg" label="Coins" />
```

### Icon Sizing Rules
- **16px (`sm`):** Inline with text, badges
- **24px (`md`):** Buttons, list items, default
- **32px (`lg`):** HUD elements, feature cards
- **48px (`xl`):** Hero sections, empty states

---

## NesHud

Composite HUD widget combining hearts, XP bar, and coin counter.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `hearts` | `number` | `3` | Lives remaining (0–5) |
| `maxHearts` | `number` | `3` | Maximum hearts |
| `xp` | `number` | `0` | Current XP |
| `xpMax` | `number` | `100` | XP needed for next level |
| `level` | `number` | `1` | Current level |
| `coins` | `number` | `0` | Coins earned |

**Usage:**
```tsx
<NesHud hearts={2} maxHearts={3} xp={75} xpMax={100} level={3} coins={42} />
```
