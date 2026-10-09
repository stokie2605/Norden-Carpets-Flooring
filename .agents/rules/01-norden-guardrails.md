---
trigger: always_on
---

# Norden Carpets & Flooring: hard rules

You are an implementer, not a designer. The design is finished and approved. Your job is to carry out the exact numbered tasks in the prompt and nothing more.

## Scope lock

- Do only the numbered tasks in the current prompt. Do not "improve", "modernise", "tidy" or "polish" anything you were not asked to change.
- Touch only the files a task needs. If you think another file must change, stop and ask first.
- Never change layout, spacing, grid, section order, component structure, colours, fonts, or animation unless a task names that exact change.
- Never add a feature the prompt did not ask for. Example of a past mistake: adding dark mode when nobody asked. That was reverted.
- Never rename, move or delete files unless a task says so.
- One prompt equals one commit. Do not bundle unrelated changes.

## No guessing

- Never invent content: no made up reviews, ratings, prices, phone numbers, addresses, team members, opening hours, awards or photos.
- Missing client facts stay as `TODO_CONFIRM` markers. Do not fill them in.
- If you do not know how something in this codebase works, read the file. Do not assume.
- Do not use a library, API or Tailwind class you have not confirmed exists in this repo's installed versions (React 19, Tailwind CSS v4, Vite).
- If two instructions conflict, stop and ask. Do not pick one.

## Locked decisions (from CLAUDE.md)

- Light theme only. No dark mode, no `prefers-color-scheme`, no `dark:` classes.
- No prices anywhere: not on the page, not in `site.ts`, not in the JSON-LD in `index.html`.
- Section order in `src/App.tsx`: Hero, MaterialSwitcher, PreviousWork, TeamStrip, ProofWall, SectionDivider, ShowroomMap.
- Team: Dave, Tom and Jake (Fitters), Wendy (Admin).
- Never mention Bury.
- Never mention subcontractors, and never use the word "subfloor" in client copy.
- All client copy lives in `src/content/site.ts`. Components read from it. No hardcoded sentences in components.
- Colours come only from the tokens in `src/styles/index.css` (`bg`, `bg-alt`, `ink`, `ink-soft`, `muted`, `accent`, `accent-deep`, `pill`, `line`). No new hex values. The only allowed raw hex values are brand colours for Facebook (#1877F2), WhatsApp (#128C7E) and white (#fff).
- No new npm packages. Ask first.
- Never push to `main`. Work on `develop` or a branch off it.
- Never read or print `.dev.vars` or any secret.

## Writing rules

- No em dashes, no en dashes, no spaced hyphens, no emojis. Use commas, colons or full stops.
- UK English spelling.
- Commit messages use conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`.

## Before you say you are done

Run all four and paste the last lines of each:

```
npm run typecheck
npm test
npm run lint:copy
npm run build
```

`scripts/guardrails.test.mjs` enforces the locked decisions. If it fails, you broke a rule. Fix your change. Never edit or delete that test to make it pass.

## Report format

End every task with exactly this:

1. Tasks: each numbered task with Done, Not done or Blocked, and one line why.
2. Files changed: the list.
3. Anything you changed that the prompt did not ask for: should be "None". If not none, explain.
4. Check results: the four commands, pass or fail.
5. Proposed commit message.

Do not claim something is done unless you can point to the line that does it.
