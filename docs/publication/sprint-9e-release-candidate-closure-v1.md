# Sprint 9E Release Candidate Closure V1

Date: 2026-07-22
Status: superseded on 2026-07-22 by the public-index refreeze

## Verdict

Sprint 9E is ready for release-candidate freeze approval. Nine local
DCO-signed repository commits, 20 release artifacts, eight package artifacts,
three generated runtime artifacts, six contract-bundle digests, exact
protocol/schema compatibility, and pinned toolchains are bound by one
distributed-foundation manifest. No GitHub repository, tag, release, branch
protection, or package registry has been mutated.

## Frozen Commits

| Repository                 | Version        | Commit                                                                     |
| -------------------------- | -------------- | -------------------------------------------------------------------------- |
| `cadenza-workspace`        | `2026.07-rc.1` | Bound by the external manifest after this report enters the curated commit |
| `cadenza`                  | `4.0.0-rc.1`   | `4851bb576eeeab31abf5e4b01f7d93ffd85af2fb`                                 |
| `cadenza-python`           | `0.1.0-rc.1`   | `9fd99a0a7e9533163a2952fed526d35fb100f307`                                 |
| `cadenza-elixir`           | `0.1.0-rc.1`   | `d1dd15f1802d108023384cab39d234aaf259f114`                                 |
| `cadenza-csharp`           | `0.1.0-rc.1`   | `d294e535aa0dfad91123c9d14ad6e3aa8c5b4cb2`                                 |
| `cadenza-environment`      | `0.1.0-rc.1`   | `b5b3b0e0b967d8c500fe23ba642676f2af7cbeab`                                 |
| `cadenza-chamber`          | `0.1.0-rc.1`   | `2824e432b98215c1738583c34b3d0bcb5d0e1cdc`                                 |
| `cadenza-cell`             | `0.1.0-rc.1`   | `145685d735d1d44587c8bd696d0514906f31420c`                                 |
| `cadenza-reference-system` | `0.1.0-rc.1`   | `3b788ccf26c7466a7d62af3decce04dce2f74dd1`                                 |

The TypeScript repository preserves its prior history. The other eight public
repositories use reviewed clean initial histories. All commits are on the
local `codex/sprint-9e-release-candidate` branch.

## Artifact Manifest

- Candidate metadata digest:
  `sha256:fb000ad25a00edbb0c8e6ff8c9887a42e6865680a854896a6673c4f22fdb9b3a`.
- The final curated-workspace commit and frozen-manifest digest are recorded in
  the approval record and the external manifest. Embedding either value here
  would make the workspace commit self-referential.
- Manifest location for local review:
  `/tmp/cadenza-distributed-foundation-rc1-manifest.json`.
- Bounded artifact directory for local review:
  `/tmp/cadenza-release-artifacts-rc1`.
- Contents: nine source archives, eight package artifacts, and three generated
  runtime artifacts.

The complete artifact set was assembled twice. Directory comparison and
manifest comparison were byte-identical. The manifest conforms to
`release/manifest.schema.json`; all 20 recorded byte sizes and SHA-256 digests
were independently recalculated and matched.

## Package Digests

| Artifact                        | SHA-256                                                            |
| ------------------------------- | ------------------------------------------------------------------ |
| TypeScript core tarball         | `5cf06ac31f859e64c2fb85a4faf22dda75d50b8b5a49d8f2883a7b714e0207dc` |
| Python wheel                    | `e516f2a01928829ba63a0e22ad2cdddb945bfa186b1c24cb554dae16e5656261` |
| Elixir Hex archive              | `2dbc65cbf773cdccb412aa7b2bdd415232feb27c07bc5a6db8b5f304fff17d7d` |
| C# NuGet package                | `f3258b28bed814339c64164e4b733b8cada9ca6095fec4f0e5cd19eafbd22118` |
| Environment authority contracts | `95627471d66f64107d170c5ee3b513d6d1f6727aaa8a7a505d8160c71a1e6875` |
| Environment authority gateway   | `85ba954fec53b3ee417392da2b366d9f3ea77dc13e42b9362be1224bf65fc09d` |
| Environment bootstrap           | `b72023a23561ea50f8bb64da4333c5b95df475fc7fcc44a8ed97737c0dd7e393` |
| Chamber crate                   | `ebd0773fcdd6aad8149f694349e4e1c1436ee48c04702f7425a2570c3dcf222f` |

## Validation Results

| Gate                     | Result                                                                                                                                                                             |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Governance and licensing | Canonical Apache-2.0 license, contribution, DCO, conduct, support, security, ownership, issue, and release files validated in all nine repositories.                               |
| CI authority             | All ordinary workflows are read-only, use commit-pinned actions, expose declared required jobs, and have no publication authority.                                                 |
| Dependencies             | Yarn, npm, Hex, NuGet, Chamber Cargo, and Cell Cargo advisory checks passed; NuGet deprecation check passed; Python has no runtime dependency.                                     |
| Public workspace         | Exactly 324 allowlisted files entered the clean public commit; private paths, Memory, CLI, legacy implementation, child repos, caches, and private workflow history were excluded. |
| Contracts and diagrams   | Six snapshot bundles match; public links pass; all 28 architecture diagrams and their catalog validate.                                                                            |
| Packages                 | TypeScript, Python, Elixir, and C# clean-consumer package proofs pass. Environment internal package assembly and Chamber crate verification pass.                                  |
| Reference system         | Exact Node `24.18.0` install, typecheck, nine tests, build, and distributed artifact regeneration pass against the final core tarball.                                             |
| Python reproducibility   | Python `3.13.14` and `3.14.6` produce the same wheel bytes under the fixed `SOURCE_DATE_EPOCH`.                                                                                    |
| Manifest                 | Nine commits, compatibility set, generated artifacts, contract bundles, and 20 release artifacts are bound and reproduce byte-for-byte.                                            |

## Publication Boundaries

- GitHub source publication remains the only authorized publication target for
  this candidate. Package registries remain separately gated.
- Environment packages, the Chamber TypeScript adapter, and the reference
  system remain private package identities despite public source.
- Cell is a GitHub source release in RC1 because its exact Chamber dependency
  is not available through crates.io.
- TypeScript is the only Chamber adapter. Python, Elixir, and C# are portable
  core implementations, not distributed adapters.
- The release is an RC with no production SLA and no Cadenza 3.x, legacy
  service/database, CLI, demo, or arbitrary prerelease compatibility promise.
- Definitive public clean-clone, Linux/gVisor, PostgreSQL, distribution,
  recovery, cleanup, and unauthenticated-view proof remains Sprint 9F.

## Approval Gate

The user approved Sprint 9E closure and release-candidate freeze on 2026-07-22.
The approved curated-workspace commit is
`06f6f49453f41874afbb442cab6558bb0ec75a1f`; the approved external manifest
digest is
`sha256:14b706369e8f682279f7f07ff35eef8050212c7c35096511bf0259d98800b2ec`.

This approval authorizes Sprint 9F definitive proof and final publication
review. It does not itself authorize publication. Any source change creates a
new candidate manifest and requires the affected Sprint 9E checks to be
repeated.

The first archive-only Sprint 9F check found public navigation links to
excluded private documents. That finding invalidated only the curated workspace
commit and manifest; the eight implementation/reference commits and package
artifacts remain unchanged. The replacement gate is
[Sprint 9E Public Index Refreeze V1](./sprint-9e-public-index-refreeze-v1.md).
