# Supply-Restart Lifecycle Hardening

Date: 2026-07-24

## Context

The sender-side replica-routing Linux proof successfully balanced execution
across two supplied Cells, replaced their generations after supply-provider
restart, and completed another delegation. During later release, a Cell exited
while attempting to publish draining lifecycle evidence because local custody
was not empty. The provider then exited because its managed child lacked
stopped authority, so dormant supply evidence was never published.

The failure exposed two related gaps in `cadenza-cell`: pre-ready activation
work has no explicit retirement path when its assignment disappears, and a
valid drain that arrives before final local cleanup is treated as fatal rather
than as a bounded reconciliation deferral.

## Decision

- Keep the empty-custody lifecycle fence. A Cell generation may not report
  draining or stopped while it retains any member, activation request, issued
  grant, prepared Chamber, or routed member.
- Represent absent members by no local inventory record. Retain only the live
  production states `GrantPending`, `Materializing`, `Ready`, `Draining`, and
  `Stopped`.
- Remove the unused `Absent`, `Preparing`, and `FailedWaitingRetry` states and
  their unused retry model.
- Insert pending activation inventory before crossing the issuer boundary so
  authority changes cannot leave hidden request custody.
- Add explicit effects to cancel pending activation authority, stop a prepared
  Chamber through its actual prepared control, and forget a stopped member
  only after stopped residency is published.
- Retain prepared custody until its stop is acknowledged. An uncertain
  cancellation remains non-empty and is retried.
- When exact supply drain authority is valid but local cleanup is incomplete,
  return the stable private-control code `CustodyPending`. Do not report
  draining and do not terminate the Cell.
- Let the supply supervisor defer only an identity-matched `CustodyPending`
  response and retry on its existing bounded cadence. All other authority,
  identity, epoch, protocol, and lifecycle failures remain fatal.
- Keep provider restart behavior unchanged: do not adopt surviving children
  and do not start an overlapping Cell generation.

## Consequences

- Cell lifecycle observations become a complete statement about local runtime
  custody rather than only inventory and route state.
- Removed assignments can retire coherently at every pre-ready stage.
- A normal ordering race between durable drain intent and local convergence no
  longer converts into provider and Cell failure.
- The Cell host and supply supervisor private protocol gains one stable
  rejection code but no mixed-version compatibility layer.
- No database schema, authority operation, placement policy, route selection,
  primitive contract, or business execution retry changes.
- Removing dead Rust convergence states is source-breaking, which is accepted
  for the new major direction.

## Alternatives

- Accept pending activation states as empty: rejected because retained grants
  or prepared Chambers would be hidden behind false lifecycle evidence.
- Stop every Chamber before publishing drain: rejected because it bypasses
  assignment, residency, route, and actual prepared-control ownership.
- Retry only in the provider: rejected because abandoned activation custody
  would never converge to empty.
- Clear all local convergence memory: rejected because uncertain process
  custody cannot safely be converted into absence.
- Move the condition into PostgreSQL release policy: rejected because durable
  authority cannot observe all in-process activation artifacts and does not
  own local process cleanup.

## Links

- [Completed execution plan](../agent-harness/exec-plans/completed/2026-07-24-supply-restart-lifecycle-hardening.md)
- [Pre-enrolled Cell supply decision](2026-07-19-pre-enrolled-cell-supply.md)
- [Autonomous Cell convergence decision](2026-07-17-autonomous-cell-runtime-convergence.md)
- User approval on 2026-07-24: `Design approved. Proceed.`
