# Scale And Placement Reconciliation

Date: 2026-07-17

## Context

Sprint 6 established static multi-cell placement, signed residencies, derived
routes, direct cell transport, and trustworthy execution evidence. Application
authors would still have to drive replica definition, assignment, lifecycle,
route refresh, capacity supply, and failover outside Cadenza. Combining these
responsibilities in a generic scheduler would create a second management
architecture and concentrate excessive authority.

## Decision

- Express environment-wide placement policy as one leased stem-cell Cadenza
  graph.
- Use PostgreSQL to serialize desired state, overrides, reconciliation leases,
  canonical plans, exact actions, assignments, and immutable outcomes.
- Keep chamber and residency convergence local to each Rust cell.
- Restrict V1 cell supply to named pre-enrolled dormant cells controlled by a
  purpose-specific trusted provider.
- Permit the trusted-cell substrate to perform only lease-fenced activation or
  takeover of the exact approved stem image; placement policy remains in the
  stem graph.
- Use TypeScript for the V1 stem slice as a justified exception because it is
  the only production chamber adapter already proven under privileged
  containment and evidence contracts.
- Split implementation into seven reviewable passes, beginning with a
  language-neutral contract and deterministic pure planner.

## Consequences

- Business definitions declare workload shape and constraints without
  receiving deployment, credential, endpoint, lease, or process machinery.
- The stem can propose and dispatch only revision-, digest-, and lease-fenced
  exact actions; it receives no generic database or host authority.
- Existing cells continue local work during authority outages, while new
  placement mutation fails closed.
- Missing pre-enrolled supply becomes explicit unsatisfied demand rather than
  weakened policy or fabricated capacity.
- Dynamic enrollment, cloud provisioning, adaptive autoscaling, actor
  distribution, and generalized runtime slimming remain separate future work.

## Alternatives

- A generic Rust scheduler in `cadenza-cell` was rejected because
  environment-wide placement is a Cadenza feature, not local substrate policy.
- One large stem callable was rejected because it would hide policy stages,
  actions, evidence, and repair behavior.
- Direct database or process authority in the stem was rejected as excessive
  and incoherent authority.
- Dynamic enrollment during scaling was rejected because trust establishment
  and workload capacity are distinct security concerns.
- Implementing a C# adapter first was rejected because no measured Sprint 7
  requirement justifies another privileged materialization surface.

## Links

- [Approved Sprint 7 design](../agent-harness/exec-plans/active/2026-07-17-scale-placement-reconciliation-design.md)
- [Cadenza Official Roadmap](../agent-harness/exec-plans/active/2026-07-09-cadenza-official-roadmap.md)
- [Multi-Cell Distribution Contract V0](../contracts/distribution/v0.md)
