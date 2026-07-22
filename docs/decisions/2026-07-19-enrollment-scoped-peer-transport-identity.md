# Enrollment-Scoped Peer Transport Identity

Date: 2026-07-19

## Context

Pre-enrolled supply creates a fresh process-generation key each time a dormant
Cell starts. Retained Cells can know the supplied Cell's stable enrolled TLS
identity, but cannot safely predict its future generation key. The prior host
configuration combined both identities, making a retained Cell unable to
communicate with a newly supplied generation without restart or mutable peer
configuration.

## Decision

- Pin peer TLS configuration to enrollment identity: Cell key, transport
  public-key reference, certificate, and SPKI digest.
- Do not place a peer process-generation key in the pinned host configuration.
- Keep signed peer controls, execution envelopes, route decisions, results,
  replay state, and evidence generation-scoped.
- After TLS authentication, require the claimed source generation to be the
  exact current unexpired ready generation in distribution authority before
  accepting the session.
- Bind that dynamically verified generation for the complete session and fail
  closed on current-authority drift at every existing consequential check.

## Consequences

- A retained Cell can authenticate a fresh supplied generation without a
  restart or configuration mutation.
- Stable enrollment identity and ephemeral process identity remain distinct
  rather than forcing one lifecycle onto the other.
- TLS authentication alone is insufficient; availability of the literal
  current-generation authority read is required before peer affect.
- Host configuration schemas and fixtures no longer carry peer generation
  keys, while protocol and evidence contracts continue to carry exact
  generation identity.

## Alternatives

- Restarting every retained peer when supply changes was rejected because it
  turns capacity changes into unrelated runtime churn.
- Predeclaring future generation keys was rejected because it contradicts
  fresh generation identity.
- A mutable peer-configuration controller was rejected because it adds a
  second operational authority path and broader runtime surface.

## Links

- [Sprint 7E amendment](../agent-harness/exec-plans/completed/2026-07-19-pre-enrolled-cell-supply-sprint-7e-design.md)
- [Cell peer transport contract](../contracts/cell-peer-transport/v0.md)
- [Pre-enrolled Cell supply](2026-07-19-pre-enrolled-cell-supply.md)
