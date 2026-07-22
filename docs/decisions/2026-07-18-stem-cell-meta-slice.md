# Stem-Cell Meta Slice

Date: 2026-07-18

## Context

Sprint 7A established a deterministic planner, Sprint 7B established fenced
PostgreSQL reconciliation authority, and Sprint 7C established autonomous local
Cell convergence. Declared desired state still requires an active policy loop
to issue snapshots, plan, commit exact actions, and let Cells converge the
result.

The integration audit found that the existing stem database role could bypass
the authority gateway, operational authority Chambers still received a denying
broker, the authority artifact lacked the reconciliation action primitive, and
the 16 MiB snapshot contract exceeded ordinary capability-result bounds.

## Decision

- Implement the V1 stem as one singleton placement unit with a privileged
  TypeScript source member and a separate authority-access support member.
- Give the source only exact `reconciliation_control/use` private facades.
  Keep placement action execution exclusively behind the digest-pinned
  `Reconciliation.ExecuteAction` authority task.
- Split PostgreSQL stem-control privilege from gateway-action privilege.
- Add an exact resumable-work projection so unknown outcomes and restarts are
  resolved from immutable plans, applications, and outcomes before retry.
- Trigger the graph with coalesced database notifications plus one fixed
  host-owned safety tick; create no durable Cell or Chamber queue.
- Preserve the approved 16 MiB whole-snapshot contract through explicit
  facade-specific bounds while ordinary business contexts remain capped at 1
  MiB.
- Generate the runtime planner helper from the Sprint 7A authority
  implementation and prove it against the same language-neutral fixtures.
- Keep initial singleton placement and first lease acquisition as explicit
  bootstrap/operator affects. Cell supply and stem takeover remain Sprints 7E
  and 7F.

## Consequences

- Cadenza expresses environment placement policy through its own primitives
  without moving scheduling policy into Rust substrate code.
- The stem source cannot access SQL, credentials, the authority catalog, root
  keys, endpoints, launch descriptors, or process control.
- A lost action response cannot cause blind re-execution because current work
  is reread from PostgreSQL.
- Large privileged reconciliation contexts require explicit authority at every
  Chamber and Cell boundary instead of weakening global limits.
- The first implementation remains serialized and bounded; concurrency and
  paged snapshots remain later measured optimizations.

## Alternatives

- A Rust scheduler in `cadenza-cell` was rejected because environment policy is
  a Cadenza feature, not local runtime substrate.
- Direct SQL or direct action privilege in the private provider was rejected
  because it collapses interpretation and affect.
- Mounting `authority_access/admin` in the source was rejected because the
  source needs one action relationship, not the full catalog.
- A large single reconciliation callback was rejected because it hides policy
  stages, action boundaries, and evidence.
- Raising all runtime limits to 16 MiB was rejected because ordinary business
  execution does not require it.

## Links

- [Approved Sprint 7D design](../agent-harness/exec-plans/completed/2026-07-18-stem-cell-meta-slice-sprint-7d-design.md)
- [Sprint 7 parent decision](2026-07-17-scale-placement-reconciliation.md)
- [Sprint 7C closure](../contracts/distribution/sprint-7c-closure-review-v0.md)
