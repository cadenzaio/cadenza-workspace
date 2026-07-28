# Sender-Side Replica Routing Closure Review V0

Date: 2026-07-24

## Status

- Implementation state: `accepted`; closure approval was received on
  2026-07-24.
- Sender-side multi-replica routing behavior is implemented and proved at the
  Chamber, Cell, and real contained-distribution boundaries.
- Complete ordinary validation passes in both affected product repositories.
- The broader pre-enrolled supply fixture reached and passed the new routing
  assertion, then exposed an existing supply-restart lifecycle failure during
  its unchanged final phase. That issue did not invalidate the routing result
  and was resolved by the completed
  [supply-restart lifecycle hardening pass](../../agent-harness/exec-plans/completed/2026-07-24-supply-restart-lifecycle-hardening.md).

## Intended Whole

Application authors express business workflow and replica demand without
coding deployment topology or choosing a destination instance. Cadenza derives
eligible route members and absorbs the ordinary execution choice while keeping
authority, execution identity, failures, and evidence explicit.

Replica creation without a coherent execution choice would be false scale.
Selection by a separate hidden service would duplicate authority. Silent
substitution or retry after uncertain execution would create ambiguous affect.
The delivered path avoids all three.

## Delivered Behavior

- PostgreSQL and Cell projections preserve every current eligible replica as a
  canonically ordered opaque route member.
- The sending Chamber chooses locally with deterministic round-robin state per
  route group and current route epoch.
- Selection state is bounded: removed groups are pruned, epoch replacement
  resets selection, and offsets wrap at candidate count.
- The source Cell validates and resolves the exact selected candidate. It never
  chooses again or substitutes another destination.
- Delegation and inquiry remain topology-free at the authored API.
- A signal is forwarded once per subscribing slice and selects one replica
  inside that slice's independent route group.
- Actor-owner routing remains authority-directed rather than balanced.
- Started or uncertain execution is not retried on another replica.

## Scenario Coverage

Focused Chamber tests prove:

- four target delegations select `A, B, A, B`;
- four signal forwards select `A, B, A, B`;
- a new route epoch resets the next selection to `A`;
- signal evidence preserves source-effect identity without correlation leakage.

Focused Cell tests prove:

- one two-replica route resolves each exact selection to its distinct Cell,
  generation, Chamber, and route-member authority;
- removing one member and advancing the route epoch makes the old explicit
  selection fail as `stale_route`;
- no Cell-side fallback changes the sender's choice.

The contained Linux scenario proved:

1. one source Cell converged two business replicas on two supplied destination
   Cells;
2. four topology-free delegations returned the same business result;
3. durable source-generation evidence named both destination Cells with at
   least two completed executions each;
4. the supply provider restarted, replacement route authority converged, and a
   fifth delegation completed;
5. scale-down reached stopped residency for both business replicas.

## Recursive Coherence Review

### Intent, Identity, And State

Replica demand remains placement intent. Route group, route epoch, route
member, sender Chamber, source Cell generation, destination Cell generation,
distribution execution, and business result remain separate identities. A
selection offset is local temporal state, not authority and not business
context.

### Affect And Boundaries

The consequence path is singular:

```text
business delegation or signal
  -> sending Chamber selection
  -> source Cell exact validation
  -> local or authenticated peer transport
  -> destination Chamber execution
  -> explicit outcome and durable evidence
```

The Chamber cannot invent candidates, the Cell cannot replace the selected
candidate, and the business graph cannot observe placement topology.

### Relationships And Failure Meaning

Canonical route authority coordinates sibling replicas without a coordinator
service. Round-robin provides deterministic local fairness only; it does not
pretend to know global load. Pre-start stale authority remains explicitly
retryable. Started and uncertain execution remain non-retryable because
duplicating business affect would be less coherent than reporting uncertainty.

### Temporal Stewardship

Route epochs fence old candidate sets. Projection revisions bind the sender's
view. Assignment epochs, Cell generations, image epochs, idempotency keys, and
distribution evidence preserve meaning through replacement and restart.
Obsolete selection counters no longer accumulate across epochs.

No new schema, migration, service, API, compatibility path, persistence
concern, or authored topology surface was introduced.

## Validation Evidence

- Chamber adapter typecheck and build passed.
- Chamber formatting, strict all-target/all-feature Clippy, complete tests,
  Rust advisory audit, and npm high-severity audit passed.
- Cell formatting, strict all-target/all-feature Clippy, complete tests, and
  documentation generation passed.
- Adapter artifact:
  `sha256:3fc2e50a73ee3e0e7e6fc2f88697c194925b500dac7f0863efc1ded1136cc5e1`.
- Fresh Linux rootfs used release Chamber, Node, core, and adapter artifact
  `sha256:4b452084649a0bd6e34f3a62774f2cef78ffc833818ba713cbb4a51953c109fd`
  under systemd with a private cgroup namespace. A later removal of unrelated
  TypeScript formatting churn changed generated bytes to the final digest
  above without changing the selection implementation; focused tests pass
  against the final artifact.
- Durable Linux evidence before provider restart recorded both target Cells
  with the required completed delegation count.

## Residual Finding

During the unchanged provider-restart phase, a managed Cell failed
`cell generation lifecycle transition requires empty local custody`. The
provider then exited because that Cell lacked stopped authority. The routing
assertion had already passed, replacement generations later became ready, and
a fifth delegation completed; however, the exited provider could not publish
the final dormant supply observations.

This was outside the approved routing change and no routing code absorbed or
concealed it. The focused supply-restart lifecycle pass repaired the separate
Cell custody problem without changing routing behavior.

## Closure Decision

Sender-side replica routing meets its approved implementation, validation, and
coherence criteria. The user approved independent closure on 2026-07-24. The
supply-restart lifecycle finding and repair remain explicit in the
[completed hardening plan](../../agent-harness/exec-plans/completed/2026-07-24-supply-restart-lifecycle-hardening.md)
and are not concealed or reclassified as routing behavior.
