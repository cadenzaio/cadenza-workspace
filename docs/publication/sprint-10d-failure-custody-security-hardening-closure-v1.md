# Sprint 10D Failure, Custody, And Security Hardening Closure V1

Date: 2026-07-28

## Decision

Sprint 10D is complete.

Every `FCS-01` through `FCS-10` obligation has assertion-level ownership. The
fast, complete, and three-scenario privileged hardening proofs passed against
the same clean source baseline. No unresolved critical, high, medium, or low
finding remains in the approved scope.

This is maintainer evidence, not an independent security audit or production
SLA.

## Product Change

The bounded review produced one product repair:

- `cadenza-cell@89e6e5492956a8513c215aa55996412ec4630ffb`
  closes `SCM_RIGHTS` descriptors received by the root-owned launcher before
  any fallible packet validation.

Before the repair, malformed canonical or contract input could reject a
launcher session while retaining transferred descriptors. The new Linux
regression observes EOF on a transferred pipe after rejection and therefore
proves actual descriptor closure.

No schema, shared contract, public API, architecture, dependency, or deferred
feature changed.

## Stewardship Change

Workspace commit `d1036b9f315ad0564b7b411f198b0230c896efff`:

- records the ten-obligation failure coverage ledger;
- updates the post-RC threat model;
- records the security review and automated scan results;
- declares a separate privileged hardening profile;
- keeps the ordinary privileged path at two scenarios;
- selects the third stem-loss scenario only with `--hardening`.

## Proof Results

All reports bind manifest
`sha256:f458640a45cfcedaf15b040b3afa65f4f257be0fbeeaa53fd7694a875b6a02a5`.

| Tier | Result | Duration | Report SHA-256 |
| ---- | ------ | -------- | -------------- |
| Fast | 7/7 | `23.482s` | `e149929e9e19999efddc168738977d9fb8a4b1c0bf63c7662b6c68779e0da05c` |
| Complete | 30/30 | `307.597s` | `94bc0b76106f3e4bbe22df17856d54c421c805d71260826864d4f3770f7b5a98` |
| Privileged hardening | 3/3 | `1139s` | `9ff12f4b1f0e07dc3c73941805b96e6141f8f7acffcc05e4f3dc83b0cceda31b` |

The privileged run used Linux `6.8.0-136-generic`, aarch64, Node `24.18.0`,
Rust `1.97.0`, PostgreSQL `16.14`, and the pinned `runsc` digest. It rebuilt and
measured:

- rootfs:
  `sha256:6b27893d41aec8e73415710219a1622d9194e04d61c214335cbbdf1cdfc0a536`;
- Chamber:
  `sha256:a1188dc0e6df3b1c98b2ad884737d06fa1d0d35970dd674f43b1b7b3d3c054de`;
- Core:
  `sha256:26b4f78288e0a15a749af46af7524f3446b64292f4f9843ecb14c0947417bdf0`;
- TypeScript adapter:
  `sha256:3fc2e50a73ee3e0e7e6fc2f88697c194925b500dac7f0863efc1ded1136cc5e1`;
- distributed reference artifact:
  `sha256:f128946cba37e65eb77d7f0c81182798cf603a7a0aaa2cf96c15e96f566fbeb2`.

## Privileged Scenarios

1. `two_real_cells_converge_database_authority_without_lifecycle_commands`
   passed in `339s`.
2. `desired_replica_state_supplies_and_releases_pre_enrolled_cells` passed in
   `329s`.
3. `scale_orchestration_survives_stem_loss_and_resupplies_fresh_capacity`
   passed in `357s`.

Together they prove fresh authority genesis, exact Cell/Chamber compatibility,
distributed reference execution, two-member sender selection, role outage,
provider-generation replacement, fresh Cell generations, actor reassignment,
stem takeover, stale authority-mount rejection, resupply, post-recovery
execution, scale-down, and cleanup.

Each scenario used a separate fresh PostgreSQL cluster. Final cleanup reported:

- containers: `0`;
- bundles: `0`;
- cgroups: `0`;
- temporary clusters: `0`;
- credential files: `0`.

## Security Results

- Gitleaks `8.30.1`: no confirmed secret in any official reachable history.
- Syft `1.49.0`: seven regenerated CycloneDX source SBOMs.
- Yarn, npm, Cargo, Hex, and NuGet: no known blocking vulnerability; no retired
  or deprecated dependency in the checked surfaces.
- CI: all retained external actions use full commit SHAs and every workflow
  declares permissions.
- PostgreSQL: 139 reviewed `SECURITY DEFINER` functions remain
  schema-qualified with `search_path = pg_catalog`.
- Provenance: changed post-publication commits verify with the dedicated
  Ed25519 key; unchanged language RC1 commits remain DCO-bound and covered by
  signed RC1 tags and assets.

The complete finding record is
[Sprint 10D Security Review V1](../security/sprint-10d-security-review-v1.md).

## Coherence Review

The hardening pass serves the intended whole:

- business logic remains unaware of routing, replacement, evidence custody,
  supply restart, and stem recovery;
- failures do not silently widen authority or substitute another identity;
- started or uncertain work remains explicit instead of being retried as if
  absent;
- replacement advances generation or epoch;
- cleanup measures retained custody instead of inferring it from command
  completion;
- one defect produced one focused regression rather than a new combinatorial
  test matrix.

No retained code or test was added without a current purpose.

## Sprint 10E Handoff

The next sprint should improve interpretation around these existing truthful
states:

1. desired versus authorized versus running versus observed state;
2. pre-affect retryable failure versus started or uncertain execution;
3. stale authority, unavailable authority, and forbidden role;
4. pending directive, retained process custody, provider restart, and fresh
   generation;
5. Chamber-selected member, Cell validation, route epoch, and no substitution;
6. actor owner epoch, uncertain mutation commit, outcome resolution, and
   relinquishment;
7. evidence admission pressure, durable custody, retry, and fail-closed stop;
8. draining, stopped, absent, and exact cleanup across every retained resource.

Sprint 10E should provide stage-specific, non-secret recovery and escalation
guidance. It must not collapse these distinctions, build the observer UI, or
start deferred advanced-security features.

## Residual Risk

The known limits remain unchanged: Node VM is not containment; host root,
PostgreSQL superuser, active keys, and `runsc` remain trusted; remote database
transport, automated key rotation, aggregate hostile admission, independent
review, and a production SLA are not claimed.

RC1 remains immutable. This closure does not authorize an RC2 tag, release,
asset, registry publication, or GitHub mutation.
