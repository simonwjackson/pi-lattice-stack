# Visual Design

How visual surfaces look in this stack: **Tailwind** + CSS theme variables + container queries.

## Design tokens

- Use named tokens from the project's theme — Tailwind theme utilities or CSS theme variables — for type, spacing, color, and radius. The named scale is the contract; reaching outside it is the exception, not a convenience.
- Hardcoded values are any value the theme didn't name. They take three forms and bypass the scale equally:
  - Raw CSS: `font-size: 14px`, `color: #1B1714`, `padding: 7px`.
  - Tailwind arbitrary-value syntax: `text-[10px]`, `bg-[#1B1714]`, `gap-[7px]`, `p-[13px]`.
  - Inline `style={{ … }}` and raw values in scoped `<style>` blocks.
- If a hardcoded value is genuinely needed, the scale is missing a step. Add the step to the theme and use it by name. Inline comments do not substitute — they document a bypass instead of fixing it.

## Fluid scaling

- Theme tokens for size and spacing are fluid by default — `clamp(min, fluid, max)` calibrated to read sensibly from a small handheld through a TV.
- Static pixel values in the theme are reserved for things that genuinely should not scale (e.g., 1px hairlines).

## Default toward the middle of the scale

The scale exists so the smallest, tightest, most-muted steps are rare exceptions. A surface where most type sits at the floor of the type scale, most spacing at the floor of the spacing scale, or most color at the most-muted color step, is denser than it should be by default. It reads as cheap.

- **Body copy lives at the body step**, not at the smallest step. The smallest type step is for fine print — timestamps, audit metadata, trace labels — not for the body of a card.
- **Card and panel padding lives at the generous steps**, not the tightest. Components breathe at the medium step of the spacing scale; reaching for the tightest step is a deliberate choice for chips, table cells, and dense data, not a default.
- **Headlines and hero numerics use display steps**, not body steps in bold. A metric card's value is the loudest thing on the card.
- When more than one of these is at its floor on the same surface, step at least one up before committing.

The same rule applies to color, weight, and radius: if every choice on a surface lives at the most-restrained end of its scale, the surface is under-designed, not minimal. Restraint is a deliberate contrast against louder choices, not a uniform default.

This rule matters most for agents. Training-data bias drags toward dense, packed admin UIs — the smallest type step and the tightest spacing step look "professional" in screenshots and dominate the corpus. Resist it. When you reach for the floor of a scale, stop and ask whether the right answer is one step up.

## Container-relative layout

- Components respond to their **container**, not the viewport.
- Use container query units (`cqi`, `cqh`, `cqw`) and `@container` queries.
- Declare `container-type: inline-size` (or `size`) on the appropriate ancestor.
- Reserve `@media` and viewport units for page-frame layout decisions where the layout itself fundamentally rearranges.

## Additive grids

- Grids add cells when space allows: `grid-template-columns: repeat(auto-fit, minmax(MIN, 1fr))` or equivalent.
- Do not scale a fixed column count up. Designs should look denser on a TV, not zoomed in.
