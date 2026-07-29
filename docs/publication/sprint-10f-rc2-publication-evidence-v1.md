# Sprint 10F RC2 Publication Evidence V1

Date: 2026-07-29
Status: complete

## Published Boundary

Cadenza Distributed Foundation RC2 is public at:

`https://github.com/cadenzaio/cadenza-workspace/releases/tag/distributed-foundation-rc.2`

RC2 advances Workspace, TypeScript Core, Python Core, Environment, Chamber,
Cell, and the Reference System. Elixir and C# remain bound through their
immutable signed RC1 tags. RC1 was not changed.

Publication includes public GitHub source, seven signed RC2 tags, seven GitHub
prereleases, one aggregate manifest, 16 manifest-bound artifacts, and detached
signatures. npm, PyPI, Hex, NuGet, crates.io, containers, deployments, Memory,
CLI, observer UI, managed UI, and agent surfaces remain unpublished.

## Repository And Release Identities

| Repository | Frozen commit | Merge commit | Signed tag object | Release ID |
| --- | --- | --- | --- | ---: |
| `cadenza-workspace` | `90df7af273b4415c76f3351ce43153659343e183` | `0fea3001903f62cff6645b458556cd77b46cb737` | `b3cfb158e889fb3f0bc63eb77675a1fe643ea146` | `361448342` |
| `cadenza` | `a4384818a777d4ff85341bbe5d91d1c9c8c12ee3` | `5f04b16524a9602e486c6a7d985bf2b838daad29` | `4d8b5bd504367c0ea75002fa25062c4f158bb131` | `361448263` |
| `cadenza-python` | `b15a306dbddf6168e0171f5fe5b468a050464375` | `8ebf89fc04c17206d7c26080f54b36319e70d872` | `00d4d2f281c2ba41f3e419ec7fd9e016d6a18bc7` | `361448269` |
| `cadenza-environment` | `96054f583e41df9341a219955c7e1c19acb63c13` | `d52aeb2a927597eb0d7df3a6ca0b2005b8f034e5` | `d16c377450417d084671f28ff5dbc6ab64c3f613` | `361448273` |
| `cadenza-chamber` | `c22d34ccb6a10f3fc1f89e416be8ee5e770089cd` | `b85aa4250963cbd912490f2bf4030c8b797e32ed` | `6e06eef6ebbd5668cb052f195a5e6fb69f3dc411` | `361448281` |
| `cadenza-cell` | `29bcbefe0130a28155a7af21fc19d27ff8fb82a9` | `a0df44fd60953ae72b7d3b16fd37f964f1b8e43f` | `14e6f92db1c9a0b18da1ef545a6502954e2601fd` | `361448284` |
| `cadenza-reference-system` | `8426e2d9674298ccd54cafbb85204fbbb52ab851` | `7f34f8e007775d3e0a49997f95055b86029ab30d` | `e6b18b714efa9a5209dd49b531c1a6313a4c57b6` | `361448290` |

Every frozen commit is an ancestor of public `main`. Merge commits advanced
governance history without moving the signed release identities.

## Manifest And Signing

- Aggregate manifest:
  `sha256:cc1c41ce6944a4b84380f4222d3952c46889d9fc9dd7b0d7444e05b906127055`.
- Candidate declaration:
  `sha256:0fefa841546cc65399be9cc172463f89ebe58a7d8495e8b9c54cba32b944d74f`.
- Signing fingerprint:
  `SHA256:CKuolHRVrIgU2TJm+lDs9TyVvrvwy25r8EqBVJzQ2Bg`.
- Aggregate assets: `38`.
- Signed inputs: `19`, each with one detached SSH signature.
- Manifest-bound artifacts: `16`; every byte size and SHA-256 digest matches.
- The same dedicated passphrase-protected Ed25519 release identity used for
  RC1 signs RC2; the key remained outside source and release artifacts.
- Registry publication remains `false`.

The workspace aggregate prerelease owns all 38 custody assets. Component
prereleases carry no duplicate assets and point readers to the aggregate
compatibility authority.

## Protected Publication

All affected pull requests merged only after their declared CI and DCO checks
passed. A bounded, user-approved linear-history exception preserved the exact
candidate commits through merge commits. Full protection documents were
snapshotted before the exception and restored byte-equivalently afterward.

All nine repositories now report:

- strict required status checks;
- required pull requests and resolved conversations;
- administrator enforcement;
- required linear history;
- disabled force pushes and branch deletion.

| Repository | Required contexts |
| --- | --- |
| `cadenza-workspace` | `governance`, `release-metadata`, `DCO` |
| `cadenza` | `core`, `lint`, `DCO` |
| `cadenza-python` | `core (3.13.14)`, `core (3.14.6)`, `DCO` |
| `cadenza-elixir` | `core`, `DCO` |
| `cadenza-csharp` | `core`, `DCO` |
| `cadenza-environment` | `environment`, `DCO` |
| `cadenza-chamber` | `chamber`, `DCO` |
| `cadenza-cell` | `cell`, `DCO` |
| `cadenza-reference-system` | `reference-system`, `DCO` |

## Outside-In Verification

A credential-empty public HTTPS verification completed:

1. downloaded all 38 aggregate assets and matched unauthenticated GitHub
   metadata to every downloaded byte;
2. verified the manifest, published key fingerprint, all 16 artifact digests,
   and all 19 detached signatures;
3. cloned all nine repositories, verified every signed tag, exact tag target,
   ancestry from `main`, Git object integrity, and tracked source-tree digest;
4. validated the 415-file public workspace, seven contract bundles, 78-file
   documentation authority, and 28-diagram architecture atlas;
5. installed the downloaded TypeScript Core tarball under Node `24.18.0`,
   passed reference typecheck and build, passed nine business-flow tests, and
   reproduced the distributed pricing artifact at
   `sha256:f128946cba37e65eb77d7f0c81182798cf603a7a0aaa2cf96c15e96f566fbeb2`;
6. installed the downloaded Python wheel under Python `3.13.14` and `3.14.6`
   and verified its public core API;
7. compiled the downloaded Chamber crate under Rust `1.97.0` and passed all ten
   packaged tests; and
8. installed and imported the three downloaded Environment packages, exposing
   their declared public APIs without registry publication.

## Closure

Sprint 10F RC2 publication is complete. The release is public, signed,
checksum-bound, reproducible, protected, and independently consumable from its
published artifacts. It remains a release candidate with no production SLA,
and the documented runtime, security, language-adapter, and operational limits
remain in force.
