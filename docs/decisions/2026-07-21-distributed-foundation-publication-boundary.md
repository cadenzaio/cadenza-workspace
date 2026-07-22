# Distributed Foundation Publication Boundary

Date: 2026-07-21

## Context

Sprint 9A found that the distributed foundation was behaviorally strong but
not yet a bounded public release. The original repository recommendation also
placed durable environment authority in TypeScript core and did not define
adapter ownership or trustworthy performance evidence. Approved amendments
created `cadenza-environment`, restored persistence-agnostic cores, assigned
language adapters to Chamber, and replaced invalid performance tests.

Publication scope, legacy state, licensing, history, release identity,
registry timing, and repository governance still required one explicit gate
before recursive stabilization could begin.

## Decision

Prepare nine public repositories under `cadenzaio`: four language cores,
Environment, Chamber, Cell, a curated architecture workspace, and a realistic
reference system.

Before the separately approved publication operation, add exact legacy notices
and then archive `cadenza-service`, `cadenza-db`, `cadenza-ui`,
`cadenza-console`, and `cadenza-demo-2`.

Use Apache-2.0 with DCO 1.1 as the working legal/contribution posture. Preserve
the existing public `cadenza` history; create clean histories for new repos;
curate the workspace into a clean public history while preserving excluded
material privately.

Publish the first foundation as a GitHub release candidate. Target
`@cadenza.io/core` `4.0.0-rc.1`, keep other repository versions independent,
and bind compatibility through an exact release manifest. GitHub source and
prerelease assets are the first publication channel; package registries require
a later explicit gate.

Protect `main`, require PR/CI after repository bootstrap, enforce DCO, publish
no-SLA support and known limitations, use public issue/discussion support, and
use private GitHub vulnerability reporting for confidential security reports.

This decision authorizes Sprint 9B stabilization. It does not authorize remote
creation, pushes, archival, package publication, or final release.

## Consequences

- Every public repository has one defensible semantic, authority, runtime,
  architecture, or proof responsibility.
- The workspace must be curated rather than made public in its current form.
- The reference system becomes maintained release evidence rather than a
  revived legacy demo.
- Legacy public repositories stop competing with the official direction after
  the final publication operation.
- Independent versions remain honest; the release manifest becomes the exact
  compatibility authority.
- Sprint 9B may repair and prepare local repositories but cannot mutate public
  GitHub state.

## Alternatives

- Publishing the current workspace unchanged was rejected because it mixes
  current authority with private/deferred material and historical execution
  debris.
- Keeping environment authority in core was superseded because it violates
  persistence-agnostic primitive ownership.
- Creating a separate repository for each language adapter was rejected until
  release cadence or stewardship evidence justifies the extra boundary.
- Publishing packages together with source was rejected until clean public
  clones prove artifact reproducibility.
- Rewriting existing public `cadenza` history was rejected because distributed
  history cannot be reliably erased and is valuable context for the v4 break.

## Links

- [Final Publication Boundary Gate V2](../publication/sprint-9a-final-publication-boundary-gate-v2.md)
- [Environment Authority Repository Boundary](2026-07-21-environment-authority-repository-boundary.md)
- [Chamber Adapter Ownership And Performance Evidence](2026-07-21-chamber-adapter-ownership-and-performance-evidence.md)
- [Distributed Foundation Stabilization And Publication](2026-07-21-distributed-foundation-stabilization-and-publication.md)
