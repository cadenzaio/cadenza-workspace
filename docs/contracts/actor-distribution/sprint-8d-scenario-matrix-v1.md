# Sprint 8D Actor Failure Scenario Matrix V1

Date: 2026-07-20

## Purpose

This matrix maps every required Sprint 8D failure and lifecycle scenario to an
exact proof. A scenario may be proved compositionally when reproducing every
process-crash instant in the definitive lifecycle test would make that test
less interpretable. The same fences are used by focused and production paths.

## Matrix

| Scenario | Expected meaning | Proof |
| --- | --- | --- |
| Concurrent first touch from two Cells | PostgreSQL serializes selection and returns one epoch and owner. | `environment-bootstrap/tests/postgres-distribution-authority.test.ts`, concurrent `resolve_owner` calls in the distribution authority test. |
| Healthy owner after capacity change | A current eligible owner is continued; rendezvous selection is not rerun merely because capacity appears. | PostgreSQL distribution authority test plus the definitive two-Cell proof's unchanged epoch after scale-up. |
| Concurrent local first touch | One per-key Chamber lane admits work in strict order; queued calls cannot bypass residency validation or hydration. | `cadenza-chamber/tests/actor_residency.rs::serializes_same_key_and_allows_distinct_keys_to_progress` and TypeScript core actor serialization tests. |
| Clean eviction and same-owner rehydration | Distributed state is unloaded after each successful or failed execution without ending assignment; every later invocation hydrates current durable state under the continued epoch. Idle grants and lanes are independently reclaimed within the Chamber bound. | TypeScript distributed state-release regression, `actor_residency.rs::reclaims_idle_capacity_and_drain_waits_for_active_work`, and the Chamber actor-owner adapter test's hydrate-before-execute path. |
| Successful read and write-through mutation | Reads observe authoritative hydration; writes become visible only after version-fenced commit. | TypeScript actor tests, `typescript_adapter.rs::generated_actor_owner_endpoint_requires_current_residency_authority`, and PostgreSQL hydration/commit assertions. |
| Lost response before durable commit | A failed commit followed by exact `not_found` remains failed and releases no candidate state or buffered affect. | Chamber actor-owner adapter rejected-commit/outcome proof and Cell persistence-outage evidence proof. |
| Lost response after durable commit | The same mutation identity resolves to its committed result and is accepted once. | Chamber unknown-commit recovery proof and PostgreSQL exact mutation replay/outcome proof. |
| Duplicate delivery | Equal mutation-key replay returns the original commitment; changed content under that key is rejected. | PostgreSQL distribution authority test and TypeScript distributed candidate-state tests. |
| Owner loss before hydration | Current residency is checked by PostgreSQL before state is returned; stale generation or epoch receives no state. | PostgreSQL hydration fencing and hostile-role assertions; Cell foreign-generation persistence test. |
| Owner loss during handler | The handler has only isolated candidate state and buffered signals; the later commit rechecks current residency and rejects stale authority. | TypeScript precommit containment tests plus PostgreSQL commit fencing. |
| Owner loss before commit | The stale epoch cannot commit and no downstream affect is released. | Chamber stale-grant test, PostgreSQL stale assignment/version tests, and TypeScript failed durable commit proof. |
| Owner loss after commit before response | Exact outcome lookup under the stable mutation key distinguishes committed from not found. | Chamber unknown-commit recovery and PostgreSQL outcome resolver proofs. |
| Stale owner or generated endpoint | Target Cell re-resolves assignment; Chamber rechecks generation, image, endpoint provenance, and epoch before affect. | `peer_transport.rs::assignment_drift_is_rejected_before_the_proceed_boundary`, actor residency hostile tests, and actor-owner adapter private/stale endpoint tests. |
| Graceful owner drain | New work is rejected, active lanes finish, exact assignments are relinquished after the local barrier, and aggregate evidence is recorded. | `actor_residency.rs::reclaims_idle_capacity_and_drain_waits_for_active_work`, `orchestrator.rs::chamber_drain_requires_actor_relinquishment_and_records_aggregate_evidence`, and PostgreSQL relinquishment proof. |
| Abrupt Cell or Chamber loss | Existing route and generation authority invalidate the predecessor; next touch creates a later actor epoch and hydrates last committed state. | Existing generation/route-loss tests plus the definitive Linux two-Cell actor proof. |
| PostgreSQL outage | Assignment, hydration, commit, outcome resolution, and failover do not invent local authority; commit transport loss is classified as uncertain. | Cell actor persistence-outage evidence test, PostgreSQL provider reconnection tests, and authority unavailability paths. |
| Corrupt, oversized, or incompatible state | Exact JSON shape, 1 MiB byte bound, depth 64 bound, and actor schema validation fail before handler or commit affect. | PostgreSQL byte/depth assertions, Chamber over-depth hydration test, neutral JSON schemas, and core actor schema tests. |
| No owner or route skew | No eligible owner is unavailable; target re-resolution rejects caller-selected or stale endpoint authority. | PostgreSQL no-candidate proof, `actor_assignment.rs` hostile responses, and peer assignment-drift proof. |
| High-cardinality pressure | Residency is capped at 65,536 keys, each key at 1,024 pending calls, idle capacity is reclaimed, payloads are bounded, and evidence uses existing bounded custody. | Actor residency limit tests, Chamber frame/result bounds, PostgreSQL candidate cap, and existing evidence-custody pressure tests. |
| Placement, supply, stem, evidence, and cleanup | Actor ownership follows ready placed replicas, survives scale-up and owner withdrawal, uses ordinary evidence custody, and leaves no process, route, or assignment residue after shutdown. | Definitive Linux/gVisor multi-Cell actor proof layered on the Sprint 7 convergence, supply, stem-recovery, evidence, and cleanup proof. |

## Failure-Window Composition

The four abrupt-loss windows do not rely on timing luck. Before hydration and
commit, PostgreSQL validates current residency in the same authoritative
operation. During the handler, state and signals are isolated. After commit,
the immutable mutation commitment resolves response ambiguity. A predecessor
therefore cannot turn process timing into a second authority.

## Evidence-Layer Mapping

Actor evidence remains layered rather than duplicating the complete execution
protocol into one record type:

| Concern | Authoritative evidence |
| --- | --- |
| Assignment resolution and routing | Cell-observed `actor.assignment_*` and `actor.invocation_routed` records. |
| Residency loading and readiness | Cell-observed hydration outcome joined to the ordinary task-execution start through shared trace, graph, and task ancestry. |
| Read or write attempt | Ordinary task-execution evidence identifies the actor-bound task; actor routing evidence binds its actor, key digest, epoch, endpoint, and path. |
| Commit and uncertain outcome | Cell-observed actor commit and outcome records with stable mutation, version, state, and result commitments. |
| Clean state release | The adapter's mandatory release-after-execution invariant and the Chamber's delegation completion evidence. No raw state or state key is emitted. |
| Graceful drain | Chamber lifecycle evidence plus aggregate `actor.assignment_relinquished` evidence after the local barrier. |
| Abrupt loss and succession | Generation/residency loss evidence, immutable PostgreSQL `assignment_end`, and the successor's later `actor.assignment_created` record. A lost process is not trusted to self-report its loss. |

There is no hydration-join event in Sprint 8 because the conservative runtime
does not share in-flight hydration: strict per-key admission hydrates each
invocation in order. If hydration single-flight is introduced during the later
concurrency optimization, its joined callers require explicit evidence.

## Deferred Optimization

The current distributed path hydrates on every local invocation and unloads
the state instance after acceptance. Cached hydration, broader Chamber
concurrency, and a performance pass remain deferred. This costs throughput but
removes a cache-coherence protocol and unbounded adapter state from the first
complete environment without weakening any scenario above.
