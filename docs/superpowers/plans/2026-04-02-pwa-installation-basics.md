# PWA Installation Basics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the current Three Moves web app installable PWA basics with monogram branding, a minimal service worker, and a tiny iPhone install guide without adding offline sync or push.

**Architecture:** Keep the app largely unchanged and add a thin PWA shell on top. The manifest and icons define the installed app identity, a no-op service worker provides the installable/PWA surface without caching app data, and a small `/install` page explains the iPhone flow. All page rendering stays in the existing App Router pages.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, browser Service Worker APIs, static icon assets.

---

### Task 1: Add manifest and root PWA metadata

**Files:**
- Create: `public/manifest.webmanifest`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Define the manifest identity**

Create a manifest that keeps the product name as `Three Moves`, uses a short monogram-friendly `short_name`, sets `display` to `standalone`, and points `start_url` and `scope` to `/`. Include two icon entries at 192px and 512px that will later map to the monogram artwork.

- [ ] **Step 2: Wire root metadata to the manifest**

Update the root layout metadata so the app advertises the manifest, `theme-color`, and Apple web app meta values from the same warm paper palette already used by the app. Keep the existing language and page title behavior intact.

- [ ] **Step 3: Confirm the browser shell still renders normally**

Run the app locally and open the root page. Expected result: the app still uses the current warm paper UI, and the new PWA metadata does not change page layout, spacing, or typography.

- [ ] **Step 4: Validate the head output**

Run:

```bash
npm run lint
npm run typecheck
```

Expected result: both commands pass. In the browser devtools head panel, confirm the manifest link and theme color are present.

### Task 2: Create warm monogram app icons

**Files:**
- Create: `src/app/icon.svg`
- Create: `src/app/apple-icon.png`
- Update: `src/app/favicon.ico`
- Create: `public/icons/icon-192.png`
- Create: `public/icons/icon-512.png`
- Create: `public/icons/icon-maskable-192.png`
- Create: `public/icons/icon-maskable-512.png`

- [ ] **Step 1: Build the monogram artwork once**

Create a simple warm-paper monogram mark that reads well at small sizes. Keep it high contrast and minimal so it still looks sharp in the home screen grid and iPhone splash contexts.

- [ ] **Step 2: Export app and manifest sizes**

Export the same artwork into the icon set required by the manifest and Apple home screen support. Use the 192px and 512px PNGs as the primary manifest assets and provide maskable variants for Android launch surfaces.

- [ ] **Step 3: Replace the default favicon fallback**

Update the existing favicon so browser tabs and bookmarks do not show the default starter icon. Keep the icon style consistent with the monogram.

- [ ] **Step 4: Confirm icons are reachable**

Open the app in the browser and verify the icon URLs resolve directly. Expected result: no broken image requests and no console errors related to missing icon files.

### Task 3: Register a minimal service worker

**Files:**
- Create: `public/sw.js`
- Create: `src/components/pwa-registry.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Add the minimal service worker**

Implement a service worker that only handles lifecycle events: `install`, `activate`, and client claiming. Do not intercept fetches, do not cache app data, and do not add sync or push handlers.

- [ ] **Step 2: Register the worker from the client**

Add a tiny client component that registers `/sw.js` after mount when the browser supports service workers. Keep registration isolated so the rest of the app stays server-rendered as it is today.

- [ ] **Step 3: Keep the app behavior unchanged**

Open the app, navigate through Today, Reminder, Night, and History, and confirm the worker does not alter request flow or page rendering. Expected result: no offline fallback UI, no stale shell, no fetch interception.

- [ ] **Step 4: Verify worker lifecycle**

In browser devtools Application panel, confirm the service worker is installed and controlling the page after reload. Run:

```bash
npm run build
```

Expected result: build still succeeds with the worker present.

### Task 4: Add a minimal iPhone install entry

**Files:**
- Create: `src/app/install/page.tsx`
- Create: `src/components/install-guide.tsx`
- Modify: `src/components/app-shell.tsx`

- [ ] **Step 1: Create the install guide content**

Add a tiny install guide that explains the iPhone path in plain language: open Safari, tap Share, choose Add to Home Screen. Keep it short and do not add prompts about permissions, notifications, or accounts.

- [ ] **Step 2: Add a visible entry point**

Add a small `Install` link or pill in the app shell so the guide is reachable from any page without disturbing the existing layout.

- [ ] **Step 3: Keep the page visually aligned**

Make the install page reuse the current warm paper theme and monogram branding so it feels like part of the app rather than a separate help center.

- [ ] **Step 4: Validate the mobile flow**

On a phone or simulator, open `/install`, confirm the instructions are readable, then open the main app and verify the new shell entry does not block any existing controls.

### Task 5: End-to-end PWA verification

**Files:**
- No code changes expected unless a verification run exposes a real defect

- [ ] **Step 1: Run the repository checks**

Run:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Expected result: all commands pass.

- [ ] **Step 2: Verify the manifest and icons from the browser**

Open `view-source:` or devtools and confirm the manifest URL, icon URLs, and theme color are correct. Expected result: no 404s for manifest or icon assets.

- [ ] **Step 3: Verify installability on iPhone**

On iPhone Safari, confirm the site can be added to the home screen, opens as a standalone app, and shows the warm monogram icon rather than the browser favicon.

- [ ] **Step 4: Verify no scope creep**

Confirm there is no Web Push permission prompt, no offline sync UI, and no extra product pages beyond the install guide.

## Coverage Check

- Manifest and root metadata are covered by Task 1.
- Monogram app icons are covered by Task 2.
- Minimal service worker is covered by Task 3.
- The install entry for iPhone users is covered by Task 4.
- Manual and automated verification is covered by Task 5.

## Risks

- Service worker registration can appear to work in one browser while failing in another if the asset path is wrong.
- PWA install behavior differs between Safari on iPhone and Chromium browsers, so the install guide must stay browser-specific and simple.
- Replacing the favicon and app icons with monogram assets can make small-size contrast issues obvious, so the artwork must stay high contrast.

## Assumptions

- The product name remains `Three Moves`.
- The warm paper visual system stays in place.
- The app remains local-first and does not gain offline sync, Web Push, or account flows in this phase.

## Open Questions

- Should the install entry live as a dedicated `/install` page only, or also appear as a small link in the root shell on every page?
- Do we want one monogram for all icon surfaces or a slightly simplified variant for the 192px/512px manifest assets?

## Next Steps

- Review this plan.
- If approved, choose either subagent-driven execution or inline execution.
- Then implement the plan task by task with verification after each task.
