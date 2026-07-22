# Separate Activation And Containment Lifetimes

Date: 2026-07-19

## Context

The Sprint 7D Linux proof used one five-minute limit for both operational
activation grants and Chamber process custody. A healthy Chamber was therefore
terminated when the grant that authorized its creation expired. This confused
two different identities and responsibilities: short-lived authorization to
start one exact image, and bounded custody of the already admitted process.

Extending activation grants would increase replay and stale-authority exposure.
Ending healthy Chambers with each grant would create periodic replacement
churn, route disruption, and unnecessary operational pressure.

## Decision

- Operational activation grants remain valid for no more than five minutes.
- A grant must be live and fully valid when activation crosses the affect
  boundary.
- Successful activation establishes an independent Chamber containment
  lifetime capped at fifteen minutes.
- Launcher custody and Cell host containment configuration enforce the same
  fifteen-minute hard ceiling.
- Grant expiry after successful activation does not terminate the admitted
  Chamber. Current assignment, projection, route, and containment authority
  continue to govern its legitimate affect.
- The signed containment plan binds the exact process expiry. Callers cannot
  extend custody after admission.
- Automatic replacement after unexpected Chamber loss remains later healing
  work; this decision does not add a hidden renewal or restart loop.

## Consequences

- Authorization remains short-lived without turning grant expiry into runtime
  lifecycle policy.
- Healthy Chambers can survive long enough for the five-minute stem lease,
  route renewal, outage, and restart scenarios to be exercised without forced
  churn.
- A fifteen-minute containment loss bound is explicit in the runtime constant,
  host and launcher validators, JSON schemas, example configuration, and tests.
- Longer-lived Chambers will eventually need an explicit containment renewal
  or replacement design rather than silently extending process custody.

## Alternatives

- Raising both grants and containment to fifteen minutes was rejected because
  it unnecessarily broadens activation authority.
- Keeping both at five minutes was rejected because authorization expiry would
  continue to kill healthy runtime state.
- Unbounded or ambient process custody was rejected because it weakens failure
  containment and temporal stewardship.

## Links

- [Sprint 7D design](../agent-harness/exec-plans/completed/2026-07-18-stem-cell-meta-slice-sprint-7d-design.md)
- [Operational authority-mount promotion](2026-07-18-operational-authority-mount-promotion.md)
- [Sprint 7D closure review](../contracts/distribution/sprint-7d-closure-review-v0.md)
