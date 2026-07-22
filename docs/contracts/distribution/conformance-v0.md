# Multi-Cell Distribution Conformance V0

## Required Positive Proofs

- `distribution.general-source-authority`
- `distribution.source-registration-revocation`
- `distribution.root-authorized-cell-enrollment`
- `distribution.candidate-transport-key-possession`
- `distribution.distinct-cell-key-purposes`
- `distribution.active-enrollment`
- `distribution.governed-capability-capacity`
- `distribution.multi-member-placement-unit`
- `distribution.derived-unit-requirements`
- `distribution.static-replica-assignment`
- `distribution.complete-ready-residency`
- `distribution.derived-route-member`
- `distribution.declarative-control-meta-slice`
- `distribution.cell-bounded-projection`
- `distribution.idempotent-authority-operations`
- `distribution.immutable-evidence`

## Required Negative Proofs

- `distribution.reject-expired-enrollment-grant`
- `distribution.reject-revoked-source-activation`
- `distribution.reject-root-signature-drift`
- `distribution.reject-candidate-possession-drift`
- `distribution.reject-enrollment-replay-conflict`
- `distribution.reject-self-declared-trust`
- `distribution.reject-unknown-capability`
- `distribution.reject-capability-mode-mismatch`
- `distribution.reject-trust-mismatch`
- `distribution.reject-capacity-overflow`
- `distribution.reject-stale-authority-revision`
- `distribution.reject-stale-unit-revision`
- `distribution.reject-stale-assignment-epoch`
- `distribution.reject-cross-cell-residency`
- `distribution.reject-partial-replica-readiness`
- `distribution.reject-expired-residency`
- `distribution.reject-suspended-cell-route`
- `distribution.reject-revoked-cell-route`
- `distribution.reject-ambient-topology`
- `distribution.reject-generic-authority-operation`

## Validation Levels

### Neutral Contract

Proves canonical identity, state, ordering, and fixture shape without choosing a
language or database representation.

### Authority Model

Proves operation semantics, derivation, state transitions, idempotency, stale
rejection, and evidence through in-memory model tests.

### PostgreSQL Authority

Proves fresh migration, transaction isolation, role boundaries, constraints,
projection reads, root/candidate proof binding, and hostile direct SQL.

### Cell Consumer

Proves the Rust cell accepts only bounded projections that agree with its own
identity and independently checks assignment, residency, and route eligibility.

## Fixture Rules

- the fixture is language-neutral and canonical-JSON compatible.
- identity collections and set-like arrays are sorted and duplicate-free.
- digests and signatures are shape-valid fixture values, not private material.
- fixture endpoints are loopback documentation values and not deployment
  recommendations.
- no fixture contains credentials, private keys, provider objects, business
  secrets, actor ownership, dynamic placement, or stem-cell state.
