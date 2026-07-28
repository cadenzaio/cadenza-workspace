# Sprint 10F Definitive Proof Closure V1

Date: 2026-07-28

## Status

Sprint 10F implementation is complete and `review_needed`.

The local mixed RC1/RC2 candidate is recommended for closure review. This
record does not approve publication, signing, tags, releases, uploads, branch
changes, registry publication, or any other GitHub mutation.

## Candidate

The aggregate candidate is
`cadenza-distributed-foundation-rc2`.

Affected RC2 identities:

- workspace: `2026.07-rc.2`;
- TypeScript Core: `4.0.0-rc.2`;
- Python Core, Environment, Chamber, Cell, and reference system:
  `0.1.0-rc.2`.

Elixir and C# remain on their existing signed `0.1.0-rc.1` identities. This
avoids version churn without hiding their participation in complete
cross-language validation.

## Definitive Proof

All three reports bind proof manifest
`sha256:e68ca9a3cba791e98ffdd3a006a8fb50529fe999e517bb1da0ffd268e0a3d721`.

| Tier | Result | Duration | Report SHA-256 |
| --- | --- | ---: | --- |
| Fast | passed | `19.669s` | `1c4437014b6f410c8bfab721af344b8487491bfc5b1f9cf08a90e788a6710599` |
| Complete | passed | `296.512s` | `82e11d823e7dca12efedc98680d5dee277b47205c9e5a72c92eb29e30ed6f1de` |
| Privileged hardening | passed | `1168s` | `c459b5f715200a46c601188a4efdb71661fb650d8efbe63e9afeba9851a765be` |

The exact reports are retained under
[`evidence/sprint-10f/`](./evidence/sprint-10f/).

### Complete Coverage

The complete proof passed 30 stages:

- workspace governance, public documentation, contracts, and release metadata;
- TypeScript format, typecheck, 148 tests, build, docs, package smoke, and
  dependency audit;
- Python 3.13 and 3.14 tests plus byte-identical package smoke;
- Elixir dependency, compile, format, 61-test, and package checks;
- C# format, warning-free build, 38 tests, advisory checks, and NuGet consumer;
- Environment frozen installs, typecheck, 112 tests, builds, audits, and three
  package consumers;
- Chamber adapter, Rust, hostile boundary, package, and RustSec validation;
- Cell Rust, routing, peer, journal, supply, actor, documentation, and real
  multi-Chamber validation;
- exact clean reference-system consumption and distributed artifact rebuild.

Cell is intentionally a public source package rather than a crates.io package.
`cargo package` is therefore inapplicable while its exact Chamber dependency is
an unpublished local candidate; all source, compile, test, documentation, and
privileged consumer paths passed.

### Privileged Coverage

The hardening profile used a clean detached source assembly in the approved
`cadenza-gvisor` Lima environment:

| Scenario | Result | Duration |
| --- | --- | ---: |
| Two real Cells converge through database authority | passed | `348s` |
| Desired replica state supplies and releases pre-enrolled Cells | passed | `333s` |
| Stem loss advances authority and resupplies fresh capacity | passed | `365s` |

The proof started from measured Core, Environment, Chamber, adapter, rootfs,
Node, and reference inputs and completed its declared resource cleanup.

## Performance Evidence

Three independent Core timing runs and three independent memory runs used the
exact Node `24.18.0` Apple M1 Pro budget identity.

Both advisory reviews report `within_budget`. Representative timing ranges
include:

- one-task graphs: approximately `14.9k` to `20.3k` operations per second;
- ten-task graphs: approximately `2.7k` to `6.7k` operations per second;
- signal delivery: approximately `9.4k` to `11.8k` operations per second;
- retry lifecycles: approximately `238` to `269` operations per second.

Retained memory remained approximately `0.12` to `0.23 MiB` across the reviewed
completed-operation workloads. These are machine-specific distributions, not
correctness gates.

## Package Evidence

Six affected installable artifacts were built twice from clean committed
sources and reproduce byte-for-byte:

| Artifact | SHA-256 |
| --- | --- |
| `cadenza.io-core-4.0.0-rc.2.tgz` | `dd2a83eb0f797cc10597a8f0095ba6cab8bc5e74a8bcbe22f9aef5d9c7a9af3b` |
| `cadenza_python-0.1.0rc2-py3-none-any.whl` | `00a636df8b647097b3805e97fe592c6b501284f27908459a2964a4955c222a2d` |
| `cadenza.io-environment-authority-contracts-0.1.0-rc.2.tgz` | `c2f0caf056f3b655459476370c5748ced6a61c94b39645a6cedd5d2ecc81c13b` |
| `cadenza.io-authority-gateway-0.1.0-rc.2.tgz` | `ff304f5dc9d8b3528363fafdbbb482792a6e83dae75ba7a86ae19e38ce36ccf3` |
| `cadenza.io-environment-bootstrap-0.1.0-rc.2.tgz` | `a5811ebc62eb80ea0e5ce7af8da24f93061ce185b35cc0eaf4c8d2f265b38d57` |
| `cadenza-chamber-0.1.0-rc.2.crate` | `ec9b726c112558969e4672d9929619f14b27c5e4f230326763ed2e11b53759b2` |

Generated runtime identities remain exact:

- authority gateway:
  `sha256:e57f71f25986638703acf876fa2d4b6881f8e26960a4a0e1744110930d9a6be7`;
- TypeScript Chamber adapter:
  `sha256:3fc2e50a73ee3e0e7e6fc2f88697c194925b500dac7f0863efc1ded1136cc5e1`;
- distributed reference pricing artifact:
  `sha256:f128946cba37e65eb77d7f0c81182798cf603a7a0aaa2cf96c15e96f566fbeb2`;
- reference Core runtime module:
  `sha256:26b4f78288e0a15a749af46af7524f3446b64292f4f9843ecb14c0947417bdf0`.

## Supply Chain And Provenance

- Seven CycloneDX SBOMs regenerate byte-identically with Syft `1.49.0`;
  only Environment, Chamber, and Cell advance first-party RC2 identities.
- Dependency, retired-package, and vulnerability checks are clean.
- Gitleaks `8.30.1` found zero confirmed secret across all official histories.
- Candidate workflows remain read-only and full-SHA pinned.
- Every affected commit verifies with the dedicated Ed25519 key and DCO.
- Reused Elixir and C# identities retain verified signed RC1 tags and DCO.

The
[security and coherence review](../security/sprint-10f-security-coherence-review-v1.md)
contains the recursive boundary assessment.

## Evidence Layering

The executable proof reports bind root commit
`a9185048e834775c144017f9cf5527b4c501f8d4` and the exact child commits listed
in the security review. The complete and fast reports truthfully mark the root
worktree dirty because the preserved, unrelated `docs/strategy/` user work was
present; no proof command reads that untracked scope.

The privileged proof used isolated clean worktrees and records every source as
clean. Root commit `8603bbf` follows the executable freeze only to refresh
affected SBOM projections. This documentation and retained evidence follow as
post-proof governance. None changes executable source, contract, protocol,
migration, generated runtime artifact, or proof behavior, so rerunning
privileged containment would add cost without testing a changed boundary.

Final source archives and the aggregate manifest are emitted after this
governance commit. Their exact external digest belongs to the post-freeze
publication decision package rather than the source commit they identify.

## Coherence Conclusion

Sprint 10 now has a credible consolidated baseline:

- the core remains purpose-only and persistence-agnostic;
- four language cores express one primitive contract;
- authority, containment, distribution, replica routing, scale, evidence,
  actor residency, and recovery compose across explicit boundaries;
- realistic business flows consume built artifacts;
- operational meaning remains truthful under failure;
- release identities advance only when their source or artifact changed.

No dead purpose, duplicate authority, hidden affect, weak custody, unjustified
fragmentation, or unresolved security finding was found.

## Retained Limits

- TypeScript is the only Chamber adapter.
- Chamber business execution is serialized.
- Cell PostgreSQL transport is local-only.
- Production installer, SLA, observer UI, CLI, Memory, plugins, agents,
  managed-product surfaces, and generated expansion remain later work.
- Production key custody, rotation, fleet admission, hostile tenancy, and
  independent security review remain deployment or advanced-security work.
- Execution evidence does not prove business truth.

## Recommendation

Approve Sprint 10F closure and review the locally assembled optional RC2
manifest. Keep the candidate unsigned and local until a separate explicit
publication decision.
