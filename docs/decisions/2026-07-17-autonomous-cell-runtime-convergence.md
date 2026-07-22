# Autonomous Cell Runtime Convergence

Date: 2026-07-17

## Context

Sprint 7B established database authority for desired state, placement,
assignment, reconciliation leases, plans, and signed runtime observations. The
production-shaped cell still depended on static startup bundles, direct
environment-root activation signatures, controller-published residencies, and
manual route refresh. Automating those controls without changing their
authority boundaries would preserve an external lifecycle controller and put
routine runtime affect too close to semantic root authority.

## Decision

- Extend runtime-slice registration with immutable, digest-bound artifact bytes
  and canonical runtime-support authority in PostgreSQL.
- Provide one bounded, transactionally coherent projection of current local
  assignments, materialization authority, residencies, and route membership to
  each enrolled cell generation.
- Keep placement policy and desired-state mutation outside the cell. A cell may
  only interpret and converge runtime state already assigned to itself.
- Introduce a purpose-specific activation issuer whose Ed25519 key is authorized
  by a revocable environment-root delegation. The environment root remains
  offline and neither root nor issuer private keys enter the cell or chamber.
- Require PostgreSQL to derive and reserve the exact operational activation
  basis. The issuer may sign only that derived digest and must record the exact
  signature before returning the grant.
- Require chambers to verify both the root-signed issuer delegation and the
  issuer-signed activation grant against current cell, assignment, source, and
  activation authority before artifact resolution.
- Add narrow runtime-observation appenders for signed cell-generation and
  member-residency evidence. Routine runtime observations do not use the generic
  authority gateway after reconciliation begins.
- Recompute convergence from PostgreSQL semantic truth and cell-local process
  truth. Do not add a durable cell work queue or another scheduler.
- Treat database notifications as coalesced hints only; every consequential
  decision rereads current authority, with a fixed safety cadence repairing
  missed hints.
- Converge lifecycle effects serially in V0 and defer concurrency until the
  complete environment has been proven and measured.

## Consequences

- Definitions become sufficient serialized authority for later controlled
  callable and primitive materialization without moving materialization into
  the core repositories.
- Routine chamber activation no longer depends on an online environment root,
  while a compromised cell cannot mint execution authority.
- Cells can autonomously activate, renew, replace, drain, stop, and route only
  their current assignments without learning placement policy or provider
  secrets.
- PostgreSQL gains materialization custody, exact activation issuance, bounded
  local projections, and narrow observation operations, but no placement
  algorithm, process custody, or generic job API.
- Issuer availability affects new materialization only. Already admitted work
  remains bounded by current residency, route, and chamber authority.
- Operational complexity increases by one security-critical process and exact
  credential boundary; its protocol and database role therefore remain
  deliberately single-purpose.

## Alternatives

- Giving the cell the environment root key was rejected because process custody
  could then invent environment-wide execution authority.
- Keeping the environment root online in a routine signer was rejected because
  it would make the highest authority a hot operational credential and
  availability dependency.
- Giving every cell its own activation delegation was rejected because the same
  compromised process could forge both a grant and its claimed local basis.
- Passing fresh startup bundles through the existing control descriptor was
  rejected because it preserves an external lifecycle controller.
- Letting chambers read PostgreSQL or artifact storage directly was rejected
  because it moves credentials and topology into the execution boundary.
- Using the generic authority gateway for runtime observations was rejected
  because routine evidence does not justify broad semantic mutation access.
- Adding a durable convergence queue was rejected because assignment authority
  and local process custody already provide sufficient truths for restart
  recomputation.

## Links

- [Approved Sprint 7C design](../agent-harness/exec-plans/completed/2026-07-17-autonomous-cell-runtime-convergence-sprint-7c-design.md)
- [Sprint 7 parent design](../agent-harness/exec-plans/active/2026-07-17-scale-placement-reconciliation-design.md)
- [Sprint 7 parent decision](2026-07-17-scale-placement-reconciliation.md)
- [Sprint 7B PostgreSQL authority decision](2026-07-17-postgres-reconciliation-authority.md)
- [Sprint 7B closure review](../contracts/distribution/sprint-7b-closure-review-v0.md)
