# Contract Foundation Sprint 1A

## Status

done

Moved to completed on 2026-07-12 as part of Sprint 1B closure hygiene.

## Objective

Make the official TypeScript `cadenza` repo spotless as the canonical core contract reference for the next Cadenza direction.

## Approval

- Approved by the user on 2026-07-10 with: `Design approved. Proceed.`
- Decision log: [docs/decisions/2026-07-10-contract-foundation.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/decisions/2026-07-10-contract-foundation.md)
- Design proposal: [2026-07-09-contract-foundation-design.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/agent-harness/exec-plans/completed/2026-07-09-contract-foundation-design.md)

## Current Scope

- Inventory current `cadenza` public exports, source modules, tests, and docs.
- Classify each surface as core purpose, needs redesign, legacy/remove, deferred/later layer, or unclear.
- Identify the first small implementation slice after inventory.
- Keep implementation inside `cadenza` unless a root governance doc must be updated.

## Current Artifact

- `cadenza/docs/contract-foundation-inventory.md` records the first API/module/test/doc classification pass and the recommended first implementation slice.

## Progress - 2026-07-10

- Added a storage-agnostic `TaskDefinition` contract in `cadenza/src/definitions/task.ts`.
- Added `Task.key` and `Cadenza.getTaskByKey(...)`; removed legacy `Cadenza.get(name)`.
- Wired `Cadenza.createTaskFromDefinition(...)` to accept the new key-first definition shape separately from the older source-backed runtime definition shape.
- Exposed task keys in task exports and runtime snapshots.
- Added focused tests for key-first task materialization and label/name changes.
- Removed routines from the core contract instead of reclassifying them; future grouping will be handled through tags.
- Updated graph node identity so execution scheduling compares task keys instead of task names.
- Added `taskKey` metadata beside existing `taskName` fields in graph-node execution metadata.
- Added focused graph-node identity tests for same-label/different-key tasks.
- Replaced the name-indexed task registry with key-indexed task registration, lookup, and deletion.
- Updated task destruction, schema-update meta tasks, runtime snapshots, and registry registration to use task keys where possible.
- Added focused registry identity tests for same-label tasks, key-based deletion, and snapshot de-duplication.
- Added `HelperDefinition.key` and `GlobalDefinition.key`.
- Added key-indexed helper/global caches and public `getHelperByKey(...)` / `getGlobalByKey(...)` lookups.
- Updated helper/global alias binding storage to point at dependency keys rather than dependency labels.
- Exposed helper/global keys through exports, creation events, and runtime snapshots.
- Added focused tool identity tests for same-label helpers/globals and keyed alias resolution.
- Removed the legacy CLI package surface:
  - deleted `src/cli.ts`
  - deleted `src/runtime/SharedRuntimeDaemon.ts`
  - deleted `tests/unit/runtime-cli.test.ts`
  - removed `package.json#bin.cadenza`
  - removed the CLI build target from `tsup.config.ts`
- Removed runtime-host code, subscription manager code, runtime-host tests, and protocol/subscription types after extracting the useful source materialization path.
- Removed Runtime-Direct CLI and legacy repo references from README/product/architecture docs.
- Resolved actor identity terminology with user approval: `actorKey` is stable actor definition identity; `defaultKey` remains the default actor-state key.
- Added `actorKey` to actor definitions/specs, actor metadata, and runtime snapshots.
- Added key-indexed actor cache with `Cadenza.getActorByKey(...)` and removed `getActor(name)` label lookup.
- Added focused actor identity tests for same-label actors, duplicate actor-key rejection, snapshots, and actor task metadata.
- Removed `GraphRoutine`, `Task.makeRoutine(...)`, routine registry state, routine runtime definitions, routine snapshot entries, and routine-capable runner/signal/inquiry types.
- Renamed internal execution-group metadata from routine-oriented names to run-oriented names.
- Added task keys to source-backed runtime task definitions, runtime task binding contracts, task relationship metadata, and runtime snapshots.
- Added focused tests for runtime-owned task replacement by key and successor/predecessor snapshot keys.
- Updated source-backed helper/global runtime-owned replacement and snapshots to resolve by stable key.
- Added focused helper/global replacement tests for same-key label changes.
- Resolved signal/intent identity by user direction: signals and intents remain name-keyed.
- Added explicit validation and docs for signal naming (`domain.event`, optional `:tag`) and intent naming (`kebab-case`).
- Removed Vue Flow export, color randomization, custom graph exporter injection, and unused graph visitor hooks from the core.
- Replaced `GraphRun.export()` graph output with a neutral core snapshot that retains execution introspection without UI layout fields.
- Classified debounce, ephemeral, throttle, and cloning/timestamp utilities as retained task-execution support rather than separate primitives.
- Removed unused `GraphDebugRun`.
- Removed temporary name lookup compatibility APIs and caches for tasks, actors, helpers, and globals.
- Renamed runtime validation scope starts to `startTaskKeys`.
- Removed the legacy actor definition `state.durable.initialState` fallback in favor of `initState`.
- Removed dead task/node traversal surfaces after purpose audit:
  - `src/interfaces/Graph.ts`
  - `src/graph/iterators/TaskIterator.ts`
  - `src/graph/iterators/GraphNodeIterator.ts`
  - `Task.getIterator(...)`
  - `GraphNode.getIterator(...)`
  - `GraphNode.lightExport(...)`
- Made runtime-owned definition and binding contracts key-required instead of deriving identity from labels.
- Removed runtime registry fallback logic that treated names as definition identity.
- Updated `Task.export()` to emit key-first relationship arrays with names retained only as labels.
- Trimmed public package named exports so internal runners, brokers, registries, contexts, signal emitters, and task variants are not translation-source API.
- Marked internal Cadenza singleton fields and run-strategy objects as internal so generated declarations no longer expose them as public contract.
- Changed task-variant factory return types to the base `Task` type for public declaration coherence.
- Updated README and inventory docs to match the narrowed public contract.

## Sprint Scope

- TypeScript core only.
- Task-only executable primitive taxonomy.
- Key-first runtime identity.
- Storage-agnostic task definition and materialization contracts.
- Helper/global access direction.
- Minimal actor core semantics and task-side actor binding direction.
- Terminology cleanup around current in-process graph runner versus future chamber runtime.
- Purposeful-code cleanup.
- README, docs, and tests aligned with exported behavior.

## Out Of Scope

- Backwards compatibility with legacy consumers.
- `cadenza-service`, `cadenza-db`, `cadenza-ui`, demo, or old runtime bridge implementation.
- CLI work.
- Memory or Weave prototype work.
- Chamber runtime repo creation.
- Cells, placement, scale, distribution, orchestration, authority/tag/policy runtime, UI/UX, agents, plugins, secrets, or evidence.
- Polyglot repos until TypeScript is spotless.

## Work Plan

1. Record approval and open Sprint 1A execution plan. Done.
2. Inventory current `cadenza` API, modules, tests, and docs. Done.
3. Produce a repo-local Contract Foundation inventory note. Done.
4. Classify core surfaces and identify removal/redesign candidates. Done.
5. Propose the first implementation slice before broad code edits. Done.
6. Validate root harness changes and, when code changes begin, run focused `cadenza` validation. Done for first slice.

## Latest Validation

- `cd cadenza && yarn tsc --noEmit` passed.
- `cd cadenza && yarn vitest run tests/unit/task-definition.test.ts` passed.
- `cd cadenza && yarn vitest run tests/unit/graph-node-identity.test.ts tests/unit/task-definition.test.ts` passed.
- `cd cadenza && yarn vitest run tests/unit/graph-registry-identity.test.ts tests/unit/graph-node-identity.test.ts tests/unit/task-definition.test.ts` passed.
- `cd cadenza && yarn vitest run tests/unit/tool-identity.test.ts tests/unit/graph-registry-identity.test.ts tests/unit/graph-node-identity.test.ts tests/unit/task-definition.test.ts` passed.
- `cd cadenza && yarn vitest run tests/unit/actor.test.ts tests/unit/graph-registry-identity.test.ts tests/unit/tool-identity.test.ts` passed.
- `cd cadenza && yarn vitest run --exclude tests/unit/performance.test.ts` passed.
- `cd cadenza && yarn build` passed.
- `cd cadenza && yarn prettier --check ...` passed for touched files.
- `cd cadenza && yarn vitest run tests/unit/basic-task.test.ts tests/unit/basic-graph.test.ts tests/unit/async-graph.test.ts tests/unit/schema.test.ts tests/unit/runtime-validation-policy.test.ts` passed after neutral graph export cleanup.
- Latest full validation after exporter/debug cleanup:
  - `cd cadenza && yarn tsc --noEmit` passed.
  - `cd cadenza && yarn vitest run --exclude tests/unit/performance.test.ts` passed: 16 files, 126 tests.
  - `cd cadenza && yarn build` passed.
  - `cd cadenza && yarn prettier --check README.md docs/architecture.md docs/product.md docs/contract-foundation-inventory.md src tests` passed.
  - `./scripts/check-agent-harness.sh` passed from workspace root.
  - `git diff --check` passed in both `cadenza` and workspace root.
- Latest full validation after key-only cleanup:
  - `cd cadenza && yarn tsc --noEmit` passed.
  - `cd cadenza && yarn vitest run --exclude tests/unit/performance.test.ts` passed: 16 files, 126 tests.
  - `cd cadenza && yarn build` passed.
  - `cd cadenza && yarn prettier --check README.md docs/architecture.md docs/product.md docs/contract-foundation-inventory.md src tests` passed.
  - `./scripts/check-agent-harness.sh` passed from workspace root.
  - `git diff --check` passed in both `cadenza` and workspace root.
- `cd cadenza && yarn test` failed only in `tests/unit/performance.test.ts`:
  - CPU latency threshold exceeded.
  - emit-only memory baseline expected `< 2` MB and measured exactly `2` MB.
  - retry memory test timed out and produced an existing async cleanup error path.
- Latest full validation after purpose-audit and Sprint 1B pre-translation cleanup:
  - `cd cadenza && yarn tsc --noEmit --noUnusedLocals --noUnusedParameters false` passed.
  - `cd cadenza && yarn tsc --noEmit` passed.
  - `cd cadenza && yarn vitest run --exclude tests/unit/performance.test.ts` passed: 16 files, 124 tests.
  - `cd cadenza && yarn build` passed.
  - `cd cadenza && yarn prettier --check README.md docs/contract-foundation-inventory.md src tests package.json tsup.config.ts` passed.
  - `cd cadenza && git diff --check` passed.
- Latest validation after coherence-gate fixes:
  - `cd cadenza && yarn tsc --noEmit --noUnusedLocals --noUnusedParameters false` passed.
  - `cd cadenza && yarn build` passed.
  - `cd cadenza && yarn prettier --check README.md docs/architecture.md docs/contract-foundation-inventory.md src tests package.json tsup.config.ts` passed.
  - `cd cadenza && yarn vitest run --exclude tests/unit/performance.test.ts` passed: 16 files, 124 tests.
  - Generated declarations no longer expose `Cadenza.signalBroker`, `Cadenza.inquiryBroker`, `Cadenza.runner`, `Cadenza.metaRunner`, `Cadenza.registry`, `Cadenza.runStrategy`, or internal runner/broker/registry/task-variant classes as public declarations.

## Assumptions

- This is a new major-version direction.
- Legacy consumers can remain on prior `@cadenza.io/core` versions.
- Dirty files already present in `cadenza` should be treated as user or prior work unless we explicitly determine they belong to this task.
- The first implementation work should be inventory-led, not a blind refactor.

## Validation

- Root docs:
  - `./scripts/check-agent-harness.sh`
- `cadenza` validation once product code changes begin:
  - `yarn test`
  - `yarn tsc --noEmit`
  - `yarn build`

## Exit Criteria

- `cadenza` public behavior and docs express the new core contract clearly.
- Every retained source module, public API, test, and doc serves the intended whole.
- Legacy, exploratory, dead, or deferred-layer code is removed or explicitly quarantined out of the core contract.
- Changed primitive contracts have focused tests.
- TypeScript is suitable as the canonical reference for Sprint 1B language implementations.

## Review Gate

Sprint 1A TypeScript Contract Foundation is ready to serve as the reference source for Sprint 1B Python translation. The next gate is Sprint 1B polyglot planning/implementation, including shared conformance-test shape.

## Sprint 1B Translation Readiness Gate

- Added [docs/cadenza-python-translation-readiness.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/cadenza-python-translation-readiness.md) to define the three-category scan rule for language translation:
  - Shared Core
  - Native Expression
  - Language Enrichment
- Applied the scan specifically to Python before package implementation begins.
- Classified Python shared core, native expression opportunities, optional enrichment candidates, exclusions, decision gates, and the initial conformance-test scope.
- Linked the readiness note from [docs/index.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/index.md).
