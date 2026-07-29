# Sprint 10D Failure And Custody Coverage V1

Date: 2026-07-28

## Status

- Coverage inventory: complete.
- Finding-driven repair: complete.
- Deterministic and process validation: passed.
- Privileged hardening profile: passed.

This ledger maps each Sprint 10D obligation to the cheapest test that reaches
the claimed authority or custody boundary. It is not a list of every related
test.

## Source Baseline

| Repository                 | Reviewed commit | Role in this ledger                                      |
| -------------------------- | --------------- | -------------------------------------------------------- |
| Workspace                  | `c44b853`       | Proof and cross-repository stewardship                   |
| `cadenza`                  | `a2d38f0`       | Primitive, result, evidence, and actor-core semantics     |
| `cadenza-python`           | `9fd99a0`       | Unchanged core conformance                               |
| `cadenza-elixir`           | `d1dd15f`       | Unchanged core conformance                               |
| `cadenza-csharp`           | `d294e53`       | Unchanged core conformance                               |
| `cadenza-environment`      | `eb9cc00`       | Durable authority and PostgreSQL role ownership          |
| `cadenza-chamber`          | `10db3f6`       | Runtime selection, activation, execution, and custody    |
| `cadenza-cell`             | `89e6e54`       | Routing, transport, process, supply, and host custody     |
| `cadenza-reference-system` | `4d610e3`       | Exact distributed business-flow consumer                 |

The workspace commit will advance when this ledger and its closure evidence are
committed. Product evidence remains bound to the child commits above.

## Assertion Rule

A test owns an obligation only when its assertion observes the named boundary:

- **no mutation** means the relevant durable or local state is compared before
  and after rejection;
- **before affect** means the target execution callback, broker, process, or
  mutation function is proved uncalled;
- **retained custody** means the exact request, process, actor, descriptor, or
  evidence state remains attributable after uncertainty;
- **cleanup** means absence is measured for the resources named by the claim;
- a timeout alone is never accepted as proof of a transition.

## Coverage Matrix

| ID       | Deterministic injection checkpoint | Expected state and forbidden affect | Authoritative focused proof | Tier 3 composition | Disposition |
| -------- | ---------------------------------- | ----------------------------------- | --------------------------- | ------------------ | ----------- |
| `FCS-01` | Stale revision, conflicting idempotency content, stale projection digest, or contradictory override before commit | Reject before durable/local mutation; no evidence or projection publication for rejected content | Environment `rejects stale authorization and conflicting idempotency without mutation`; Environment `fails closed on digest drift, stale authority, and contradictory overrides`; Cell `stale_or_tampered_projection_is_rejected_without_local_effect` | All scenarios begin from fresh authority and exercise current revisions | Covered |
| `FCS-02` | Issuer request before a grant or authority-mount promotion receipt exists; purpose-specific role unavailable or unauthorized | Activation remains absent or pending; no partial image, grant, promotion, broader credential, or direct table access | Chamber `interrupted_artifact_resolution_never_constructs_a_partial_image`; Environment `promotes only the exact ready stem authority member and records immutable evidence`; Environment `enforces hostile role separation and closes broad residency mutation`; Cell issuer canonical-frame, key-binding, local-transport, and identity-bound promotion unit tests | `two_real_cells_converge_database_authority_without_lifecycle_commands` suspends and restores database roles before successful execution | Covered without another outage test |
| `FCS-03` | Provider unavailable before issue, withdrawal while activation is pre-ready, and provider process restart after observed generations | Exact pending directive remains retryable; withdrawal cancels exact local custody; restart cannot adopt or overlap predecessor generation | Cell `database_availability_and_authorization_outages_remain_retryable`; Cell `withdrawn_pre_ready_activation_follows_exact_local_custody`; Cell `custody_pending_is_retryable_only_for_the_exact_managed_directive` | `desired_replica_state_supplies_and_releases_pre_enrolled_cells` kills and restarts the provider and proves fresh Cell generations | Covered |
| `FCS-04` | Successor prepared while predecessor is still present; stale predecessor attempts work after route swap | Successor authority is published first; predecessor route and generation are fenced before drain; no stale affect | Cell `replacement_is_successor_first_and_predecessor_retires_after_route_swap`; Cell `replacement_publishes_successor_before_predecessor_drain_and_stop`; Chamber `rejects_cross_generation_stale_digest_and_undeclared_routes_without_mutation` | Ordinary scenarios replace Chamber/provider generations; hardening adds stem replacement | Covered |
| `FCS-05` | Withdrawal during pending, prepared, or pre-ready activation | Exact request/grant/process custody is cancelled before absence; unrelated custody is unchanged | Cell `withdrawn_pre_ready_activation_follows_exact_local_custody`; Cell `withdrawal_publishes_draining_then_fences_routes_before_process_drain`; Chamber `partial_activation_cannot_skip_to_ready` | Supply scenario proves scale-down, dormant supply, and no retained generation | Covered |
| `FCS-06` | Equal replay, conflicting replay content, stale generation, suspended enrollment, or authority drift after transport open | Equal replay returns equal outcome; every conflict or stale identity rejects before duplicate target execution | Cell `distribution_identity_replays_equal_outcomes_and_rejects_conflicts`; `stale_generation_and_suspended_enrollment_fail_before_execution`; `source_generation_drift_after_open_rejects_before_target_execution`; `assignment_drift_is_rejected_before_the_proceed_boundary` | Distributed reference execution crosses two real Cells | Covered |
| `FCS-07` | Multiple route candidates, route-epoch advance, replaced member, or invalid selected key | Chamber selects one candidate and resets bounded state on epoch change; Cell executes that exact key or rejects, never substitutes | Chamber `typescript_adapter_materializes_and_executes_a_non_privileged_slice`; Cell `source_selection_is_validated_without_silent_reroute`; Cell `authority_refresh_groups_target_replicas_and_separates_signal_slices` | Two-Cell scenario executes across two replicas and replaces a route member | Covered |
| `FCS-08` | Evidence sink unavailable before execution, after execution start, at target admission, or under journal pressure | Pre-start failures have no business affect; started work remains explicit/indeterminate; mandatory custody failure never becomes success; storage use remains bounded | Chamber `pre_callable_custody_loss_fails_closed_before_execution`; `post_start_custody_loss_is_reported_as_indeterminate`; `rejects_a_success_response_without_the_custody_checkpoint`; Cell `mandatory_source_evidence_failure_fails_the_operation_closed`; `target_evidence_failure_rejects_before_peer_execution`; journal high-water, reserve, restart, and unknown-commit tests; Environment evidence-ledger replay and role tests | All scenarios require durable evidence and exact cleanup | Covered; no cross-layer duplicate needed |
| `FCS-09` | Actor persistence outage during commit, owner epoch replacement, stale residency, or relinquishment during drain | Stable mutation identity resolves committed/absent/uncertain outcome; stale owner cannot affect; drain waits for exact relinquishment | Environment `commits source, enrollment, multi-member placement, route, and suspension authority`; Cell `actor_persistence_outage_distinguishes_uncertain_commits_in_evidence`; Cell `chamber_drain_requires_actor_relinquishment_and_records_aggregate_evidence`; Chamber `accepts_current_authority_and_rejects_stale_epoch_generation_and_endpoint` | Two-Cell scenario proves actor reassignment and post-replacement state continuity | Covered |
| `FCS-10` | Drain, deadline, disconnect, malformed launcher packet, stem loss, provider loss, or proof failure cleanup | Stopped/clean is forbidden while process, descriptor, actor, route, container, cgroup, bundle, credential, cluster, or generation custody remains | Cell launcher process-custody suite; Cell `malformed_packet_closes_transferred_descriptors`; Cell `graceful_drain_waits_for_durable_custody_acknowledgement`; Cell actor drain test | All three privileged scenarios assert cleanup; hardening adds stem-loss takeover and resupply | Covered after `SEC-10D-001` repair |

## Tier Ownership

### Tier 1: Deterministic Boundary Tests

Tier 1 owns stale authority, replay, route selection, generation fencing,
activation state, actor commit outcomes, journal pressure, and no-mutation
assertions. Existing repository tests already reach these boundaries. Sprint
10D adds only the descriptor regression identified during manual review.

### Tier 2: Process And Protocol Tests

Tier 2 owns:

- adapter deadline, cancellation, crash, frame, and stderr bounds;
- launcher peer identity, nonce replay, deadline, disconnect, cancellation, and
  bundle cleanup;
- peer transport loss before and after the proceed boundary;
- evidence custody loss before callable start and after started execution;
- PostgreSQL role separation and transactional authority mutation.

These tests use protocol or process checkpoints. No new sleep-based checkpoint
was introduced.

### Tier 3: Privileged System Tests

The ordinary profile retains:

1. `two_real_cells_converge_database_authority_without_lifecycle_commands`;
2. `desired_replica_state_supplies_and_releases_pre_enrolled_cells`.

The hardening profile adds:

3. `scale_orchestration_survives_stem_loss_and_resupplies_fresh_capacity`.

The hardening profile is selected with:

```sh
node scripts/run-proof.mjs privileged --lima cadenza-gvisor --hardening
```

Each scenario receives a fresh PostgreSQL cluster and generated fixture
credentials. Closure requires three passing scenario results and cleanup status
`passed` in the same manifest-bound report.

## Finding Binding

`SEC-10D-001` exposed a gap in `FCS-10`: the root-owned launcher accepted file
descriptors with `recvmsg`, then parsed JSON before wrapping those descriptors
in `OwnedFd`. A malformed packet could therefore leak the received copies into
the launcher process.

Commit `cadenza-cell@89e6e54` adopts received descriptors before all fallible
packet validation and adds
`launcher_service::tests::malformed_packet_closes_transferred_descriptors`.
The test transfers the write side of a nonblocking pipe with malformed JSON and
proves the read side reaches EOF after rejection. This asserts kernel-level
descriptor closure, not merely an error result.

## Execution Record

All reports bind manifest
`sha256:f458640a45cfcedaf15b040b3afa65f4f257be0fbeeaa53fd7694a875b6a02a5`
and workspace source commit `d1036b9`.

| Tier | Result | Duration | Report SHA-256 |
| ---- | ------ | -------- | -------------- |
| Fast | 7/7 steps passed | `23.482s` | `e149929e9e19999efddc168738977d9fb8a4b1c0bf63c7662b6c68779e0da05c` |
| Complete | 30/30 steps passed | `307.597s` | `94bc0b76106f3e4bbe22df17856d54c421c805d71260826864d4f3770f7b5a98` |
| Privileged hardening | 3/3 scenarios passed | `1139s` | `9ff12f4b1f0e07dc3c73941805b96e6141f8f7acffcc05e4f3dc83b0cceda31b` |

The privileged report records:

- fresh authority cluster per scenario;
- no retained fixture credential;
- measured rootfs
  `sha256:6b27893d41aec8e73415710219a1622d9194e04d61c214335cbbdf1cdfc0a536`;
- two-Cell distribution, two-member sender selection, provider restart, fresh
  generations, stem takeover, stale-mount rejection, resupply, and
  post-recovery execution;
- zero retained containers, bundles, cgroups, temporary clusters, and
  credential files.

`SEC-10D-001` is resolved. No other critical, high, medium, or low defect
remains open from this bounded review.
