# Stem Recovery And Fencing

Date: 2026-07-19

## Context

The reconciliation stem is a singleton whose lease, assignment, source
Chamber, authority-support Chamber, and operational authority mount initially
belong to one bootstrap-selected trusted-control Cell. Existing operations
correctly reject an expired lease or a lease whose owner generation is no
longer current and ready, but no authority can appoint a successor while the
stem itself is unavailable.

Recovery must preserve the intended whole: application authors remain focused
on logical behavior while Cadenza restores its own coordination authority
without split brain, hidden infrastructure control, or fabricated readiness.

## Decision

PostgreSQL remains the sole clock and linearization authority for stem
succession. A purpose-separated host-only resolver will atomically:

- validate lease expiry or loss of the exact owner generation.
- select one deterministic current ready eligible trusted-control Cell.
- advance the lease epoch and singleton assignment epoch when placement moves.
- retire unresolved predecessor work.
- advance authority and reconciliation revisions.
- append immutable takeover evidence and wake ordinary convergence.

Recovery belongs to the Rust Cell host substrate because the unavailable stem
cannot recover itself. It receives a separate fixed database credential and no
Chamber-facing capability. Existing assignment, activation, containment,
residency, and authority-mount promotion paths materialize the successor; the
takeover transaction does not claim runtime readiness.

The bootstrap Cell is an initial binding rather than a permanent placement
pin. Continuing eligibility is governed by current trust, generation,
capabilities, artifacts, capacity, desired state, and overrides.

Only already-running current ready trusted-control Cells participate. Dormant
supply and complete trusted-control extinction remain explicit
bootstrap/operator recovery concerns.

## Consequences

- One database transaction fences predecessor authority before successor
  materialization begins.
- PostgreSQL unavailability prevents takeover rather than creating host-local
  election truth.
- A failed successor cannot renew on behalf of a non-working stem; later expiry
  rotates to another eligible Cell when available.
- Cell host configuration gains one purpose-separated credential descriptor.
- The system retains one singleton policy loop and does not add a consensus
  service, heartbeat subsystem, recovery queue, or supply policy bypass.
- Recovery latency remains governed by current lease and generation expiry
  until measured evidence justifies changing those durations.

## Alternatives

- Let the stem elect its successor: rejected because that responsibility is
  unavailable at the failure boundary.
- Active-active stems: rejected because every effect would require a broader
  consensus protocol.
- Add etcd, Consul, Raft, Kubernetes leases, or host advisory locks: rejected
  because PostgreSQL already serializes every affected authority identity.
- Reuse the stem meta-slice credential: rejected because takeover governs the
  meta slice itself and requires a host-only authority boundary.
- Start dormant recovery capacity: deferred because it would duplicate supply
  policy and create a second scheduler.

## Links

- [Approved Sprint 7F design](../agent-harness/exec-plans/active/2026-07-19-stem-recovery-fencing-sprint-7f-design.md)
- [Parent Sprint 7 design](../agent-harness/exec-plans/active/2026-07-17-scale-placement-reconciliation-design.md)
- [Sprint 7E closure](../contracts/distribution/sprint-7e-closure-review-v0.md)
