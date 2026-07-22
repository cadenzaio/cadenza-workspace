# Operational Authority-Mount Promotion

Date: 2026-07-18

## Context

Sprint 7D materializes the authority-access support member of the reconciliation
stem as an ordinary grant-backed Chamber. The authority gateway correctly
rejects that Chamber because the environment's singleton operational authority
mount still identifies the bootstrap Chamber and image.

Treating residency as a mount would broaden the observation credential into an
authority-admission credential. Keeping the bootstrap Chamber as a permanent
special route would contradict the approved managed stem placement.

## Decision

- Extend the existing UID-bound activation-issuer protocol with one exact
  authority-mount promotion operation.
- Allow promotion only for the support member `slice.authority-access.v0` in
  singleton unit `unit.meta.reconciliation-stem.v0` and replica
  `replica.meta.reconciliation-stem.0001`.
- Require the current active assignment, trusted Cell generation, signed
  operational activation grant, current signed-ready residency, exact runtime
  slice materialization, and the existing singleton mount anchor to agree.
- Preserve the existing capability mount key, authority slice, artifact key,
  and artifact digest. Replace only the Cell, Chamber, image, epoch, authority
  revision, and mount time under one PostgreSQL transaction.
- Record every actual transition in immutable canonical promotion evidence.
  Exact retries after promotion return success without another transition.
- Grant execution only to `cadenza_operational_activation_issuer`. Do not add a
  database credential or mount-management privilege to the Cell, Chamber,
  observation appender, reconciliation stem, or authority gateway role.

## Consequences

- A dynamically managed authority-support Chamber can satisfy the gateway's
  exact mount admission check without weakening it.
- Residency remains evidence of runtime state rather than authority by itself;
  activation-signing custody must confirm the complete authority chain.
- The operational environment continues to have exactly one active authority
  mount, while its runtime identity can move through a narrowly governed
  lifecycle.
- Promotion currently applies only to the first reconciliation stem singleton.
  A general authority-placement lifecycle requires a later design.

## Alternatives

- Letting the gateway accept current ready residency was rejected because it
  makes the observation path part of authority admission.
- Routing permanently through the bootstrap Chamber was rejected because it
  creates a special unmanaged runtime dependency.
- Giving the Cell direct mount-table access was rejected because it collapses
  local custody and environment authority.

## Links

- [Sprint 7D design](../agent-harness/exec-plans/completed/2026-07-18-stem-cell-meta-slice-sprint-7d-design.md)
- [Stem-cell meta-slice decision](2026-07-18-stem-cell-meta-slice.md)
