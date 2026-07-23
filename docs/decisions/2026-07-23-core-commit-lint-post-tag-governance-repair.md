# Core Commit-Lint Post-Tag Governance Repair

Date: 2026-07-23
Status: approved

## Context

Sprint 9F's live protected-branch proof exposed a Core pull-request workflow
that failed before linting because its pinned commitlint action no longer
accepted the repository's CommonJS `.js` configuration path. The RC1 product
checks and DCO passed, but leaving an advisory failed check on every future
Core pull request would be operationally incoherent.

## Decision

Repair the Core configuration as ESM, prove the `lint` API context through a
protected DCO-compliant pull request, add `lint` to the workspace
machine-readable required-check set, and then require it in Core branch
protection.

Treat the change as post-tag repository governance. Do not replace, move, or
republish RC1 tags, the aggregate manifest, source archives, packages,
signatures, SBOMs, or release assets.

## Consequences

- Core contribution checks become deterministic and enforceable.
- Core and Workspace `main` advance beyond their signed RC1 tags.
- Signed tags and the distributed-foundation manifest remain the immutable RC1
  compatibility authority.
- Final publication evidence must distinguish release identity from later
  protected governance commits.

## Alternatives

- Remove commit lint as legacy behavior: rejected because it serves the
  contribution and release discipline.
- Continue with a known advisory failure: rejected because it normalizes
  operational noise.
- Replace RC1 or publish RC2: rejected because no product, contract, package,
  or release artifact changed.

## Links

- [Sprint 9F Core Commit-Lint Post-Tag Governance Repair V1](../publication/sprint-9f-core-commit-lint-post-tag-governance-repair-v1.md)
- [GitHub Required-Check API Contexts](2026-07-23-github-required-check-api-contexts.md)
