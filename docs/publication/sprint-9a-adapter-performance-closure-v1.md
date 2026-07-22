# Sprint 9A Adapter And Performance Amendment Closure V1

Date: 2026-07-21

## Verdict

`closed`

Closure approved by the user on 2026-07-21.

The TypeScript adapter has one explicit owner, core remains Chamber-agnostic,
and performance evidence now measures completed work without destabilizing the
correctness suite. No whole-breaking finding remains in this amendment.

## Implemented Boundary

- Chamber owns the neutral language-adapter protocol, lifecycle, artifact
  manifest, acceptance surface, and current adapter packages.
- The TypeScript adapter remains independently locked and versioned at
  `cadenza-chamber/adapters/typescript`.
- TypeScript core owns primitive semantics and exposes runtime APIs consumed by
  the adapter; it does not import Chamber.
- Environment owns durable approval of exact runtime and adapter identities and
  digests.
- Cell owns containment, process custody, resource enforcement, artifact
  resolution, and mediated capabilities.
- Future adapters remain co-located by default until evidence justifies an
  independent repository.

## Performance Repair

- Removed `tests/unit/performance.test.ts` and its unawaited shared-runtime
  workloads, arbitrary timing/byte thresholds, report-capacity exhaustion, and
  automatic source-tree snapshots.
- Removed 6.7 GB of generated snapshots left by that test and ignored future
  benchmark result and snapshot directories.
- Added deterministic default-suite coverage for 50 distinct completed graphs,
  a real signal observer, retry exhaustion, bounded overlapping submissions,
  exact evidence sequence, custody, conclusions, idle state, and cleanup.
- Added isolated `benchmark:core`, `benchmark:memory`, and `benchmark:check`
  commands with no new dependency.
- Added three-run raw baseline evidence and an extended graph-memory diagnostic.
- Adopted no ungrounded regression threshold.

## Coherence Review

**Whole:** The adapter boundary removes materialization and deployment concerns
from business logic while preserving the official core as the semantic center.
The benchmark observes the actual coordination lifecycle instead of a cheaper
but false substitute.

**Purpose:** Every added surface has one purpose: deterministic lifecycle
correctness, explicit diagnostic measurement, adapter translation, or boundary
documentation. Generated reports are isolated from product source.

**Authority:** No authority moved into core or adapter. Chamber verifies and
hosts, Environment approves, Cell contains, and core executes primitive
meaning.

**Dependency direction:** Adapter consumes core. Core does not consume Chamber,
Environment, Cell, or adapter behavior.

**Boundary truth:** A Node child process is still not called a sandbox. The
documented adapter lifecycle requires Cell-owned containment and mediated
capabilities for trusted execution.

**Evidence:** Benchmarks preserve execution reports and exact custody rather
than disabling them for attractive numbers. Structural and boundary profiles
remain distinguishable.

**Temporal behavior:** Tests await conclusions and idle runners. Each benchmark
scenario receives a fresh process, so state cannot leak between measurements.

**Failure interpretation:** Retry, signal, cleanup, report sequencing, and
custody failures terminate the worker rather than becoming partial samples.

**Operational complexity:** Performance commands are explicit and separate
from ordinary tests. Snapshots require deliberate opt-in and an external path.

**Proportionality:** The current single adapter stays co-located. No extra repo,
benchmark library, CI service, or release process was introduced without need.

## Validation

- `cadenza`: 18 files and 132 tests pass; build passes; benchmark typecheck
  passes; core and memory smoke runs pass; three full runs of each benchmark
  pass without snapshots.
- `cadenza-chamber`: adapter typecheck and deterministic artifact build pass;
  artifact manifest digest is
  `sha256:93ca68bd3e11557a3563fdf39dc695b8ed4b25c5b8d5528712df3458bd7dadd2`;
  Rust format and clippy pass; all Rust and TypeScript-adapter integration tests
  pass.
- `cadenza-workspace`: agent harness check passes; contract authority map and
  current architecture/runtime-contract docs agree on ownership.
- Normal tests and benchmarks create no `heap-snapshots/` directory.

## Residual Risks

- The baseline is tied to one pre-publication machine and Node/V8 version.
- The baseline records the prior committed `HEAD` plus this uncommitted Sprint
  9A amendment; the publication candidate should be rerun at an immutable
  release commit.
- The extended graph-memory slope is low and flattening, but long-lived runtime
  soak tests remain useful later.
- Dedicated performance CI and initial regression budgets remain future
  decisions.

These are explicit limitations, not closure blockers for Sprint 9A.

## Closure Gate

The user approved this review on 2026-07-21, closing the adapter/performance
amendment. Sprint 9A itself remains open until its other publication-boundary
and environment-extraction gates are closed.
