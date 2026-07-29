# Sprint 10F RC2 Publication Decision V1

Date: 2026-07-28

## Status

`approved`

The local optional RC2 candidate is complete, reproducible, and unpublished.
The user approved Sprint 10F closure and publication on 2026-07-28 with:
`approved. we can proceed with publication`

The user approved the publication CI repair and affected-scope replacement
freeze on 2026-07-28 with:
`Sprint 10F RC2 publication CI repair and affected-scope replacement freeze`.

Publication remains limited to the exact frozen scope in this record and the
approved publication decision. Package registries remain excluded.

## Frozen Candidate

- release key: `cadenza-distributed-foundation-rc2`;
- candidate declaration:
  `sha256:0fefa841546cc65399be9cc172463f89ebe58a7d8495e8b9c54cba32b944d74f`;
- aggregate manifest: external attestation generated after the public
  candidate commit and published with the workspace prerelease;
- public workspace commit: recorded by that external aggregate manifest;
- artifact inventory: 7 source archives, 6 installable packages, and 3
  generated runtime artifacts;
- registry publication: `false`.

The artifact tree and manifest were assembled twice with byte-identical
results. The manifest validates against
`release/manifest.schema.json` using JSON Schema Draft 2020-12.

## Replacement Freeze

Protected review exposed publication-input defects rather than runtime
behavior defects. The approved repair preserves failed reviews as evidence,
uses a new Core branch instead of rewriting remote history, and pins
cross-repository CI to exact candidate commits before tags exist.

| Repository | Repaired candidate commit |
| --- | --- |
| `cadenza` | `a4384818a777d4ff85341bbe5d91d1c9c8c12ee3` |
| `cadenza-environment` | `96054f583e41df9341a219955c7e1c19acb63c13` |
| `cadenza-chamber` | `c22d34ccb6a10f3fc1f89e416be8ee5e770089cd` |
| `cadenza-cell` | `29bcbefe0130a28155a7af21fc19d27ff8fb82a9` |
| `cadenza-reference-system` | `8426e2d9674298ccd54cafbb85204fbbb52ab851` |

Workspace identity is intentionally recorded only by the external manifest
generated after this public candidate commit. Python remains at its frozen RC2
commit. Elixir and C# remain at their signed RC1 commits.

## Proposed New Identities

| Repository | Version | Proposed tag |
| --- | --- | --- |
| `cadenza-workspace` | `2026.07-rc.2` | `distributed-foundation-rc.2` |
| `cadenza` | `4.0.0-rc.2` | `v4.0.0-rc.2` |
| `cadenza-python` | `0.1.0-rc.2` | `v0.1.0-rc.2` |
| `cadenza-environment` | `0.1.0-rc.2` | `v0.1.0-rc.2` |
| `cadenza-chamber` | `0.1.0-rc.2` | `v0.1.0-rc.2` |
| `cadenza-cell` | `0.1.0-rc.2` | `v0.1.0-rc.2` |
| `cadenza-reference-system` | `0.1.0-rc.2` | `v0.1.0-rc.2` |

Elixir and C# remain referenced through their existing signed
`v0.1.0-rc.1` tags. They must not receive RC2 tags or replacement assets.

## Evidence For Approval

- [definitive proof closure](./sprint-10f-definitive-proof-closure-v1.md);
- [security and coherence review](../security/sprint-10f-security-coherence-review-v1.md);
- [source and candidate inventory](./sprint-10f-source-candidate-inventory-v1.md);
- [publication CI repair evidence](./sprint-10f-rc2-publication-ci-repair-v1.md);
- exact fast, complete, privileged, timing, and memory reports under
  [`evidence/sprint-10f/`](./evidence/sprint-10f/).

The review found no open security finding and no required product repair.
Retained product limits are explicit in the closure and are not represented as
completed features.

## Actions Requiring Separate Approval

A future publication action would require explicit approval for this exact
scope:

1. push each affected repository commit through its existing review path;
2. publish the curated workspace commit through its public-lineage review path;
3. wait for every declared required check on the exact reviewed heads;
4. create seven signed annotated tags listed above;
5. create the corresponding GitHub prereleases;
6. attach only the manifest-declared source, package, and generated assets;
7. create detached Ed25519 signatures for the aggregate manifest and published
   release assets;
8. verify public unauthenticated clones, tags, signatures, assets, checksums,
   documentation navigation, and release links;
9. record the resulting public evidence in a post-publication governance
   commit.

Package registries remain out of scope. No npm, PyPI, Hex, NuGet, or crates.io
publication is proposed.

## Current Boundary

No tag, signature, release, upload, push, branch update, protection change,
registry publication, or GitHub mutation has occurred for RC2.

The candidate may now be:

- approved for a separately designed publication pass;
- retained locally for more review;
- rejected without affecting immutable RC1.
