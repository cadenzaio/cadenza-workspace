# Sprint 9F GitHub Required-Check Context Gate V1

Date: 2026-07-23
Status: approved

## Context

The first live RC1 source bootstrap published the exact frozen Core commit
`f936045b5710e40db272435b6cf68741803824e6`. GitHub Actions run
`30021377941` completed successfully, and the signed annotated
`v4.0.0-rc.1` tag resolves to that commit.

GitHub's commit check-runs API reports the successful required check as:

- context: `core`;
- GitHub App: `github-actions`;
- App ID: `15368`;
- UI presentation: `CI / core`.

The frozen [`release/required-checks.json`](../../release/required-checks.json)
records `CI / core` as the branch-protection context. GitHub's branch
protection API requires the check-run context name, not the composite workflow
and job label shown in the UI. Enforcing the frozen value would therefore make
the protected branch permanently unsatisfiable.

The publication procedure requires exact observed CI and DCO context names and
requires publication to stop on any mismatch. Downstream source publication
has stopped.

## External State At Pause

- The prior private workspace is preserved as the private
  `cadenza-workspace-private-archive` repository at exact head
  `8aae264179e50cdb05cb0ed807a812ee0937b37e`.
- Eight new official repositories exist publicly but remain empty.
- DCO installation `148532268` is restricted to the nine official
  repositories.
- Public `cadenza/main` is the exact frozen commit
  `f936045b5710e40db272435b6cf68741803824e6`.
- Signed tag `cadenza/v4.0.0-rc.1` resolves to that exact commit.
- No GitHub prerelease, release asset, downstream source, branch protection,
  legacy notice, archival action, or package-registry publication has occurred.

The Core source and tag remain valid. This finding affects only the
curated-workspace branch-protection projection.

## Proposed Decision

Record the GitHub API check-run context names in
`release/required-checks.json`:

| Repository                 | Required API contexts                    |
| -------------------------- | ---------------------------------------- |
| `cadenza-workspace`        | `governance`, `release-metadata`, `DCO`  |
| `cadenza`                  | `core`, `DCO`                            |
| `cadenza-python`           | `core (3.13.14)`, `core (3.14.6)`, `DCO` |
| `cadenza-elixir`           | `core`, `DCO`                            |
| `cadenza-csharp`           | `core`, `DCO`                            |
| `cadenza-environment`      | `environment`, `DCO`                     |
| `cadenza-chamber`          | `chamber`, `DCO`                         |
| `cadenza-cell`             | `cell`, `DCO`                            |
| `cadenza-reference-system` | `reference-system`, `DCO`                |

Update the release validator to require exact job contexts directly, with
matrix suffixes allowed only for the declared Python jobs. Update current
required-check documentation to distinguish API context names from composite
UI labels.

After repair:

1. create a DCO-signed curated workspace commit;
2. assemble twice against the unchanged frozen implementation/package inputs;
3. prove that only the workspace commit, source-tree digest, source archive,
   and aggregate manifest changed;
4. request one exact workspace-only replacement freeze;
5. resume publication without moving or replacing the valid Core tag.

## Consequences

- Branch protection will require checks that GitHub can actually satisfy.
- Machine-readable governance will match the external enforcement API rather
  than a presentation label.
- The curated workspace commit, workspace source archive, and aggregate
  manifest require replacement.
- All eight implementation/reference commits, packages, generated artifacts,
  SBOMs, contracts, protocol values, and the existing signed Core tag remain
  frozen.
- The public workspace remains empty until the repaired replacement freeze is
  approved.

## Alternatives

1. Require `CI / core`. Rejected because it is not the check-run context
   emitted by GitHub and would deadlock protected changes.
2. Omit required CI contexts. Rejected because it weakens the approved
   governance contract.
3. Rename workflow jobs to include `CI /`. Rejected because it changes every
   implementation repository merely to imitate a UI label.
4. Continue publication and repair the public workspace afterward. Rejected
   because the approved release procedure requires fail-closed exactness.

## Approval

The user approved the GitHub required-check API context amendment on
2026-07-23. The curated-workspace-only repair and deterministic refreeze may
proceed. No implementation repository or existing Core release identity will
change.
