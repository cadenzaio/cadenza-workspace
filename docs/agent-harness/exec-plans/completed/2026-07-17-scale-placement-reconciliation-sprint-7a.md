# Sprint 7A Reconciliation Contract And Pure Planner

Date: 2026-07-17

## Goal

- Outcome: define the language-neutral reconciliation contract and implement a
  bounded deterministic TypeScript planner with shared conformance fixtures.
- Why it matters: every later authority and runtime effect must be derived from
  one reviewable plan rather than ambient scheduler behavior.

## Current Status

- State: `done`; closure approved by the user on 2026-07-17.
- Current repo: `cadenza`.
- Impacted repos: workspace meta repo and `cadenza`.
- Approved parent design:
  [Sprint 7 Scale, Placement Reconciliation, And Orchestration](2026-07-17-scale-placement-reconciliation-design.md).

## Scope

- In scope: desired state, override, generation observation, lease, snapshot,
  plan, action, and outcome contracts; canonical validation; deterministic
  planning; valid, hostile, and digest fixtures; focused tests; 7A security,
  pressure, language-fit, and coherence review.
- Out of scope: PostgreSQL migrations or operations, runtime workers, stem
  graph activation, provider effects, cell process changes, and stem takeover.

## Work Items

- [x] Establish exact neutral V0 identities, invariants, bounds, and schemas.
- [x] Add valid, hostile, permutation, and digest conformance fixtures.
- [x] Implement canonical validation and a pure TypeScript planner.
- [x] Prove order independence, no-churn assignment, anti-affinity, packing,
  pins, blocks, shortage, scale changes, withdrawal, and stale-input denial.
- [x] Export only the isolated authority-package contract and planner surface.
- [x] Run focused and full repository validation.
- [x] Complete the 7A security, pressure, language-fit, and coherence review.

## Questions Or Blockers

- None. The parent design was approved on 2026-07-17.
- Sprint 7A closure was approved on 2026-07-17.

## Assumptions

- The planner is policy-pure and has no database, process, network, clock,
  random, environment, or filesystem access.
- Inputs are one authority-produced canonical snapshot; the planner does not
  infer missing authority.
- V0 placement cost uses one integer slot per replica because the current
  placement contract exposes slot capacity rather than multidimensional
  resources.
- Existing eligible healthy assignments are preserved before packing new or
  displaced replicas.

## Validation

- `npm test -- --run tests/unit/reconciliation-contract.test.ts`
- `npm test`
- `npm run build`
- `git diff --check`
- `./scripts/check-agent-harness.sh` from the workspace root.

## Exit Criteria

- Equal semantic snapshots produce one canonical plan regardless of input
  ordering.
- Every action is bounded, sorted, stable-keyed, and contains no host effect.
- Invalid, stale, contradictory, excessive, and noncanonical inputs fail
  closed with deterministic errors.
- The 7A review finds no coherence or security issue that should precede
  PostgreSQL authority work.

## Closure Evidence

- [Sprint 7A Closure Review](../../../contracts/distribution/sprint-7a-closure-review-v0.md)
- Environment authority package: 58 tests passed, including 18 focused
  reconciliation tests and the PostgreSQL integration suites.
- Core correctness suite: 161 tests passed with the previously deferred
  machine-sensitive performance file excluded.
- TypeScript authority and core typechecks and builds passed.
