# Realtime Execution Evidence Implementation Coherence Review V0

Date: 2026-07-15

Status: implementation proposal reviewed; explicit cross-repo design approval
required.

## Target

- Change: implement the approved execution-evidence protocol through official
  cores, chamber, cell, local custody, a Cadenza evidence processor, and an
  immutable PostgreSQL ledger.
- Scope: Sprint 6D.1 through Sprint 6D.6.
- Source documents:
  - [`v0.md`](./v0.md).
  - [`2026-07-15-execution-evidence-implementation-design.md`](../../agent-harness/exec-plans/completed/2026-07-15-execution-evidence-implementation-design.md).
  - [`cadenza-intended-whole.md`](../../cadenza-intended-whole.md).
  - [`cadenza-language-role-doctrine.md`](../../cadenza-language-role-doctrine.md).
  - [`cadenza-language-runtime-contract.md`](../../cadenza-language-runtime-contract.md).

## Intended Whole

The change preserves Cadenza's intended reduction of accidental complexity:
business authors continue to express tasks, signals, intents, relationships,
and logical flow. Execution identity, custody, distribution correlation,
durability, projection, and recursion termination remain runtime concerns.

False success would be a system that displays convincing traces while losing
mandatory evidence, overclaims what the substrate observed, exposes business
context, or makes PostgreSQL availability a condition of already-custodied
business execution.

## Identities And State

The proposal assigns distinct stewardship for trace, graph, primitive,
distribution, transport-attempt, evidence, custody, and batch identities. It
also names one identity risk omitted by a conventional tracing model: a
language runtime report and a substrate observation are not the same epistemic
state.

`observation_basis` repairs that ambiguity:

- `runtime_reported` means a bound runtime image made the internal semantic
  report and the trusted substrate preserved it.
- `chamber_observed` and `cell_observed` mean the respective substrate directly
  controlled the boundary.
- `authority_committed` means evidence was atomically bound to an authority or
  ledger transaction.

The proposal must update the approved V0 envelope and shared fixtures only
after design approval. Projections remain derived state and never acquire an
observation basis.

## Affect And Boundaries

The reviewed design now distinguishes bounded queue acceptance from durable
custody. Mandatory runtime transitions wait for a receipt through an abstract
reporter barrier; the core does not know which journal or provider implements
that receipt.

External capability and distribution effects have two barriers:

1. custody of the trusted request observation before performing affect.
2. custody of the trusted outcome before reporting success or safe failure.

If affect may have occurred and terminal evidence is unavailable, the result is
`evidence_integrity_failed`, not a retryable rollback fiction. This is the
critical false-success boundary for the implementation.

The dedicated chamber-to-cell channel is appropriately narrow: it transports
canonical evidence frames and receipts but grants no path, credential,
database connection, or general host operation. The dedicated evidence signing
key prevents control, transport, and evidence compromise domains from being
silently merged.

## Relationships And Interpretation

The consequence path remains interpretable in both directions:

- downward: shared semantic fixtures tell each language runtime what it must
  report and which transitions require custody.
- upward: chamber and cell bind those reports to image, invocation, generation,
  distribution, transport, and custody state.
- horizontal: all four cores share causal fixtures while retaining idiomatic
  APIs; chamber and cell retain their own legitimate observation authority.

The design does not infer distributed order from timestamps. Source sequence,
digest linkage, explicit causes, distribution identity, and transport-attempt
identity carry meaning across layers.

## Shared Fields And Time

The evidence contract, canonicalization vectors, local journals, signing-key
lineage, append ledger, and projection rules are shared fields. Stewardship is
assigned by dependency:

- `cadenza` owns semantic schemas and fixtures.
- each official core owns idiomatic reporting conformance.
- chamber owns adapter binding and directly observed runtime boundaries.
- cell owns local custody, distribution identity, and evidence-key use.
- environment bootstrap owns isolated ledger migration and capability
  authority.
- the evidence meta slice owns policy-driven post-custody processing.

Append history, signed batches, explicit gaps, idempotent equal-digest replay,
and rebuildable projections preserve temporal interpretability. Segments are
deleted only after an equal-digest durable receipt.

## Recursive Meta Evidence

The implementation proposal now gives `processing_eligible: false` an explicit
delivery path rather than treating it as invisibility:

- processor acceptance enters local custody and accompanies the claimed batch.
- processor failure enters local custody and accompanies a later retry.
- successful completion is created atomically by the ledger transaction.
- these boundary facts do not independently trigger the same processor.

This preserves production evidence of consequential meta work while
terminating same-pipeline recursion.

## Fragmentation Test

The design would fragment despite local success if implementation:

- acknowledges an adapter queue as though it were durable custody.
- labels internal task reports as direct chamber observation.
- lets authored context choose trace, profile, basis, or processing eligibility.
- lets a capability or transport effect cross the boundary before its request
  evidence is custodied.
- reports safe retry after possible external affect and terminal custody loss.
- routes detached evidence only while a serialized chamber command is active.
- gives the processor filesystem paths, database credentials, or generic
  provider access.
- drops old journal segments under pressure or deletes them before an
  equal-digest ledger receipt.
- stores canonical authority only as normalized JSONB.
- preserves legacy metric signals, raw graph exports, or context-carried
  execution authority beside the new path.

Repair is explicit: stop new affect, quarantine the source generation, retain
the last verified chain, append a visible gap/integrity record after recovery,
and rebuild projections from immutable evidence. Never synthesize a missing
business outcome.

## Remaining Risks

- The mandatory per-transition durability barriers may materially reduce
  throughput. Pressure tests may improve batching but cannot weaken success
  semantics without a new approved protocol revision.
- Journal durability claims depend on Linux filesystem behavior and require
  crash tests in the approved Linux/gVisor environment.
- Processor placement is static and per-cell in V0. Automatic reconciliation,
  failover, and trace closure remain later orchestration concerns.
- The four core implementations can drift unless hostile fixtures and digest
  vectors are treated as closure requirements, not optional tests.
- Evidence retention and diagnostic-disclosure policy still need measured
  constants and governed defaults during implementation.

## Decision

- Coherence judgment: `fits with risks`.
- Required follow-up:
  - obtain explicit approval for the eight implementation decisions in the
    active Sprint 6D proposal.
  - update the semantic protocol with `observation_basis` and per-cell processor
    placement as the first authority change after approval.
  - execute each pass behind its stated conformance gate.
  - repeat security, pressure, and coherence review before Sprint 7.

No principle-level contradiction remains in the implementation proposal. The
design should not be implemented until its separate cross-repo approval gate is
satisfied.
