# Nuannuan Growth Center Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the local foundation for Nuannuan Growth Center and integrate the first accessible PWA without deleting legacy data.

**Architecture:** A local control workspace owns registry files, Supabase migrations, an SDK package, an admin dashboard, and migration scripts. Existing PWA code imports the SDK directly from the workspace package until the package is published.

**Tech Stack:** TypeScript, React, Vite, Node test runner, Supabase SQL, local JSON registries.

---

### Task 1: Discovery And Registry

**Files:**
- Create: `nuannuan-growth-center/scripts/discover-projects/discover.mjs`
- Create: `nuannuan-growth-center/tests/discover.test.mjs`
- Generate: `nuannuan-growth-center/registry/discovered-projects.json`

- [x] Write failing tests for PWA and picture book classification.
- [x] Implement local scanner and classifier.
- [x] Run scanner against the current workspace.

### Task 2: Growth SDK

**Files:**
- Create: `nuannuan-growth-center/packages/growth-sdk/src/index.ts`
- Create: `nuannuan-growth-center/tests/growth-sdk.test.mjs`

- [x] Write failing tests for offline event queue and legacy migration record.
- [x] Implement SDK client, memory/browser storage, and Supabase REST transport.
- [x] Compile SDK and run tests.

### Task 3: Admin Dashboard

**Files:**
- Create: `nuannuan-growth-center/apps/admin/src/App.tsx`
- Create: `nuannuan-growth-center/apps/admin/src/styles.css`

- [x] Read registry JSON files.
- [x] Display overview, project library, migration console, and blocker list.
- [x] Build dashboard successfully.

### Task 4: First PWA Integration

**Files:**
- Create: `src/lib/growthClient.ts`
- Modify: `src/App.tsx`
- Create: `nuannuan.project.json`

- [x] Keep old local storage and IndexedDB untouched.
- [x] Track session, app open, task completion, achievements, progress, and legacy migration.
- [x] Build root PWA successfully.

### Task 5: Final Verification

- [x] Run SDK tests.
- [x] Run admin build.
- [x] Run root PWA build.
- [x] Record permission blockers and remaining external work.
