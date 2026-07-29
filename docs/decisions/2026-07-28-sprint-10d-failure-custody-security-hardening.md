# Sprint 10D Failure, Custody, And Security Hardening

Date: 2026-07-28

## Context

Sprint 10C established reproducible fast, complete, and privileged proof
paths. The distributed foundation now needs a bounded post-RC failure and
security review before operational interpretation and final Sprint 10 closure.

The existing repositories already contain substantial focused failure
coverage. Repeating every failure at every layer would add maintenance and
runtime cost without establishing clearer boundary meaning. The user approved
the focused design on 2026-07-28 with:

`Design approved. Proceed.`

## Decision

Sprint 10D uses ten named failure obligations and three proof tiers:

1. deterministic repository tests for local authority and state invariants;
2. process and protocol tests only where custody crosses a real boundary;
3. the three existing root Linux/gVisor scenarios for system-level
   interruption, replacement, recovery, and cleanup.

Each obligation receives one authoritative proof owner through a current
coverage ledger. Product changes are finding-driven. No new privileged
scenario is planned unless a focused amendment proves that a
containment-specific gap cannot be established at a lower tier.

Critical and high findings block closure until repaired and re-proved or until
the affected capability is removed through an approved amendment. Medium
findings are repaired by default and may be accepted only with bounded
rationale and explicit ownership. Advanced-security features remain outside
Sprint 10D.

## Consequences

- Existing tests count only when their assertions reach the claimed boundary.
- Failure injection is expressed through deterministic authority states rather
  than arbitrary timing.
- The third existing privileged system scenario becomes declared hardening
  evidence without increasing the ordinary two-scenario development path.
- Cross-repository security judgment lives in the workspace; each product
  repository owns repairs within its authority boundary.
- Any schema, shared-contract, public-API, architectural, dependency, or large
  product repair returns to a design gate.
- Sprint 10D makes no independent security-audit or production-SLA claim.

## Alternatives

- Repeat every failure at every layer: rejected as expensive duplicate
  coverage.
- Run only existing full suites: rejected because test presence is not a
  current cross-boundary coverage argument.
- Add a broad privileged chaos suite: rejected because state-blind process
  killing is timing-sensitive and difficult to interpret.
- Implement every accepted security limitation: rejected because that would
  absorb the later advanced-security track.
- Accept critical or high findings through documentation: rejected because a
  supported boundary cannot remain knowingly false.

## Links

- [Approved Sprint 10D design](../agent-harness/exec-plans/active/2026-07-28-sprint-10d-failure-custody-security-hardening.md)
- [Parent Sprint 10 design](../agent-harness/exec-plans/active/2026-07-25-distributed-foundation-consolidation-hardening-design.md)
- [Sprint 10C closure](../publication/sprint-10c-reproducible-proof-performance-closure-v1.md)
- [Current threat model](../security/cadenza-threat-model-v1.md)
