# Real Reminders Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a minimal, production-ready reminder chain for one iPhone-focused PWA subscription, one fixed daily slot, and push-to-reminder navigation.

**Architecture:** Keep the existing Today / Night / History app intact and add a narrow reminder subsystem beside it. The client owns permission requests and subscription creation, a small API stores one active subscription per install, a cron-driven server route sends one daily push, and the service worker turns the push into a notification that opens the reminder route.

**Tech Stack:** Next.js App Router, React, TypeScript, Web Push API, Notifications API, Service Worker, `web-push`, `@vercel/kv` or equivalent Vercel-backed persistent key-value storage, Vercel Cron.

---

### Task 1: Reminder primitives and payload helpers

**Files:**
- Create: `src/lib/reminders/config.ts`
- Create: `src/lib/reminders/types.ts`
- Create: `src/lib/reminders/payload.ts`
- Modify: `src/lib/constants/reminders.ts`
- Test: `src/lib/reminders/payload.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { buildReminderNotification, PRIMARY_REMINDER_PATH, PRIMARY_REMINDER_SLOT_ID } from "./payload";

describe("buildReminderNotification", () => {
  it("builds a notification that opens the primary reminder route", () => {
    const payload = buildReminderNotification({
      slotId: PRIMARY_REMINDER_SLOT_ID,
      dateKey: "2026-04-03",
      todayItems: ["A", "B", "C"],
    });

    expect(payload.title).toBe("Three Moves 提醒");
    expect(payload.body).toContain("19:00");
    expect(payload.url).toBe(PRIMARY_REMINDER_PATH);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/lib/reminders/payload.test.ts`
Expected: FAIL because the reminder helper module does not exist yet.

- [ ] **Step 3: Write minimal implementation**

```ts
export const PRIMARY_REMINDER_SLOT_ID = "5";
export const PRIMARY_REMINDER_PATH = "/reminder/5";

export function buildReminderNotification(input: {
  slotId: string;
  dateKey: string;
  todayItems: [string, string, string] | string[];
}) {
  return {
    title: "Three Moves 提醒",
    body: `今天 19:00 的提醒：先回到 /reminder/${input.slotId} 查看今天三件事。`,
    url: PRIMARY_REMINDER_PATH,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/lib/reminders/payload.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/reminders/config.ts src/lib/reminders/types.ts src/lib/reminders/payload.ts src/lib/constants/reminders.ts src/lib/reminders/payload.test.ts
git commit -m "feat: add reminder payload helpers"
```

### Task 2: Client reminder toggle and subscription flow

**Files:**
- Create: `src/lib/reminders/install-id.ts`
- Create: `src/lib/reminders/permissions.ts`
- Create: `src/lib/reminders/push-client.ts`
- Create: `src/hooks/use-reminder-subscription.ts`
- Create: `src/components/reminder-toggle.tsx`
- Modify: `src/components/reminder-page.tsx`
- Modify: `src/components/app-shell.tsx` if the toggle needs shell-level placement
- Test: `src/lib/reminders/push-client.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { base64ToUint8Array } from "./push-client";

describe("base64ToUint8Array", () => {
  it("converts a url-safe base64 public key into bytes", () => {
    const bytes = base64ToUint8Array("BEl1bW15X3B1YmxpY19rZXk");
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/lib/reminders/push-client.test.ts`
Expected: FAIL because the client helper does not exist yet.

- [ ] **Step 3: Write minimal implementation**

```ts
export function base64ToUint8Array(value: string) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const normalized = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(normalized);
  const bytes = new Uint8Array(raw.length);
  for (let index = 0; index < raw.length; index += 1) {
    bytes[index] = raw.charCodeAt(index);
  }
  return bytes;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/lib/reminders/push-client.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/reminders/install-id.ts src/lib/reminders/permissions.ts src/lib/reminders/push-client.ts src/hooks/use-reminder-subscription.ts src/components/reminder-toggle.tsx src/components/reminder-page.tsx
git commit -m "feat: add reminder subscription toggle"
```

### Task 3: Server subscription store and send route

**Files:**
- Create: `src/lib/reminders/server-store.ts`
- Create: `src/app/api/reminders/subscription/route.ts`
- Create: `src/app/api/reminders/send/route.ts`
- Create: `src/lib/reminders/send.ts`
- Create: `src/lib/reminders/cron.ts`
- Test: `src/lib/reminders/server-store.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { createReminderSubscriptionIndex, upsertReminderSubscription, listActiveReminderSubscriptions } from "./server-store";

describe("reminder subscription store", () => {
  it("stores one active subscription per install id", () => {
    const initial = createReminderSubscriptionIndex();
    const next = upsertReminderSubscription(initial, {
      installId: "abc",
      slotId: "5",
      timezone: "Asia/Shanghai",
      endpoint: "https://example.com",
      keys: { p256dh: "p256", auth: "auth" },
      expirationTime: null,
      createdAt: "2026-04-03T11:00:00.000Z",
      updatedAt: "2026-04-03T11:00:00.000Z",
      revokedAt: null,
    });

    expect(listActiveReminderSubscriptions(next)).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/lib/reminders/server-store.test.ts`
Expected: FAIL because the server store does not exist yet.

- [ ] **Step 3: Write minimal implementation**

```ts
export function createReminderSubscriptionIndex() {
  return { version: 1, records: {} };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/lib/reminders/server-store.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/reminders/server-store.ts src/app/api/reminders/subscription/route.ts src/app/api/reminders/send/route.ts src/lib/reminders/send.ts src/lib/reminders/cron.ts
git commit -m "feat: add reminder server routes"
```

### Task 4: Service worker and deployment wiring

**Files:**
- Modify: `public/sw.js`
- Modify: `src/components/pwa-registry.tsx`
- Create: `vercel.json`
- Modify: `package.json`
- Modify: `src/app/layout.tsx` only if public VAPID keys or install metadata need a small hook

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { buildReminderNotification } from "./payload";

describe("push payload", () => {
  it("includes a url for notification clicks", () => {
    const payload = buildReminderNotification({
      slotId: "5",
      dateKey: "2026-04-03",
      todayItems: ["A", "B", "C"],
    });

    expect(payload.url).toBe("/reminder/5");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/lib/reminders/payload.test.ts`
Expected: FAIL until the payload helper exists.

- [ ] **Step 3: Write minimal implementation**

```js
self.addEventListener("push", (event) => {
  const payload = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: "/icon.svg",
      data: { url: payload.url || "/reminder/5" },
    })
  );
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow(event.notification.data?.url || "/reminder/5"));
});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/lib/reminders/payload.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add public/sw.js src/components/pwa-registry.tsx vercel.json package.json src/app/layout.tsx
git commit -m "feat: wire reminder push delivery"
```

## Verification Checklist

- App build stays green: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`
- Client can request permission only from a direct click
- Server can persist one subscription record
- Cron route can send a push with a clickable reminder URL
- Service worker opens `/reminder/5` on notification click

## Gaps / Risks

- Vercel storage or KV credentials still need to exist in the deployment environment.
- VAPID keys must be provisioned before push can actually send in production.
- iPhone Web Push still needs a real installed Home Screen app for end-to-end validation.
