# FIX-02 V2.1 — two-level history disclosures

## Baseline and scope
- Baseline main: `ddbb62dc3454b06657833be675d559e9c53c8723`.
- Verified rollback branch: `backup/pre-fix02-v21-20261021`, points to that exact commit.
- Root cause: only date-level `<details>` existed. The containing history heading was an ordinary h2. The old load-more handler increased a cumulative limit by seven, so the DOM could grow indefinitely.
- Runtime changes only: `index.html` adds three native outer details/summary wrappers and a cache version; `assets/history-fixes.js` adds large touch targets/arrows, clears day detail display state on outer close and uses fixed seven-date previous/next pages.
- Outer wrapper is outside the list HTML replaced by render(), so new records and edits do not forcibly open a closed section. Date rows remain separately collapsible and hydrate only on demand. Reload starts all three sections closed. Closing a section also releases hydrated date rows.
- Every recorded date remains reachable, including dates older than a year. There is no retention cutoff or database migration. All food shards and 3D preview files are unchanged. All existing inline scripts (including energy calculations) are byte-for-byte unchanged.

## Current execution evidence
Real headless Chromium 151.0.7922.34 on Linux; isolated synthetic browser contexts and local HTTP. This is not physical iPhone Safari or Home Screen acceptance. Official Chrome-for-Testing storage download was used because the Playwright CDN returned HTML rather than a ZIP. Full Chrome's profile Unix socket was restricted in this environment; the official headless shell runs the tests successfully without switching to single-process mode.

| Suite | Passed checks | Coverage |
|---|---:|---|
| `tests/fix-02-v21-browser.cjs` | 245 | Outer/inner toggles, 48px targets, independent state, re-render/reload, 320/390/430px widths, all 400 recorded dates for each kind across 58 fixed pages, unchanged stored bytes |
| `tests/fix-01-03-browser.cjs` | 85 | Historical meal reuse, grams/servings, manual edits, duplicate-submit guard, food/exercise CRUD, weight editing/time/ranges, real food search, Net totals, reload and paging; food save keeps every closed history section closed |
| `tests/fix-01-03-faults.cjs` | 25 | Quota failure and recovery, unknown/zero handling, mobile widths, database outage and manual fallback |
| `tests/fix-04-browser.cjs` | 53 | Export/download readback, SHA validation, legacy import, merge/idempotence, overwrite confirmations, rollback, malformed-storage write protection, isolated browser data |
| `tests/fix-01-03-data.cjs` | 647 | Old snapshot semantics, dates/averages, unchanged 15,367 foods and 610 shards, preserved food/exercise modules and energy calculation code |

Total: 408 browser assertions and 647 data/file assertions passed. No browser runtime errors in the integration and disclosure suites. These are bounded test cases, not proof that every possible browser/device state is correct.

New screenshots `fix-02-v21-closed.png` and `fix-02-v21-open.png` are local test artifacts, generated with a local Traditional Chinese font for legibility. No personal data was used or acquired. No phone data backup is claimed.

## Release checks
- Native HTML disclosure semantics preserve a working outer collapse even before the history script finishes loading.
- Styles hide the native marker only on the outer summary and add explicit ▶/▼ arrows; date summaries keep native disclosure behavior.
- Seven-date page state is memory-only and clamped after records are removed. Previous/next buttons replace dates, never append them. Oldest dates retain edit/delete controls. Historical data and all statistics still use the complete stored arrays.
- No new storage write, remove, clear, reset, migration or external dependency is added. The existing explicit weight-edit storage write is unchanged. Native collapses/pagination do not call persist().
- Runtime JavaScript growth is about 2 KB; no new runtime requests or food preload are introduced. There is no claim of measured physical iPhone performance.
- Publish one commit based on the verified main, read back its parent/tree/files, recheck main, then fast-forward using expected SHA and force=false. Monitor Pages and verify served file Git blob hashes, not just commit creation.

## iPhone Safari / Home Screen acceptance still required
1. Visit each food/exercise/weight page: only the history title and right arrow should be visible initially.
2. Tap title: see up to seven dates. Tap one date to reveal entries and edit/delete actions. Tap date again to collapse it.
3. Open a date, close the outer title, then reopen: no long detail list should remain exposed.
4. Use older/newer dates, reach an old record and return. New pages must replace the previous dates.
5. Add/edit a record while the history section is closed; it should remain closed. Confirm home totals and weight trend are still correct.
6. Refresh Safari and launch from Home Screen: records remain, histories start closed. Separate Safari/Home Screen storage containers may differ; do not assume synchronization.
7. Check thumb reach, arrow visibility and scrolling. Report physical device issues separately; do not clear website data to refresh the code.
