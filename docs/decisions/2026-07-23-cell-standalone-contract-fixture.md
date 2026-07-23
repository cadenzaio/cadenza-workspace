# Cell Standalone Contract Fixture

## Context

Cell's host-meta-authority integration test consumed the neutral
local-orchestration fixture through a parent workspace path. The combined
workspace supplied that file, but a standalone Cell checkout and source archive
did not. Public GitHub Actions therefore failed while compiling the test.

The neutral fixture is already governed as the workspace-owned
`local_orchestration_v0` contract bundle for Chamber. Cell validates the same
projection digest and acknowledgement semantics and needs an independently
available, drift-checked consumer.

## Decision

Add Cell as a second explicit consumer of `local_orchestration_v0`:

- authority:
  `docs/contracts/local-orchestration/fixtures/v0-local-orchestration.json`;
- Cell consumer:
  `cadenza-cell/contracts/fixtures/local-orchestration-v0.json`.

Synchronize the consumer through the workspace contract-snapshot tooling and
make Cell tests read only that repository-local path. Validate the exact Cell
source archive without parent workspace documentation before publication.

## Consequences

- Cell's compile-time contract test becomes independently reproducible.
- Chamber and Cell share one neutral contract authority without sharing ambient
  repository paths.
- The contract-bundle count remains seven; only the consumer set expands.
- Cell and curated workspace identities require an exact affected-scope
  replacement freeze.
- Runtime behavior, protocols, schemas, and authority semantics do not change.

## Alternatives

- Checkout the workspace in Cell CI. Rejected because it preserves ambient
  authority.
- Read the Chamber consumer through a sibling path. Rejected because Cell would
  still depend on repository topology.
- Copy the fixture without governance. Rejected because drift would be
  undetected.
- Remove the test. Rejected because it protects host projection coherence.

## Links

- [Sprint 9F Cell Standalone Contract Fixture Gate V1](../publication/sprint-9f-cell-standalone-contract-fixture-gate-v1.md)
- User approval:
  `Sprint 9F Cell standalone contract fixture repair design approved. Proceed.`
