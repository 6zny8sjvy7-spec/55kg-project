# FIX-01–04 release validation

Validated against production parent `26d5282f0e087bdd8a689069f39da32e73dec71d`.
Recoverable code branch: `backup/pre-fix-01-03-20261021` (also covers this integrated release).
This is a code backup, not a backup of any user's phone storage.

## Changes

- Historical food snapshots automatically appear in food-form suggestions and unified search. Confirmed saved nutrients are the basis; unknown macros stay null. Different nutritional versions remain separate. Reuse creates a new dated record; reliable recorded grams support weight conversion, otherwise servings only. A duplicate large custom-food form is removed without removing its stored library.
- Food, exercise and weight histories show the latest seven **recorded date groups**, collapsed by default. More loads seven further dates. Detail rows are rendered when expanded. Existing edit/delete remain available. Startup avoids rendering the entire detailed history before grouped views load.
- Weight chart offers 7/30/90/all date ranges, morning daily means, independently identified other observations, a measured-days rolling seven-calendar-day average, and point details. Unknown periods never become morning records. Optional measurement time is retained when supplied; older records without time are dated only, never assigned a guessed measurement time. The main energy model is unchanged.
- Complete local JSON export covers all current `55kg_` personal localStorage keys (including unknown future personal keys) and existing current-tab custom course session steps. Public food IndexedDB cache is intentionally excluded; it is reproducible public data. No backup network upload exists.
- Version-2 envelopes contain export time and SHA-256 integrity over canonical content. Version-1 backups remain readable with an explicit lack-of-original-hash warning. Import previews counts before writing; safe merge is default. Same-ID conflicts keep existing records; repeated import is idempotent. Settings keep current values under merge. Overwrite requires export, selecting the saved safety export for readback verification, and two confirmations.
- Explicit imports journal before/after snapshots, verify writes, roll back on failure and recover interrupted transactions before legacy startup. If rollback or parsing cannot complete, writes stop rather than replacing data with an empty database. Rescue exports retain malformed raw text but are deliberately not directly importable without repair.
- New browser storage starts without any owner weight, meal or exercise record. Height and age fields are not prefilled with an owner's profile. Existing stored records/settings are not migrated or reset. Devices do not synchronize automatically. Safari and Home Screen storage containers are not guaranteed to be shared.

## Evidence

Tests use synthetic isolated data only, Chromium 153.0.8010.0, real browser execution on a cloud Linux host. No test touched an actual user's phone data. Browser processes use normal isolated contexts; single-process mode is not used for isolation evidence.

| Suite | Checks | Scope |
|---|---:|---|
| `tests/fix-01-03-browser.cjs` | 81 | Historical reuse, unknown vs zero, grams/servings/manual edits, food/exercise CRUD, homepage totals, date changes, chart ranges, measured time, old-field preservation, search, seven filters, paging, reload |
| `tests/fix-01-03-faults.cjs` | 25 | Storage-full injection, retained drafts/retry, food-data outage/manual fallback, 320/390/430/1200 px layouts |
| `tests/fix-04-browser.cjs` | 53 | Full export, real download/readback, SHA validation, legacy import, merge/conflicts/idempotence, two-confirmation overwrite, partial-failure rollback, crash recovery, malformed-data protection, safety-script failure protection, independent browser contexts, session-step backup |
| `tests/fix-01-03-data.cjs` | 647 | Pure conversion/trend assertions, 15,367 foods, 610 shard hashes plus unchanged calculation/form/barcode/estimator/video assets; the majority are file-integrity checks, not separate user workflows |

BMR/TDEE/Gross-Net calculation code is byte-for-byte unchanged. All 610 existing food-data files and their original 15,367 entries are retained; no duplicate database is uploaded. Existing barcode scanning implementation and vendor assets remain unchanged. Camera hardware was not exercised in these tests.

Raw machine-readable results are included next to test scripts. Screenshots use synthetic data and are local review artifacts, not personal backup files.

## Performance and limits

`tests/fix-performance.cjs` measures three fresh browser contexts per version over local HTTP with warm host disk cache. It does not represent mobile network latency or a real iPhone. See `tests/fix-performance-results.json` for all samples and decoded bytes. Homepage requests no food database or video thumbnails. The release adds three small local safety/history/backup modules; no new remote dependency or paid service is added.

The integration food-search run issued 19 food-data requests across multiple queries and loaded only six nutrition shards, not all 610 data shards. Historical snapshots derive from current browser records; no separate large localStorage food database is created. Runtime backup journal temporarily requires space for both before/after snapshots; quota failure is handled and does not silently reset data.

## Still requires physical iPhone acceptance

1. In Safari, confirm existing food, weight, exercise, favorites and settings remain visible before any import.
2. Reuse an old meal; adjust half/1.5 servings or known grams; save today, check home totals and the original date remains unchanged.
3. Expand histories and load older dates; test weight ranges, morning vs all observations and point selection.
4. Export JSON to Files, confirm file is saved; select it for preview. Use safe merge first and verify repeating it does not multiply records.
5. If overwrite is intentionally wanted, verify the safety export by selecting it and review both confirmations. Do not overwrite merely to test download.
6. Repeat export/selection in Home Screen mode. Verify its records independently; do not assume Safari synchronization.
7. Retest barcode permission, rear-camera scan, result, camera release and manual fallback; existing scanner code is unchanged but physical scanning has not been validated here.

Physical iPhone Safari, Home Screen file-provider behavior, rear camera and real-device FPS remain untested. A browser download event proves generation/download delivery, not that a user saved a file on their phone. Data in a corrupt rescue backup may require manual repair; the app does not fabricate replacement records.

## Deployment gate

Publish this integrated FIX-01–04 only after passing all suites, verifying the backup branch and unchanged main parent. Create one commit, read back tree/parent/file hashes, recheck main, then fast-forward without force. Deployment is only complete after GitHub Pages reports success and the live index/modules and food-data hashes match the release. Phase 6 model/animation work is outside this release.
