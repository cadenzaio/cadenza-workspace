# Environment Authority Repository Boundary

Date: 2026-07-21

## Context

The TypeScript `cadenza` repository contained both primitive runtime semantics
and the durable environment authority: policy contracts, bootstrap,
PostgreSQL persistence, reconciliation, supply, evidence-ledger processing,
and distributed actor authority. This contradicted the persistence-agnostic
core direction and structurally privileged one language core over the other
official language expressions.

## Decision

Create `cadenza-environment` as an official repository for the complete durable
environment-authority whole. It owns environment bootstrap, durable
authority/security operations, authority gateway, PostgreSQL adapters and
migrations, reconciliation, supply, stem recovery, evidence-ledger processing,
and distributed actor authority.

All four core repositories remain responsible for primitive semantics, local
execution, intrinsic definition metadata, and neutral execution-evidence
production. They may report supplied authority context but may not discover,
evaluate, persist, or mutate durable authority.

Runtime execution-evidence event contracts remain under TypeScript core
authority. Durable evidence custody, ledger, compaction, replay, and processing
contracts move to environment authority.

## Consequences

- the candidate public repository set grows from eight to nine.
- all translated durable authority/security contract implementations leave the
  language core packages.
- `cadenza` no longer contains SQL, migrations, database clients, bootstrap,
  policy evaluation, authority gateway, reconciliation, supply, or durable
  actor persistence.
- Cell and Chamber consume narrowed, versioned environment contracts without
  becoming owners of global authority.
- PostgreSQL remains the first environment persistence adapter but does not
  define the repository identity.
- this is a breaking pre-publication change with no compatibility layer.

## Alternatives

- moving only SQL into a database repository was rejected because it would
  leave the environment whole fragmented.
- placing authority in Cell or Chamber was rejected because runtime hosts
  consume narrowed authority and must not govern themselves.
- retaining authority in TypeScript core was rejected because it violates the
  persistence-agnostic, polyglot core boundary.

## Links

- [Approved Design Amendment](../publication/sprint-9a-environment-authority-boundary-amendment-v1.md)
- [Persistence-Agnostic Core](2026-07-11-persistence-agnostic-core.md)
- [Sprint 9 Plan](../agent-harness/exec-plans/active/2026-07-21-distributed-foundation-stabilization-publication-design.md)
