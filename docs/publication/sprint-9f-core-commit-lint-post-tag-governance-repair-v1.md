# Sprint 9F Core Commit-Lint Post-Tag Governance Repair V1

Date: 2026-07-23
Status: implemented

## Context

The protected-branch control proof used temporary no-content pull requests in
all nine official repositories. Core pull request `#1` passed required checks
`core` and `DCO`, but its additional `lint` check failed before examining the
commit. The pinned commitlint action requires an ESM `.mjs` configuration,
while Core still referenced `commitlint.config.js`.

The failure did not invalidate the frozen Core source, signed
`v4.0.0-rc.1` tag, aggregate manifest, or release assets. It did prove that
ordinary post-release Core pull requests would show a failed governance check.

## Decision

Repair the workflow as post-tag repository governance:

1. rename `commitlint.config.js` to `commitlint.config.mjs`;
2. express the configuration as an ESM default export;
3. update the immutable-pinned workflow to reference the `.mjs` file;
4. prove `core`, `lint`, and `DCO` through a protected pull request;
5. add `lint` to the workspace required-check authority; and
6. require the verified `lint` context in Core branch protection.

RC1 tags, manifests, source archives, packages, detached signatures, SBOMs,
and release assets remain immutable. Core and Workspace `main` may advance
beyond their RC1 tags through normal protected governance changes.

## Approval

The user approved this design on 2026-07-23 with:

`Sprint 9F Core commit-lint post-tag governance repair design approved. Proceed.`

## Implementation Evidence

- Core repair commit before GitHub rebase:
  `92b92972fc4452b3cb70f0e8104b7935762f114c`.
- The commit verified with the dedicated RC1 Ed25519 key and carried DCO
  sign-off.
- Core pull request:
  `https://github.com/cadenzaio/cadenza/pull/2`.
- Required Core workflow run `30051064646`: passed context `core`.
- Repaired commit-lint run `30051064637`: passed context `lint`.
- DCO: passed.
- Protected Core rebase merge commit:
  `d2696d05129ae70bbda9805669809af10a6a4ff4`.
- Workspace pull request:
  `https://github.com/cadenzaio/cadenza-workspace/pull/2`.
- Workspace workflow run `30051507697`: passed contexts `governance` and
  `release-metadata`.
- Workspace workflow run `30051507753`: passed context `agent-harness`.
- Workspace `DCO`: passed.
- Protected Workspace squash merge commit:
  `61dcc16b59edd4fa17e8134f052f7f4ed44fcb68`.
- Final Core protection readback requires `core` and `lint` from GitHub Actions
  App ID `15368`, plus `DCO` from App ID `1861`.
- Final all-repository readback confirms the exact machine projection,
  administrator enforcement, linear history, resolved conversations, zero
  approving reviews, and disabled force pushes and deletion.

## Consequences

- Core pull requests regain a functioning conventional-commit check.
- `lint` becomes a required API context instead of an advisory red check.
- Machine governance and GitHub enforcement remain aligned.
- The published RC1 compatibility identity and all signed release material
  remain unchanged.
- Public `main` is explicitly allowed to contain later governance commits;
  consumers reproducing RC1 must continue to use the signed tags and manifest.

## Alternatives

- Removing commit lint was rejected because the workflow still serves Core's
  release and contribution discipline.
- Leaving the failing check advisory was rejected because every Core pull
  request would present known false failure.
- Replacing the immutable RC1 tags and assets was rejected because the defect
  concerns repository governance after the release boundary.
- Creating RC2 solely for this workflow repair was rejected as disproportionate
  and semantically misleading.

## Links

- [GitHub Required-Check API Contexts](../decisions/2026-07-23-github-required-check-api-contexts.md)
- [Core Commit-Lint Post-Tag Governance Repair](../decisions/2026-07-23-core-commit-lint-post-tag-governance-repair.md)
