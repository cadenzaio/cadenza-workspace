# Cadenza Troubleshooting Guide

## Start With Authority, Not Processes

1. Identify the failing identity and its current generation or epoch.
2. Read durable desired authority and the latest signed observation.
3. Check whether assignment, image, source slice, route, readiness, and custody
   agree.
4. Find the overarching trace and the last started/completed/failed transition.
5. Classify the outcome before retrying.

## Common Failure Classes

| Symptom                                       | Meaning                                                     | Response                                                                           |
| --------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `ProviderUnavailable`                         | Transport or provider availability failure                  | Defer with bounded retry under still-current authority.                            |
| Authorization or policy denial                | Semantic refusal                                            | Do not retry as availability; correct authority or request.                        |
| Stale generation, lease, route, or assignment | Superseded identity attempted affect                        | Fence it and reconcile from current authority.                                     |
| Composition failure                           | Terminal branches changed the same path differently         | Repair graph design or add an explicit domain join.                                |
| Outcome unknown                               | Affect may have committed before connection loss            | Resolve the exact idempotency identity before continuing.                          |
| Evidence pressure                             | Custody capacity cannot safely accept more work             | Restore ledger processing; do not discard terminal reserve.                        |
| Chamber not ready                             | Admission, adapter, source, authority, or custody disagrees | Inspect the lifecycle transition that failed; process liveness is insufficient.    |
| Actor owner lost                              | Current residency disappeared                               | Advance assignment epoch, hydrate committed state, and reject stale-owner commits. |

Use the [atlas](../architecture/atlas/README.md) to move from the relevant state
or sequence back to its cited contract and executable proof. Do not bypass a
failed authority, custody, or containment transition to force progress.
