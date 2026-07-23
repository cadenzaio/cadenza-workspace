# Public Documentation Authority Coherence

Date: 2026-07-23
Status: approved

## Context

The final Sprint 9F recursive review found that public documents presented as
current agent and architecture guidance still assigned responsibility to
legacy service, database, engine, UI, and demo repositories. The public
documentation link checker did not cover those primary documents and therefore
missed a broken link into the absent legacy service repository.

## Decision

Current public learning, architecture, vision, and repository-routing surfaces
must describe only the official language cores, Environment, Chamber, Cell,
reference system, and workspace authority model. Historical documents and
explicitly labeled legacy repo cards remain as provenance.

Public documentation validation must distinguish current authority from
history, check links across every declared current authority document, and
reject current learning or routing language that assigns authority to a legacy
repository.

The repair is confined to the curated workspace. All implementation
repositories and executable artifacts remain frozen.

## Consequences

- Current public entry paths become mutually consistent with the implemented
  distributed foundation.
- Historical provenance remains available but cannot masquerade as current
  routing authority.
- The curated workspace commit, source archive, and aggregate manifest require
  replacement and a new exact affected-scope freeze.
- Public documentation checks gain an explicit, machine-readable authority
  boundary instead of relying on an incomplete hardcoded list.

## Alternatives

- Removing the stale documents was rejected because they carry necessary
  learning, architecture, and vision responsibilities.
- Fixing only the broken link was rejected because the surrounding semantics
  remained obsolete.
- Rewriting historical decisions was rejected because it would destroy useful
  temporal provenance.

## Links

- [Sprint 9F Public Documentation Authority Coherence Gate V1](../publication/sprint-9f-public-documentation-authority-coherence-gate-v1.md)
- [Sprint 9F Definitive Proof And Publication Review](../agent-harness/exec-plans/active/2026-07-22-sprint-9f-definitive-proof-publication-review.md)
