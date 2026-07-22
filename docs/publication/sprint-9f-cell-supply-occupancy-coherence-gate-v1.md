# Sprint 9F Cell Supply Occupancy Coherence Gate V1

Date: 2026-07-22
Status: affected-scope replacement freeze approved

## Context

The approved proof-timeout repair allowed the definitive pre-enrolled Cell
supply scenario to run for its full 600-second bound. It still stopped while
waiting for both demanded Cell generations to become ready.

The retained authority timeline proves a deterministic runtime defect:

- desired state requested two replicas across two pre-enrolled target Cells;
- the planner requested and the provider started the first target Cell;
- that Cell published a verified ready generation;
- its mandatory per-Cell evidence processor converged;
- one business replica consumed the remaining slot in its capacity of two;
- the second business replica remained unplaced;
- every later supply pass selected the already-running first target as if it
  still had free capacity, so no start directive was issued for the second
  target.

The normal placement phase computes one authoritative reservation map from
current assignments, planned withdrawals and assignments, and signed Cell
generation occupancy. `planCellSupply` then creates a new empty reservation
map. It therefore forgets both committed and observed occupancy precisely when
it decides whether pending supply can satisfy unplaced demand.

There is a second expression of the same incoherence. A dormant Cell must host
the system-owned per-Cell evidence processor before ordinary work becomes
eligible. Supply planning does not reserve that mandatory support cost. A
one-slot Cell can consequently be started for one business replica even though
its only slot must be consumed by the processor, creating permanent pending
demand.

The 180-second result was therefore useful evidence of slow sequential
progress, but the 600-second result proves that increasing time cannot produce
convergence.

## Decision Proposal

Use one coherent simulated capacity state throughout placement, supply, and
per-Cell support planning:

1. Pass the post-placement reservation map into `planCellSupply`; do not create
   an empty supply-only map.
2. Evaluate supply fit against the greater of assignment-derived reservations
   and signed current-generation occupancy, matching ordinary placement.
3. Include the slot cost of required system-owned per-Cell support that is not
   already assigned when evaluating a dormant or not-yet-supported Cell.
4. Reserve selected ordinary demand in the same simulated map so the following
   per-Cell support pass sees the complete intended capacity state.
5. Preserve the approved deterministic supply policy: smallest fitting Cell,
   then Cell key, while reusing selected capacity before starting another Cell.
6. Make no contract, migration, action, provider, Cell lifecycle, retry,
   concurrency, or public API change.

This repair does not make supply predictive and does not start both Cells
eagerly. It restores eventual convergence under the existing sequential,
demand-driven policy by ensuring that a pending running Cell is reused only
while it actually has coherent simulated capacity.

## Required Regression Proof

Planner-level tests must prove:

- a saturated running supplied Cell cannot absorb another simulated replica,
  so the next fitting dormant Cell receives `request_cell_start`;
- signed generation occupancy cannot be reused merely because assignment
  authority temporarily reports fewer occupied slots;
- mandatory per-Cell support overhead prevents starting a Cell that cannot
  host both support and the demanding ordinary replica;
- selected dormant capacity is still packed deterministically before another
  Cell is started;
- supplied Cells reserved for valid pending demand are not drained.

The generated reconciliation-planner helper must be regenerated from the
repaired source and tested for exact source/helper agreement.

## Impacted Scope

- Source repair: `cadenza-environment` reconciliation planner, focused tests,
  and generated planner helper.
- Dependent validation: complete environment install, formatting where
  applicable, typecheck, build, unit, PostgreSQL, hostile role-boundary,
  package-smoke, audit, generated-fixture, and clean-consumer checks.
- System validation: all three autonomous Cell Linux/gVisor scenarios with the
  approved explicit 600-second proof bound and complete cleanup assertions.
- Required source replacement: environment commit, source-tree digest, and
  source archive.
- Existing pending replacements remain: the approved reference-system binding
  commit and artifact, and the approved Cell proof-timeout commit.
- Required public-index replacement: this gate and resulting evidence change
  the curated workspace source identity and archive.
- Required aggregate replacement: every affected repository, generated
  artifact, source artifact, SBOM projection if its bytes change, and the
  distributed manifest must be regenerated and frozen by exact digest.
- Expected unchanged inputs: core language packages, adapters, Cell and Chamber
  runtime bytes, rootfs, runsc, authority schema and migrations, protocols,
  and toolchain identities.

No external publication is authorized.

## Risks

- Sharing simulated reservations can expose assumptions previously hidden by
  the supply-local map. Complete planner and PostgreSQL tests are required.
- Double-counting already assigned support would under-provision capacity.
  Support overhead must be derived only for missing system-owned per-Cell
  assignments.
- Trusting assignment counts alone would repeat the signed-observation defect.
  Supply fit must remain conservative when runtime occupancy is higher.
- Broadening this into parallel or predictive provisioning would change the
  approved supply policy and is outside this amendment.

## Alternatives

1. Increase the timeout again. Rejected because the plan is stable and no
   second start action can emerge from the current occupancy calculation.
2. Lower the target replica count or increase test Cell capacity. Rejected
   because that hides the exact scale-out boundary the proof is required to
   validate.
3. Start one Cell per missing replica immediately. Rejected because it discards
   the approved bounded packing policy and may over-provision.
4. Ignore mandatory evidence-processor cost during supply. Rejected because
   ordinary placement is deliberately gated on that local processor and its
   slot cost is real capacity.

## Approval Gate

Approval authorizes the narrow environment planner repair above, generated
helper regeneration, complete environment and dependent validation, rerun of
all three autonomous Linux/gVisor scenarios, replacement artifact assembly,
and a new affected-scope freeze request. It does not authorize unrelated
runtime changes, concurrency optimization, contract changes, weakened proof
assertions, or publication.

The user approved this design amendment on 2026-07-22.

## Repair Result

- Supply planning now receives the post-placement reservation map instead of
  constructing an empty capacity view.
- Supply fit uses the greater of assignment reservations and signed generation
  occupancy.
- Missing system-owned per-Cell support cost is precomputed once per Cell and
  included without double-counting an existing support assignment.
- Four focused regressions prove saturated pending supply, support-only
  capacity, signed runtime occupancy, and deterministic packing.
- The canonical Environment, Chamber, and Cell stem fixtures are byte-identical
  at
  `sha256:6484123f8c08e0c7f0f78f65a3748e1bdae67c008806e287e169463a07039941`.
- The fixture generator's incorrect nested-repository paths were repaired so
  its declared workspace propagation works from the package command.

Replacement commits:

- Environment: `7005bab6093fe210c2af9ded3dd3f08dc5a8d774`.
- Chamber fixture: `243543d20ad02d2a40ca02ae3e0e5e5f13f8bab1`.
- Cell: `752ae0d2a47103d42966b22dbc83e01159ec1219`.

Validation completed before the definitive system rerun:

- exact Node `24.18.0` and PostgreSQL `16.14` clean copy: install, build,
  typecheck, all 111 tests, audit, and three-package smoke pass;
- Chamber: format, strict Clippy, all-target tests, metadata, and RustSec pass;
- Cell: format, strict Clippy, all-target tests, metadata, and RustSec pass.

The first repaired supply proof then reached a previously unreachable
scale-down step and exposed a scenario-local revision typo: it submitted
desired-state revision `5` after revision `2`. The authority correctly rejected
the discontinuity. The proof now submits revision `3`; no authority behavior or
assertion changed.

Definitive autonomous Linux/gVisor results against the commits above and the
approved measured runtime are:

- two-Cell distribution, reference execution, evidence, and cleanup:
  `104.87s`, passed;
- pre-enrolled two-Cell supply, provider outage/restart, fresh generations,
  scale-down, release, and cleanup: `134.75s`, passed;
- scale orchestration, stem loss and succession, actor persistence and
  reassignment, evidence, fresh-capacity resupply, and cleanup: `255.06s`,
  passed.

The proof used Node `24.18.0`, Rust `1.97.0`, PostgreSQL `16.14`, rootfs
`sha256:bec776773e572b05fc8398ae27c0924d09c326cc887a520bc5db4ce674fcd685`,
and runsc
`sha256:1fb4c9cb232e353bb44add450fc393e4b61d49511564d1c4bc9cb2b81e843a77`.
After every scenario and at container closure, no runsc sandbox, launcher
bundle, proof PostgreSQL process, runtime state, or proof container remained.

## Replacement Assembly

The repaired candidate was assembled twice from the same clean commits and
staged packages. Both complete artifact directories and both generated
manifests are byte-identical. The release metadata still binds candidate
digest
`sha256:fb000ad25a00edbb0c8e6ff8c9887a42e6865680a854896a6673c4f22fdb9b3a`,
contains 20 artifacts, and keeps `registry_publication` false.

Replacement repository identities are:

- curated workspace commit
  `804556a4ffd78f6ad1b66c8c05c25b3d4ae85b95`, tree
  `sha256:fcfc1ec49859b43093f428b799e7d6c7ca0f4f52b99535578020bf97b64be1fb`;
- reference system commit
  `fbefa9aaad5d3e4511e19a1c5f5e965c30bb9fc6`, tree
  `sha256:7158f0bf4723854f5ccf3c72cfc845a8fa5faa8f7444ed2306574d34669a2a2a`;
- Environment commit
  `7005bab6093fe210c2af9ded3dd3f08dc5a8d774`, tree
  `sha256:830779d90d75dae6c624aa5e072c33cab959e08f7fc41bdf6d73c40b6251675a`;
- Chamber commit
  `243543d20ad02d2a40ca02ae3e0e5e5f13f8bab1`, tree
  `sha256:6790e4415ace74f14716b562eeee8a91bb72fcf05965b022c6f3ee0cc4c5e40a`;
- Cell commit
  `752ae0d2a47103d42966b22dbc83e01159ec1219`, tree
  `sha256:50afe44935615b64bc7885b1e01c18cc131040cfbcff2f7d0e32875f35636016`.

Replacement artifact digests are:

- workspace source archive:
  `sha256:aaa86a08c68c5384e789d77336f9916a151c14f548a90c04540d8f732f071c60`;
- reference-system source archive:
  `sha256:67f204f2b2cbf0e0c124e1ab0e05e1d27035ff7fdfb4f8176b90527aadc4c74f`;
- Environment source archive:
  `sha256:1d300f7db948281da63b17d86037ec84013e244d6e8073537e0a4661ccd2480d`;
- Chamber source archive:
  `sha256:f235031396434e6878ae2dd8933e2528fbe27d558d7155968cb77f304888a446`;
- Cell source archive:
  `sha256:ee4e46cec43d237099a97331b96e81fd9e5f2a1e1a11df13311783d79f7ba51c`;
- generated reference artifact:
  `sha256:9b9f1118e5313ac9867cec4bba9162296df5b2d2515ae6b1085dc9a51538b3a1`;
- Environment bootstrap package:
  `sha256:c0fc2b77ec69a28686b765214d5880d02b84413ae61b9125dc34cd40ffe12cf3`;
- Chamber crate:
  `sha256:4692620e4db5f9db4121bb63762d70a731c01918f21024aefde7f5dc588aac40`.

Every other source archive, package, and generated runtime artifact is
byte-identical to the approved SBOM replacement freeze. All seven regenerated
SBOMs are also byte-identical to that freeze. The replacement manifest is
`sha256:fe88c18520c81002a882660df14ac86c6cd872dd00bcf22de0e7ec6fa20a5cf1`.

Retained inputs:

- manifest:
  `/tmp/cadenza-distributed-foundation-rc1-supply-coherence-manifest-v2.json`;
- artifacts: `/tmp/cadenza-release-artifacts-rc1-supply-coherence-v2`;
- independently reproduced artifacts:
  `/tmp/cadenza-release-artifacts-rc1-supply-coherence-repro-v2`.

## Affected-Scope Refreeze Gate

Explicit approval replaces only the five repository identities and eight
artifact records listed above, together with the aggregate manifest. It
reauthorizes Sprint 9F against the retained inputs. It does not authorize any
external publication.

The user approved this affected-scope replacement freeze on 2026-07-22. The
replacement identity in this document is now authoritative for Sprint 9F.
