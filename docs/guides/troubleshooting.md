# Cadenza Troubleshooting Guide

## Start With Identity And Stage

1. Identify the failing identity and its current generation or epoch.
2. Read durable desired authority and the latest signed observation.
3. Check whether assignment, image, source slice, route, readiness, and custody
   agree.
4. Find the overarching trace and the last accepted, started, completed, failed,
   or custody transition.
5. Name the stage that owns the first disagreement.
6. Classify affect before retrying, replacing, or cleaning up.

Use the
[operational interpretation guide](./operational-interpretation.md) to keep
desired, authorized, running, observed, custody, and safe-next-action truth
separate.

## Affect Decision

| Observation | Meaning | Action |
| --- | --- | --- |
| Explicit retryable rejection with `execution_started: false` | Protected affect did not start | Retry only under still-current authority and the owning contract's bound |
| `transport_failed` with `execution_started: false` | Transport ended before known execution, but retry policy still depends on failure class | Revalidate route, generation, deadline, and idempotency before another attempt |
| Any outcome with `execution_started: true` | Affect may have started | Do not send fresh work to another replica |
| Unknown commit or indeterminate replay state | Durable affect may have committed | Resolve the exact mutation, distribution, idempotency, or processing-attempt identity |
| Stale generation, epoch, route, lease, grant, or revision | Attempted authority is superseded | Fence it and reread current authority |
| Semantic denial or conflict | Current authority refuses the affect | Correct policy, role, request, or state; do not retry as outage |
| Custody pressure or pending drain | A current owner must retain resources | Restore the owning transfer or wait for exact release |

## Common Failure Classes

| Symptom | Owning stage | Meaning | Safe response |
| --- | --- | --- | --- |
| `ProviderUnavailable` | Purpose-specific provider boundary | No semantic result was available | Defer only the exact bounded operation under still-current authority |
| Authorization or policy denial | Authority or capability stage | Semantic refusal | Correct authority or request; never widen a credential for convenience |
| Stale generation, lease, route, grant, revision, or assignment | Authority validation | Superseded identity attempted affect | Fence and reconcile from current authority |
| Composition failure | Core graph conclusion | Terminal branches changed the same path differently | Repair graph design or add an explicit domain join |
| Reconciliation `unknown_outcome` | Stem action dispatch | Action may have committed after transport loss | Read exact action application and outcome before replan |
| Reconciliation `blocked` | Stem work resolution | Exact action failed or was rejected | Use plan key, action key, reason code, and current input revision |
| `CustodyPending` | Cell supply lifecycle | Exact local process or member custody remains | Defer only the matching provider generation, directive, and epoch |
| Chamber not ready | Activation, adapter, source, projection, or custody stage | Required readiness sources disagree | Inspect the first failed lifecycle transition; liveness is insufficient |
| Route rejected | Chamber selection or Cell validation | Selected member or route epoch is not current | Refresh projection; Cell must not substitute another member |
| Outcome unknown | Persistence or ledger commit | Affect may have committed before response loss | Resolve the exact stable identity |
| Evidence pressure | Cell journal or ledger processing | Custody capacity cannot safely accept more work | Restore processing; do not discard terminal reserve or unacknowledged batches |
| Actor owner lost | Actor residency | Current owner disappeared or was superseded | Advance epoch, hydrate durable state, resolve exact mutations, reject stale-owner commits |
| Drain does not complete | Owning lifecycle or custody stage | A route, actor, execution, evidence, process, or descriptor remains | Identify retained owner; do not force stopped or clean |

Use the [atlas](../architecture/atlas/README.md) to move from the relevant state
or sequence back to its cited contract and executable proof. Do not bypass a
failed authority, custody, or containment transition to force progress.

## Proof-Substrate Failures

Actual release proofs exposed failures that looked like runtime defects but
belonged to the proving environment:

| Symptom | Finding | Repair principle |
| --- | --- | --- |
| Unexpected existing PostgreSQL roles | Shared cluster retained earlier proof authority | Use a fresh isolated cluster per scenario |
| `protocol_version_mismatch` from an installed rootfs | Rootfs contained an obsolete Chamber protocol | Rebuild from measured source inputs; do not patch installed content |
| Cleanup reports one retained Cadenza cgroup | Enclosing proof service matched its own cleanup namespace | Keep harness services outside the runtime namespace being measured |
| PostgreSQL restart test exits without diagnosis | Shared TCP port race and discarded stderr | Isolate process namespaces and preserve exit diagnostics |
| Standalone Chamber or Cell test cannot find a fixture | Test depended on ambient parent-workspace authority | Use a governed repo-local contract snapshot |
| Increasing timeout reveals a different block | Timing was a bound, not the cause | Read authority progress and blocked state before changing timeouts |
| Replaced artifact classified as protocol shape failure | Size check masked signed-content mismatch | Preserve distinct shape and tamper meanings |

Before changing runtime source, verify source commits, manifest digest,
authority cluster, measured rootfs, standalone repository inputs, process exit,
and cleanup scope.

## Escalate With

Provide only safe correlation data:

- owning stage and bounded failure code;
- environment, plan, action, directive, generation, assignment, route, request,
  distribution, transport, mutation, evidence, batch, attempt, or receipt key;
- relevant revision, epoch, deadline, validity, digest, and started state;
- retained custody owner and last acknowledged transfer;
- exact forbidden shortcut and expected closure condition.

Do not attach raw contexts, actor state, callable source, credentials, private
keys, host objects, generic commands, or unrestricted endpoints.
