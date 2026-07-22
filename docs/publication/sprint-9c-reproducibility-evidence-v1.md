# Sprint 9C Reproducibility Evidence V1

Date: 2026-07-22

## Verdict

The official foundation builds and tests from source-only release workspaces
under pinned language runtimes. Deterministic contract snapshots, authority
artifacts, Python wheels, SBOMs, and Chamber rootfs assembly have repeatable
outputs. Privileged Linux evidence uses fresh PostgreSQL clusters and current
runtime artifacts rather than historical binaries.

This is a pre-publication clean-room proof. Sprint 9E will bind exact commits,
and Sprint 9F must repeat it from public unauthenticated clones before the
public release claim is final.

## Clean Package Proofs

| Repository | Result |
| --- | --- |
| `cadenza` | exact Node container: format, typecheck, `148` tests, build, and dry-run pack passed |
| `cadenza-python` | CPython `3.13.14` and `3.14.6`: `76` tests each; both builds produced wheel SHA-256 `1865349b629d5b7d7facb571480485d402e27f9795471fa941c3b9bd28afa191` with `SOURCE_DATE_EPOCH=315532800` |
| `cadenza-elixir` | exact Elixir/OTP and Hex: locked dependency check, format, warnings-as-errors, `61` tests, and Hex build passed |
| `cadenza-csharp` | exact .NET SDK: locked restore, format, Release warnings-as-errors, `38` tests, and pack passed |
| `cadenza-environment` | exact Node on clean Ubuntu with PostgreSQL `16.14`: strict install-script policy, typecheck, `107` tests, and build passed |
| `cadenza-chamber` | Ubuntu/Rust: adapter typecheck/build, format, strict all-target Clippy, complete ordinary tests, source/prebuilt gateway and hostile supervision passed |
| `cadenza-cell` | Ubuntu/Rust: format, strict all-target Clippy, complete ordinary suite, process, protocol, peer, and integrated multi-Chamber tests passed |
| `cadenza-reference-system` | exact packed TypeScript core artifact: typecheck, `9` business, specialized, and artifact-determinism tests, and build passed in an isolated copy |

## Contract And Generated Authority

- Six shared snapshot bundles are repo-local, match their authorities, and pass
  `scripts/check-contract-snapshots.mjs` without reaching the workspace root.
- The current authority gateway artifact reproduces as
  `sha256:8ba7d52b0e191626ec8d44b142ca99f316f2148d4533c0329b5e68cde2ce51e4`.
- The bootstrap conformance fixture was regenerated from that artifact and
  propagated to Chamber and Cell.
- Seven normalized CycloneDX source SBOMs regenerate byte-identically with
  Syft `1.49.0`. They were regenerated twice after the final Sprint 9C source
  changes and remained byte-identical.

## Empty Database And Authority Shape

The definitive scale proof started PostgreSQL `16.14` from a new `initdb`
directory with no Cadenza schema or roles. Bootstrap applied `15` checksummed
migrations from `001_bootstrap_authority.sql` through
`015_actor_failure_and_lifecycle.sql`.

The resulting authority contained:

- `8` Cadenza schemas and `109` tables.
- environment `environment.local.primary` at bootstrap state `handoff_ready`
  and operational state `operational`.
- one fenced reconciliation takeover at lease epoch `2`.
- `1,642` durable execution-evidence records after the scale/stem/supply run.
- no running gVisor container, launcher bundle, Cell, Chamber, activation
  issuer, or supply process after teardown.

The complementary actor run used a second new cluster and ended with two actor
assignment epochs, three durable mutation commits, and actor state
`{"count":3}` at state version `3` under assignment epoch `2`. It retained
`991` durable evidence records and also left no runtime process, bundle, or
container.

## Reproducible Rootfs

`cadenza-cell/scripts/build-gvisor-rootfs.sh` now owns rootfs assembly. Two
independent runs from the same explicit inputs were directory-identical. The
final measured rootfs digest was
`sha256:ccbdf7bb35a6fc2d1cccaed8d75c13e983bbdffbc5b51d46d00537bf53b2ecee`.

Measured component SHA-256 values were:

- Chamber: `9851d9d5a64c03a3c06460ddc4a344cb8c9c4d10a2abeb7b82ac3195f974d8b8`.
- Node `24.18.0`: `6bf69d0eda41a12030d5f28d958cd09ce323bc0c13f1ab4d8bb426933aa08812`.
- TypeScript core: `4d3fa4699480afa1cd89d5a4afc3287c5e4391fab4636d5d78ad136f3a57438f`.
- adapter artifact manifest: `93ca68bd3e11557a3563fdf39dc695b8ed4b25c5b8d5528712df3458bd7dadd2`.
- adapter lock: `1b07ea4b66608848bb9da39adac853c3b6b51ff6ea8b75e6427c12772a25b94a`.

The first assembly attempt preserved group-writable executable bits from two
npm artifact files and was rejected by `LauncherPolicy::digest_rootfs`. Static
measurement of the over-corrected read-only tree then passed while live adapter
startup failed. The assembler now makes every file immutable and restores
execute permission only for runtime binaries and declared TypeScript tool
entrypoints. The narrow gVisor fixture also exposed that its obsolete launcher
transferred protocol fd `3` but not current execution-custody fd `4`; after the
fixture was repaired to model the real launch contract, the atomic transition
passed in `42.27s` with durable custody.

## Privileged System Proof

- real process/PostgreSQL atomic operational transition: passed in `27.24s`.
- assembled-rootfs gVisor atomic transition with durable custody: passed in
  `42.27s`.
- scale, stem loss, PostgreSQL role outage, demand supply, drain, fresh
  generation, evidence custody, and cleanup: passed in `479.41s`.
- two-Cell actor owner replacement, reassignment, hydration, continued mutation,
  exact reference pricing, evidence, and cleanup: passed in `443.85s`.

The definitive two-Cell run authority-bound reference artifact
`sha256:a36e4c7cd0448579dc5fbc6a35ab05154881425b5334e982963a85b0ed680b20`,
materialized it in a measured Chamber, routed its entry task from the source
Cell to the target Cell, and returned the expected EUR `14,000` cents result.
It finished with actor state `{"count":3}` at version `3`, assignment epoch
`2`, and `1,173` durable execution-evidence records.

Expected role outage surfaced as `ProviderUnavailable` and deferred
reconciliation. Recovery resumed authority work; no semantic denial was
misclassified as retryable success.

## Remaining Repetition Gates

- bind every result to exact clean commits and release artifacts in Sprint 9E.
- repeat the release proof from public unauthenticated clones in Sprint 9F.
