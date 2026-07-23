# GitHub Owner, Signing, And Governance

Date: 2026-07-23
Status: approved

## Context

The final Sprint 9F operational review established that `cadenzaio` is a
personal GitHub account, the current private `cadenza-workspace` repository
contains private working history, no release-signing identity is configured,
and `cadenzaio` is the only collaborator on the current public `cadenza`
repository.

The earlier candidate procedure assumed organization ownership and one
mandatory approval with no administrator bypass. That combination does not
describe current custody and would make a single-maintainer protected branch
impossible to operate.

## Decision

RC1 will use the existing personal `cadenzaio` GitHub owner. The account will
not be converted into an organization as part of this release.

Before public workspace creation, the current private repository will be
renamed to `cadenza-workspace-private-archive`, verified to remain private, and
retained with its original history. A new public `cadenza-workspace`
repository will be created only from the approved curated history.

Protected `main` branches will require pull requests, declared CI checks, DCO,
resolved conversations, stale-conversation handling where applicable, linear
history, no force push, no deletion, and no administrator bypass. Mandatory
approving reviews will be zero while the repositories have one maintainer.
Before a second identity receives write authority or the project claims
multi-maintainer governance, this setting must ratchet to one independent
approval.

The GitHub DCO check will be installed and observed under its exact declared
name before final branch protection is applied.

All nine annotated RC1 tags, the aggregate manifest, and release assets will be
signed with a dedicated passphrase-protected Ed25519 SSH signing identity. Its
public key and fingerprint will be published. Its private key must remain
outside source, artifacts, logs, and inherited runtime configuration. The
project owner must provision the key or explicitly authorize its generation
and custody before publication.

## Consequences

- Current release guidance must use GitHub owner or account terminology rather
  than organization terminology.
- The machine-readable required-checks contract must encode zero approving
  reviews and the independent-review ratchet must remain explicit in current
  documentation.
- The private workspace history cannot cross into the public repository.
- Publication requires a separate signing-key preflight and cannot fall back
  to unsigned tags or assets.
- The personal-owner and single-maintainer custody model is an accepted RC1
  limitation, not a claim of mature organizational governance.
- These documentation and release-control changes require a final
  curated-workspace-only replacement freeze.

## Alternatives

- Converting `cadenzaio` to an organization was rejected because account
  migration is not necessary to prove the distributed foundation and would add
  unrelated release risk.
- Making the existing private workspace public after replacing `main` was
  rejected because branch replacement does not prove private repository
  objects are absent.
- Keeping one mandatory approval without an independent reviewer was rejected
  because it would deadlock maintenance.
- Informally bypassing protection was rejected because external enforcement
  would drift from the machine-readable release contract.
- Unsigned release identities and silently generated unencrypted keys were
  rejected because they violate the approved provenance and custody posture.

## Links

- [Sprint 9F GitHub Ownership, Signing, And Governance Gate V1](../publication/sprint-9f-github-ownership-signing-governance-gate-v1.md)
- [Sprint 9F Definitive Proof And Publication Review](../agent-harness/exec-plans/active/2026-07-22-sprint-9f-definitive-proof-publication-review.md)
