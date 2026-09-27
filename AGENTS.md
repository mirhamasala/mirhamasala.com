# AGENTS.md

Read `docs/PRODUCT.md` and `docs/ARCHITECTURE.md` before making changes.

## Legacy code

- The previous site lives at tag `pre-redesign-2026` and branch `legacy`. It is not an architectural reference.
- Never copy, adapt, or imitate its code, configuration, dependencies, components, styling, content format, or file layout.
- It may be used only as a source of editorial content, images, and public slugs, and only when a task explicitly asks for migration.

## Hard requirements

- Articles are served at `/posts/[slug]`. This is the only compatibility requirement with the old site.
- The user-facing label for `/posts` is "Writing". "posts" is an internal name only.

## Working rules

- Default to Server Components. Add `"use client"` only for real interactivity.
- A new runtime or significant tooling dependency needs a concrete requirement. Record the decision and rationale in `docs/ARCHITECTURE.md` in the same change. Prefer platform and Next.js features.
- Do not settle anything listed under "Not yet decided" in `docs/PRODUCT.md` or "Undecided" in `docs/ARCHITECTURE.md` unless the current task explicitly asks for that decision. Otherwise, raise it instead.
- Do not add frontmatter fields, abstractions, or folders ahead of a concrete need.
- When a durable architectural decision is made, record it in `docs/ARCHITECTURE.md` in the same change.
- Use pnpm. Before finishing, `pnpm lint`, `pnpm typecheck`, and `pnpm build` must pass.

## Git and deployment

- Never rewrite history or force-push.
- `main` deploys to production. Do not push to `main` without explicit approval.
- Never commit `.env*` files or `.vercel/`.
