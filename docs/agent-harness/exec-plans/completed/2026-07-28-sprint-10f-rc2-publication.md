# Sprint 10F RC2 Publication

Date: 2026-07-28

## Status

- State: `done`.
- Approval:
  `approved. we can proceed with publication`
- CI repair approval:
  `Sprint 10F RC2 publication CI repair and affected-scope replacement freeze`.
- Decision:
  [Sprint 10F RC2 Publication](../../../decisions/2026-07-28-sprint-10f-rc2-publication.md).
- Repair decision:
  [Sprint 10F RC2 Publication CI Repair](../../../decisions/2026-07-28-sprint-10f-rc2-publication-ci-repair.md).
- Candidate:
  [Sprint 10F RC2 Publication Decision V1](../../../publication/sprint-10f-rc2-publication-decision-v1.md).
- Repair evidence:
  [Sprint 10F RC2 Publication CI Repair V1](../../../publication/sprint-10f-rc2-publication-ci-repair-v1.md).
- Aggregate manifest SHA-256:
  `cc1c41ce6944a4b84380f4222d3952c46889d9fc9dd7b0d7444e05b906127055`.
  This supersedes the original candidate manifest
  `015e8ca720d7e2a8ea90d70233531644033a1f523c5653a29a4c83337c7af6e6`.
- Publication evidence:
  [Sprint 10F RC2 Publication Evidence V1](../../../publication/sprint-10f-rc2-publication-evidence-v1.md).

## Objective

Publish the exact reviewed distributed-foundation RC2 candidate through each
official repository's protected review path without rewriting candidate
commits, retagging unchanged repositories, or publishing to package
registries.

## Frozen Identities

| Repository | Commit | Tag |
| --- | --- | --- |
| `cadenza-workspace` | `90df7af273b4415c76f3351ce43153659343e183` | `distributed-foundation-rc.2` |
| `cadenza` | `a4384818a777d4ff85341bbe5d91d1c9c8c12ee3` | `v4.0.0-rc.2` |
| `cadenza-python` | `b15a306dbddf6168e0171f5fe5b468a050464375` | `v0.1.0-rc.2` |
| `cadenza-environment` | `96054f583e41df9341a219955c7e1c19acb63c13` | `v0.1.0-rc.2` |
| `cadenza-chamber` | `c22d34ccb6a10f3fc1f89e416be8ee5e770089cd` | `v0.1.0-rc.2` |
| `cadenza-cell` | `29bcbefe0130a28155a7af21fc19d27ff8fb82a9` | `v0.1.0-rc.2` |
| `cadenza-reference-system` | `8426e2d9674298ccd54cafbb85204fbbb52ab851` | `v0.1.0-rc.2` |

Elixir and C# remain on their verified signed `v0.1.0-rc.1` tags.

## Approved CI Repair

The first protected review pass exposed five publication-wiring defects:

1. the public workspace omitted a linked Sprint 10F execution plan;
2. one unmerged Core commit body exceeded the restored commit-lint limit;
3. Chamber CI consumed RC1 Core and Environment dependencies;
4. Cell CI consumed RC1 Core, Environment, and Chamber dependencies; and
5. Reference System CI consumed RC1 Core while validating an RC2-bound
   generated artifact.

The affected-scope replacement freeze permits:

- a new Core replacement branch from public `main` with the same candidate
  changes and a corrected commit message, while preserving the failed branch
  and PR as audit evidence;
- additive repair commits in Workspace, Chamber, Cell, and Reference System;
- exact candidate-commit CI pins to break the pre-tag publication cycle; and
- reconstruction and replacement of only the five affected source identities,
  their derived release artifacts, and the aggregate manifest.

No force push, rebase, squash, RC1 mutation, registry publication, or change to
Python, Environment, Elixir, or C# is authorized.

The repaired artifact tree and manifest were assembled twice byte-identically.
The manifest validates under JSON Schema Draft 2020-12 and records nine exact
repository identities and 16 checksum-bound artifacts.

## Sequence

1. Verify authentication, remotes, frozen commits, clean worktrees, absent RC2
   tags, and current default branches.
2. Push the exact affected branches without force.
3. Open review-ready pull requests with the frozen manifest and proof evidence.
4. Repair the approved publication-only failures and reconstruct the affected
   candidate scope twice byte-identically.
5. Replace the affected identities and aggregate manifest only after complete
   local validation.
6. Update or replace affected pull requests without rewriting remote history.
7. Wait for every declared required check on each exact head.
8. Merge with merge commits only; never squash or rebase candidate commits.
9. Verify each frozen commit is reachable from public `main`.
10. Create signed annotated affected-only RC2 tags at the frozen commits.
11. Push and verify the tags.
12. Create GitHub prereleases and attach only manifest-declared assets assigned
   to each repository.
13. Create detached Ed25519 signatures for the aggregate manifest and release
    assets, then upload them with the manifest.
14. Verify unauthenticated public clones, tag signatures, asset checksums,
    release links, documentation, and required checks.
15. Record exact publication evidence and remaining limits.

## Merge And Asset Rules

- Merge commits may advance `main`, but tags must point to the frozen candidate
  commits recorded above.
- No squash, rebase, force push, tag replacement, or RC1 mutation is allowed.
- Workspace release owns the aggregate manifest and cross-repository signature
  bundle.
- Repository releases own only their manifest-declared source, package, and
  generated artifacts.
- No npm, PyPI, Hex, NuGet, or crates.io publication is allowed.

## Stop Conditions

Stop and return to a focused repair or user gate when:

- a frozen commit, source tree, package, generated artifact, or manifest digest
  differs;
- a required check fails for a substantive reason;
- a branch protection rule would require history rewriting;
- an RC2 tag or release already exists with another identity;
- a signature cannot be independently verified;
- a public clone or asset checksum differs from the manifest;
- the action would mutate Elixir, C#, RC1, a registry, or a legacy repository.

## Merge Policy Gate

All required checks passed on the seven exact repaired candidate heads. GitHub
rejected merge-commit attempts before changing any pull request because every
protected `main` branch currently has required linear history enabled.
Repository-level merge-commit support remains enabled.

Squash and rebase merges remain prohibited because they would replace the
manifest-bound candidate commits. The recommended bounded exception is:

1. snapshot all seven complete branch-protection documents;
2. disable only `required_linear_history`;
3. merge the seven green pull requests with merge commits;
4. verify each frozen candidate commit is reachable from public `main`;
5. immediately restore `required_linear_history`; and
6. compare every other protection field byte-for-byte with its snapshot.

Required checks, DCO, pull-request review, administrator enforcement, branch
deletion posture, tags, releases, registries, and candidate identities must not
change during this exception. No protection mutation is authorized until the
user explicitly approves this gate.

The user approved the bounded exception. All seven complete protection
documents were snapshotted, only `required_linear_history` was disabled, all
seven green pull requests merged with merge commits, every frozen candidate
became reachable from `main`, and every original protection document was
restored byte-equivalently.

## Completion

Publication is complete only when all seven affected commits are public and
reachable, all seven signed tags verify, all prereleases and declared assets
are public, unauthenticated verification passes, and the publication evidence
record is committed.

Completed on 2026-07-29. The workspace aggregate prerelease owns the manifest,
16 manifest-bound artifacts, the release public key and fingerprint, and 19
detached signatures. The six component prereleases carry no duplicate assets.
All public clone, tag, asset, documentation, package-consumer, protection, and
required-check checks passed. RC1, Elixir, C#, registries, deployments, and
legacy repositories were not mutated.
