# Sprint 8D Actor Operational Complexity Inventory V1

Date: 2026-07-20

## Result

Sprint 8 adds request-driven actor coordination, not another control plane.
There is no actor scheduler, rebalance loop, write-behind worker, independent
lease, cache-invalidation service, or general persistence broker.

## Inventory

| Kind | Added state or work | Bound and cleanup |
| --- | --- | --- |
| Timer | Invocation and assignment deadlines only. | Existing request deadlines; no actor-owned repeating timer. |
| Retry | One exact mutation-outcome lookup after an indeterminate commit response. | Stable mutation identity; no autonomous retry loop and no retry with new content. |
| Queue | Chamber per-key mutex waiters. | At most 1,024 pending invocations per actor/key; pressure rejects before admission. |
| Local cache | Residency grants, per-key lanes, pending counts, and completed-drain identities. | At most 65,536 residencies per Chamber; distributed adapter state unloads after each accepted invocation; idle lanes are reclaimed; drain clears residency; Chamber termination drops all local state. |
| Generated surface | One hidden owner endpoint per actor-bound task in the immutable runtime image. | Bounded by runtime-image task limits; revision, Chamber, image, and generation bound. |
| Payload | Actor key at private ingress, state, handler result, and protocol frame. | Key 4 KiB; state/result 1 MiB each; JSON depth 64; bounded canonical frames. |
| Assignment selection | PostgreSQL evaluates eligible ready replicas. | At most 4,096 canonical candidates; one transaction lock per actor/key resolution. |
| Evidence | Assignment, route, hydration, commit, outcome, and aggregate relinquishment records. | Existing bounded Cell journal and evidence-processor custody; raw key, state, input, and result excluded. Custody failure fails the operation closed. |
| Durable projection | `placement_authority`, `current_assignment`, and `current_state`. | At most one current row per governed identity; replaced or removed transactionally. |
| Durable history | `assignment_epoch`, `assignment_end`, and `mutation_commit`. | Append-only authority and idempotency history. Growth follows accepted business mutations and ownership changes, not timers or retries. |
| Cleanup | Idle eviction, graceful Chamber drain, exact assignment relinquishment, route invalidation, and process cleanup. | Existing Chamber and Cell lifecycle; relinquishment is idempotent and scoped to one generation/image. |

## Durable-History Boundary

Mutation commitments cannot be discarded casually: they are the evidence that
an old stable mutation identity already changed state and they resolve a lost
response without double application. Assignment epochs likewise prove that an
old owner never regains authority. These tables are deliberately durable and
can grow with real business history.

That is a database capacity and archival concern, not an unbounded runtime
queue. Any future retention or compaction rule must preserve deduplication and
historical fencing and therefore requires its own design gate. Sprint 8 does
not hide this cost behind an unsafe time-based deletion policy.

## Coherence Judgment

The operational machinery is proportional to actor use and reuses existing
Cell, Chamber, PostgreSQL, and evidence lifecycles. The main throughput cost is
conservative hydrate-before-each-invocation behavior. It is explicit, easy to
reason about, and suitable for the first complete environment; optimization
must preserve the authority and failure semantics proved here.
