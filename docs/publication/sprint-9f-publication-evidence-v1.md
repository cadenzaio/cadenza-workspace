# Sprint 9F Publication Evidence V1

Date: 2026-07-23
Status: complete

## Published Boundary

The distributed-foundation RC1 is public under the personal GitHub owner
`cadenzaio`. The aggregate release is:

`https://github.com/cadenzaio/cadenza-workspace/releases/tag/distributed-foundation-rc.1`

The release publishes nine source repositories, nine signed annotated tags,
nine GitHub prereleases, one aggregate manifest, and signed release assets. It
does not publish npm, PyPI, Hex, NuGet, crates.io, containers, deployments,
Memory, CLI, managed UI, or agent surfaces.

## Repository And Release Identities

| Repository | GitHub ID | Signed tag object | Frozen commit | Pre-evidence governance baseline | Release ID |
| --- | ---: | --- | --- | --- | ---: |
| `cadenza-workspace` | `1310097315` | `078f22270b5746eae23f0ad424fedcb130db41aa` | `60994b88fcd98d2db45f240b6bce8a12fe28d70e` | `61dcc16b59edd4fa17e8134f052f7f4ed44fcb68` | `358985696` |
| `cadenza` | `1026746399` | `b9cfcca62b81dc06a1857391599608120a722bc1` | `f936045b5710e40db272435b6cf68741803824e6` | `d2696d05129ae70bbda9805669809af10a6a4ff4` | `358985594` |
| `cadenza-python` | `1310096973` | `421de3bac00576ca58cd5588059a467232466e41` | `9fd99a0a7e9533163a2952fed526d35fb100f307` | same as frozen | `358985596` |
| `cadenza-elixir` | `1310097027` | `25cdd5c6fbd1fdd9dd9b2d89031a5c41ff7eb98b` | `d1dd15f1802d108023384cab39d234aaf259f114` | same as frozen | `358985607` |
| `cadenza-csharp` | `1310097077` | `3732a452796a6a31640c672687baafa4689047f3` | `d294e535aa0dfad91123c9d14ad6e3aa8c5b4cb2` | same as frozen | `358985613` |
| `cadenza-environment` | `1310097118` | `450c7b0c38c2ca15cd9c3c6007adb2fff07614b0` | `de8dd66ea8dd87613c15120b1d4ce5b4f38bbd47` | same as frozen | `358985623` |
| `cadenza-chamber` | `1310097164` | `3a068a548c7d179f7a40be90204ea84ae8bc6000` | `3bc0dfa23d7c5fd16baf4a29f584127003cc2d5b` | same as frozen | `358985627` |
| `cadenza-cell` | `1310097214` | `ade713d39fda1cdbe537b2e3c83c2100e4adb5a6` | `a9b5e168f4c29e7579657c563242a15ca0ba473c` | same as frozen | `358985632` |
| `cadenza-reference-system` | `1310097258` | `3027c2c4e5a50fe211833edc64c2c1235485ae86` | `fbefa9aaad5d3e4511e19a1c5f5e965c30bb9fc6` | same as frozen | `358985635` |

Core and Workspace each contain one protected post-tag governance commit before
this evidence was appended. Publishing closure evidence necessarily advances
Workspace `main`, so this table does not make a self-referential mutable-head
claim. The signed RC1 tags and aggregate manifest remain the immutable
compatibility authority; neither tag nor any release asset moved.

## Manifest And Signing

- Aggregate manifest:
  `sha256:184cbb7dcdd606f52991a6848633bce25ec18235af6f554ac2561627edc56590`.
- Candidate metadata:
  `sha256:fb000ad25a00edbb0c8e6ff8c9887a42e6865680a854896a6673c4f22fdb9b3a`.
- Signing fingerprint:
  `SHA256:CKuolHRVrIgU2TJm+lDs9TyVvrvwy25r8EqBVJzQ2Bg`.
- Aggregate release assets: `46`.
- Signed inputs: `23`, each with one detached SSH signature.
- Manifest-bound release artifacts: `20`; every byte size and SHA-256 digest
  matches.
- All nine annotated tag signatures and all 23 detached signatures verify
  against the published Ed25519 key.
- Registry publication remains `false`.

## Repository Controls

All nine repositories use protected `main` with strict required checks,
pull requests, zero approving reviews for the single-maintainer phase, stale
review dismissal, resolved conversations, linear history, administrator
enforcement, and disabled force pushes and deletion.

| Repository | Required API contexts |
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

GitHub Actions App ID `15368` owns CI contexts. DCO App ID `1861` owns `DCO`.
Temporary proof pull requests demonstrated every context and were closed; all
temporary branches were removed. Private vulnerability reporting, secret
scanning, and push protection are enabled in every official repository.

The approved governance ratchet requires one independent approval before a
second write authority or multi-maintainer claim.

## Legacy And Private Boundaries

The preserved private workspace archive has GitHub ID `1174853611`, private
head `8aae264179e50cdb05cb0ed807a812ee0937b37e`, and remains private. An
unauthenticated API request returns `404`, and unauthenticated Git access
cannot discover it.

These public legacy repositories carry the exact pre-v4 warning, link to the
current workspace, and are archived:

| Repository | Final notice commit |
| --- | --- |
| `cadenza-service` | `bccff4214b78afd99e7b1944d6e0c5091631f55f` |
| `cadenza-db` | `7e64605cfdacfb80f5897199ac66bd9ba540f8a6` |
| `cadenza-ui` | `2e786ceea6e9005f1da09a05983fe2f209e56576` |
| `cadenza-console` | `dcb518550d6e81d70fe7167108752d6522d73aad` |
| `cadenza-demo-2` | `67391a55f40000a48398d9a1d3ffea456a1762c2` |

Each notice commit carries DCO sign-off and verifies cryptographically against
the dedicated Ed25519 key. GitHub's account badge is not the verification
authority because the commit email maps to a different personal account than
the account holding the release key.

## Unauthenticated Verification

A credential-empty environment completed these checks from public HTTPS
surfaces:

1. cloned all nine repositories and checked out every signed RC1 tag;
2. verified all tag signatures, tag targets, ancestry, Git object integrity,
   and nine source-tree digests;
3. downloaded all 46 aggregate assets and verified all 23 detached signatures,
   GitHub byte sizes, and 20 manifest artifact digests;
4. confirmed all nine prereleases are public and all nine `main` branches
   report protected;
5. validated both the 354-file tagged workspace and 356-file current workspace,
   seven contract bundles, 67-file documentation authority set, and 28-diagram
   architecture atlas;
6. executed clean downloaded-package consumers under Node `24.18.0`, Python
   `3.13.14` and `3.14.6`, Elixir `1.17.3`/OTP 27, .NET SDK `10.0.302`, and
   Rust `1.97.0`;
7. compiled and ran the downloaded Chamber crate, including ten packaged unit
   tests; and
8. rebuilt the complete reference-system consumer from public tags: typecheck,
   build, nine business/specialized-task tests, and the distributed pricing
   artifact all passed.

The reproduced distributed pricing artifact remains
`sha256:9b9f1118e5313ac9867cec4bba9162296df5b2d2515ae6b1085dc9a51538b3a1`.
Unauthenticated readers can still view every archived legacy warning.

## Closure

Sprint 9F publication is complete. The public result is a governed,
reproducible distributed-foundation release candidate with immutable signed
release identities, explicit post-tag governance evolution, protected
repositories, confidential vulnerability intake, archived legacy direction,
and outside-in consumer proof.

RC1 remains a release candidate with no production SLA. Package registries,
deployment, Memory, CLI, managed-product UI, and agent integration remain
separately gated.
