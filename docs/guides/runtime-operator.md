# Cadenza Runtime Operator Guide

## Operational Truth

A running process is not a healthy Cadenza identity. Read desired, authorized,
running, observed, custody, and safe-next-action truth separately through the
[operational interpretation guide](./operational-interpretation.md).

Health requires current durable authority, the exact process generation, ready
residency, valid routes, and required evidence custody to agree. Disagreement
is a stage-specific operational state, not one generic unhealthy value.

Read the [runtime topology](../architecture/atlas/rendered/06-runtime-topology.svg),
[scale path](../architecture/atlas/rendered/10-scale-reconciliation.svg), and
[security boundaries](../architecture/atlas/rendered/12-security-capability-boundaries.svg)
before operating a distributed environment.

## Startup Order

1. Provision supported PostgreSQL and run all checksummed migrations through
   the exclusive administrative identity.
2. Complete genesis, trust-root establishment, first-Cell enrollment, seed
   application, authority handoff, and bootstrap-root retirement.
3. Install measured `runsc`, immutable rootfs content, launcher, activation
   issuer, and fixed system services on each Linux host.
4. Start the unprivileged Cell with credentials and capabilities on fixed
   inherited descriptors.
5. Let the current stem and each Cell converge desired authority. Do not issue
   ordinary Chamber lifecycle commands manually.

## Read Current State

| Scope | Required agreement |
| --- | --- |
| Environment | `handoff_ready`, `operational`, current trust root, and retired bootstrap authority |
| Stem | One current unexpired lease owner and epoch, with takeover evidence for changes |
| Supply | Current directive, provider generation, profile, process observation, and Cell generation |
| Cell | Enrollment, exact unexpired generation observation, projection, and host custody |
| Chamber | Assignment, image, Cell generation, ready residency, projection acknowledgement, and evidence custody |
| Route | Exact ready members and route epoch in the source Chamber's applied projection |
| Evidence processor | One ready system-owned replica per active Cell and progressing durable receipts |
| Actor | Assignment epoch, owner residency, state version, mutation outcome, and drain posture |

## Failure Posture

Classify whether affect did not start, started, became uncertain, was
superseded, remains custody-blocked, or completed before taking action.

- Declared pre-affect provider or transport unavailability can defer bounded
  work under still-current authority.
- Authorization denial, conflict, invalid input, stale generation, and revoked
  authority are semantic failures, not availability retries.
- `transport_failed` is not inherently retryable; read `execution_started`.
- Unknown commit is resolved by exact idempotency, mutation, distribution, or
  processing-attempt identity.
- The system fails closed when it cannot preserve authority or evidence
  custody.

Use the [troubleshooting guide](./troubleshooting.md) for stage-first diagnosis.

## Drain And Cleanup

Withdraw desired replicas, stop new actor work, settle accepted mutations,
seal and process evidence, withdraw the evidence processor, and only then stop
the Cell generation. A clean stop requires no runtime processes, gVisor
containers, launch bundles, temporary sockets, proof rootfs, or unresolved
custody. The detailed lifecycle remains in
[Sprint 9C operational evidence](../publication/sprint-9c-operational-lifecycle-v1.md).

`draining`, `stopped`, `dormant`, absent, and clean describe different scopes.
Do not infer global cleanup from any one of them.

## Repeat Proof

Use the [proof harness](./proof-harness.md) to distinguish fast development
checks, complete non-privileged release validation, and the clean-source Linux
gVisor proof. Do not treat a fast or complete report as privileged containment
evidence.

Verify proof source, authority cluster, measured rootfs, service namespace, and
cleanup scope before interpreting a failed proof as a runtime defect.
