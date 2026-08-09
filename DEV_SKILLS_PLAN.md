# Dev Skills Learning Plan (ComfortMap + Montessori Engine)

**Goal:** practice the 4 things companies actually want, using two real codebases in
parallel — the same way a dev juggles multiple projects at a job. This file lives in
BOTH project folders so either one can pick up the plan with full context.

---

## The 4 parts

### 1. Git branching + PRs
Stop committing straight to `master`. For every change, however small:

```
git checkout -b feat/short-name
# make the change
git add -A && git commit -m "clear message"
git push -u origin feat/short-name
```

Then open a PR on GitHub, read your own diff like a reviewer would, and merge.

**Why it matters for Montessori specifically:** the site auto-deploys to
montessoriengine.com the moment you push to `master`, and real teachers use it. A
branch + PR gives you a Vercel **preview deployment** to test on *before* it goes
live — a real safety net, not busywork.

- **ComfortMap first rep:** one small, safe change (e.g. add a word to the moderation
  blocklist in `src/utils/moderation.js`). Branch → commit → PR → merge.
  Repo: github.com/Zsolis-2028/comfortmap
- **Montessori first rep:** ship *this file* via a branch + PR (safe — it's just a doc).
  Repo: github.com/Zsolis-2028/montessori-engine

### 2. Reading other people's code
Pick one real flow, trace it file by file, and write 3–5 sentences explaining how it
works before asking for confirmation.

- **ComfortMap candidate flows:**
  - `src/lib/billing.js` → Stripe webhook → `profiles.plan` flip
  - Report submission → `src/utils/moderation.js` → Supabase insert
- **Montessori candidate flow:** the signup path —
  `app/signup/page.tsx` → the `create-school-profile` edge function
  (`supabase/functions/create-school-profile/index.ts`) → inserts into `schools` and
  `user_profiles`. Trace how a new account + school + profile all get created in one call.

### 3. TypeScript
Don't convert everything — start small, on a branch.

- **ComfortMap candidate:** `src/utils/moderation.js` — small, pure logic, no UI.
  Add `typescript` dev dep, add `tsconfig.json`, rename to `moderation.ts`, type
  `containsProfanity()`, run the build, confirm it passes. Don't merge until solid.
- **Montessori note:** this project is *already* TypeScript. So the rep here is to
  **tighten** types rather than convert — pick `lib/sanitize.ts` or
  `lib/supabase/profile.ts`, remove any loose `any`s, and add precise types.

### 4. Testing
Install Vitest, write tests for one small function — not the whole app.

- **ComfortMap candidate:** `containsProfanity()` in `src/utils/moderation.js`.
  Cases: clean text passes; a blocked word fails; a word that merely *contains* a
  blocked substring passes (e.g. "class"); a punctuation-obfuscated word ("f.ck")
  still gets caught.
- **Montessori candidate:** `sanitizeInput()` in `lib/sanitize.ts` — pure, no DB/API,
  security-relevant. Cases: clean text passes through unchanged; `<script>`/HTML tags
  get stripped; length capping works; empty input is handled.

---

## Working order

1. **Git branch/PR habit first** — it's the wrapper everything else happens inside.
2. **Read-and-explain one flow** — cheap, no risk, builds real familiarity.
3. **TypeScript** on the small file, on a branch.
4. **Tests** for that same small file, same branch or a follow-up.

---

## Status

- [ ] Git branch/PR rep (ComfortMap)
- [ ] Git branch/PR rep (Montessori) — ship this file via a branch + PR
- [ ] Trace + explain a flow (ComfortMap)
- [ ] Trace + explain a flow (Montessori) — the signup flow
- [ ] TypeScript conversion (ComfortMap: moderation.js)
- [ ] TypeScript tighten (Montessori: sanitize.ts or profile.ts)
- [ ] Vitest tests (ComfortMap: containsProfanity)
- [ ] Vitest tests (Montessori: sanitizeInput)
