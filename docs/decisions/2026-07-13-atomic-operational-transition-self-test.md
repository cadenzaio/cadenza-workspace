# Atomic Operational Transition Self-Test

## Context

The environment must remain `pending_activation` until the real authority
gateway path is proven. Ordinary authority operations are rejected before
`operational`, but the original transition payload required preexisting
gateway-self-test evidence. No authorized pre-operational operation could create
that evidence, and direct synthetic insertion did not prove the gateway,
broker, role, and PostgreSQL transaction path.

## Decision

The exact `Environment.RequestOperationalTransition` invocation is the V0
gateway self-test. Its fixed PostgreSQL transaction validates the complete
invocation and four independently published proofs: containment,
materialization, readiness, and bootstrap-owner retirement.

After validation and before committing operational state, the transaction
creates deterministic immutable gateway-self-test evidence. It then commits the
authority operation, `pending_activation -> operational`, and operational
transition evidence atomically. Any later failure rolls back the generated
self-test evidence. External runtime-evidence append rejects gateway-self-test
records.

## Consequences

- there is no circular precondition or synthetic proof bypass.
- the self-test exercises the real cell, chamber, adapter, gateway, broker,
  database role, and provider transaction path.
- no ordinary authority mutation becomes available before `operational`.
- transition failure cannot leave reusable self-test evidence.
- transition input contains four external proof references rather than five.

## Alternatives

- Add a tenth non-mutating pre-operational probe primitive. Rejected because it
  expands the canonical gateway surface solely to resolve the circularity.
- Accept a local or mocked gateway proof. Rejected because it does not prove the
  real provider and database authority boundary.
- Permit externally appended gateway-self-test evidence. Rejected because it
  can claim a path that was never executed.

## Links

- [Runtime Gateway Contract](../contracts/authority-security/runtime-gateway-v0.md)
- [Trusted Cell And First Activation Plan](../agent-harness/exec-plans/active/2026-07-13-trusted-cell-first-activation-design.md)
