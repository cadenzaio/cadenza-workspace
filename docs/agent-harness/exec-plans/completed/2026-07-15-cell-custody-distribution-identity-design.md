# Sprint 6D.4 Cell Custody And Distribution Identity Design Proposal

Date: 2026-07-15

## Status

- State: `done`; passes 6D.4A through 6D.4D and the closure review were accepted
  by the user on 2026-07-16.
- Complexity gate: required. This pass changes a shared authority contract,
  trusted key custody, local durable storage, chamber-to-cell protocol behavior,
  distribution envelopes, and failure semantics across three official repos.
- Approval: the user approved the design with `Design approved. Proceed.` on
  2026-07-15.
- Approved refinement: acknowledged signed segments remain local recovery and
  replay authority in 6D.4. Physical compaction and deletion move to 6D.5,
  where the ledger can resolve historical continuity. See
  [the compaction decision](../../../decisions/2026-07-15-defer-evidence-batch-compaction.md).
- Parent plan:
  [Sprint 6D Realtime Execution Evidence Implementation Design Proposal](2026-07-15-execution-evidence-implementation-design.md).
- Closure review:
  [Sprint 6D.4 Custody And Distribution Identity Closure](../../../../cadenza-cell/docs/custody-distribution-identity-closure-2026-07-15.md).

## Implementation Result

- evidence enrollment, purpose-separated key custody, exact descriptors, and
  authority migration are implemented authority-first in `cadenza`.
- the cell owns a signed segmented journal with synced receipts, deterministic
  recovery, bounded admission and terminal reserve, immutable claim/ack
  sidecars, and retained acknowledged segments.
- chamber observations, launcher observations, local distribution evidence,
  and peer transport evidence enter one journal path; the write-only evidence
  descriptor is removed.
- TypeScript generated support receives private source-execution identity;
  authored task arguments and business context remain unchanged.
- local and peer routing carry explicit trace, source graph, source effect,
  optional signal/inquiry, distribution, and per-attempt identities without a
  generic correlation alias.
- hostile custody, forged ingress, namespace drift, replay conflict,
  pre/post-affect loss, capacity, corruption, descriptor, and recovery tests
  fail closed.
- distribution replay retention follows the signed route deadline rather than
  the shorter peer-envelope lifetime.
- native all-target, complete chamber, TypeScript, workspace harness, and Linux
  container validation passed. The machine-dependent core performance test
  remains deferred by user direction; final updated two-cell gVisor pressure
  evidence remains Sprint 6D.6.

## Context

- Problem: Sprint 6D.3 validates runtime reports and requires trusted
  `cell_durable` receipts, but the cell still supplies test-only receipts and
  forwards observations to a flushed descriptor. No durable, recoverable,
  signed custody authority exists.
- Problem: local and peer routing currently reuse a generic
  `correlation_key`. That value cannot coherently stand for trace continuity,
  one distribution execution, one network attempt, one source effect, and
  idempotency at once.
- Why now: execution evidence cannot become authoritative, and affect-bearing
  operations cannot fail safely, until the cell can durably preserve evidence
  and distinguish every causal boundary it controls.
- Evidence: the accepted 6D.3 closure records the missing durable implementation
  and the current cell/chamber code confirms that host observations are only
  length-prefixed writes followed by `flush`.

## Intended Whole

Business authors express intended function and logical flow. They do not create
trace IDs, distribution IDs, evidence tasks, journal records, or retry rules.

The substrate creates and preserves those identities because it owns the
corresponding boundaries:

- core owns primitive execution identities and meaning.
- chamber binds reports to one invocation and one activated runtime image.
- source cell creates one distribution-execution identity after route
  validation.
- a networking cell creates one transport-attempt identity before each attempt.
- target chamber continues the trace and creates a new local graph execution.
- cell owns durable custody, ordering, signing, capacity, recovery, and replay.

Evidence remains an account of coordination, not a business-result store. Raw
contexts, callable source, credentials, and unrestricted payloads never enter
the journal.

## Coherence Decisions

### 1. Evidence keys are enrollment authority

V0 adds `evidence_public_key_ref` and `evidence_key_digest` to first-cell and
ordinary cell enrollment. Control, transport, and evidence references must be
pairwise distinct. Enrollment requires an Ed25519 proof of possession for both
the transport key and evidence key.

The evidence private seed is supplied to the cell through one exact,
pre-opened descriptor. The cell derives its public identity and digest, compares
them with current enrollment authority, and fails before activation on drift.
The seed never enters a chamber, configuration JSON, PostgreSQL, or journal.

This binds one evidence key to an enrollment in V0. Independent evidence-key
rotation is valuable, but introducing a second rotatable key-authority model in
this pass would enlarge the security surface before custody itself is proven.
A later additive authority decision may introduce rotation while retaining
historical verification references.

### 2. The cell owns one journal per cell generation

Deployment opens a private journal directory and passes only its directory
descriptor. The cell receives no path. The journal header binds:

- environment key.
- cell key.
- cell-generation key.
- evidence public-key reference and digest.
- journal format version.

Two cell hosts cannot own the same journal concurrently. The cell takes a
non-blocking exclusive lock and rejects ownership conflict. A successor process
may recover the same cell generation only when deployment intentionally gives
it the same directory and generation identity. A new generation starts a new
journal authority.

### 3. Durable means synced, not queued or flushed

For each accepted evidence capture, the cell:

1. validates the reporter and exact chamber/image/generation binding.
2. normalizes the bounded semantic record.
3. assigns the next cell-generation custody sequence.
4. validates or assigns the reporter-source sequence.
5. links both the previous source digest and previous custody digest.
6. appends a canonical framed record.
7. calls `fdatasync` on the open segment.
8. returns a `cell_durable` receipt bound to the report sequence and evidence
   digest.

No receipt is returned before step 7. Queue acceptance, buffered writes, and
`flush` do not satisfy custody.

The existing runtime custody receipt shape remains stable. For
`cell_durable`, `receipt_digest` is mandatory and continues to cover the
canonical receipt fields excluding itself. The receipt key is deterministically
derived from the durably accepted evidence digest, so the chamber can verify
the capture binding without adding a hidden hash input or changing all official
core validators. Accepted time is preserved for equal replay, making a receipt
lost after sync reproducible. The receipt is a barrier token, not a ledger
record or a second evidence identity.

### 4. One open segment becomes one signed batch

The V0 journal uses no embedded database and no custody daemon. It uses one
open append-only segment and zero or more immutable sealed segments. Files are
opened relative to the supplied directory using generated ASCII names and
`openat`-family operations with no-follow, exclusive-create, close-on-exec, and
owner-only permissions.

An open segment contains:

- a canonical header.
- length-prefixed canonical evidence records.
- on sealing, one canonical signed batch manifest.

The manifest contains environment, cell, and generation identities; batch key;
first and last custody sequence; ordered record digests; previous batch root;
record and byte counts; sealed time; evidence-key reference; signature
algorithm; root digest; and Ed25519 signature.

The root is a SHA-256 digest of the canonical unsigned manifest. The signature
uses an explicit Cadenza evidence-batch domain separator. The sealed file is
synced, atomically renamed, and followed by a directory sync before it becomes
claimable.

Segment thresholds are bounded implementation policy, not semantic authority.
Initial policy will be selected by pressure tests within these hard rules:

- one evidence record is at most 2 MiB.
- record count, byte count, age, sealed backlog, and total journal bytes are
  bounded.
- no record or sealed batch is overwritten to recover capacity.

### 5. Recovery preserves facts and rejects invented continuity

Startup scans only recognized generated names, validates ownership and mode,
then validates every header, frame, digest link, batch root, and signature.

- An incomplete final frame in the sole open segment may be truncated to the
  last synced valid frame.
- A complete malformed frame, bad digest, source rollback, custody rollback,
  non-final corruption, or signature failure quarantines the generation and
  prevents execution.
- Repeating an identical capture after a lost receipt is idempotent and returns
  the same semantic acceptance.
- Reusing a source sequence or evidence key with different content is an
  integrity failure.
- Sequence state is reconstructed from accepted records; no mutable side file
  can silently redefine history.

Quarantine is fail-closed and visible. V0 does not auto-repair evidence.

### 6. Capacity has normal and terminal reserves

The journal never discards evidence. At normal high-water, the cell rejects new
graph starts, new distribution executions, and new affect-bearing operations
before affect. A bounded terminal reserve remains available only for evidence
needed to close operations already admitted.

If affect may have occurred and terminal evidence cannot be durably accepted,
the operation returns `evidence_integrity_failed`. It must not be represented as
a clean failure or a safely retryable transport failure. Recovery must establish
custody health before new affect is admitted.

### 7. Claim and acknowledgement do not mutate signed batches

Sprint 6D.4 defines the cell-local API needed by the 6D.5 evidence processor:

- claim the oldest unacknowledged sealed batch under a bounded lease.
- read its immutable manifest and records.
- renew or release that claim.
- acknowledge it only with a canonical commit receipt that binds the batch key,
  root digest, durable ledger commit identity, and committed time.

Claims and acknowledgements use separate sidecar records. They never alter the
signed segment. A synced acknowledgement makes the batch no longer claimable,
but its signed segment remains local recovery and replay authority in 6D.4.
Physical compaction and deletion require the historical continuity contract
owned by Sprint 6D.5. A conflicting acknowledgement is an integrity failure.
The restricted provider and ledger transaction that issue commit receipts also
belong to Sprint 6D.5.

### 8. Distribution identities describe distinct facts

The current generic correlation field is removed from the new major contract.
The trusted routing envelopes carry explicit fields:

- `trace_key`: the overarching causal trace, created at original ingress and
  continued across detached signals and child inquiries.
- `source_graph_execution_key`: the local graph that requested the boundary.
- `source_effect_key`: the exact task execution or signal emission that caused
  the route request.
- `source_signal_emission_key`: required for signal forwarding.
- `source_inquiry_key`: present for inquiry/delegation response loops.
- `distribution_execution_key`: one logical local-or-remote routing execution,
  created by the source cell after authority and route validation.
- `transport_attempt_key`: one network attempt, created immediately before
  opening transport; absent for local routing.
- `idempotency_key`: an explicitly named caller binding, never treated as an
  execution or correlation identity.

Every new execution identity uses its contract-specific prefix and UUID shape.
Opaque random session/envelope keys may remain protocol identities, but cannot
substitute for execution identities.

### 9. Trace continuity does not collapse graph identity

At target ingress, the chamber receives the trusted trace and causal references
from the cell. It does not create a replacement trace. It does create a new
target graph-execution key because a graph run is local to one chamber
invocation.

The resulting causal path is source graph -> source effect -> distribution
execution -> optional transport attempt -> target ingress -> target graph.

For signals, the source signal-emission identity remains explicit. For
delegation/inquiry, the inquiry identity remains explicit. A private substrate
receipt may return target graph/composition identities for causal evidence, but
these are not inserted into business context or exposed as business results.

### 10. Source identities remain hidden from authored business logic

The TypeScript core already knows the current task execution and execution
scope. It will pass a private task-execution context to adapter-owned transport
tasks without adding arguments to authored task functions or execution context.

Generated target proxies and signal forwarders may consume this internal
context to populate trusted route requests. Ordinary tasks retain the existing
five business arguments. This avoids global or async-local inference and keeps
concurrent execution possible later.

The semantic adapter requirement is documented for future languages, but this
pass changes only the production TypeScript adapter.

### 11. Activation authority transitions in stages

Current activation proofs derive from the chamber's ordered activation evidence
while an observation sink receives a secondary copy. Replacing that proof input
in the same step as introducing durable custody would combine two authorities
without equivalent-proof tests.

During 6D.4:

- chamber activation evidence continues to feed the existing activation proof
  derivation.
- every accepted chamber observation is also normalized into the durable
  journal.
- the write-only host observation descriptor is removed after launcher, chamber,
  and peer observations all enter journal custody.
- no duplicate durable evidence path is retained after transition.

Moving activation proof derivation to a durable journal projection is deferred
until that projection proves equal or stronger authority. This is not a license
for execution evidence to bypass custody.

## Journal Descriptor Contract

The cell host receives fixed inherited descriptors for:

- configuration.
- cell control key.
- transport key.
- database credential.
- listener.
- control channel.
- journal directory.
- evidence signing key.
- startup activations.
- control signing key.
- launcher channel.

The current evidence-output descriptor is replaced, not retained. Exact numeric
descriptor assignments will be changed atomically in the binary, deployment
documentation, and Linux conformance fixtures. Unknown, duplicated, writable
key, non-directory journal, inherited-path, and close-on-exec violations fail
before cell activation.

## Event Ordering

### Local delegation or signal

1. chamber supplies trusted trace and source identities.
2. source cell validates route and creates distribution execution `D`.
3. cell durably captures distribution requested/accepted evidence.
4. target chamber continues the trace and creates target graph `G2`.
5. target terminal evidence enters custody.
6. source distribution outcome enters custody before a safe outcome returns.

No transport-attempt identity exists.

### Remote delegation or signal

1. source cell validates route and creates `D`.
2. source cell durably records distribution request.
3. source cell creates transport attempt `P` and durably records attempted.
4. authenticated target cell durably records transport/distribution acceptance
   before acknowledging ingress.
5. target chamber continues trace and creates `G2`.
6. target durably records terminal execution and transport evidence before
   returning a signed outcome.
7. source durably records terminal transport and distribution outcome before
   returning a safe outcome.

Retries reuse `D` but create a new `P`. Target ingress uses `D` as the
distribution idempotency identity. A duplicate equal request may replay the
same terminal substrate receipt; a conflicting request using `D` is rejected.

## Contract Changes

### `cadenza`

- Add evidence-key fields and dual proof of possession to environment-bootstrap
  and distribution authority contracts.
- Add an additive PostgreSQL migration for existing authority schemas and
  projections; do not rewrite applied migrations.
- Extend execution-evidence record schema with cell-generation
  `custody_sequence` and `previous_custody_evidence_digest`.
- Complete custody-batch authority with environment/cell identity, sealed time,
  fixed Ed25519 algorithm, and explicit evidence-key reference.
- Add the private TypeScript task-execution context required by generated
  transport support tasks.
- Update route support types and conformance fixtures with explicit causal
  identities.

### `cadenza-chamber`

- Replace route correlation fields with explicit trusted identity fields.
- Accept continued trace and causal references at distributed target ingress.
- Keep target graph identity local and return only a private substrate receipt.
- Require digest-bound `cell_durable` receipts from production custody.
- Preserve existing activation-proof derivation during the staged transition.

### `cadenza-cell`

- Verify enrolled evidence identity and own the signing seed.
- Implement the segmented journal, recovery, sealing, signing, capacity,
  claim, and acknowledgement mechanisms.
- Replace test-only production custody with one managed, exactly bound custody
  service per chamber.
- Replace host observation forwarding with normalized journal custody.
- Generate distribution and transport-attempt identities and capture boundary
  evidence before and after affect.
- Propagate trace and causal identities through local and peer routes.

Python, Elixir, and C# core repos are not changed. The primitive evidence
contract is already coherent; this pass changes the production TypeScript
adapter integration and substrate contracts, not primitive meaning.

## Implementation Passes

### 6D.4A Authority And Journal Core

- update evidence-key enrollment authority, migration, fixtures, and snapshots.
- update evidence record and custody-batch schemas.
- implement secure descriptor intake and enrolled-key verification.
- implement journal append, recovery, sequence chains, sealing, and signatures.

Gate: a restarted cell recovers only valid synced history and produces
verifiable, purpose-separated signed batches.

### 6D.4B Custody Transition And Capacity

- replace test-only chamber custody with exact chamber/image-bound durable
  custody.
- normalize chamber, launcher, and cell observations into the journal.
- remove the write-only observation descriptor.
- implement high-water, terminal reserve, quarantine, claim, and ack behavior.

Gate: trusted affect cannot start without capacity and cannot report safe
success without durable terminal custody.

### 6D.4C Causal Routing Identity

- add private TypeScript source-execution propagation.
- update chamber route and target-ingress contracts.
- update local orchestration with `D` and causal continuation.
- update peer transport with `D`, one `P` per attempt, target idempotency, and
  terminal substrate receipts.

Gate: local and two-cell evidence reconstructs the causal path without generic
correlation or business-context identity leakage.

### 6D.4D Hostile And Recovery Closure

- complete crash-point, corruption, replay, capacity, key, descriptor,
  custody-loss, and two-cell causal tests.
- run portable suites and Linux durability/confinement tests.
- perform security and Coherent Creation reviews.
- publish a closure report before 6D.5.

Gate: affect-bearing operations fail correctly under custody loss and recovery.

The implementation may proceed through these passes after overall 6D.4 design
approval. A new user decision gate is required only if implementation discovers
a contract change that weakens these invariants or materially changes authority.

## Validation

- authority fixtures reject missing, equal, mismatched, or unproven evidence
  keys.
- record and batch schemas reject custody gaps, digest drift, key drift, and
  signature drift.
- append/reopen/replay tests cover receipt loss and equal retry.
- crash injection covers partial header, length, payload, sync, seal, rename,
  and acknowledgement marker. Deletion moves to the 6D.5 compaction matrix.
- only an incomplete final open-segment frame may be truncated.
- complete and non-final corruption quarantines the generation.
- symlinks, unexpected names, wrong ownership/mode, duplicate ownership, and
  descriptor substitution fail closed.
- capacity tests prove normal high-water, terminal reserve, and no overwrite.
- claim lease restart, equal acknowledgement, and conflicting acknowledgement
  are deterministic.
- custody rejects wrong chamber, image, generation, adapter, sequence, and
  channel.
- local and remote delegation and signal tests prove trace, source effect,
  distribution, attempt, inquiry, signal, target graph, and outcome linkage.
- transport failure tests cover before-connect, after-ingress, after-affect,
  and terminal-custody loss.
- no journal fixture contains raw context, callable source, credential material,
  or authored execution identifiers in business context.
- existing repo tests, formatting, linting, and workspace harness pass.
- Linux establishes `openat`, sync, rename, lock, permission, and confinement
  semantics; macOS covers portable logic but does not claim Linux durability.

## Risks

- Breaking change risk: high and intentional. This is a new major version with
  no backward-compatibility layer.
- Durability risk: filesystem assumptions can be overstated. Linux-specific
  tests must prove the supported host contract.
- Integrity risk: recovery code could mistake corruption for a partial write.
  Only an incomplete final frame is truncatable.
- Availability risk: fail-closed custody can stop useful work. Bounded capacity,
  terminal reserve, explicit health, and later processor draining make that
  failure visible rather than lossy.
- Key risk: an evidence-key compromise permits forged future batches. Purpose
  separation limits cross-domain compromise; rotation remains explicit
  follow-up authority work.
- Causal risk: target execution may occur while the source loses its response.
  Distribution identity and target idempotency preserve ambiguity honestly;
  they do not invent exactly-once networking.
- Transition risk: activation evidence has two representations temporarily.
  Only the existing ordered input grants activation proofs until durable
  equivalence is separately demonstrated.

## Migration Strategy

1. Change semantic authority and schemas in `cadenza` first.
2. Add the authority migration, fixtures, and contract snapshots.
3. Implement and prove the cell journal without switching chamber production
   custody.
4. Switch chamber custody and observations atomically; remove write-only
   forwarding.
5. Change TypeScript private support context and chamber route contracts.
6. Change local then peer cell routing and run causal conformance.
7. Run hostile/recovery closure and update the parent plan.

Each repo is validated and committed independently if commits are requested.
Contract propagation occurs in the same task. No legacy adapter or compatibility
field remains after the switch.

## Alternatives

- Reuse the transport or control key: rejected because evidence retention,
  compromise, and future rotation have a different authority domain.
- Introduce independently rotatable evidence authority now: deferred because it
  adds substantial enrollment and historical-key complexity before custody is
  proven.
- Store directly in PostgreSQL: rejected because database availability would
  become execution availability.
- Use SQLite or a new daemon: rejected because append, seal, replay, and ack do
  not justify a larger trusted dependency in V0.
- Keep the write-only observation descriptor beside the journal: rejected
  because it creates two apparent custody paths and dead code.
- Use idempotency as correlation: rejected because one caller binding cannot
  identify trace, graph, distribution, and attempt scopes.
- Put source execution IDs in business context: rejected because substrate
  mechanics would leak into authored logic and serialized application data.
- Claim exactly-once peer execution: rejected because transport loss can occur
  after target affect; explicit identities and outcome ambiguity are the honest
  contract.

## Assumptions

- The supported production host is Linux with durable regular filesystem
  semantics for `fdatasync`, atomic same-directory rename, directory sync,
  advisory lock, and `openat`-family operations.
- Deployment can provision a private evidence signing seed and journal
  directory descriptor for each enrolled cell.
- V0 permits one active evidence key per enrollment; independent rotation is
  deferred and documented rather than silently unsupported.
- The current serialized chamber execution model remains until the approved
  later concurrency optimization pass.
- TypeScript remains the only production chamber adapter in Sprint 6D.
- Sprint 6D.5 supplies the restricted capability and ledger commit receipt;
  6D.4 defines and tests the cell-local claim/ack boundary without inventing a
  production ledger writer.
- A cell runtime restart creates a new cell generation under the current
  lifecycle contract. Same-generation journal reopening restores custody
  authority only; it does not authorize runtime continuation or claim durable
  exactly-once execution.
