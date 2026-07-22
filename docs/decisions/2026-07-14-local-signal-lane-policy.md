# Local Signal Lane Policy V0

## Context

Sprint 5 introduces local signal forwarding between chambers. Delegation is restricted to the same execution lane, but the integrated orchestration proof requires business work to emit detached audit signals to a meta-support chamber. Leaving signal direction implicit would allow route state that is structurally valid but violates the intended authority boundary.

## Decision

For local signal routing in V0:

- same-lane delivery is allowed.
- `business` to `meta_support` delivery is allowed.
- every other cross-lane direction is rejected.
- `trusted_control` may exchange signals only with `trusted_control`.
- invalid lane relationships are rejected before route state is accepted and are revalidated when projections and addressed deliveries are interpreted.

Delegation remains same-lane only. Any future expansion requires an explicit superseding decision and an environment-derived policy rather than an ad hoc exception.

## Consequences

- business chambers can detach audit and support observations without receiving reverse execution influence from meta-support chambers.
- meta-support cannot signal business or trusted-control chambers.
- trusted-control remains isolated from cross-lane signal traffic.
- route configuration, projection publication, and delivery validation enforce the same directional rule.
- this is a conservative V0 boundary and may be revisited after the authority and distribution model matures.

## Alternatives

- same-lane signals only: rejected because it prevents the intended business-to-meta-support audit relationship.
- unrestricted cross-lane signals: rejected because signal detachment would become ambient horizontal authority.
- validate only at delivery time: rejected because invalid routes would enter authoritative state and fail after traffic begins.

## Links

- [Single-cell multi-chamber design](../agent-harness/exec-plans/completed/2026-07-13-single-cell-multi-chamber-orchestration-design.md)
- [Local orchestration contract](../contracts/local-orchestration/v0.md)
- [Single-cell multi-chamber decision](2026-07-13-single-cell-multi-chamber-orchestration.md)
