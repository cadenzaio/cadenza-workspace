# Environment Bootstrap Conformance V0

Date: 2026-07-12

## Purpose

This note defines the minimum proof required before an implementation may claim Environment Bootstrap V0 conformance.

## Required Positive Proofs

- `bootstrap.environment-identity`
- `bootstrap.trust-root-public-only`
- `bootstrap.first-cell-enrollment`
- `bootstrap.static-principal-trace`
- `bootstrap.adjacent-state-transitions`
- `bootstrap.idempotent-input`
- `bootstrap.ordered-evidence`
- `bootstrap.chained-evidence`
- `bootstrap.capability-registry-complete`
- `bootstrap.seed-pack-digest`
- `bootstrap.seed-application-provenance`
- `bootstrap.authority-access-single-holder`
- `bootstrap.handoff-complete`
- `bootstrap.handoff-attested`
- `bootstrap.no-source-materialization`

## Required Negative Proofs

- `bootstrap.reject-state-skip`
- `bootstrap.reject-conflicting-input`
- `bootstrap.reject-private-material`
- `bootstrap.reject-source-payload`
- `bootstrap.reject-seed-digest-mismatch`
- `bootstrap.reject-duplicate-capability`
- `bootstrap.reject-second-authority-holder`
- `bootstrap.reject-incomplete-handoff`
- `bootstrap.reject-unsigned-handoff`
- `bootstrap.reject-invalid-attestation`
- `bootstrap.reject-non-handoff-ready`

## Fixture Rules

- every required positive proof appears in aggregate positive coverage.
- every required negative proof has one named negative case.
- negative mutations use JSON Pointer paths and one of `add`, `replace`, or `remove`.
- a negative case may request digest normalization after mutation when the intended proof is not a digest-mismatch proof.
- each negative case declares one stable expected failure class and one message fragment.
- fixture mutation is conformance-harness behavior, not a public bootstrap runtime API.
- public-key resolution data may appear at the fixture root for signature verification; it is harness data and must contain no private material.

## Validation Levels

### Contract Validation

Proves data shape, naming, state relationships, digest reproducibility, forbidden material, registry completeness, single-holder authority, and handoff completeness.

### Store Integration

Must later prove clean schema creation, transactional transitions, concurrent bootstrap exclusion, exact rerun idempotency, conflicting-input rejection, rollback, and authority/security relational constraints.

### Runtime Handoff

Deferred until the chamber runtime exists. Bootstrap V0 closes by producing and validating `handoff_ready`; it does not prove activation.
