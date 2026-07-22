# Cadenza Runtime Operator Guide

## Operational Truth

A running process is not a healthy Cadenza identity. Health requires current
durable authority, the exact process generation, ready residency, valid routes,
and required evidence custody to agree.

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

## Read Health

- Environment: `handoff_ready` and `operational`.
- Cell: current unexpired generation observation matching enrollment and host
  authority.
- Stem: one current lease owner and epoch, with takeover evidence for changes.
- Chamber: assignment, image, source slice, Cell generation, ready residency,
  and deadline agree.
- Evidence processor: one ready system-owned replica per active Cell.
- Actor: assignment epoch, owner residency, state version, and mutation outcome
  agree.

## Failure Posture

Transport and provider outages defer bounded work. Authorization denial,
conflict, invalid input, stale generation, and revoked authority are terminal.
Unknown commit is resolved by exact idempotency identity. The system fails
closed when it cannot preserve authority or evidence custody.

## Drain And Cleanup

Withdraw desired replicas, stop new actor work, settle accepted mutations,
seal and process evidence, withdraw the evidence processor, and only then stop
the Cell generation. A clean stop requires no runtime processes, gVisor
containers, launch bundles, temporary sockets, proof rootfs, or unresolved
custody. The detailed lifecycle remains in
[Sprint 9C operational evidence](../publication/sprint-9c-operational-lifecycle-v1.md).
