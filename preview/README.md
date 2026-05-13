# Humanaut Nav Preview

Minimal Next.js 15 + Tailwind sandbox that mounts the navigation components from
`../app/(site)/_components/nav/` so you can interact with them in a browser.

This is **only a preview harness**. The actual deliverable is the
`app/(site)/_components/nav/` folder at the repo root — that is what gets
dropped into the real Humanaut Health project.

## Run it

```bash
cd preview
npm install
npm run dev
```

Open http://localhost:3000.

## What to try

- Hover the desktop items (≥1024px) — verify the 150 / 200ms hover delays
- Tab through the nav — verify focus rings, arrow-key navigation inside
  dropdowns, Escape to close, focus return to trigger
- Scroll past 80px — verify the sticky bottom border appears
- Resize below 1024px — verify the mobile overlay opens, body scroll locks,
  scroll position restores on close
- Visit `/memberships/path`, `/testing/dexa`, or
  `/treatments/regenerative/stem-cells` to verify active state (orange
  underline on top-level, orange left border on nested items)

## Notes

- Tailwind tokens are stock (`bg-slate-900`, `bg-orange-500`). Swap to the
  Humanaut brand palette once the components are dropped into the real repo.
- The logo is the plain text "Humanaut Health" — replace with the real logo
  component.
- Several routes intentionally 404 (per the spec — unbuilt pages are fine).
