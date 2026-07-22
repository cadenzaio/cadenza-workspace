# Sprint 9A Environment Authority Extraction Closure V1

Date: 2026-07-21

## Status

- State: `closed`.
- Approved amendment: implemented.
- External publication or remote mutation: none.
- Closure approved by the user on 2026-07-21.
- Required closure phrase:
  `Sprint 9A environment authority extraction closure approved.`

## Result

The durable environment-authority whole now lives in a new independent
`cadenza-environment` repository. TypeScript, Python, Elixir, and C# core no
longer implement or export durable authority/security contracts.

The extraction moved responsibility rather than only storage:

- authority/security contract validation.
- exact authority gateway and deterministic artifact.
- environment bootstrap and operational handoff.
- PostgreSQL schema, migrations, roles, and exact-operation adapters.
- runtime convergence, reconciliation, supply, and stem recovery.
- durable execution-evidence ledger processing.
- distributed actor placement, assignment, hydration, mutation, and
  persistence authority.

## Repository Boundary

`cadenza-environment` contains:

- `packages/authority-contracts`.
- `packages/authority-gateway`.
- `packages/environment-bootstrap`.
- local versioned contract schemas and conformance fixtures.
- repository-local governance, validation entry points, and generated-artifact
  exclusions.

PostgreSQL remains behind package adapter boundaries. The repository is named
for the environment whole, not its current database.

## Core Cleanup

Removed from all four core expressions:

- durable logical-object/version/tag/policy record implementations.
- canonical authority-flow normalizers and validators.
- authority/security conformance tests and public exports.

Retained deliberately:

- intrinsic primitive identity, version, name, and tag metadata.
- local primitive and graph execution.
- runtime evidence generation and custody barriers.
- bounded `authority` evidence fields that report supplied execution context.

A forbidden-surface scan finds no policy decision implementation, authority
foundation normalizer, environment bootstrap, authority gateway, PostgreSQL
client, SQL function, or migration in core source and test trees.

## Contract Governance

`contracts.config.json` now assigns:

- primitive and runtime-event authority to `cadenza`.
- durable custody, ledger, replay, compaction, and processing authority to
  `cadenza-environment`.
- authority/security, bootstrap, and distribution authority to
  `cadenza-environment`.
- Chamber and Cell runtime authority to their existing repositories.

Cell and Chamber artifact paths now resolve through `cadenza-environment`.
Standalone environment tests use repository-local fixtures rather than
workspace-relative fixtures.

## Validation

| Surface                                            | Result                                                                                                           |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Workspace harness and JSON authority map           | pass                                                                                                             |
| Environment authority contracts                    | 24 tests pass                                                                                                    |
| Authority gateway                                  | 26 tests pass; deterministic artifact digest verified                                                            |
| Environment bootstrap and PostgreSQL authority     | 107 tests pass across 19 files                                                                                   |
| Environment root typecheck                         | pass across all three packages                                                                                   |
| TypeScript core                                    | typecheck and 128 correctness tests pass                                                                         |
| Python core                                        | 75 tests pass                                                                                                    |
| Elixir core                                        | 61 tests pass                                                                                                    |
| C# core                                            | 32 tests pass with repo-pinned .NET SDK                                                                          |
| Chamber                                            | full locked all-target suite passes                                                                              |
| Cell                                               | full locked all-target suite passes; 112 ordinary tests, one explicit integration ignored by the default command |
| Cell atomic PostgreSQL/Node transition integration | explicit ignored test run passes against the new repository path                                                 |
| Rust formatting                                    | Cell and Chamber pass                                                                                            |
| Modified TypeScript/environment formatting         | pass                                                                                                             |

The explicitly run Cell integration exposed and removed an obsolete test-only
assumption that delegated gateway results still arrived inside a legacy graph
envelope. The current normalized gateway result is now asserted directly. No
runtime compatibility shim was added.

## Coherence Review

### Whole And Identity

The core whole is primitive meaning and local execution. The environment whole
is durable governed state and the operations that alter it. They now have
separate repository identities matching their distinct lifecycles and
security responsibilities.

### Affect And Boundaries

Core may materialize and execute already-governed definitions and report the
authority context it received. It cannot evaluate policy, access PostgreSQL,
bootstrap an environment, reconcile placement, or mutate durable authority.
Cell and Chamber receive narrowed authority but do not own global desired
state.

### Interpretation

The contract map, repository cards, architecture, intended whole, local
fixtures, and package APIs now describe the same direction. Runtime event
meaning remains interpretable across languages while durable custody and
processing have one environment owner.

### Temporal Stewardship

The superseding decision records why the earlier same-repository bootstrap
decision changed. Historical decisions remain immutable. The file ownership
manifest records the moved and retained surfaces.

### Fragmentation Test

No whole-breaking fragmentation was found after extraction. The remaining
workspace-level semantic documents are cross-repository projections; executable
contracts and standalone fixtures have named repository owners.

Verdict: `fits`.

## Remaining Sprint 9A Gate

The user approved this closure on 2026-07-21. Sprint 9A still requires
acceptance or amendment of the remaining publication posture:

1. the nine-repository candidate public set defined by the
   [Final Publication Boundary Gate V2](sprint-9a-final-publication-boundary-gate-v2.md).
2. legacy notices followed by archival.
3. Apache-2.0 plus DCO as the working legal/contribution posture.
4. preserved public core history, clean new histories, and curated workspace
   history.
5. release-candidate maturity with manifest-bound independent versions.
6. GitHub prerelease first; package registries only after a later gate.
7. protected `main`, PR/CI, no-SLA, public support, and private vulnerability
   reporting.

Sprint 9B remains blocked on that complete Sprint 9A publication-boundary gate.

## Evidence

- [Approved Boundary Amendment](sprint-9a-environment-authority-boundary-amendment-v1.md)
- [File Ownership Manifest](sprint-9a-environment-authority-file-ownership-v1.md)
- [Boundary Decision](../decisions/2026-07-21-environment-authority-repository-boundary.md)
- [Sprint 9A Truth Baseline](sprint-9a-truth-baseline-and-boundary-gate-v1.md)
- [Contract Authority Map](../../contracts.config.json)
