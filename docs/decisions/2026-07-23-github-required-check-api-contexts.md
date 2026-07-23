# GitHub Required-Check API Contexts

Date: 2026-07-23
Status: approved

## Context

The first live RC1 Core workflow passed at the exact frozen commit, but
GitHub's check-runs API reported the required context as `core`. The frozen
branch-protection projection used the composite UI label `CI / core`.
Branch-protection APIs require the check-run context name, so the frozen value
would have created an unsatisfiable protection rule.

## Decision

Machine-readable required checks use GitHub API context names:

- direct job contexts such as `core`, `environment`, `chamber`, `cell`, and
  `reference-system`;
- `governance` and `release-metadata` for the workspace;
- `core (3.13.14)` and `core (3.14.6)` for the Python matrix;
- `DCO` for every official repository.

The release validator must require the exact context set for every repository,
including both Python matrix entries, and reject missing or extra projected
checks. Documentation may mention composite UI labels only as presentation,
not as branch-protection authority.

## Consequences

- Branch protection can require checks GitHub actually emits.
- Machine governance and external enforcement use the same identity.
- The curated workspace commit, source archive, and aggregate manifest require
  a workspace-only replacement freeze.
- The already published Core commit, successful CI run, and signed
  `v4.0.0-rc.1` tag remain valid and unchanged.
- Every implementation/reference commit, package, generated artifact, SBOM,
  contract, protocol value, and registry boundary remains frozen.

## Alternatives

- Requiring composite UI labels was rejected because those labels are not
  check-run API contexts.
- Omitting required checks was rejected because it weakens governance.
- Renaming all workflow jobs was rejected because it changes implementation
  repositories to imitate presentation.
- Repairing after publication was rejected by the fail-closed publication
  procedure.

## Links

- [Sprint 9F GitHub Required-Check Context Gate V1](../publication/sprint-9f-github-required-check-context-gate-v1.md)
- [Sprint 9F Definitive Proof And Publication Review](../agent-harness/exec-plans/active/2026-07-22-sprint-9f-definitive-proof-publication-review.md)
