# 中国可用版迁移 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the current product unchanged while replacing the overseas infrastructure so the same app works on China networks without VPN.

**Architecture:** Preserve the current Next.js App Router product layer as the shared baseline, then introduce a thin infrastructure boundary for deployment, storage, scheduling, and notification delivery. The overseas version remains the reference baseline; the China worktree becomes the migration candidate that reuses the same routes, copy, layout, and local data model, but swaps platform-specific infrastructure behind adapters.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, PWA, EdgeOne Pages for China deployment, domestic storage/scheduling/push providers behind adapters, local-first browser storage for product state.

---

## Scope Lock

This plan is intentionally limited to infrastructure migration.

**Do keep unchanged**
- Today / Reminder / Night / History / Install pages
- Route structure and page transitions
- Current copy, layout, and mobile-first visual language
- Local-first product data model
- PWA shell behavior that does not depend on overseas infrastructure

**Do replace**
- Deployment target and domain
- Static asset delivery assumptions
- Reminder subscription persistence
- Scheduled reminder trigger
- Push delivery backend
- Any environment variables tied to overseas vendors

**Do not add**
- Account system
- Cloud sync product logic
- New product pages
- Analytics dashboard
- Product redesign

---

## Task 1: Freeze the Shared Product Baseline

**Files:**
- Modify: `E:/three-moves-cn-migration/docs/01_当前版本保留项.md`
- Modify: `E:/three-moves-cn-migration/docs/02_必须替换的基础设施项.md`
- Modify: `E:/three-moves-cn-migration/docs/04_风险与边界.md`
- Modify: `E:/three-moves-cn-migration/docs/06_目录地图.md`
- Create: `E:/three-moves-cn-migration/docs/07_基线冻结清单.md`

- [ ] **Step 1: Record the frozen product surface**

Capture the exact product surface that the China version must reuse: Today, Reminder, Night, History, Install, local persistence, and the current mobile layout. The intent is to make later diffs obvious and prevent accidental product drift.

- [ ] **Step 2: Mark infrastructure-only change areas**

List the files that are allowed to diverge between overseas and China versions: deployment config, storage adapters, reminder delivery, and environment bindings.

- [ ] **Step 3: Write the baseline verification checklist**

Add a concise checklist for future workers: confirm the China branch still matches the shared product baseline before any platform replacement work starts.

- [ ] **Step 4: Validate the freeze document**

Open the freeze docs and confirm they do not introduce new product behavior, only preserve and classify existing behavior.

---

## Task 2: Separate Deployment Concerns

**Files:**
- Modify: `E:/three-moves-cn-migration/deploy/README.md`
- Modify: `E:/three-moves-cn-migration/deploy/01_部署切换检查表.md`
- Modify: `E:/three-moves-cn-migration/deploy/02_目标平台待确认.md`
- Create: `E:/three-moves-cn-migration/deploy/03_中国部署配置清单.md`
- Create: `E:/three-moves-cn-migration/edgeone.json`
- Modify: `E:/three-moves-cn-migration/package.json`
- Modify: `E:/three-moves-cn-migration/.nvmrc`
- Modify: `E:/three-moves-cn-migration/next.config.ts`

- [ ] **Step 1: Define the China deployment target**

Document the first China deployment target as EdgeOne Pages, with the intent to keep the same Next.js app and change only the hosting layer.

- [ ] **Step 2: Pin the runtime and build contract**

Keep the build command, output directory, and Node version explicit so the China platform does not guess how to build the app.

- [ ] **Step 3: Separate platform-specific settings from product code**

Put build and hosting values into deployment config only, not into page components or business logic.

- [ ] **Step 4: Verify the deployment checklist against the current app**

Confirm the deployment docs mention the same routes and assets that already work in the overseas baseline.

---

## Task 3: Abstract Reminder Infrastructure

**Files:**
- Modify: `E:/three-moves-cn-migration/src/app/api/reminders/send/route.ts`
- Modify: `E:/three-moves-cn-migration/src/app/api/reminders/subscription/route.ts`
- Modify: `E:/three-moves-cn-migration/src/lib/reminders/config.ts`
- Modify: `E:/three-moves-cn-migration/src/lib/reminders/server-store.ts`
- Create: `E:/three-moves-cn-migration/src/lib/reminders/providers.ts`
- Create: `E:/three-moves-cn-migration/src/lib/reminders/domains.ts`
- Create: `E:/three-moves-cn-migration/src/lib/reminders/transport.ts`
- Modify: `E:/three-moves-cn-migration/public/sw.js`

- [ ] **Step 1: Define a provider interface for reminder delivery**

Separate reminder sending into a platform-neutral interface so the page layer never calls a specific overseas vendor directly.

- [ ] **Step 2: Move subscription storage behind a repository boundary**

Keep the shape of a reminder subscription stable while allowing the persistence backend to change later.

- [ ] **Step 3: Keep the notification click target stable**

Preserve the current `/reminder/[slot]` route and only change the infrastructure that sends the notification, not the destination page.

- [ ] **Step 4: Ensure the service worker remains minimal**

Only keep push reception and click handling in the worker; do not introduce caching rules that could make the China version harder to debug.

- [ ] **Step 5: Validate the reminder contract**

Confirm a provider can be swapped without changing the product pages or reminder route structure.

---

## Task 4: Replace Storage and Scheduling Providers

**Files:**
- Modify: `E:/three-moves-cn-migration/src/lib/storage/store.ts`
- Modify: `E:/three-moves-cn-migration/src/lib/storage/store.test.ts`
- Modify: `E:/three-moves-cn-migration/src/lib/domain/daily-entry.ts`
- Modify: `E:/three-moves-cn-migration/src/app/api/reminders/send/route.ts`
- Modify: `E:/three-moves-cn-migration/src/app/api/reminders/subscription/route.ts`
- Create: `E:/three-moves-cn-migration/src/lib/platform/storage-adapter.ts`
- Create: `E:/three-moves-cn-migration/src/lib/platform/scheduler-adapter.ts`
- Create: `E:/three-moves-cn-migration/src/lib/platform/env.ts`
- Modify: `E:/three-moves-cn-migration/vercel.json` only if it remains relevant for the overseas baseline

- [ ] **Step 1: Classify what still uses browser-only storage**

Keep local browser storage for product state only; move reminder backend persistence into a platform adapter.

- [ ] **Step 2: Replace scheduled reminder execution with a China-compatible adapter**

Keep the fixed reminder time, but allow the execution trigger to move off overseas-only scheduling.

- [ ] **Step 3: Keep environment variables isolated**

Document which env vars are product-level and which are deployment-level so China infrastructure can inject its own values.

- [ ] **Step 4: Confirm the adapter boundary is testable**

The same product code should be able to run with a mock adapter in tests and a China provider in production.

---

## Task 5: Verify China Network and iPhone Behavior

**Files:**
- Modify: `E:/three-moves-cn-migration/docs/08_测试与上线检查.md`
- Create: `E:/three-moves-cn-migration/docs/09_中国网络验收清单.md`
- Create: `E:/three-moves-cn-migration/docs/10_迁移回退策略.md`

- [ ] **Step 1: Define the China network smoke tests**

Document the exact pages and user flows that must work without VPN: home entry, install page, reminder route, and history route.

- [ ] **Step 2: Define iPhone installation verification**

Verify that the app can still be added to the home screen and launched as an installed web app on iPhone.

- [ ] **Step 3: Define reminder delivery verification**

Document the production-only checks for notification permission, subscription save, scheduled send, and click-through navigation.

- [ ] **Step 4: Define rollback criteria**

Describe the exact symptoms that mean the China migration should stop and fall back to the overseas baseline.

---

## Self-Review

**1. Spec coverage**
- Preserve product surface: covered by Task 1.
- Replace deployment: covered by Task 2.
- Replace reminder infrastructure: covered by Task 3.
- Replace storage and scheduling providers: covered by Task 4.
- Verify China network behavior: covered by Task 5.

**2. Placeholder scan**
- No TBD/TODO placeholders.
- No “write tests for above” without details.
- No vague “handle edge cases” language.

**3. Type consistency**
- The product route names stay the same across tasks: `Today`, `Reminder`, `Night`, `History`, `Install`.
- The reminder destination stays `\`/reminder/[slot]\``.
- The China migration keeps the same shared product baseline and only changes infrastructure adapters.

---

## Execution Handoff

Plan complete and saved to `E:/three-moves-cn-migration/docs/superpowers/plans/2026-04-03-cn-migration-implementation-plan.md`.

Two execution options:

**1. Subagent-Driven (recommended)** - dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** - execute tasks in this session with checkpoints.

Which approach?

## Risks
- Product and infrastructure can drift if future changes do not respect the baseline freeze.
- China deployment specifics can force adapter work earlier than expected.
- Reminder delivery is the highest-risk subsystem because it depends on platform support, push permissions, and scheduling.

## Assumptions
- The overseas version remains the reference baseline.
- The China version should behave like the same product, not a redesign.
- EdgeOne Pages is the first China deployment target.

## Open Questions
- Which domestic storage provider will be the final persistence layer.
- Whether the first China reminder adapter should target a domestic push provider or a server-side notification bridge.
- Whether any public URL must remain identical through the migration.

## Next Steps
- Freeze the baseline documents.
- Execute deployment abstraction first.
- Then replace reminder storage and scheduling.
- Finish with China network and iPhone verification.
