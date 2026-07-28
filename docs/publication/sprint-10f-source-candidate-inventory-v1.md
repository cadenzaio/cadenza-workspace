# Sprint 10F Source And Candidate Inventory V1

Date: 2026-07-28

## Status

- Source freeze: complete for pre-implementation heads.
- RC1 comparison: complete.
- Mixed-candidate schema check: pass.
- Release-tooling gap classification: workspace-local repair.
- Product or shared-contract gap: none.

## Pre-Implementation Freeze

| Repository | RC1 commit | Frozen current commit | Commits after RC1 | Worktree | Candidate identity |
| --- | --- | --- | ---: | --- | --- |
| `cadenza-workspace` | `60994b88fcd98d2db45f240b6bce8a12fe28d70e` | `24fd05fbf4831dea1021e181d8f8a9327834800f` | 28 | unrelated untracked strategy custody only | RC2 |
| `cadenza` | `f936045b5710e40db272435b6cf68741803824e6` | `a2d38f0bc72b43634ca9a2af74b1194584ba6746` | 5 | clean | RC2 |
| `cadenza-python` | `9fd99a0a7e9533163a2952fed526d35fb100f307` | same | 0 | clean | retain RC1 |
| `cadenza-elixir` | `d1dd15f1802d108023384cab39d234aaf259f114` | same | 0 | clean | retain RC1 |
| `cadenza-csharp` | `d294e535aa0dfad91123c9d14ad6e3aa8c5b4cb2` | same | 0 | clean | retain RC1 |
| `cadenza-environment` | `de8dd66ea8dd87613c15120b1d4ce5b4f38bbd47` | `eb9cc0046b1e74b24e44b9598c118c9a6ee67d03` | 1 | clean | RC2 |
| `cadenza-chamber` | `3bc0dfa23d7c5fd16baf4a29f584127003cc2d5b` | `10db3f61e93bbec336bcc489d194877e23a5ee3b` | 2 | clean | RC2 |
| `cadenza-cell` | `a9b5e168f4c29e7579657c563242a15ca0ba473c` | `89e6e5492956a8513c215aa55996412ec4630ffb` | 6 | clean | RC2 |
| `cadenza-reference-system` | `fbefa9aaad5d3e4511e19a1c5f5e965c30bb9fc6` | `4d610e3d53a97d22effc6f8b677966c78fbeffc7` | 3 | clean | RC2 |

The workspace comparison predates this inventory and approval record. Every
candidate proof and artifact stage must refreeze the committed head it
actually uses.

## Changed-Purpose Classification

| Repository | Post-RC purpose |
| --- | --- |
| Workspace | public-lineage custody, proof orchestration, security evidence, operational guidance, and Sprint 10 governance |
| TypeScript core | actor API purpose repair, package and TypeDoc security repair, reference binding, and reviewed performance budget |
| Environment | removal of unused authority code and TypeScript declaration drift |
| Chamber | sender-side route selection and current plan-reference repair |
| Cell | sender-side route validation, supply restart custody, standalone fixtures, and launcher descriptor closure |
| Reference system | exact repaired-core binding and generated distributed artifact |

Elixir and C# have no post-RC source difference. Validation is required because
they consume shared semantic authority, but a new release identity would add
no information.

The first complete proof found one machine-sensitive Python throttling test.
The approved finding-driven repair replaces its wall-clock ceiling with
deterministic same-tag serialization and cross-tag progress evidence. Python is
therefore an affected RC2 repository at
`b15a306dbddf6168e0171f5fe5b468a050464375`.

## Candidate Identity

| Repository | Candidate version | Candidate tag |
| --- | --- | --- |
| Workspace | `2026.07-rc.2` | `distributed-foundation-rc.2` |
| TypeScript core | `4.0.0-rc.2` | `v4.0.0-rc.2` |
| Python | `0.1.0-rc.2` | `v0.1.0-rc.2` |
| Elixir | existing `0.1.0-rc.1` | existing `v0.1.0-rc.1` |
| C# | existing `0.1.0-rc.1` | existing `v0.1.0-rc.1` |
| Environment | `0.1.0-rc.2` | `v0.1.0-rc.2` |
| Chamber | `0.1.0-rc.2` | `v0.1.0-rc.2` |
| Cell | `0.1.0-rc.2` | `v0.1.0-rc.2` |
| Reference system | `0.1.0-rc.2` | `v0.1.0-rc.2` |

Package versions and repository tags are release identities. Python’s native
package version is `0.1.0rc2`. Chamber adapter,
Cell peer, launcher, activation issuer, and other protocol versions remain
unchanged. Elixir and C# remain the reused RC1 identities.

## Manifest Schema Finding

`release/manifest.schema.json` already permits each repository entry to carry
an independent non-empty version and tag. It imposes no aggregate version
uniformity and therefore represents a mixed RC1/RC2 repository set without
change.

No schema, shared contract, protocol, public API, architecture, or migration
amendment is required.

## Release-Tooling Findings

The current tooling has two RC1-specific assumptions:

1. candidate validation, artifact assembly, and manifest generation load
   `release/candidate.json` implicitly;
2. artifact assembly hard-codes RC1 package filenames.

The bounded workspace repair is to:

- preserve RC1 as a versioned candidate input;
- add a separate RC2 candidate input;
- require or accept an explicit candidate path;
- declare candidate package artifacts as structured metadata;
- validate built package versions and required filenames from that metadata;
- retain RC1 as the default only where compatibility is explicit and tested.

This changes release tooling, not product runtime or release-manifest meaning.

## Resolution

The workspace now:

- preserves `release/candidate.json` as the RC1 declaration;
- owns the mixed candidate at
  `release/candidates/distributed-foundation-rc2.json`;
- accepts an explicit candidate input in validation, assembly, and manifest
  generation;
- derives package filenames from package role and declared version;
- excludes repositories marked `reuse` from new source and package assembly;
- verifies that every reused repository HEAD is its declared existing tag;
- validates the current RC2 candidate across all nine repositories.

No release-manifest schema changed.

## Custody Exclusion

The untracked `docs/strategy/` tree and
`docs/agent-harness/exec-plans/completed/2026-07-28-restore-strategy-artifacts.md`
remain outside Sprint 10F. They must not be staged, exported, archived, or
classified as candidate evidence without explicit user direction.
