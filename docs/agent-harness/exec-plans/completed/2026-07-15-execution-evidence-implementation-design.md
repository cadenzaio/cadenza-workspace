# Sprint 6D Realtime Execution Evidence Implementation Design Proposal

Date: 2026-07-15

## Goal

- Outcome: implement the approved realtime execution-evidence protocol across
  all official core languages, the TypeScript chamber adapter, chamber and cell
  substrates, local durable custody, and one database-native evidence-processing
  meta slice with a rebuildable PostgreSQL ledger projection.
- Why it matters: Sprint 7 scale and orchestration would multiply execution
  ambiguity unless task, graph, detached-signal, inquiry, and distribution
  evidence already form one trustworthy causal account.

## Current Status

- State: `done`; Sprint 6D.6 implementation and measured closure were accepted
  by the user on 2026-07-17.
- Detailed 6D.5 proposal:
  [Sprint 6D.5 Execution-Evidence Processing And Ledger Design Proposal](../completed/2026-07-16-execution-evidence-ledger-processing-design.md).
- Current repos: workspace design authority and the official repos identified
  by the 6D.5 design review. Sprint 6D.4 is complete and accepted. Sprint
  6D.5A, 6D.5B, 6D.5C, and 6D.5D implementation and closure are accepted.
  Sprint 6D.6 is complete and accepted.
- Proposed implementation repos: `cadenza`, `cadenza-python`,
  `cadenza-elixir`, `cadenza-csharp`, `cadenza-chamber`, and `cadenza-cell`.
- Complexity gate: required because this is a breaking multi-repo core contract,
  a runtime protocol change, a security boundary, a PostgreSQL migration, and
  more than 200 lines of implementation.
- Semantic authority: the approved
  [Realtime Execution Evidence Protocol V0](../../../contracts/execution-evidence/v0.md).
- Coherence review:
  [Realtime Execution Evidence Implementation Coherence Review V0](../../../contracts/execution-evidence/implementation-coherence-review-v0.md).
- Approval: the user approved the complete design with
  `Design approved. Proceed.` on 2026-07-15.
- Sprint 6D.1 implementation status: `done`; the TypeScript contract,
  runtime reporting path, custody barriers, hostile fixtures, legacy-path
  removal, and coherence review were accepted by the user on 2026-07-15.
- Sprint 6D.2 implementation status: `done`; Python, Elixir, and C#
  parity, shared hostile conformance, idiomatic translation review, and
  cross-language validation were accepted by the user on 2026-07-15.
- Sprint 6D.3 implementation status: `done` and accepted by the user on
  2026-07-15.
- Sprint 6D.4 implementation status: `done`; all four passes and the closure
  review were accepted by the user on 2026-07-16. See the approved
  [Sprint 6D.4 Cell Custody And Distribution Identity Design Proposal](2026-07-15-cell-custody-distribution-identity-design.md)
  and the
  [Sprint 6D.4 closure review](../../../../cadenza-cell/docs/custody-distribution-identity-closure-2026-07-15.md).
- Boundary clarification approved on 2026-07-15: Sprint 6D.3 may bring forward
  the cell-created dual-descriptor launcher and bounded custody receipt
  transport required for detached report progress. Development/conformance may
  use explicit `test_only` receipts; trusted execution fails closed unless
  custody is `cell_durable`. Journal durability, signing, recovery, sealing,
  and batching remain Sprint 6D.4.
- Closure reviews:
  [TypeScript Core Execution Evidence Closure V0](../../../contracts/execution-evidence/typescript-core-closure-v0.md).
  [Official Core Execution Evidence Parity Closure V0](../../../contracts/execution-evidence/official-core-parity-closure-v0.md).
  [Chamber Capture Closure V0](../../../contracts/execution-evidence/chamber-capture-closure-v0.md).
  [Cell Custody And Distribution Identity Closure](../../../../cadenza-cell/docs/custody-distribution-identity-closure-2026-07-15.md).
  [Sprint 6D Realtime Execution Evidence System Closure V0](../../../contracts/execution-evidence/system-closure-v0.md).

## Context

The official implementations currently expose incompatible pieces of the
future evidence path:

- TypeScript core still emits legacy `meta.runner.*` and `meta.node.*` signals,
  carries execution IDs in context metadata, and exports raw graph/context
  snapshots for the adapter.
- Python, Elixir, and C# implement the primitive runtime independently and do
  not share an execution-evidence hook.
- the TypeScript chamber adapter already multiplexes responses, capability
  requests, and transport requests over bounded framed stdout.
- the Rust chamber records activation, materialization, delegation, signal, and
  lifecycle evidence but has no task-level runtime-report protocol.
- the cell forwards chamber and peer observations through a flushed descriptor;
  it does not provide durable custody, replay, acknowledgement, or bounded
  recovery.
- peer transport uses one generic `correlation_key` and has no separate trace,
  distribution-execution, or transport-attempt identity.
- environment bootstrap owns isolated PostgreSQL migrations and capability
  authority, but no execution-evidence ledger or processing slice exists.

The legacy implementation proves that evidence delivery will be out of order
and that meta processing can use Cadenza primitives. It must not be copied as a
raw-context, mutable-row, or service-centric design.

## Intended Whole

Business authors continue to express only intended function and logical flow.
They do not create trace IDs, add evidence tasks, select a database, understand
cells, or propagate transport state.

The implementation remains fractal:

- core reports primitive meaning.
- chamber binds reports to one contained runtime image and invocation.
- cell owns local custody and distribution identity.
- a meta-support graph processes custody batches.
- a restricted provider appends the durable ledger.
- projections and future UI read one rebuildable execution truth.

## Required Protocol Clarification: Claim Versus Observation

The approved trust model treats language adapters as potentially faulty or
hostile. A Rust chamber can observe adapter ingress, process state, capability
calls, transport requests, and adapter outcomes. It cannot independently prove
that an internal task handler, relationship traversal, or local signal observer
ran exactly as the language runtime reports.

Implementation must therefore distinguish evidence basis:

| Basis | Meaning | Typical events |
| --- | --- | --- |
| `runtime_reported` | An approved, digest-bound core/adapter reported the semantic event; chamber validated its invocation binding and cell preserved the report | task, local relationship, local signal, inquiry, composition |
| `chamber_observed` | The Rust chamber directly controlled or observed the boundary | graph ingress, adapter request start/outcome, materialization, chamber lifecycle |
| `cell_observed` | The trusted cell directly controlled or observed the boundary | local routing, custody, distribution creation, peer ingress, containment |
| `authority_committed` | A trusted provider returned evidence atomically bound to a committed authority or ledger transaction | authority mutation, durable evidence-batch append |

`runtime_reported` is authoritative evidence that the report was received from
the activated runtime image. It is not represented as independent substrate
proof of internal execution.

External affect remains brokered. Capability and distribution effects require
`cell_observed` or `authority_committed` evidence in addition to any runtime
report. Projections are not an evidence basis.

Approval of this design approves adding `observation_basis` to the V0 envelope
and protocol documentation.

## Architecture

```text
official core runtime
  -> bounded runtime report hook and mandatory custody barriers
TypeScript adapter
  -> execution_report messages and custody receipts
Rust chamber
  -> validates image, invocation, identities, report sequence and profile
  -> adds chamber-observed boundaries
  -> dedicated inherited custody channel
trusted cell
  -> validates source binding
  -> appends canonical record to segmented local journal
  -> acknowledges custody barriers
  -> signals local evidence processor when a batch seals
per-cell meta-support evidence processor
  -> claims bounded local batch through a generated capability facade
  -> delegates append to restricted PostgreSQL ledger provider
  -> acknowledges committed batch to cell
PostgreSQL immutable ledger
  -> append history
  -> rebuildable execution projections
  -> future realtime/UI consumers
```

The first trustworthy boundary is the cell journal. PostgreSQL availability is
not in the execution-success path after local custody.

### Mandatory Custody Barriers

Acceptance into an adapter queue is not durable custody and cannot satisfy the
approved protocol by itself. Every official runtime reporter therefore exposes
two separate operations:

- bounded report submission, which returns a runtime-local report sequence.
- a custody barrier through a sequence, which resolves only after the cell has
  durably accepted every mandatory report through that sequence.

The core remains persistence-agnostic: it knows only the abstract receipt
contract, never cells, descriptors, files, signatures, or PostgreSQL. In an
official environment the adapter, chamber, and cell carry the barrier to the
cell journal and return the receipt. Standalone affect-bearing execution must
be supplied with a conforming custody reporter; an in-memory or immediately
acknowledging reporter is test-only and cannot claim production conformance.

Mandatory barriers occur at least:

- after `task.started` and before invoking the callable.
- after a task, relationship, signal, inquiry, responder, composition, or graph
  terminal report and before that transition affects downstream scheduling or
  is reported as successful.
- before a capability or distribution effect is performed, after the trusted
  boundary has recorded the requested effect.
- after a capability or distribution outcome is recorded and before the
  outcome is returned to the runtime as successful or safely failed.

If an external effect occurred but its terminal evidence cannot enter custody,
the operation becomes `evidence_integrity_failed`; neither core nor substrate
may represent it as safely retryable. These barriers intentionally prioritize
trustworthy consequence over maximum throughput. Later batching may reduce
sync frequency only when conformance proves that the same success boundary is
preserved.

## Contract Shapes

### Runtime Report

Core runtimes produce a bounded `RuntimeExecutionReport` containing:

- contract and version.
- runtime-local report sequence.
- event type and normalized outcome.
- all applicable execution identities.
- explicit causes.
- task, signal, intent, relationship, and conclusion definition references.
- context commitments only.
- evidence profile and processing eligibility inherited from trusted runtime
  scope.

It does not contain:

- a custody sequence or receipt.
- a claim that the chamber or cell observed internal execution.
- raw business context, callable source, stack trace, credential, or endpoint.
- an authored override for trace, graph, profile, or processing eligibility.

### Execution Evidence Record

The chamber or cell normalizes a report or direct observation into the approved
execution-evidence envelope. Required additions are:

- `observation_basis`.
- `reporting_source` for runtime-reported evidence.
- exact chamber image, adapter, cell, and cell-generation binding.
- source sequence and source-local previous digest.
- bounded commitments and normalized failure code.

The cell validates unknown fields strictly and finalizes:

- cell-generation custody sequence.
- previous custody digest.
- evidence digest.
- segment identity.
- custody receipt identity and accepted time.

### Custody Batch

A sealed batch contains:

- batch and cell-generation identities.
- first and last custody sequence.
- ordered record digests.
- previous batch root.
- batch root digest.
- byte and record counts.
- cell evidence-key reference.
- Ed25519 signature over the canonical batch manifest.
- claim, commit, and acknowledgement state outside the signed immutable
  manifest.

The cell uses a dedicated enrolled evidence signing key. It does not reuse the
transport key or containment/control key.

### Key Syntax

Generated execution identities use lowercase namespaced keys with lowercase
UUID values:

```text
trace.<uuid>
graph-execution.<uuid>
task-execution.<uuid>
signal-emission.<uuid>
inquiry.<uuid>
inquiry-responder.<uuid>
relationship-execution.<uuid>
composition.<uuid>
distribution-execution.<uuid>
transport-attempt.<uuid>
evidence.execution.<uuid>
evidence-batch.<uuid>
```

Definitions retain their existing semantic keys. Generated execution keys are
not logical-object identities and are never placed in business context.

## Identity Stewardship

| Identity | Creator | Propagation rule |
| --- | --- | --- |
| trace | first trusted cell ingress; standalone core only outside an official environment | authenticated runtime scope and signed peer envelope |
| graph execution | chamber for trusted ingress; core for local signal/inquiry child runs | runtime scope, never business context |
| task, relationship, signal, inquiry, responder, composition | official core runtime | runtime report and private transport request |
| distribution execution | source cell after validating one route operation | signed peer envelope and source/target evidence |
| transport attempt | source cell transport per actual attempt | signed envelope/session evidence |
| evidence record | trusted chamber or cell normalizer | cell journal and durable ledger |
| custody sequence and batch | cell journal | signed batch manifest |

An external tracing header may be committed as a separately named correlation
value. It never becomes `trace_key`.

## Core Authority Changes: `cadenza`

### Shared Contract

Add `contracts/execution-evidence/v0/` with:

- strict JSON schemas for runtime report, evidence record, custody receipt, and
  custody batch.
- canonical valid fixtures for local graph, split/composition, signal fan-out,
  multi-responder inquiry, distributed delegation, and distributed signal.
- hostile fixtures for identity injection, raw context, unknown fields,
  sequence drift, conflicting replay, and invalid causal references.
- digest and canonicalization vectors consumed by every official language,
  chamber, and cell.

Workspace docs remain the human semantic projection. `cadenza` becomes the
machine-readable fixture authority.

### Runtime Scope

Introduce an internal `ExecutionScope` separate from business context. It owns:

- trace and graph-execution identities.
- ingress cause.
- lane and evidence profile.
- processing eligibility.
- reporting source and report sequence.

Handlers continue to receive business context. Reserved execution state is not
enumerable business data and cannot be returned by a callable to replace the
runtime scope.

### Evidence Hook

Introduce a bounded runtime evidence reporter interface. It is synchronous for
acceptance into the adapter's bounded report queue and asynchronous for a
custody barrier through an accepted sequence. Durable acknowledgement belongs
below core, but the core waits on the abstract barrier at every mandatory
transition.

Queue refusal fails before new core work is scheduled. Core does not know about
cells, journals, signatures, databases, or persistence.

### Runtime Instrumentation

Replace legacy observability signals with direct runtime reports for:

- trace root when core legitimately owns a standalone root.
- graph accepted/started/concluded.
- task scheduled/started/completed/failed.
- relationship resolution and result contribution.
- signal emitted and observer graph creation.
- inquiry call, responder, timeout, and composed conclusion.
- graph composition success/failure.

Remove rather than retain parallel legacy behavior:

- `meta.runner.*` and `meta.node.*` evidence/metric emissions.
- `executionTraceId` and `runExecId` as context-carried authority.
- `sub_meta` recursion flags and signal-name conventions.
- raw result-context emission through evidence signals.
- adapter dependence on `GraphRun.export()` and its raw graph snapshot.

`GraphRun.export()` is screened separately. If no remaining purposeful
non-evidence consumer exists, it and the related function/context snapshot code
are removed under the spotless standard.

## Official Core Translation Changes

After TypeScript semantics and fixtures stabilize, implement the same meaning
idiomatically in each official core:

- `cadenza-python`: immutable dataclasses/protocols, `uuid`, and explicit
  execution scope passed through the async runner.
- `cadenza-elixir`: structs and supervised runtime reporting without creating
  atoms from dynamic identities; process context may carry private execution
  scope but business maps may not.
- `cadenza-csharp`: immutable records, `Guid`, and an injected evidence-reporter
  interface with explicit execution scope.

The public APIs may differ. Shared fixtures must prove identical identities,
causal relationships, commitments, outcomes, and forbidden behavior.

No chamber adapters for Python, Elixir, or C# are added in Sprint 6D. Their core
evidence hooks prepare future adapters and prove contract portability.

## TypeScript Adapter Changes: `cadenza-chamber`

Add `execution_report` as a fourth bounded adapter message type beside response,
capability request, and transport request.

The adapter:

- installs the core evidence reporter during materialization.
- binds reports to the active invocation and activated image.
- maintains a bounded report sequence and queue.
- sends reports over the adapter protocol without using Cadenza signals.
- resolves core custody barriers only from matching chamber receipts that bind
  the report sequence to a cell custody receipt.
- returns the last required report sequence in delegation and signal outcomes.
- never includes the raw `run.export()` graph in a delegation result.

Report queue overflow or protocol failure terminates the adapter. It is not
silently sampled.

## Chamber Changes: `cadenza-chamber`

### Report Validation

The Rust adapter reader demultiplexes execution reports into a dedicated bounded
receiver. Chamber validation requires:

- exact active image, adapter, invocation, trace, and graph binding.
- monotonic runtime report sequence.
- event transition compatible with the current adapter request.
- allowed event/profile/basis combinations.
- bounded canonical payload and commitment-only content.
- no authored identity or processing-profile override.

The chamber records runtime reports with `runtime_reported`. It creates separate
`chamber_observed` records for ingress, adapter request start, graph-outcome
receipt, adapter failure, and lifecycle.

### Dedicated Custody Channel

Add a second fixed inherited chamber descriptor for evidence custody. It is a
bounded bidirectional canonical-frame channel created by the cell and passed by
the narrow launcher. It exposes no path, credential, socket destination, or
general host operation.

This channel avoids forcing asynchronous detached-signal evidence through the
serialized chamber command stream. A chamber evidence pump can continue after
the signal-ingress response without introducing concurrent business execution.

The chamber uses a custody barrier before returning successful delegation. For
signal delivery, acceptance is returned only after signal ingress and started
state have entered custody; detached graph completion continues through the
evidence pump.

The same receipt path remains live while an adapter request is running. This is
required so the core can stop before callable invocation and so chamber/cell
effect brokers can stop before or after capability and distribution affect.
Adapter report receipts contain no journal path or general cell capability.

If custody becomes unavailable:

- no new adapter work is accepted.
- pre-start operations fail closed.
- an already-started operation becomes `evidence_integrity_failed` and is not
  reported as safely retryable.
- the chamber is drained or terminated by the cell.

## Cell Custody Changes: `cadenza-cell`

### Cell-Owned Segmented Journal

Replace the write-only evidence descriptor with a pre-opened journal-directory
descriptor. The cell receives no journal path. It opens only fixed generated
segment names relative to that descriptor with safe `openat` flags.

Use a purpose-built append-only segmented journal implemented with existing
Rust/std, `libc`, canonical JSON, SHA-256, and Ed25519 dependencies. Do not add
SQLite, an embedded database, or a new custody process in V0.

Each segment has:

- a canonical header bound to environment, cell, and generation.
- length-prefixed canonical records.
- custody sequence and digest chain.
- crash recovery that truncates only an incomplete final frame.
- a sealed manifest and signed root.
- bounded maximum record, batch, segment, and total journal sizes.

Sealed batches are deleted only after an equal-digest durable ledger receipt is
acknowledged. Capacity exhaustion applies backpressure and then fails new
affect-bearing work closed; uncommitted evidence is never overwritten.

Exact initial byte and record constants are selected from pressure tests and
remain implementation constants rather than semantic contract values.

### Cell And Chamber Sources

The cell:

- appends cell, transport, containment, and custody observations directly.
- services one inherited custody channel per chamber.
- binds every chamber channel to the chamber/image identity established at
  launch.
- assigns custody order independent of reporter timestamps.
- generates distribution and transport-attempt identities.
- signs sealed batches with a dedicated evidence key.
- quarantines conflicting sequence or digest replay.

### Distribution Migration

Replace generic correlation ambiguity with explicit fields in route requests,
peer envelopes, and peer evidence:

- trace key.
- source graph and primitive-effect keys.
- distribution-execution key.
- transport-attempt key.
- inquiry and responder key where applicable.
- signal-emission key where applicable.

Existing `envelope_key` remains the signed transport-envelope identity and is
not reused as a transport-attempt or distribution identity.

## Evidence Processor And Durable Ledger

### Per-Cell Meta-Support Slice

V0 uses one evidence-processing slice per active cell, not one remote
environment singleton. This repairs the protocol's initial simplifying
assumption because custody is cell-local and should not require another cell to
remain available.

The first implementation is TypeScript because it is the only language with an
official chamber adapter. The source definition and wiring live in environment
authority, not as a conventional service repo.

The slice observes a cell-injected batch-ready signal carrying only:

- custody batch key.
- cell-generation key.
- batch root digest.
- record and byte counts.

It uses generated, narrow capability facades to:

1. claim/read the exact local batch.
2. request idempotent durable ledger append.
3. verify the returned equal-digest commit receipt.
4. acknowledge the committed batch to local custody.

It never receives a journal path, database credential, SQL client, or generic
provider object.

### Capabilities

Add governed capabilities:

- `execution_evidence/use`: claim and acknowledge bounded local custody batches.
- `execution_evidence_ledger/use`: append one validated signed batch and obtain
  its commit receipt.

The cell owns provider implementations and credentials. The slice receives only
generated facade methods allowed by its runtime image.

### PostgreSQL Ledger

The isolated `cadenza/environment-bootstrap` package adds additive migrations
for:

- immutable custody batch manifests and commit receipts.
- immutable canonical execution-evidence records.
- unique evidence identity and equal-digest replay enforcement.
- unique cell-generation custody sequence.
- source-sequence and causal-link indexes.
- rebuildable trace, graph, task, signal, inquiry, distribution, and failure
  projections.
- a restricted security-definer batch-append function and dedicated writer
  role.

Canonical record bytes or an equivalent digest-verifiable representation remain
available. JSONB may support projection queries, but JSONB normalization is not
used to verify the signed canonical digest.

The append transaction also writes the `authority_committed`
`evidence_batch.completed` boundary record. That terminal record is not fed
back through the same processor.

### Recursive Evidence

The evidence processor runs with `boundary` profile and trusted
`processing_eligible: false` scope for its internal task activity.

- its task-by-task runtime reports are suppressed by profile, not signal name.
- `evidence_batch.accepted` enters local custody before ledger append begins and
  its custody receipt is included in the append request.
- `evidence_batch.failed` enters local custody after a failed attempt and is
  included with the next retry of the still-uncommitted claimed batch.
- successful `evidence_batch.completed` is generated atomically by the ledger
  append as `authority_committed` evidence.
- completion does not trigger another batch-ready signal.
- debug authority may route bounded internal task reports through a distinct
  diagnostic batch class.

Processing-internal records are never independently claimed by the same
processor. The claim provider attaches the custodied accepted/failure records
to their originating business batch, and the ledger transaction verifies those
receipts before append. A failed batch remains retryable until its boundary
failure records can be carried by a later attempt; no terminal processor record
is stranded merely because it is `processing_eligible: false`.

No `sub_meta` primitive or naming convention returns.

## Pass Structure

### Sprint 6D.1: Contract And TypeScript Core

- add schemas, fixtures, key syntax, commitment algorithm, and observation
  basis.
- implement private execution scope and runtime evidence reporter.
- instrument trace, graph, task, relationship, signal, inquiry, and composition.
- remove legacy metric/evidence signals and raw adapter graph export.
- run the TypeScript spotless and coherence review.

Gate: TypeScript core and shared fixtures are stable before translation.

Status: `done` and accepted by the user on 2026-07-15.

### Sprint 6D.2: Official Core Parity

- implement Python, Elixir, and C# evidence scope and reporting.
- run shared valid and hostile fixtures in all four repos.
- document idiomatic deviations without changing semantic meaning.

Gate: cross-language conformance and coherence review.

Status: `done` and accepted by the user on 2026-07-15. See
[Official Core Execution Evidence Parity Closure V0](../../../contracts/execution-evidence/official-core-parity-closure-v0.md).

### Sprint 6D.3: Chamber Capture

- extend adapter protocol with runtime reports and checkpoints.
- add observation-basis validation.
- add dedicated chamber custody descriptor and evidence pump.
- remove raw graph export from adapter outcomes.
- add hostile adapter and custody-loss tests.

Gate: chamber proves bounded task reporting without claiming independent task
observation.

Status: `done` and accepted by the user on 2026-07-15. The adapter
report/checkpoint protocol, Rust capture
validation, trusted/test custody distinction, exact dual-descriptor launcher
boundary, hostile framed-adapter tests, and pre/post-start custody-loss tests
are complete. See
[Chamber Capture Closure V0](../../../contracts/execution-evidence/chamber-capture-closure-v0.md).

The current implementation deliberately preserves serialized execution and
waits for business and meta-support runner quiescence before completing signal
ingress. It services custody while the adapter request is active. The second
descriptor establishes the independent custody authority and transport
boundary, but the concurrent detached evidence pump remains deferred with the
approved chamber concurrency optimization pass.

Boundary clarification: the user approved bringing the cell-created second
descriptor and bounded custody request/receipt transport into this pass. This
does not bring forward the Sprint 6D.4 durable journal.

### Sprint 6D.4: Cell Custody And Distribution Identity

Detailed design:
[Sprint 6D.4 Cell Custody And Distribution Identity Design Proposal](2026-07-15-cell-custody-distribution-identity-design.md).

- add evidence-key enrollment and key custody.
- implement segmented journal, recovery, sealing, signing, claim, and ack.
- replace write-only observation forwarding.
- add explicit trace, distribution, attempt, signal, inquiry, and source-effect
  fields to local and peer envelopes.
- run crash, corruption, replay, capacity, and two-cell causal tests.

Gate: affect-bearing operations fail correctly under custody loss and recovery.

### Sprint 6D.5: Meta Processing And Ledger

Detailed design:
[Sprint 6D.5 Execution-Evidence Processing And Ledger Design Proposal](../completed/2026-07-16-execution-evidence-ledger-processing-design.md).

Status: `done` and accepted by the user on 2026-07-17; the detailed design was approved with
`Design approved. Proceed.` on 2026-07-16. Sprint 6D.5A and its closure review
were accepted on 2026-07-16. Sprint 6D.5B and its closure review were accepted
on 2026-07-17. Sprint 6D.5C processor-slice implementation and its two-cell
Linux gVisor closure were accepted on 2026-07-17. Sprint 6D.5D implementation,
validation, and closure review were accepted on 2026-07-17.
The 6D.5C closure evidence is recorded in
`cadenza-cell/docs/execution-evidence-processor-activation-closure-2026-07-17.md`.
The Sprint 6D.5 closure evidence is recorded in
`cadenza-cell/docs/execution-evidence-ledger-processing-closure-2026-07-17.md`.

- add capability authority and restricted cell providers.
- add PostgreSQL ledger migration, role, append function, and projection rebuild.
- seed and activate one TypeScript evidence processor per cell.
- prove database outage backlog, idempotent replay, out-of-order projection,
  recursion termination, and recovery.

Gate: local custody drains into a rebuildable durable ledger without placing the
database in the execution-success path.

### Sprint 6D.6: Closure

Status: `done` and accepted by the user on 2026-07-17. The complete two-cell Linux gVisor
outage/recovery, ledger drain, signed compaction, disclosure, suspension,
cleanup, hostile failure-code, pressure, security, dead-code,
operational-complexity, and recursive coherence reviews passed. See
[Sprint 6D Realtime Execution Evidence System Closure V0](../../../contracts/execution-evidence/system-closure-v0.md).

- run full two-cell gVisor evidence scenarios.
- perform security, pressure, hostile-boundary, and recursive coherence reviews.
- verify no raw context or credential appears in journal, transport, ledger, or
  debug-disabled output.
- close the mandatory pre-Sprint-7 gate only after measured evidence.

## Conformance And Tests

### Shared Core

- deterministic key shape and runtime scope propagation.
- local linear and split graphs.
- relationship contribution and composition conflict.
- zero, one, and multiple signal observers.
- zero, one, and multiple inquiry responders.
- timeout and partial responder failure.
- identity injection and raw-context rejection.
- equal commitment output across all official languages.

### Chamber

- report sequence gap, duplicate, rollback, and overflow.
- report identity differs from active invocation.
- task report attempts `chamber_observed` basis.
- report contains raw context or forbidden fields.
- adapter response arrives before required report checkpoint.
- detached graph reports after signal acceptance.
- custody channel loss before and after execution start.

### Cell Journal

- crash after header, frame length, payload, digest, seal, and ack boundaries.
- incomplete final frame truncation and non-final corruption quarantine.
- full journal backpressure without overwrite.
- equal replay idempotency and conflicting replay rejection.
- signed batch verification and evidence-key mismatch.
- stale chamber/image/generation channel rejection.
- committed-batch deletion only after equal receipt.

### Distributed Environment

- local delegation and signal.
- remote delegation with one trace, one distribution execution, and one
  transport attempt.
- remote detached signal with a new target graph in the same trace.
- transport failure before and after target start.
- database outage while local custody continues within bounds.
- processor restart, duplicate delivery, and out-of-order causal projection.
- evidence processor production boundary without recursion.

Pressure tests assert bounded queues, files, frames, and recovery behavior.
Machine-dependent throughput is measured and reported but does not become a
brittle correctness threshold.

## Impacted Repos

- `cadenza`: semantic authority, TypeScript core, fixtures, isolated bootstrap
  migration, capability authority, and evidence processor seed definition.
- `cadenza-python`: idiomatic runtime evidence conformance.
- `cadenza-elixir`: idiomatic runtime evidence conformance.
- `cadenza-csharp`: idiomatic runtime evidence conformance.
- `cadenza-chamber`: adapter reporting, observation validation, custody channel,
  and chamber evidence.
- `cadenza-cell`: key authority consumption, journal custody, capability
  providers, distribution identity, peer evidence, and ledger broker.
- workspace meta repo: plans, decisions, authority map, shared reviews, and
  roadmap status only.

Legacy service, database, engine, demo, UI, CLI, integrations, and memory repos
remain reference-only and receive no implementation.

## Risks

- task-level evidence can be overclaimed unless observation basis remains
  explicit.
- journal corruption or capacity errors can stop execution; recovery behavior
  must be tested before integration.
- evidence volume can dominate runtime work without bounded profiles and
  batching.
- changing core execution scope can regress signal and inquiry semantics.
- asynchronous detached reports can deadlock if coupled to the serialized
  chamber command stream.
- a generic evidence capability could become a database or filesystem escape.
- per-cell processors can duplicate work unless batch claim and append are
  idempotent.
- a central ledger outage can fill local journals; capacity must remain visible
  and fail closed rather than discard evidence.
- dedicated evidence keys add enrollment and rotation obligations.

## Migration Strategy

This is a new major version with no legacy compatibility layer.

- authority source and fixtures change first.
- TypeScript stabilizes before translation.
- every repo is changed and validated separately.
- chamber consumes the stabilized TypeScript report contract.
- cell custody lands before durable processing.
- existing chamber and peer evidence remain until their replacement passes
  equal or stronger conformance; they are then removed rather than duplicated.
- database migration is additive, but execution does not switch to the new
  evidence path until the processor, journal, and replay tests pass together.
- The Sprint 7 execution-evidence prerequisite was satisfied when the user
  accepted Sprint 6D.6 on 2026-07-17.

## Alternatives

- Reuse meta signals for core reports: rejected because signals are part of the
  behavior being evidenced and recreate recursion and raw-context pressure.
- Claim Rust independently observed task execution: rejected because task
  internals occur inside the language runtime.
- Send asynchronous evidence over the chamber command stream: rejected because
  the current stream is serialized and idle detached work would not be drained.
- Persist directly to PostgreSQL from the execution path: rejected because DB
  availability would become execution availability.
- Use the current write-only evidence descriptor as custody: rejected because
  flush is not durable acknowledgement or replay.
- Add SQLite or another embedded database: rejected for V0 because the required
  journal semantics are append, seal, replay, and ack, and a new database
  dependency expands the trusted surface.
- Add a separate custody daemon: rejected for V0 because the trusted cell can
  own the journal through a pre-opened directory without another process.
- Use one environment-wide processor: rejected because local custody should not
  depend on a remote cell.
- Reuse transport or control signing keys: rejected because evidence has a
  distinct compromise, retention, and rotation domain.
- Persist processor task-level evidence: rejected because boundary evidence
  expresses its production consequence without recursive self-observation.

## Assumptions

- `openat`, `fdatasync`, atomic rename, and directory sync semantics are
  available on the supported Linux production host; macOS tests exercise the
  portable contract where possible but do not establish Linux durability.
- current serialized chamber business execution remains in place during Sprint
  6D; evidence pumping may be concurrent without enabling concurrent task runs.
- the TypeScript adapter remains the only production adapter in this sprint.
- the environment PostgreSQL instance can host the immutable ledger under a
  separately restricted writer role.
- evidence processor placement is explicit and static; automatic reconciliation
  remains Sprint 7 work.
- debug disclosure storage and UI are deferred, but debug authority and base
  redaction rules are enforced now.

## Meta-Slice Language Doctrine Resolution

The user accepted C# as the default comparison baseline for general-purpose
feature-extending meta slices on 2026-07-15. The default controls polyglot
complexity; it does not presume C# is best for every slice. Another language
must prove a material slice-specific benefit after adapter, runtime, tooling,
operations, and stewardship costs are counted. The V0 evidence processor
remains a deliberate TypeScript bootstrap exception under the approved design.

This rule does not apply to core language-internal meta tasks or runtime
substrate. The full doctrine is recorded in
`docs/cadenza-language-role-doctrine.md` and decision
`docs/decisions/2026-07-15-meta-slice-language-default.md`.

## Approved Implementation Gate

Explicit approval is required for:

1. the four observation-basis classes and the honest limitation of task-level
   runtime reports.
2. a dedicated cell evidence signing key.
3. a cell-owned segmented journal through a pre-opened directory descriptor.
4. a dedicated chamber-to-cell custody channel.
5. one TypeScript evidence processor per cell using narrow capability facades.
6. an immutable PostgreSQL ledger in the isolated environment-bootstrap
   extension.
7. removal of legacy core observability signals, context-carried execution
   authority, and raw graph exports.
8. the six-pass Sprint 6D implementation and review sequence.

The user approved these eight decisions with `Design approved. Proceed.` on
2026-07-15. Implementation proceeds one pass at a time through the gates above.
