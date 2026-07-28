# Supply-Restart Lifecycle Hardening

Date: 2026-07-24

## Goal

- Outcome: determine and repair why a supply-managed Cell can attempt a
  generation transition while retaining local custody after provider restart.
- Why it matters: provider replacement must preserve Cell lifecycle authority
  and eventually return released pre-enrolled capacity to dormant without
  accepting overlapping generations or abandoning custody.

## Current Status

- State: `done`
- Current repo: `cadenza-cell`
- Expected scope: `cadenza-cell` plus workspace planning and decision records.
- Approved decision:
  [supply-restart lifecycle hardening](../../../decisions/2026-07-24-supply-restart-lifecycle-hardening.md).

## Observed Evidence

- The sender-side replica-routing proof completed its four-call balancing
  assertion across two supplied Cells.
- Supply-provider replacement converged fresh Cell generations and a fifth
  business delegation completed.
- During the unchanged release phase, a managed Cell failed with
  `cell generation lifecycle transition requires empty local custody`.
- The provider then exited because the managed Cell lacked stopped authority.
- Business replica residency reached `stopped`, but the exited provider could
  not publish the final dormant supply observations.

## Investigation Findings

- The supply supervisor correctly refuses to adopt children after provider
  restart. It waits for prior Cell-generation authority to stop or expire and
  then creates a fresh generation. The replacement and post-restart business
  delegation succeeded, so provider replacement is not the owner of this
  defect.
- `CellHostConvergenceRuntime::generation_effect` correctly refuses to publish
  a draining or stopped generation while local inventory or routes are
  non-empty. Weakening this fence would allow false lifecycle evidence.
- The convergence state machine has no retirement effect for an assignment
  removed while activation is pending. `GrantPending` is ignored during
  withdrawal, and a prepared `Materializing` Chamber is incorrectly routed to
  the ordinary orchestrator even though its control is still owned by the
  prepared-activation map.
- Activation requests, issued grants, and prepared Chambers are retained in
  maps outside `LocalRuntimeInventory`. The current empty-custody predicate
  does not inspect those maps, so the same model can report both false
  non-empty and false empty states.
- `Absent`, `Preparing`, and `FailedWaitingRetry` do not describe live runtime
  transitions. `Preparing` and `FailedWaitingRetry` are never produced by
  production code; their retry metadata is exercised only by a synthetic unit
  test. This conflicts with the spotless-core rule that every state and code
  path must serve the intended whole.
- A valid supply drain can race the final local convergence pass. A non-empty
  Cell then propagates the empty-custody guard as a fatal host error. The
  provider subsequently observes a child exit without stopped authority and
  exits before publishing dormant supply evidence. Local cleanup still being
  in progress is a retryable reconciliation state, not a fatal authority
  failure.
- The captured host output did not include the retained member identity or
  state, so it cannot distinguish a pending grant from a prepared Chamber
  after the fact. The production paths prove both can become abandoned and
  neither can currently retire coherently. The repair therefore closes the
  complete pre-ready custody class instead of guessing one instance.

## Coherence Assessment

- **Identity:** absence should be represented by no local member record, not an
  `Absent` record that may still have hidden request or grant custody.
- **State:** pending grant custody, prepared Chamber custody, running Chamber
  custody, and stopped historical evidence require distinct transitions.
- **Affect:** cancelling a prepared Chamber must cross its actual prepared
  control boundary; the ready-Chamber orchestrator must not be asked to stop a
  process it does not own.
- **Security boundary:** a Cell may discard only its exact activation request,
  grant, or prepared Chamber. It must retain the empty-custody generation
  fence and may not infer stopped authority from a desired directive.
- **Temporal stewardship:** a valid drain that arrives before cleanup
  completes must wait and retry. It must neither claim draining early nor
  terminate the Cell before stopped authority is recorded.

## Design Proposal

### 1. Make pre-ready retirement explicit

- Reduce the live member state machine to states production actually owns:
  `GrantPending`, `Materializing`, `Ready`, `Draining`, and `Stopped`.
- Represent absence by removing the member from local inventory.
- Remove the unused `Absent`, `Preparing`, and `FailedWaitingRetry` states,
  `RetryDeadline`, `retry_delay_ms`, and their synthetic test coverage.
- Insert a `GrantPending` member before crossing the activation-issuer
  boundary. This makes an in-flight request visible to convergence even when
  the issuer call is unavailable or authority changes.
- Add explicit convergence effects for:
  - cancelling a pending activation request or retained grant;
  - cancelling a prepared, not-yet-ready Chamber through its prepared control;
  - forgetting a stopped member only after stopped residency has been
    published.
- Apply the same pre-ready retirement semantics to ordinary withdrawal and
  successor-first replacement. Replacement keeps its existing successor-ready
  fence.

### 2. Make cancellation follow actual custody

- Add a non-consuming cancellation operation to
  `PreparedMemberActivation`. It sends the Chamber stop command while the
  prepared control and host are still retained.
- Remove prepared custody, its issued grant, and the local member only after
  cancellation succeeds.
- On an uncertain cancellation failure, retain all local records and retry;
  never declare empty custody.
- Pending activation retirement removes only the exact basis request and exact
  grant associated with the local member.

### 3. Strengthen empty-custody truth

- Define an empty convergence runtime as:
  - no local member records;
  - no pending activation requests;
  - no issued activation grants;
  - no prepared Chambers; and
  - no routed members.
- Keep `generation_effect` as the final enforcement point. Draining and stopped
  generation evidence remain impossible until every local custody category is
  empty.

### 4. Defer, rather than crash, during a normal drain race

- After validating the exact supply directive and current ready lifecycle, the
  Cell checks the strengthened local-custody predicate.
- If cleanup is still pending, return the existing lifecycle-rejection frame
  with the stable code `CustodyPending`. Do not publish draining lifecycle
  evidence, do not set the Cell to draining, and do not exit.
- The supply supervisor treats only an identity-matched `CustodyPending`
  response as a retryable deferral. It retains process custody and retries on
  its bounded safety cadence.
- All authority, identity, epoch, malformed-response, and other lifecycle
  rejections remain fatal. The provider still requires an acknowledged
  draining transition before stop and dormant publication.

## Impacted Repos

- Authority repo: `cadenza-cell` owns local activation custody, Cell lifecycle
  truth, the private host/supply control protocol, and the failing proof.
- Direct consumers: none outside `cadenza-cell`; the host and supply supervisor
  are version-locked processes from the same repository.
- Database authority: unchanged. PostgreSQL continues to express desired
  disposition and observed Cell lifecycle without claiming local process
  cleanup.
- Follow-up repos: none expected.

## Risks

- Cancellation could lose track of a live prepared Chamber. The implementation
  must retain prepared custody until an explicit stop succeeds.
- Treating broad lifecycle failures as retryable could hide authority defects.
  Only the exact `CustodyPending` code with matching generation, directive, and
  epoch is deferred.
- Removing dead public Rust types is a source-level breaking change. This is
  accepted for the new major direction; no official external consumer owns
  these Cell-internal convergence states.
- A Linux proof can expose another timing race after the first defect is
  removed. The repair remains open until the complete restart, release, and
  cleanup sequence passes.

## Migration Strategy

1. Add focused convergence tests for pending, prepared, and stopped
   retirement, then implement the reduced state machine.
2. Add runtime custody tests proving hidden request, grant, prepared, member,
   and route state each prevent an empty declaration.
3. Add exact host/supply response classification tests for retryable
   `CustodyPending` and fatal mismatches.
4. Run formatting, strict Clippy, the complete `cadenza-cell` test suite, and
   dependency/security validation.
5. Run the ignored Linux/gVisor
   `desired_replica_state_supplies_and_releases_pre_enrolled_cells` proof.
   Require provider replacement, post-restart execution, stopped generation,
   dormant supply observations, and no remaining process, route, bundle,
   runsc, or cgroup custody.
6. Record proof evidence and run a final coherence review before closure.

There is no backward-compatibility migration. No durable schema or authority
data changes.

## Alternatives

- **Accept pending states as empty:** rejected because signed grants or prepared
  Chambers could remain hidden behind a draining or stopped generation claim.
- **Call `stop_all` before draining:** rejected because it bypasses route,
  residency, assignment, and prepared-control ownership.
- **Retry only in the provider:** rejected because an abandoned pending or
  prepared activation would never converge to empty.
- **Reset all local convergence memory:** rejected because it can discard
  uncertain process custody and create false absence.
- **Change PostgreSQL release policy:** rejected because durable desired state
  cannot observe every in-process activation artifact and should not own local
  cleanup.

## Assumptions

- The private Cell host/supply protocol may add the stable `CustodyPending`
  code without supporting legacy mixed-version host and supervisor binaries.
- Exact activation grants have no remote revocation operation; safe retirement
  means deleting the Cell's only retained copy and never materializing it.
- A prepared Chamber acknowledges `Stop` before activation and the launcher
  retains its existing disconnect, deadline, and cleanup guarantees.
- The previously captured Linux run is sufficient reproduction evidence for
  design. The complete proof will be rerun after implementation rather than
  consuming another long privileged run before the approved repair exists.

## Investigation Scope

- Reconstruct the provider-restart and release sequence from the captured
  systemd/private-cgroup Linux proof and the exact production paths.
- Establish the exact custody retained at the rejected lifecycle transition.
- Determine whether ownership belongs to Cell convergence, provider restart,
  replacement-generation retirement, or the proof fixture.
- Preserve the existing prohibition on adopting a surviving child or starting
  overlapping Cell generations.
- Add the smallest focused regression test at the owning boundary, then rerun
  the pre-enrolled supply lifecycle proof.

## Out Of Scope

- Changes to sender-side replica selection or route authority.
- Weakening empty-custody, stopped-authority, generation, or provider fencing.
- Retrying uncertain business execution.
- General supply optimization, parallel activation, or cloud provisioning.

## Exit Criteria

- [x] The failure has one evidenced owner and an approved design.
- [x] Provider replacement and later release reach stopped Cell authority and
      dormant supply observations without overlapping generations.
- [x] Existing hostile, outage, restart, routing, and cleanup assertions
      remain intact.

## Closure Evidence

- The convergence model now has explicit pending, prepared, ready, draining,
  and stopped custody transitions. Dead absence/retry states were removed.
- Empty local custody includes members, pending activation requests, issued
  grants, prepared Chambers, and routed members.
- Exact `CustodyPending` deferral preserves a valid drain request while local
  cleanup converges; identity or authority mismatches remain fatal.
- macOS focused convergence coverage passed `11` tests.
- Linux formatting, strict all-target/all-feature Clippy, and the complete
  locked test suite passed.
- The definitive Linux/gVisor
  `desired_replica_state_supplies_and_releases_pre_enrolled_cells` proof
  passed in `374.23s` against a new PostgreSQL cluster and canonical rootfs
  `sha256:ccbdf7bb35a6fc2d1cccaed8d75c13e983bbdffbc5b51d46d00537bf53b2ecee`.
- The proof covered two supplied replicas, authority-role outage, provider
  replacement without adoption, fresh Cell generations, post-restart
  execution, scale-down, stopped residency, dormant profiles, and complete
  process/container/bundle/listener/cgroup cleanup.
- Detailed evidence and the final coherence review are recorded in
  `cadenza-cell/docs/supply-restart-lifecycle-evidence-2026-07-24.md`.
