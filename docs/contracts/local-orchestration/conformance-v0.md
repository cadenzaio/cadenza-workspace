# Local Orchestration Conformance V0

## Required Positive Proofs

- `local.generation-bound-authority`
- `local.monotonic-host-revision`
- `local.chamber-specific-projection`
- `local.atomic-full-snapshot-apply`
- `local.exact-projection-acknowledgement`
- `local.eligibility-after-ack`
- `local.source-selected-route`
- `local.host-validates-no-reroute`
- `local.delegation-start-boundary`
- `local.delegation-uses-core-conclusion`
- `local.composition-failure-is-started-execution-failure`
- `local.absolute-deadline`
- `local.detached-signal-acceptance`
- `local.local-inquiry-proxy`
- `local.successor-before-drain`
- `local.serialized-quiescence`
- `local.ordered-evidence`
- `local.source-contained-linux`

## Required Negative Proofs

- `local.reject-cross-generation`
- `local.reject-stale-host-revision`
- `local.reject-stale-projection`
- `local.reject-projection-digest-mismatch`
- `local.reject-projection-before-static-descriptor`
- `local.reject-acknowledgement-mismatch`
- `local.reject-unacknowledged-ingress`
- `local.reject-stale-route`
- `local.reject-silent-reroute`
- `local.reject-layer-violation`
- `local.reject-target-draining`
- `local.reject-post-start-safe-retry`
- `local.reject-signal-loop`
- `local.reject-actor-route-v0`
- `local.reject-ambient-host-port`
- `local.reject-active-execution-contract-v0`

## Fixture Rules

- the fixture is language neutral and canonical-JSON compatible.
- every set-like array is sorted and duplicate-free.
- every positive and negative proof has a stable identifier.
- no fixture contains actor ownership, placement, network endpoint, credential, provider, or secret material.
- conformance tests must prove model behavior, not only deserialize the fixture.
- Linux containment is an explicit integration level and cannot be replaced by process-only tests.

## Validation Levels

### Contract Model

Proves identity, revisions, state transitions, projection derivation, acknowledgement, eligibility, routing decisions, and evidence ordering.

### Chamber Integration

Proves atomic projection application, generated runtime support, primitive ingress, started/completed boundaries, deadlines, drain, and hostile callback rejection.

### Cell Integration

Proves multi-chamber orchestration, exact source/target validation, successor publication, compensation, and process custody.

### Linux Closure

Proves trusted-control, business, and meta-support chambers under measured gVisor containment through inquiry/delegation, detached signal, replacement, stale rejection, drain, and stop.
