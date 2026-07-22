# Sprint 9F Linux Proof Timing Bound Gate V1

Date: 2026-07-22
Status: repair approved and complete; diagnostic conclusion superseded

## Context

The approved reference runtime-core repair passes its exact Node `24.18.0`
release-consumer validation and the autonomous two-Cell Linux/gVisor proof.
The next scenario,
`desired_replica_state_supplies_and_releases_pre_enrolled_cells`, reached its
fixed 180-second convergence deadline before both demanded Cell generations
became ready.

The result reproduced in a fresh systemd and cgroup namespace. A diagnostic
run retained live authority evidence until the deadline:

- desired replica state revision `2` requested two target replicas;
- the stem held the valid lease and committed a deterministic plan;
- the first `request_cell_start` action and supply directive committed;
- the supply provider published `starting` and then `running` observations;
- the launched Cell remained alive and eventually published verified `ready`
  generation observations;
- the planner intentionally processes the bounded action set before the next
  supplied Cell, so the second gVisor activation is sequential;
- all proof resources cleaned up after each failure.

The debug runs reached the deadline in approximately 218 seconds including
setup. An optimized release-build run reached the same deadline in 186
seconds. This evidence justified making the proof bound explicit, but it did
not prove that timing was the only cause. The approved 600-second run later
disproved that preliminary conclusion and exposed a separate planner defect.

The current constant is shared by the ignored autonomous Linux proofs and
cannot be adjusted explicitly for a slower contained proof environment.

## Decision Proposal

Make the ignored autonomous proof timeout explicit and bounded:

- preserve 180 seconds as the default;
- accept `CADENZA_PROOF_CONVERGENCE_TIMEOUT_SECONDS` for the approved Linux
  proof environment;
- reject values below 180 seconds or above 900 seconds;
- use 600 seconds for the definitive Docker Desktop/gVisor proof;
- keep every existing state, identity, evidence, failure, and cleanup
  assertion unchanged;
- record actual scenario durations so the wider bound cannot be mistaken for
  a runtime service-level objective.

This changes test orchestration only. No Cell runtime path, cadence, retry,
authority, supply, placement, containment, or cleanup behavior changes.

## Impacted Scope

- Source repair: the ignored autonomous Linux proof in `cadenza-cell` only.
- Required validation: complete Cell formatting, strict Clippy, unit,
  integration, hostile, PostgreSQL, advisory, and package checks, followed by
  all three autonomous Linux/gVisor scenarios with the explicit bound.
- Required source replacement: Cell commit, source-tree digest, and source
  archive.
- Existing pending replacement: the already approved reference-system repair,
  its source archive, and generated distributed pricing artifact.
- Required public-index replacement: this gate and resulting evidence, so the
  curated workspace commit and source archive must be regenerated.
- Required aggregate replacement: affected repository records, generated and
  source artifact records, and the distributed manifest.
- Expected unchanged inputs: all runtime executable bytes, package artifacts,
  rootfs and runsc measurements, contracts, protocols, migrations, SBOMs,
  diagrams, and toolchains.

No external publication is authorized.

## Alternatives

1. Accept or skip the failed scenario. Rejected because supply and release are
   required Sprint 9F behavior.
2. Increase the hardcoded default globally. Rejected because proof timing is an
   environment property and should remain explicit.
3. Change runtime reconciliation or parallelize Cell activation to satisfy the
   test. Rejected because the evidence shows coherent progress; runtime
   optimization is outside this stabilization repair.
4. Treat the repeated failures as transient flakes. Rejected because they are
   reproducible at the same bounded wait and the authority timeline explains
   them.

## Approval Gate

Approval authorizes the narrow Cell proof-harness repair, complete dependent
validation, continuation of the autonomous Linux/gVisor proof with the
explicit 600-second bound, replacement artifact assembly, and a combined
reference/Cell affected-scope freeze request. It does not authorize runtime
behavior changes, unrelated source changes, or publication.

The user approved this design on 2026-07-22.

## Repair Result

- The default remains 180 seconds.
- `CADENZA_PROOF_CONVERGENCE_TIMEOUT_SECONDS` accepts only values from 180
  through 900 seconds.
- Parser coverage proves the default, the approved 600-second value, and
  rejection below and above the bound.
- Complete Cell formatting, strict Clippy, ordinary unit, integration,
  hostile, PostgreSQL, advisory, and package validation passes.
- The autonomous two-Cell release proof passes in 106.66 seconds with the
  explicit 600-second bound and complete cleanup.
- Cell replacement commit:
  `f05aa0e412704e656164a2b6db47eb59f8cf037b`.

The extended pre-enrolled supply proof reached 603.67 seconds without a second
Cell start directive. This is not a timeout defect. The authority trace and
planner source show that supply planning discards occupied-slot reservations
before selecting pending capacity. The resulting runtime amendment is tracked
by
[Sprint 9F Cell Supply Occupancy Coherence Gate V1](sprint-9f-cell-supply-occupancy-coherence-gate-v1.md).
