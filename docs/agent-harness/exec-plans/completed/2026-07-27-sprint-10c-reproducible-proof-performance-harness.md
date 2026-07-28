# Sprint 10C Reproducible Proof And Performance Harness

Date: 2026-07-27

## Status

- State: `done`.
- Parent:
  [Sprint 10 distributed foundation consolidation and hardening](2026-07-25-distributed-foundation-consolidation-hardening-design.md).
- Approval authority: the parent Sprint 10 design was approved by the user on
  2026-07-27.
- Completed on 2026-07-27.
- Closure:
  [Sprint 10C reproducible proof and performance closure](../../../publication/sprint-10c-reproducible-proof-performance-closure-v1.md).

## Goal

Replace operator-memory-dependent validation with declared fast, complete, and
privileged proof tiers, then consolidate performance evidence as measurements
and reviewed budgets rather than machine-sensitive correctness thresholds.

## Implementation Sequence

1. Establish `proof/manifest.json` as the proof-tier and timeout authority.
2. Add one workspace entrypoint for fast, complete, and privileged proof.
3. Move privileged fixture credentials from source and individual environment
   variables into one generated root-owned file.
4. Rebuild the canonical rootfs from clean exact commits and reject matching
   stale installed content.
5. Run a contained protocol preflight before the long scenarios.
6. Reproduce distributed reference and replica/provider-restart behavior from
   separate fresh PostgreSQL clusters.
7. Record source identities, component digests, durations, claims, limits, and
   exact cleanup in one report.
8. Consolidate Core performance sampling, distributions, retained-memory
   observations, and reviewed budgets.

## Repository Ownership

- Workspace: proof manifest, cross-repo orchestration, evidence schema, and
  operator guidance.
- `cadenza-cell`: privileged test credential intake and runtime assertions.
- `cadenza`: benchmark measurement and budget evaluation.
- Environment, Chamber, and reference system: unchanged authorities consumed
  through their repository-owned build and test entrypoints.

## Acceptance

- fast proof passes on the ordinary development host;
- complete proof passes from declared repository commands;
- privileged proof uses clean commits and a neutral delegated cgroup;
- each privileged scenario starts from fresh PostgreSQL authority and generated
  credentials;
- rootfs and protocol compatibility are established before long execution;
- distributed reference and provider-restart scenarios pass;
- the report proves no retained proof custody;
- performance results are distributions with explicit non-portable budgets,
  not default-suite pass/fail timing.

## Non-Goals

- runtime feature work;
- concurrency optimization;
- production deployment automation;
- remote PostgreSQL transport;
- advanced security-track controls;
- performance SLA adoption.

## Completion

- fast proof passed from the clean current workspace;
- complete proof passed all 30 declared repository checks;
- privileged proof passed both fresh-authority distributed scenarios and exact
  cleanup;
- Core timing and memory collections each completed three clean runs;
- the runtime-specific advisory budget reviews returned `within_budget`.
