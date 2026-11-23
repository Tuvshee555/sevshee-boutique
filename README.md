# SEVSHEE — women's boutique demonstration

A complete online boutique for a **fictional** Ulaanbaatar women's clothing shop, built by
[Ursgal Digital](https://www.ursgaldigital.com) as a portfolio demonstration. The shop,
products, prices, stock and sample orders are invented; the system is real: a Postgres
database, size-level inventory, server-priced checkout, an admin dashboard and a shopping
assistant that answers from the database.

SEVSHEE is a sibling of the MANAN clothing demo and the ALKHAM shoe demo: the same engine with
its own catalogue (`src/server/seed/sevshee/`), identity and copy. The engine's tests still run
against the MANAN reference catalogue (`src/server/seed/reference/`, `STORE_CATALOG=reference`);
`tests/unit/sevshee-catalog.test.ts` checks SEVSHEE's own data.

| | |
|---|---|
| Store | https://sevshee-boutique.vercel.app |
| Admin | `/admin/login` → «Демо горимоор нэвтрэх» (no password) |
| Portfolio | https://www.ursgaldigital.com/portfolio/boutique |

Everything customer-facing is in Mongolian; prices are integer tögrög (`189,000₮`).

## What is real and what is simulated

| Area | Status |
|---|---|
| Catalogue, 30 products in 7 categories (dresses, tops, knitwear, skirts, trousers, outerwear, bags and scarves), colour × size variants, photos | **Real** — read from Postgres on every page |
| Stock per variant, low-stock / sold-out states | **Real** — live, enforced by the database (`stock >= 0`) |
| Colour swatches on the home page, body-measurement size finder | **Real** — colour families and size ranges come from the catalogue and the size chart in the database |
| Cart, checkout, order creation, stock reservation | **Real** — one transaction with row locks; cannot oversell |
| Admin: products, variants, stock, orders, customers, settings | **Real** (owner account); the public demo is restricted |
| Shopping assistant | **Real** — exact colour × size answers, chest/waist → size, Latin-script Mongolian, chat orders after an explicit «тийм», hand-over to staff. Catalogue mode (deterministic) without an AI key |
| QPay | **Simulated** — clearly labelled; the adapter is built but the demo never takes money |
| Delivery, e-mail, SMS | **Not performed** — demo only |
| Shop, products, prices, sample orders, policies | **Fictional** |

## Stack

Next.js 16.4 (App Router, Cache Components, Partial Prefetching) · React 19 · TypeScript ·
Tailwind CSS 4 · PostgreSQL (Neon) via Drizzle ORM · zod 4 · Vitest · Playwright · Vercel.
The structure follows Ursgal's cleaning-platform codebase (services take a `ServiceContext`,
server actions validate → authorize → call service).

## Local development

```bash
npm install
cp .env.example .env.local     # set ADMIN_EMAIL / ADMIN_PASSWORD for a local owner account
npm run db:dev                 # own terminal: local PostgreSQL; the first run migrates and seeds it
npm run dev                    # http://localhost:3200
```

Local development and tests use only the local database from `npm run db:dev` (`DATABASE_URL=postgres://postgres:postgres@127.0.0.1:54328/sevshee_dev`, data in `.dev-db/`). The production database URL is set only in the Vercel project; never put it in `.env.local`.

| Command | |
|---|---|
| `npm run dev` / `build` / `start` | Next.js on port 3200 |
| `npm run db:dev` | local development PostgreSQL (first run: migrate + seed); keep it running while you work |
| `npm run lint` · `typecheck` | ESLint (incl. React Compiler rules) · `tsc --noEmit` |
| `npm test` | unit + integration (integration starts its own throwaway Postgres — never the live DB) |
| `npm run test:e2e` | Playwright shopping-to-admin journey (`E2E_BASE_URL=https://… npm run test:e2e` for a deployed site) |
| `npm run db:migrate` · `db:seed` · `db:generate` | migrations (additive), seed (adds only what is missing), new migration from `schema.ts` |
| `npm run images:build` | download, crop and encode catalogue photos from `scripts/images/manifest.json` (the build runs it with `--ensure` for photos not committed yet) |
| `npm run assistant:smoke` | ask the assistant the reference questions (as an admin test chat) and check every amount against the database |
| `ASSISTANT_EVAL_REPORT=1 ASSISTANT_EVAL_HELDOUT=1 npx vitest run tests/integration/assistant-eval.test.ts` | Mongolian evaluation (102 + 30 held-out conversations) → `docs/assistant/EVAL*.md` |
| `npm run check` | lint + typecheck + tests + build |

## Accounts

- **Public demo** — `/admin/login` → «Демо горимоор нэвтрэх». A 4-hour session on the `demo`
  role: sees sample data plus orders placed from the same browser, may move *its own* orders
  through their statuses; in AI чатбот, sees sample chats and its own, may take over and answer
  only its own; cannot edit products, stock, settings or the chatbot; never sees other visitors.
- **Owner** — e-mail and password set once through `ADMIN_EMAIL` / `ADMIN_PASSWORD` when
  seeding. Never published. Change it under Admin → Тохиргоо.

## Documentation

- [docs/BRAND.md](docs/BRAND.md) — name, identity, voice
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — layers, caching, data flow, demo scope
- [docs/DATABASE.md](docs/DATABASE.md) — schema, invariants, inventory ledger, seed
- [docs/ASSISTANT.md](docs/ASSISTANT.md) — the assistant: what came from Lorentz, clothing layer, chat orders, hand-over, AI mode, evaluation
- [docs/SECURITY.md](docs/SECURITY.md) — controls and what they protect
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — Vercel, environment variables, cron, QPay activation
- [docs/IMAGE_CREDITS.md](docs/IMAGE_CREDITS.md) — every photo, photographer and licence

The brand name lives in one place: `src/lib/brand.ts`.
