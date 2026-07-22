# Workspace Map

## Purpose

This document maps repository topology and primary dependency flow in `cadenza-workspace` as it exists today.

## Topology

- `cadenza/`
  - Core primitives and runtime execution semantics.
- `cadenza-python/`
  - Python translation of the official Cadenza core contract. `cadenza` remains the authority until Python reaches conformance parity.
- `cadenza-elixir/`
  - Elixir translation of the official Cadenza core contract. Pass 1 is boring core parity; BEAM-native enrichment comes later.
- `cadenza-csharp/`
  - C# translation of the official Cadenza core contract. It starts with boring core parity before any C# runtime adapter, Roslyn materialization, or C#-natural meta-slice implementation.
- `cadenza-environment/`
  - Durable environment authority. It owns bootstrap, authority/security operations, PostgreSQL adapters, reconciliation, supply, evidence-ledger processing, and distributed actor authority.
- `cadenza-chamber/`
  - Rust chamber runtime substrate. It consumes bootstrap handoffs and owns chamber activation, runtime-image, lifecycle, adapter-host, primitive-ingress, outcome, and runtime-evidence contracts.
- `cadenza-cell/`
  - Rust trusted local host. It owns deterministic containment plans and launch policy, Chamber process custody, capability brokers, local/remote route interpretation, authenticated peer transport, evidence, pre-enrolled local Cell supply supervision, and termination. Durable placement and supply authority remain in `cadenza-environment`.
- `cadenza-reference-system/`
  - Release-owned clean consumer. It proves realistic order-to-fulfillment
    authoring, business truth, public-package usability, and the separation of
    business definitions from deployment authority and runtime mechanics. It
    owns no framework contract.
- legacy repositories
  - `cadenza-service/`, `cadenza-db/`, `cadenza-engine/`, current integrations/UI experiments, and demos are reference-only for the new major-version direction.

## Dependency Edges

Primary contract dependency direction:

- official language cores -> neutral primitive authority in `cadenza`.
- `cadenza-environment` -> neutral runtime-evidence contracts in `cadenza`.
- `cadenza-chamber` -> primitive contracts in `cadenza` and narrowed environment authority in `cadenza-environment`.
- `cadenza-cell` -> chamber runtime contracts in `cadenza-chamber` and authority/bootstrap contracts in `cadenza-environment`.
- `cadenza-reference-system` -> public core authoring APIs and release-owned
  deployment descriptors; dependency direction never reverses into framework
  repositories.

Operational contract flow:

- Core primitives are authored in `cadenza`.
- Python translations of core primitives are implemented in `cadenza-python` after the TypeScript contract is stable.
- Elixir translations of core primitives are implemented in `cadenza-elixir` after the post-Python readiness gate.
- C# translations of core primitives are implemented in `cadenza-csharp` after the meta-slice language fit review justified C# as an official core language.
- Chamber runtime contracts are authored in `cadenza-chamber`.
- Trusted local cell and containment-plan contracts are authored in `cadenza-cell`.
- Legacy service and database contracts do not govern new implementation.

## Change Coordination

When a contract changes:

1. Update authority repo first.
2. Update direct consumers in the same task, or record deferred follow-up work explicitly.
3. Validate with repo-local tests/typechecks.
4. Log cross-repo decision in `docs/decisions/` if design-required.

## Direction Of Travel

This workspace is transitional.

- Today: the official foundation consists of language cores, environment bootstrap, the chamber runtime substrate, and the trusted local cell substrate; legacy capabilities remain available only as historical evidence.
- Target: a database-native Cadenza where the executable graph becomes the primary system of record and file repos contain only the minimal code that still must live outside the database.
- Current runtime expansion: `cadenza-environment` holds durable reconciliation and supply
  authority, the contained stem interprets it, `cadenza-cell` realizes local
  runtime custody, and `cadenza-chamber` executes primitive definitions.

When deciding where to add new behavior, prefer structures that will migrate cleanly into the database-native graph.

## Safe Working Rule

Never perform one git commit that spans multiple child repositories.
