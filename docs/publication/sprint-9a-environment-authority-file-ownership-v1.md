# Sprint 9A Environment Authority File Ownership V1

Date: 2026-07-21

## Purpose

This manifest governs the approved extraction into `cadenza-environment`. A
file moves only when its whole is durable environment authority. Mixed files
must be split so neutral primitive execution and evidence production do not
acquire an environment dependency.

## Move As Complete Units

| Current path                             | New path                                              | Responsibility                                                                                                                |
| ---------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `cadenza/environment-bootstrap/`         | `cadenza-environment/packages/environment-bootstrap/` | bootstrap, PostgreSQL adapters/migrations, distribution authority, reconciliation, supply, ledger processing, actor authority |
| `cadenza/authority-gateway/`             | `cadenza-environment/packages/authority-gateway/`     | trusted exact authority-operation boundary and generated artifact                                                             |
| `cadenza/contracts/reconciliation/`      | `cadenza-environment/contracts/reconciliation/`       | reconciliation, supply, and stem schemas/fixtures                                                                             |
| `cadenza/contracts/runtime-convergence/` | `cadenza-environment/contracts/runtime-convergence/`  | runtime materialization and convergence authority schemas                                                                     |

Generated `dist/`, installed `node_modules/`, `.DS_Store`, and diagnostic
artifacts do not move. They must be regenerated or excluded.

## Split Before Or During Move

| Current source                                                | Environment-owned result                                                  | Core-owned result                                                                               |
| ------------------------------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `cadenza/src/authority/contracts.ts`                          | `packages/authority-contracts/src/contracts.ts` and its conformance tests | none; intrinsic primitive metadata remains in existing primitive definitions                    |
| `cadenza/contracts/execution-evidence/v0/`                    | custody, ledger, replay, compaction, and processing schemas/fixtures      | runtime report schema, runtime evidence fixture, and event-production contract documentation    |
| `docs/contracts/execution-evidence/`                          | durable custody/ledger documentation identified by the contract map       | event, trace, graph, task, signal, inquiry, relationship, distribution, and transport semantics |
| `contracts.config.json` mixed evidence and authority families | environment families for durable state and processing                     | primitive and runtime-event families                                                            |

## Remove From Language Cores

| Repository       | Files/surfaces                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------- |
| `cadenza`        | `src/authority/contracts.ts`, public authority/security exports, authority conformance unit tests |
| `cadenza-python` | `src/cadenza/authority.py`, package exports, authority conformance tests                          |
| `cadenza-elixir` | `lib/cadenza/authority.ex`, `lib/cadenza/authority/contracts.ex`, authority conformance tests     |
| `cadenza-csharp` | `AuthorityContract.cs`, `AuthorityContracts.cs`, authority conformance tests                      |

The `authority` object in runtime execution evidence is not a durable authority
implementation. It remains as bounded observational metadata supplied by the
runtime and must not gain database or policy behavior.

## Retain In Core

- primitive definitions and their stable identity/version/name/tag metadata.
- local task, signal, inquiry, actor, relationship, graph, and conclusion
  behavior.
- runtime execution-evidence reporters, trace continuity, custody barrier
  interfaces, and runtime-event schemas.
- no-op or in-memory evidence reporters used to exercise core semantics.

## Consumer Repairs

- Cell receives versioned environment contract snapshots and integration
  artifacts through the release-workspace layer, not implicit sibling paths.
- Chamber retains only execution/materialization concerns and consumes narrowed
  activation/convergence contracts.
- the workspace remains architecture and release authority; it owns no
  deployable environment implementation.
- standalone repository tests use local snapshots; cross-repository scenarios
  use an explicit release manifest.

## Completion Test

The extraction is complete only when:

1. no core package contains SQL, `pg`, migrations, bootstrap, gateway, policy
   evaluation, reconciliation, supply, ledger processing, or distributed actor
   persistence.
2. no core repository imports `cadenza-environment`.
3. each environment contract has one authority and local conformance evidence.
4. all four core public API inventories omit durable authority/security
   surfaces.
5. standalone and release-workspace validation pass.
