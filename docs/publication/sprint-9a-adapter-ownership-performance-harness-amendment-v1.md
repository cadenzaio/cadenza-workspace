# Sprint 9A Adapter Ownership And Performance Harness Amendment V1

Date: 2026-07-21

## Status

- State: `closed`.
- Complexity gate: required. The work changes runtime-boundary documentation,
  test commands, performance methodology, and more than roughly 200 lines of
  test/benchmark code across multiple repositories.
- Impacted repositories: `cadenza-workspace`, `cadenza`, and
  `cadenza-chamber`.
- New external dependencies: none.
- Required approval phrase:
  `Sprint 9A adapter and performance amendment approved. Proceed.`
- Approval received on 2026-07-21 with the required phrase.
- Closure approved by the user on 2026-07-21.
- Decision record:
  [Chamber Adapter Ownership And Performance Evidence](../decisions/2026-07-21-chamber-adapter-ownership-and-performance-evidence.md).

## Context

Sprint 9A identified two unresolved publication boundaries.

First, the only implemented language adapter is physically located at
`cadenza-chamber/adapters/typescript`, but its ownership is not explicit in the
contract map or local documentation. Without a clear rule, future work could
move adapters into language cores, environment authority, or Cell and collapse
the intended dependency direction.

Second, `cadenza/tests/unit/performance.test.ts` runs inside the default
correctness suite but does not provide trustworthy performance evidence:

- graph and signal operations are not awaited to completion.
- repeated calls can add work to one already-running `GraphRun` rather than
  measure independent completed runs.
- all scenarios share singleton runtime and evidence-reporter state.
- the test-only in-memory reporter retains reports until capacity exhaustion.
- heap snapshots are produced automatically inside the source tree.
- absolute one- and two-megabyte memory thresholds and the CPU threshold have
  no calibrated basis.
- retry measurement observes handler entry count rather than completed graph,
  conclusion, and evidence custody.

The resulting failures, reporter errors, and snapshots describe a broken
measurement harness. They cannot currently establish whether core has a
performance regression or retained-memory defect.

## Intended Whole

Language adapters should let Chamber execute a language core through one
neutral, contained, evidence-producing protocol without making core aware of
Chamber or allowing runtime hosts to become authority owners.

Performance evidence should reveal the cost and retention behavior of
completed Cadenza work. It must not create its own concurrency, custody, or
resource failures and then attribute them to the runtime under measurement.

False success would be a green default suite obtained by weakening thresholds,
or attractive benchmark numbers produced by skipping required evidence,
conclusion, cleanup, or custody behavior.

## Decision 1: Adapter Ownership

Keep the TypeScript adapter in `cadenza-chamber/adapters/typescript`.

Assign ownership as follows:

| Identity              | Responsibility                                                                                                                                     |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cadenza-chamber`     | neutral adapter protocol, lifecycle, artifact manifest, acceptance/conformance, normalized outcomes/errors, and adapter implementation stewardship |
| `cadenza`             | TypeScript primitive semantics and public runtime API consumed by the adapter                                                                      |
| `cadenza-environment` | durable approval of exact adapter/runtime artifact identity, version, digest, and runtime-image eligibility                                        |
| `cadenza-cell`        | containment, process custody, resource enforcement, artifact resolution, and mediated host capabilities                                            |
| TypeScript adapter    | translation between Chamber protocol/runtime images and TypeScript core; no durable authority or ambient host ownership                            |

The adapter remains an independently versioned and locked package inside the
Chamber repository. Co-location is the default for future adapters while the
shared protocol and acceptance surface are maturing. A future adapter may move
to its own repository only when independent release cadence, stewardship,
toolchain isolation, or security review cost provides concrete evidence for
the additional boundary.

Implementation changes:

- add an adapter-specific README defining ownership, dependency direction,
  lifecycle, generated artifacts, and validation.
- update Chamber README and repo governance to identify adapters as Chamber
  runtime integration packages rather than language-core extensions.
- add adapter protocol, artifact manifest, and TypeScript reference-adapter
  ownership to `chamber_runtime_contracts` in `contracts.config.json`.
- retain the package name `@cadenza.io/chamber-adapter-typescript` and its
  independent lock/artifact digest.
- do not move adapter code or add a repository in this pass.

## Decision 2: Performance Evidence Layers

Replace the old file rather than retaining its implementation or thresholds.

### A. Default Lifecycle Correctness

Add deterministic tests to the default suite that prove:

- every graph run is awaited and reaches an explicit conclusion.
- repeated runs have distinct graph execution identities.
- the runner is idle after completion and returned run resources can be
  destroyed.
- evidence report sequences and custody receipts remain exact under repeated
  completed runs.
- signal measurement includes a real observer and waits for its graph to
  conclude.
- retry measurement waits for final graph conclusion and custody, not only
  handler entry.
- bounded concurrent submission is explicit and settles without unhandled
  rejection or cross-test activity.

These are correctness assertions, not timing assertions. They remain in the
ordinary `yarn test` command.

### B. Repeatable Core Benchmark

Add a separate `yarn benchmark:core` command using the existing `tsx`
dependency and Node performance APIs. It will:

- run each scenario in a fresh child process.
- use `node --expose-gc` and fail clearly if explicit GC is unavailable for
  memory scenarios.
- install a non-retaining immediate-custody reporter that validates exact
  report sequence and receipt behavior while avoiding intentional test-report
  accumulation.
- warm up before measurement.
- measure completed one-task and ten-task graphs.
- measure a signal with a real observer.
- measure a bounded retry lifecycle.
- measure both `structural` and `boundary` evidence profiles where meaningful.
- record sample count, completed operations, elapsed time, operations per
  second, per-operation latency, median, p95, Node/V8 version, operating
  system, architecture, CPU identity, and core revision when available.
- emit a stable JSON result plus a concise human-readable summary.

The direct-function loop may be reported as context, but it will not be a
pass/fail comparison. Cadenza graph execution necessarily performs different
work, including identity, evidence, custody, graph conclusion, and cleanup.

### C. Retained-Memory Diagnostic

Add a separate `yarn benchmark:memory` command that:

- runs in isolated child processes.
- completes and destroys work in bounded batches.
- forces GC between measured batches.
- records retained heap after each batch and calculates later-batch slope.
- measures completed graph, observed-signal, and retry scenarios separately.
- distinguishes retained heap from peak heap and intentional reporter storage.
- does not write heap snapshots by default.
- writes snapshots only when `CADENZA_HEAP_SNAPSHOT=1` is set, into
  `CADENZA_HEAP_DIR` or an ignored operating-system temporary directory.

No source-tree `heap-snapshots/` directory may be created by a normal test or
benchmark command.

## Baseline And Budget Policy

This pass will not convert the old arbitrary thresholds into new arbitrary
thresholds.

1. Run the new benchmark three times in a clean, otherwise idle environment.
2. Publish the raw environment metadata and sample distributions in a Sprint
   9A baseline report.
3. Evaluate whether retained memory has a workload-correlated positive slope
   after warm-up and completed cleanup.
4. Separate correctness defects from throughput/latency observations.
5. Propose initial regression budgets only after the baseline is interpretable.

The first baseline is evidence, not a performance promise. Dedicated CI
performance enforcement remains a later decision because shared runners and
developer machines do not provide stable absolute timing.

## File Plan

### `cadenza`

- remove `tests/unit/performance.test.ts`.
- add deterministic repeated-lifecycle correctness coverage under
  `tests/unit/`.
- add isolated benchmark driver/worker code under `benchmarks/`.
- add benchmark documentation and generated-result exclusions.
- add explicit `benchmark:core` and `benchmark:memory` package scripts.
- keep the default test command free of timing thresholds and heap snapshots.

### `cadenza-chamber`

- add `adapters/typescript/README.md`.
- update Chamber README and `AGENTS.md` ownership language.
- ensure the existing adapter build/typecheck/artifact verification remains in
  Chamber validation.

### `cadenza-workspace`

- update `contracts.config.json` Chamber adapter scope.
- update language-runtime and architecture documentation where current status
  is stale.
- record the approved decision and final baseline/closure evidence.

## Risks And Controls

- **Benchmark accidentally bypasses required evidence:** immediate custody
  validates reports and exact receipts; no evidence-disabled benchmark mode.
- **Singleton leakage between scenarios:** each scenario runs in a new process;
  correctness tests reset registry state and install a fresh reporter.
- **Benchmark measures enqueueing:** every measured operation awaits completion,
  conclusion, and cleanup.
- **GC noise is mistaken for leakage:** warm-up, repeated batches, isolated
  processes, later-batch slope, and raw samples remain visible.
- **Heap artifacts pollute the repo:** snapshots are opt-in and default to an
  ignored temporary location.
- **Adapter ownership becomes implementation monopoly:** Chamber owns the
  protocol and current integration packages, while promotion to a separate
  repository remains evidence-driven.
- **Core gains Chamber coupling:** adapter imports core; core never imports
  adapter or Chamber.

## Alternatives

### Move The TypeScript Adapter Into `cadenza`

Rejected. It would introduce Chamber protocol, runtime image, containment, and
artifact concerns into the primitive core.

### Move Adapters Into Environment Or Cell

Rejected. Environment approves artifacts and Cell contains processes; neither
should own language translation behavior.

### Create A Separate Adapter Repository Now

Rejected for this pass. One adapter does not yet justify another repository,
release manifest, governance surface, and clean-room validation stream.

### Keep And Loosen The Existing Performance Tests

Rejected. The primary defect is invalid workload lifecycle and isolation, not
only strict thresholds.

### Use A New Benchmark Library

Rejected for now. Existing Node APIs and `tsx` can provide the required
sampling and process isolation without expanding the dependency or supply-chain
surface.

## Acceptance Gate

The amendment closes only when:

1. adapter ownership is explicit in Chamber, workspace architecture, and the
   contract authority map.
2. no language core owns or imports Chamber adapter behavior.
3. the default TypeScript suite creates no heap snapshots and has no timing or
   GC threshold assertions.
4. repeated-run, signal, retry, evidence, and cleanup lifecycle correctness
   tests pass without unhandled asynchronous work.
5. benchmark scenarios execute in isolated processes and measure completed
   work.
6. memory diagnostics distinguish intentional evidence retention from runtime
   retention and require explicit snapshot opt-in.
7. three clean benchmark runs are recorded and evaluated in a baseline report.
8. core, adapter, Chamber, and workspace validation pass.
9. a coherence closure review finds no core/Chamber/environment/Cell ownership
   collapse.

All nine acceptance conditions are satisfied. Closure evidence is recorded in
[Sprint 9A Adapter And Performance Amendment Closure V1](sprint-9a-adapter-performance-closure-v1.md).

## Evidence

- [Language Runtime Contract](../cadenza-language-runtime-contract.md)
- [Language Role Doctrine](../cadenza-language-role-doctrine.md)
- [Chamber Runtime Foundation Decision](../decisions/2026-07-12-chamber-runtime-foundation.md)
- [Sprint 9A Truth Baseline](sprint-9a-truth-baseline-and-boundary-gate-v1.md)
- [Core Performance Baseline V1](sprint-9a-core-performance-baseline-v1.md)
- [Adapter And Performance Closure V1](sprint-9a-adapter-performance-closure-v1.md)
- Current adapter and performance-harness source review performed on
  2026-07-21.
