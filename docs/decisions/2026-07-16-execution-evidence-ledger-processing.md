# Execution-Evidence Ledger Processing

Date: 2026-07-16

## Context

Sprint 6D.4 established signed, bounded, cell-local execution-evidence custody.
Cadenza still requires database-native processing, immutable ledger authority,
rebuildable projections, safe acknowledged-prefix compaction, and visible
processing evidence without making PostgreSQL part of ordinary execution
success or recursively processing the processor's own records.

## Decision

- Activate one TypeScript evidence-processing meta slice per active cell after
  bootstrap handoff.
- Bind execution-evidence policy and generated narrow capability facades into
  operational activation authority and immutable runtime images.
- Give the processor only `execution_evidence/use` and
  `execution_evidence_ledger/use` through hidden generated task/intent facades.
- Keep ledger credentials in the trusted cell under a distinct restricted
  PostgreSQL role and typed provider.
- Preserve canonical bytes in an immutable PostgreSQL ledger and derive
  rebuildable views from that authority.
- Preserve processor claim/failure evidence in a claim-scoped nonrecursive
  custody class; create completion only inside the ledger commit transaction.
- Sign custody-entry commitments and compaction checkpoints so acknowledged
  local prefixes can be removed without silently losing chain or replay
  authority.
- Implement the change through four gated passes: authority/ledger, trusted
  facades/providers, processor activation, and compaction/closure.

## Consequences

- Ordinary business execution remains independent of current PostgreSQL
  availability after cell-local custody.
- Source code never receives SQL, credentials, journal paths, provider objects,
  or a generic capability callback.
- Evidence transfer remains implemented as a Cadenza graph while trusted
  effects, custody mechanics, and retry enforcement remain substrate code.
- Historical stale replay after bounded local compaction may require a
  read-only ledger lookup and fails closed when that authority is unavailable.
- TypeScript remains a deliberate slice-specific bootstrap exception to the C#
  meta-slice comparison default.

## Alternatives

- Direct cell-only processing was rejected because transfer coordination is a
  feature extension that should use Cadenza primitives.
- Bootstrap-time source materialization was rejected because bootstrap
  establishes authority and forbids source execution.
- Generic SQL or host capabilities were rejected as excessive authority.
- Ordinary-journal processor records and a `sub_meta` hierarchy were rejected
  because they do not solve recursive consequence coherently.
- Mutable projection tables were rejected as execution truth because they
  permit arrival order and repair to rewrite history.

## Links

- [Approved Sprint 6D.5 design](../agent-harness/exec-plans/completed/2026-07-16-execution-evidence-ledger-processing-design.md)
- [Parent Sprint 6D implementation design](../agent-harness/exec-plans/completed/2026-07-15-execution-evidence-implementation-design.md)
- [Execution-evidence protocol](../contracts/execution-evidence/v0.md)
