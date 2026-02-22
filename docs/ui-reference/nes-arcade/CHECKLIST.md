# NES Arcade UI Kit — UX Checklist for "Teaches Coding"

Follow this checklist when building app features with the NES UI kit.

## Layout Patterns

- [ ] **Split-view pattern:** Quest text on the left, code editor center/right, game preview optional panel
- [ ] **Collapsible panels:** Each region can be collapsed or resized (especially on smaller screens)
- [ ] **Sticky HUD:** XP bar, hearts/lives, and level indicator remain visible while coding
- [ ] **Breadcrumb nav:** Quest map > Level > Quest title — always know where you are

## Immediate Feedback

- [ ] **Run button:** Prominent, always visible; shows loading/spinner state while executing
- [ ] **Error panel:** Appears inline below the editor; uses `--nes-danger` styling, not a modal
- [ ] **Success state:** Celebration animation (brief, non-blocking), XP gain displayed
- [ ] **Test results:** Show pass/fail per test case in a checklist format
- [ ] **Output console:** Terminal-style panel with monospace font for stdout/stderr

## Progression System

- [ ] **XP bar:** Always visible in HUD, fills left-to-right, shows numeric value
- [ ] **Level display:** Current level + progress to next level
- [ ] **Quest unlocks:** Locked quests shown as dimmed with a lock icon; tooltip explains prerequisite
- [ ] **Quest map:** Visual grid or path showing completed / current / locked quests
- [ ] **Badges:** Earned for milestones; display in profile and as toast on earn

## Mobile / Responsive

- [ ] **Prioritize play view:** On mobile, show quest text + run button first
- [ ] **Collapsible editor:** Editor panel can be expanded to full-screen on tap
- [ ] **Touch-friendly buttons:** Minimum 44x44px touch target
- [ ] **Stack panels vertically:** On narrow screens, panels stack instead of side-by-side
- [ ] **Zoom-safe:** No layout breaks at 200% browser zoom

## Accessibility

- [ ] **Keyboard navigation:** All interactive elements reachable via Tab
- [ ] **Visible focus rings:** 3px solid outline using `--nes-focus-color`
- [ ] **Color not sole indicator:** Errors also use icons + text, not just red
- [ ] **No motion required:** All info conveyed without animations
- [ ] **Screen reader labels:** Buttons, icons, and progress bars have `aria-label` or visible text
- [ ] **Reduced motion:** Respect `prefers-reduced-motion` media query

## Typography Don'ts

- [ ] **No long pixel-font paragraphs:** Pixel font (Press Start 2P) only for headings, badges, short labels
- [ ] **No cramped line heights:** Body text uses `--nes-leading-normal` (1.6) or higher
- [ ] **No low-contrast text:** Maintain WCAG AA contrast (4.5:1 for body, 3:1 for large text)
- [ ] **No tiny body text:** Minimum body font size is `--nes-text-base` (14px)

## Component Usage

- [ ] **Buttons:** Use NES button variants consistently (primary for main action, danger for destructive)
- [ ] **Panels:** Use `nes-container` for all card/panel regions; always has a title
- [ ] **Icons:** Use pixelarticons at 16–32px; include `aria-hidden="true"` when decorative
- [ ] **Progress bars:** Use for XP and quest completion; include numeric label
- [ ] **Alerts:** Use for system messages; include dismiss action for non-critical alerts
