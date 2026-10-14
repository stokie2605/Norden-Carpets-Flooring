---
trigger: glob
globs: src/components/**, src/styles/**, src/App.tsx, index.html
---

# UI changes: extra rules

You are editing UI files. The layout is approved. Change only what the task names.

- Keep the existing JSX structure and Tailwind classes. Edit text, props or the one element the task names.
- Reuse what exists: `Button`, `ButtonLink`, `Picture`, `Stars`, `Wordmark` in `src/components/ui`. Do not create a new component when an existing one fits.
- Images go through `Picture` (AVIF and WebP from `npm run images`). No raw `<img>` tags, no external image URLs.
- Mobile first. Check every change at 375px wide. `npm run test:mobile` runs the Playwright mobile check.
- Keep accessibility as it is: tab roles and arrow keys in MaterialSwitcher, labelled form fields, focus handling in BookingModal, skip link, landmarks.
- No new animations, transitions, gradients, shadows or rounded corner sizes.
- Before editing a component, state in one line what you will change and what you will leave alone.
