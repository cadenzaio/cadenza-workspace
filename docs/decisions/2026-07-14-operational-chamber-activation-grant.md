# Operational Chamber Activation Grant V0

## Context

The Environment Bootstrap handoff authorizes only the first seeded authority-access slice. Reusing it to activate business or meta-support source slices would confuse bootstrap authority with later operational execution authority. The cell's containment signature cannot substitute because process custody must remain separate from environment semantic authority.

## Decision

- activation authority is a tagged proof: the existing bootstrap handoff or an operational activation grant.
- preserve bootstrap verification for the first trusted-control chamber.
- require operational grants to bind the environment, cell, complete chamber identity and lane, image generation, activation nonce, authority revision, slice identity/version/trust, artifact, runtime, policy, capabilities, runtime-support digest, and validity window.
- require V0 grants to be signed by the active environment trust-root key held outside the cell.
- require the chamber to resolve the key independently, verify the canonical grant digest and signature, reread current activation authority, and require exact agreement before artifact resolution.
- retain a distinct cell-signed containment attestation. The grant authorizes what may run; containment proves how and where it runs.
- advance the breaking cell-chamber protocol to `0.4.0`.
- defer delegated operational activation signers to a later authority design.

## Consequences

- non-bootstrap source chambers can use the production activation path without impersonating the bootstrap slice.
- the cell cannot invent source execution authority or widen runtime support.
- deterministic conformance grants can prove Sprint 5D without giving the cell root-key custody.
- activation proof identity becomes generic in runtime images instead of using bootstrap-only field names.

## Alternatives

- trust the cell's current-authority read without a signed grant: rejected because the host could invent semantic execution authority.
- reuse the bootstrap handoff: rejected because its slice identity is fixed and cryptographically bound.
- let the cell sign grants: rejected because containment custody is not environment authority.
- introduce delegated activation signers now: deferred because delegation and revocation require a separate design.

## Links

- [Approved Sprint 5 amendment](../agent-harness/exec-plans/completed/2026-07-13-single-cell-multi-chamber-orchestration-design.md#sprint-5d-operational-activation-grant-amendment)
- [Authority-bound source activation](2026-07-14-authority-bound-source-slice-activation.md)
- [Environment Bootstrap contract](../contracts/environment-bootstrap/v0.md)
