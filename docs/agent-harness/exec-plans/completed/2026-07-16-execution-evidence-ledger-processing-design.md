# Sprint 6D.5 Execution-Evidence Processing And Ledger Design Proposal

Date: 2026-07-16

## Current Status

- State: `done`; Sprint 6D.5D implementation, validation, and closure were
  accepted by the user on 2026-07-17.
- Parent plan:
  [Sprint 6D Realtime Execution Evidence Implementation](2026-07-15-execution-evidence-implementation-design.md).
- Predecessor: Sprint 6D.4 cell custody and distribution identity is complete
  and accepted.
- Complexity gate: required. This pass changes shared authority contracts,
  capability governance, trusted runtime boundaries, PostgreSQL schema, and
  more than 200 lines across three official repos.
- Approval: the user approved this design with `Design approved. Proceed.` on
  2026-07-16.
- Implementation: Sprint 6D.5A authority contracts, capability registry,
  migration `005`, canonical fixtures, restricted append authority,
  rebuildable views, and hostile PostgreSQL tests are complete. Closure
  evidence is recorded in
  `cadenza/docs/execution-evidence-ledger-foundation-closure-2026-07-16.md`.
- Acceptance: the user accepted Sprint 6D.5A and authorized continuation into
  Sprint 6D.5B on 2026-07-16.
- Sprint 6D.5B implementation is complete and its closure evidence is recorded
  in
  [Trusted Facade And Cell Provider Closure V0](../../../contracts/execution-evidence/trusted-facade-provider-closure-v0.md).
- Acceptance: the user accepted Sprint 6D.5B and authorized continuation into
  Sprint 6D.5C on 2026-07-17.
- Sprint 6D.5C implementation and its two-cell Linux gVisor acceptance path are
  complete. Closure evidence is recorded in
  `cadenza-cell/docs/execution-evidence-processor-activation-closure-2026-07-17.md`.
- Acceptance: the user accepted Sprint 6D.5C and authorized continuation into
  Sprint 6D.5D on 2026-07-17.
- Sprint 6D.5D signed compaction, bounded replay, restricted historical lookup,
  projection rebuild, pressure, disclosure, dead-code, and coherence reviews
  are complete. Closure evidence is recorded in
  `cadenza-cell/docs/execution-evidence-ledger-processing-closure-2026-07-17.md`.
- Acceptance: the user accepted the Sprint 6D.5 closure and authorized Sprint
  6D.6 on 2026-07-17.

## Context

Sprint 6D.4 established the first durable evidence authority: each trusted cell
owns an append-only, signed, bounded custody journal. It deliberately stopped
before durable ledger transfer, acknowledged-prefix deletion, and the
database-native processor.

The next problem is not merely moving JSON into PostgreSQL. The transfer must:

- keep PostgreSQL outside the success path of ordinary business execution.
- preserve canonical bytes, signatures, source chains, custody chains, and
  equal-replay meaning.
- run the feature logic as a Cadenza meta slice.
- expose no journal path, SQL, credential, or generic host capability to source
  code.
- produce evidence of evidence processing without creating an infinite loop.
- permit bounded local storage after durable acknowledgement without silently
  losing chain or replay authority.
- produce projections that can be destroyed and rebuilt from immutable truth.

The existing runtime support path can generate signal forwarders and target
proxies, but source slices cannot invoke a narrow host capability. The existing
adapter capability path is also specialized for bootstrap authority and is not
a suitable generic API. Capability facades and trusted evidence policy must
therefore become explicit, image-bound runtime contracts.

## Intended Whole

Business authors continue to express intended function and logical flow. They
do not add evidence nodes, select storage, propagate trace state, manage
retries, or know that a cell journal and PostgreSQL ledger exist.

The implementation follows the same fractal responsibility boundary as the
rest of Cadenza:

- core runtimes report semantic execution meaning.
- chambers bind reports to an activated runtime image.
- cells own local custody and trusted provider effects.
- a Cadenza graph coordinates durable transfer.
- PostgreSQL preserves immutable authority and derives disposable views.

The meta slice extends Cadenza with Cadenza primitives. The cell and chamber
substrates remain ordinary runtime code because their purpose is to make those
primitives safe to execute.

## Proposed Approach

### 1. One Local Processor Per Active Cell

V0 activates one TypeScript evidence-processing slice for each active cell.
TypeScript is the deliberate bootstrap exception to the C# meta-slice default:
it is the only language with a production chamber adapter, and this slice is
coordination-heavy rather than compute-heavy.

The cell emits `cadenza.execution_evidence.batch_ready` only when an ordinary
custody batch is sealed and eligible for processing. Its context contains only:

- `batch_key`.
- `cell_generation_key`.
- `batch_root_digest`.
- `record_count`.
- `byte_count`.

The signal creates a new processing trace. It is causally linked to the batch,
but it does not continue or alter the business trace represented by that batch.

The processor graph performs four logical steps:

1. claim and read the exact announced local batch.
2. append that batch and its processing-attempt evidence idempotently.
3. verify that the returned receipt names the same batch and root digest.
4. acknowledge the exact claim to local custody.

The graph has no business-authored deployment or retry logic. Claim leasing,
bounded retry classification, and wake-up coalescing remain cell/provider
responsibilities.

### 2. Operational Foundation Pack, Not Bootstrap Source

The processor definition and wiring are canonical assets in the `cadenza`
authority repo. They are registered only after bootstrap handoff through the
existing governed runtime-slice authority operations.

No callable source is inserted by a bootstrap SQL migration or foundational
static seed. This preserves `bootstrap.no-source-materialization` and the rule
that bootstrap establishes authority rather than silently executing source.

V0 placement is explicit and static. Automatic reconciliation of one processor
per newly active cell remains Sprint 7 orchestration work. The 6D.5 conformance
environment must nevertheless perform the complete governed registration,
placement, activation, and restart path.

### 3. Authority-Bound Execution-Evidence Policy

Add a required execution-evidence policy to runtime-slice authority,
operational activation grants, verified activation authority, and runtime image
manifests:

```json
{
  "profile": "boundary",
  "processing_eligible": false
}
```

The authority-approved value is digest-bound into the activation grant and
runtime image. The chamber derives invocation scope from that image. Source
definitions, adapter messages, and task code cannot override it.

The evidence processor uses `boundary` and `false`. Its internal task and
relationship reports are suppressed by policy. Ordinary business slices keep
their explicitly governed policy; there is no adapter hard-coded default after
this change.

### 4. Generated Capability Facades

Add `capability_facades` to the source-slice runtime-support manifest. Each
descriptor binds:

- generated task key and intent name.
- capability key and mode.
- one allowlisted provider operation.
- the adapter implementation digest already bound to the image.

At activation, the chamber verifies that every facade:

- belongs to a source slice, not a prebuilt artifact.
- names a capability/mode in the verified activation requirements.
- has unique generated task and intent identities.
- names an operation implemented by the cell's typed broker for that exact
  capability.
- cannot collide with authored tasks, intents, forwarders, or proxies.

The TypeScript adapter materializes hidden generated tasks. Authored processor
tasks reach them through ordinary Cadenza inquiries. Only those generated
tasks can call the adapter-private capability callback.

General source code receives no `invokeCapability`, host provider, descriptor,
or mutable tools object. The adapter request carries the image-bound facade
identity; the chamber and cell reject any capability, mode, method, slice,
image, or invocation mismatch.

The initial facades are deliberately narrow:

- `execution_evidence/use`
  - claim/read the exact batch named by the ready signal.
  - renew or release that exact claim when policy permits.
  - acknowledge that exact claim with an equal-root commit receipt.
- `execution_evidence_ledger/use`
  - append one claimed, verified batch with its attempt evidence.
  - return one immutable commit receipt.

No generic SQL, file, credential, journal, or arbitrary capability facade is
introduced.

### 5. Separate Ledger Credential And Provider

The cell owns both typed providers. The ledger provider receives a separate,
pre-opened PostgreSQL credential descriptor for a dedicated login role. It does
not reuse the bootstrap/authority database credential.

The processor and chamber never receive the credential or endpoint. The cell
broker accepts typed bounded values, verifies the local claim, manifest
signature, cell generation, key reference, canonical bytes, record digests,
and batch root, then invokes one restricted database function.

This keeps compromise domains distinct:

- authority administration cannot be reached through the ledger facade.
- ledger append cannot mutate runtime authority.
- a source slice cannot turn a narrow provider into a database client.

### 6. Immutable PostgreSQL Ledger

Add an isolated `005_execution_evidence_ledger.sql` migration under
`cadenza/environment-bootstrap`. It introduces:

- `execution_evidence_batch` for immutable signed manifests and commit
  receipts.
- `execution_evidence_record` for immutable canonical records.
- `execution_evidence_custody_entry` for the signed admission metadata needed
  to reproduce an exact custody receipt after local compaction.
- `execution_evidence_processing_attempt` for nonrecursive claim/attempt facts.
- the two governed capability definitions.
- a no-login schema owner, a distinct no-login appender role with function-only
  authority, a separately provisioned login membership in only the appender
  role, and one restricted `SECURITY DEFINER` append function.
- indexes for evidence identity, cell-generation custody sequence, source
  sequence, trace, graph, primitive, signal, inquiry, distribution, cause, and
  failure queries.
- regular SQL views for rebuildable projections.

The function has a fixed safe `search_path`; `PUBLIC` and ordinary roles have
no table mutation rights. The writer receives only function execution and the
minimum authority reads needed to validate current cell generation and evidence
key enrollment.

The append transaction enforces:

- one batch key maps to one root digest and immutable commit identity.
- one evidence key maps to one evidence digest.
- one cell-generation custody sequence maps to one evidence digest.
- equal replay returns the original commit key and commit time.
- conflicting replay fails without partial mutation.
- every record and attempt belongs to the submitted batch/cell generation.
- all initial rows, the submitted processing-attempt prefix, the commit receipt,
  and the terminal completion boundary commit atomically.
- an equal-root replay must reproduce the immutable manifest and custody bytes
  exactly. It may append only a complete digest-chained attempt suffix before
  returning the original receipt, preserving attempts observed after an
  unknown first commit without rewriting the completed batch.

The database-generated terminal boundary is
`evidence_batch.completed` with `authority_committed` observation basis. It is
stored in the ledger but is never returned to local custody or emitted as a
batch-ready input.

### 7. Canonical Bytes Remain Digest Authority

Each canonical record stores:

- full canonical record bytes.
- canonical unsigned digest-input bytes.
- parsed JSONB for bounded projection/query use.
- the claimed evidence digest.

The append provider verifies Ed25519 manifest authority before the database
call. The database verifies SHA-256 over supplied canonical unsigned bytes,
that full and unsigned bytes parse to values equal to their structured JSONB,
and that the full form binds the claimed digest. JSONB serialization is never
used as the digest input.

The signed manifest is stored in full and unsigned canonical forms with its
signature, root digest, ordered record digests, and evidence-key reference.
PostgreSQL validates the digest/root relationships it can validate with
built-in cryptography. V0 does not add a database extension merely to repeat
the cell's Ed25519 verification.

Before acknowledged segments can be compacted, the custody batch contract is
extended with ordered custody-entry commitments. Each entry commits the
capture digest, accepted time, source identity, canonical record digest, and
derived custody-receipt digest. The signed manifest binds both its existing
ordered record digests and these ordered entry digests. The claim/read facade
returns the canonical entries, and the ledger stores them immutably.

This change is necessary because an execution record alone does not contain
the cell acceptance time used by the custody receipt. Without the signed entry,
an old equal replay could not reproduce its original receipt after the local
segment was removed. Conflicting capture authority remains detectable through
the stored capture digest.

### 8. Nonrecursive Processing-Attempt Evidence

Ordinary custody segments cannot safely contain processor boundary records:
they would later seal into another ordinary batch and recursively wake the same
processor. They also cannot be appended to an already signed business batch.

The cell therefore owns a separate, claim-scoped, append-only processing-attempt
journal. This is a substrate evidence class, not another meta layer and not a
second general custody queue.

For each claim it records bounded canonical facts such as:

- claim accepted.
- append attempt started.
- append attempt failed with normalized non-secret classification.
- claim renewed or released.

Attempt records are digest-chained, bound to the business batch root, cell
generation, claim, processing trace, runtime image, and monotonic attempt
sequence. They use terminal reserve and survive processor/chamber restart.
They cannot emit signals or be independently claimed.

On retry, the provider submits the business batch plus the complete immutable
attempt chain. A successful transaction stores both and creates the terminal
completion boundary. The local attempt journal is removed only after the equal
commit receipt has been durably acknowledged.

This refines the parent design's phrase that accepted/failure records "enter
local custody": they remain durably cell-custodied, but in a nonrecursive
claim-scoped class rather than the ordinary execution batch stream.

### 9. Retry, Unknown Commit, And Quarantine

The ledger append is idempotent on batch key and root digest. If the database
commits but the response is lost, a retry returns the original receipt. The
cell canonicalizes and verifies the receipt before acknowledgement. The retry
submits the complete local attempt chain; the ledger verifies the committed
prefix byte-for-byte and atomically appends only its valid suffix before
returning that receipt.

Failures are classified at the provider boundary:

- transient transport/unavailability: retain claim evidence, apply bounded
  backoff, renew or safely release, and retry.
- lease loss or processor restart: recover the attempt journal and reacquire
  under the cell's single-claim rules.
- digest, signature, authority, or equal-replay conflict: quarantine the batch,
  emit a terminal local integrity condition, and do not retry it as transient.
- capacity exhaustion: preserve terminal reserve, stop accepting new
  affect-bearing work according to the existing custody policy, and surface
  the backlog.

No retry path edits or replaces an attempt fact, manifest, record, or commit
receipt.

### 10. Acknowledged-Prefix Compaction

Physical deletion is permitted only for the oldest contiguous prefix of sealed
batches whose equal-root ledger receipts are acknowledged. The cell first
writes and fsyncs a signed compaction checkpoint, then removes segment and ack
files, then fsyncs the directory.

The checkpoint preserves at least:

- journal identity and checkpoint generation.
- last removed segment, batch key, batch root, custody sequence, and custody
  digest.
- next segment and custody sequence.
- each active source and fixed cell source's next sequence and previous
  evidence digest.
- acknowledged ledger commit identities through the checkpoint.
- a bounded recent replay index sufficient for expected chamber restart
  windows.
- checkpoint digest and evidence-key signature.

Recovery treats the checkpoint as the predecessor authority for the first
resident segment. A missing, conflicting, rolled-back, or invalid checkpoint
fails closed.

A bounded cell cannot retain every historical replay receipt forever. For a
candidate older than the bounded replay index, the cell may perform a
read-only exact-evidence lookup through its ledger provider. Equal evidence
reconstructs the original custody receipt; conflict or unavailable ledger
fails that stale replay closed. New in-sequence local evidence continues to
enter custody while PostgreSQL is unavailable, so the database is still not in
the ordinary execution-success path.

Retired chamber source identities are never reusable. Their terminal source
state moves to immutable ledger authority and may leave the checkpoint after
the bounded replay window. This keeps checkpoint size bounded by active/fixed
sources rather than every chamber that has ever existed.

### 11. Rebuildable Projections

V0 projections are regular SQL views and documented rebuild queries over the
immutable ledger, not mutable status authority. They cover:

- trace chronology and causal gaps.
- local graph and primitive execution.
- signal and inquiry fan-out.
- distribution execution and transport attempts.
- failures, integrity conditions, and incomplete boundaries.
- batch custody and processor-attempt history.

Out-of-order `observed_at` values do not control truth. Projections order by
the relevant source/custody/commit identities and expose ambiguity instead of
inventing chronology. Dropping and recreating every projection must reproduce
equal results from the immutable tables.

## Impacted Repos

- Authority repo: `cadenza`
  - capability registry and bootstrap conformance authority.
  - additive environment-bootstrap migration and ledger tests.
  - runtime-slice evidence policy and activation authority changes.
  - canonical processor source definition, wiring, and conformance pack.
  - shared capability-facade and ledger fixtures where authority belongs in
    the TypeScript contract.
- Direct consumer: `cadenza-chamber`
  - runtime-support capability-facade contract and hostile verification.
  - image-derived execution-evidence policy.
  - typed, identity-bound capability request transport.
- Direct consumer: `cadenza-cell`
  - evidence and ledger providers, separate credential descriptor, ready-signal
    injection, attempt journal, receipt verification, compaction checkpoint,
    replay lookup, recovery, and pressure behavior.
- Workspace meta repo
  - execution plan, approved decision record, roadmap status, and closure
    evidence only.
- Deferred repos: `cadenza-python`, `cadenza-elixir`, and `cadenza-csharp`.
  No primitive contract changes are required for this TypeScript processor and
  substrate pass.
- Legacy repos and demos remain excluded.

## Pass Structure

### Sprint 6D.5A: Authority And Ledger Foundation

- update authority contracts first.
- add evidence-policy and capability-facade schemas/fixtures.
- add capability definitions and PostgreSQL migration.
- implement restricted append function and rebuildable views.
- prove exact replay, conflict rollback, canonical-byte verification, role
  denial, and projection rebuild in PostgreSQL.

Gate: immutable ledger authority exists without a runtime/provider integration.

### Sprint 6D.5B: Trusted Facades And Cell Providers

- implement chamber verification and adapter generated tasks.
- implement typed cell providers and separate ledger credential.
- implement claim-scoped attempt journal and unknown-commit recovery.
- run hostile method, capability, image, slice, descriptor, SQL, credential,
  and receipt tests.

Gate: an authored source task can use only the exact approved facade and can
neither reach general host authority nor forge completion.

### Sprint 6D.5C: Processor Slice And Activation

- define the canonical TypeScript processor graph.
- register it through post-handoff runtime authority.
- place and activate one instance for each conformance cell.
- inject/coalesce batch-ready signals and execute claim/append/ack flow.
- prove restart, outage backlog, retry, equal replay, and recursion termination.

Gate: local custody drains after recovery while ordinary execution remains
independent of current PostgreSQL availability.

### Sprint 6D.5D: Compaction, Rebuild, And Coherence Closure

- [x] implement signed checkpoints and contiguous acknowledged-prefix deletion.
- [x] prove crash recovery at every checkpoint/deletion boundary.
- [x] prove bounded recent replay and fail-closed historical lookup.
- [x] rebuild all projections from immutable rows and compare results.
- [x] run pressure, disclosure, dead-code, and Coherent Creation reviews.

Gate: satisfied and accepted. Sprint 6D.6 owns the full gVisor and security
closure.

## Validation Plan

Validation scales from authority to the complete two-cell path:

- authority-first TypeScript typecheck, lint, unit, and PostgreSQL integration
  tests.
- chamber Rust format, lint, unit, hostile activation, and adapter protocol
  tests.
- cell Rust format, lint, unit, journal corruption/crash, provider denial,
  PostgreSQL integration, and Linux durability tests.
- exact valid and hostile fixtures across authority, chamber, and cell.
- database unavailable before claim, during append, after commit/before reply,
  and during stale replay lookup.
- processor killed after each graph/provider boundary.
- duplicate signal, duplicate claim, expired claim, equal batch replay,
  conflicting replay, and forged receipt.
- task-level processor evidence suppressed; attempt and completion boundaries
  present exactly once without another ready signal.
- raw context, callable source, endpoint, SQL, credential, secret, and stack
  disclosure scans.
- projection rebuild equality after shuffled arrival timestamps.
- local backlog/terminal reserve pressure with the ledger unavailable.
- repository dead-code and intended-whole review before closure.

The unreliable machine-relative performance benchmark remains deferred until
the agreed clean restart. Deterministic bounded-size and correctness tests are
not deferred.

## Migration Strategy

1. change `cadenza` authority contracts and fixtures.
2. add and validate migration `005` without editing prior migration checksums.
3. update chamber contract verification and runtime image policy binding.
4. update cell typed providers and descriptor topology.
5. register the processor through operational authority in a fresh conformance
   environment.
6. upgrade existing development environments by applying `005`, provisioning
   the separate ledger login credential, granting the two cell capabilities,
   and then registering/activating the processor.
7. enable batch-ready injection only after provider and processor readiness is
   proven.
8. enable physical compaction only after durable append, equal receipt,
   checkpoint, and crash tests pass.

This is a new major version. Backward compatibility with legacy service,
database, demo, capability, or observability contracts is not a goal. Existing
official development data is migrated additively where safe; conflicting or
unverifiable evidence is rejected rather than rewritten.

## Risks

- A faulty security-definer function could widen database authority. Mitigation:
  fixed search path, no dynamic SQL, revoke-by-default roles, one typed entry
  point, and hostile role tests.
- Generic capability exposure could compromise every source slice. Mitigation:
  generated task facades, image-bound descriptors, exact operation allowlists,
  and no public adapter callback.
- Processor evidence could recurse. Mitigation: authority-bound boundary
  policy plus a nonrecursive claim-scoped attempt journal and ledger-only
  completion.
- Compaction could destroy replay or chain authority. Mitigation: contiguous
  prefix only, signed custody-entry commitments, signed fsynced checkpoint,
  bounded recent replay index, non-reusable retired source identities, and
  fail-closed historical ledger lookup.
- A central ledger outage could exhaust cells. Mitigation: bounded local
  backlog, terminal reserve, visible pressure, no overwrite, and fail-closed
  affect-bearing work at the existing capacity boundary.
- Explicit V0 placement can drift as cells change. Mitigation: conformance
  checks and visible missing-processor state; automatic reconciliation remains
  a named Sprint 7 responsibility.
- The TypeScript exception could become an accidental language default.
  Mitigation: record the slice-specific rationale and reassess after another
  production adapter exists.

## Alternatives

- Put processing logic directly in the cell: rejected because transfer
  coordination is a feature extension and should prove `Cadenza extends
  Cadenza`; only trusted effects and retry mechanics belong in the substrate.
- Put processor source in bootstrap SQL: rejected because bootstrap establishes
  authority and expressly forbids source materialization.
- Give the slice a generic provider or SQL client: rejected because it defeats
  least authority and makes source compromise equivalent to cell compromise.
- Append processor records to the ordinary journal: rejected because they
  become independently claimable and recursively wake the processor.
- Suppress all processor evidence: rejected because durable transfer is a
  consequential boundary that must remain inspectable.
- Add a `sub_meta` layer: rejected because recursion is a custody-class and
  execution-policy problem, not a reason for another primitive hierarchy.
- Reuse the authority database credential: rejected because ledger append and
  environment administration have different compromise domains.
- Use mutable status/projection tables as truth: rejected because arrival order
  and repair would rewrite execution history.
- Retain all acknowledged segments forever: rejected because the cell has a
  bounded footprint. The checkpoint design states the unavoidable historical
  replay tradeoff explicitly.
- Query PostgreSQL for every custody append: rejected because it would make
  durable ledger availability part of ordinary execution success.

## Assumptions

- The isolated environment PostgreSQL supports the existing SHA-256 functions,
  bytea, JSONB, transactions, roles, and security-definer functions used by
  environment-bootstrap.
- Cell evidence-key enrollment remains the authority used to verify signed
  batch manifests.
- The TypeScript adapter remains the only production source-slice adapter in
  Sprint 6D.5.
- V0 has one active claim per cell journal and one explicitly placed processor
  per active cell.
- Debug task-level evidence remains disabled by default and is not added to the
  ordinary production batch path in this sprint.
- Full multi-cell gVisor pressure and security closure remains Sprint 6D.6.

## Approval Gate

Approval accepts these implementation decisions:

1. one TypeScript processor per active cell, activated after bootstrap handoff.
2. authority-bound evidence policy in activation grants and runtime images.
3. hidden generated task/intent facades instead of a generic source capability
   API.
4. separate `execution_evidence/use` and
   `execution_evidence_ledger/use` capabilities with a dedicated ledger
   credential.
5. immutable canonical-byte PostgreSQL ledger with restricted append authority
   and rebuildable views.
6. claim-scoped nonrecursive processing-attempt evidence and ledger-only
   completion.
7. signed acknowledged-prefix compaction checkpoints with bounded local replay
   and fail-closed historical ledger lookup.
8. signed custody-entry commitments sufficient to reproduce exact historical
   custody receipts after compaction.
9. the four-pass 6D.5 implementation and review sequence.

The user approved these decisions with `Design approved. Proceed.` on
2026-07-16. Implementation began authority-first with Sprint 6D.5A.
