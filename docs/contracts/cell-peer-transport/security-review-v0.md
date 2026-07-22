# Cell Peer Transport V0 Security And Coherence Review

Date: 2026-07-14

## Verdict

Sprint 6B fits Cadenza's intended whole and is ready for its transport security
review gate. Opaque route members now preserve one authored primitive surface
across local and remote placement, and direct cell transport has explicit
identity, authority, confidentiality, execution-start, replay, bounds, process,
and evidence boundaries. No critical or high-severity finding remains in the
6B scope.

This verdict does not claim a complete two-cell environment. Authority-driven
chamber activation in the real host and the measured two-process gVisor proof
belong to Sprint 6C and must not begin until this review is accepted.

## Intended Whole

Cadenza should absorb deployment and distribution complexity so creators keep
their attention on business flow and task behavior. Sprint 6B preserves this:
chambers select opaque route members through the same private callbacks, while
the source cell alone interprets each selection as one exact local chamber or
remote cell generation. Authored definitions receive no endpoint, certificate,
credential, assignment, or transport object.

False success would be a virtual remote chamber, generic RPC surface, merely
signed plaintext, TLS authentication treated as execution authorization,
silent route substitution, retry-safe claims after an uncertain start, or a
cell executable with ambient command/provider authority. The implementation
rejects each of these shapes.

## Identities And State

Environment, cell enrollment, cell generation, transport key, placement unit
and revision, replica, assignment epoch, route member, route epoch, slice,
chamber, image digest and epoch, projection revision, session, envelope,
correlation, and evidence remain distinct.

TLS proves possession of a pinned transport key. Signed controls bind the peer
cell generations and session. The signed execution envelope binds current
placement and route meaning. The target independently rereads current
enrollment and route authority before acceptance, then revalidates exact local
generation, chamber, image, lane, readiness, and projection eligibility. Only a
valid signed `proceed` advances replay state from reserved to started.

## Affect And Boundaries

The peer transport exposes only delegation and signal. It is direct, one-hop,
TLS 1.3 mutual transport with exact certificate roots and post-handshake SPKI
checks. Every control, envelope, and result is canonical, bounded, signed, and
generation-bound. Unknown fields, duplicate keys, noncanonical encodings,
oversized frames or contexts, excessive lifetimes, stale authority, and result
overflow fail closed.

The Linux cell host runs unprivileged and has one exact argument and descriptor
surface. Configuration, certificate, private key, database credential,
pre-bound listener, lifecycle control, and append-only transport evidence each
have a distinct inherited descriptor. No path, shell, arbitrary provider,
destination, or environment credential is accepted. Remote plaintext
PostgreSQL is rejected until a separate authenticated database transport
contract exists.

## Evidence

The target records canonical `target_accepted`, `target_started`, and
`target_completed` events. The source records `source_outcome`. Source and
target records share envelope identity when an envelope was created, and bind
both generations, operation, correlation, route member, outcome, started state,
and normalized failure code. Evidence digests exclude their own digest field.

Raw business context, initiating subject, runtime principal, credentials,
certificates, keys, and endpoints are absent. Evidence append failure fails the
operation closed. This stream proves transport coordination only; it is not the
deferred realtime per-task business-execution evidence protocol.

## Findings Repaired

- Route-member derivation could collide when sibling slices declared the same
  responsibility. Owning slice identity is now part of the derived key.
- Cell route bindings initially lacked enough durable placement meaning for an
  exact remote decision. Unit revision, replica, assignment epoch, target
  generation, slice, lane, chamber, image, and responsibility are now bound.
- Chamber test values retained chamber-shaped identities after the opaque-field
  rename. They now prove route-member identity rather than only field naming.
- The replay ledger could evict a live guard at capacity and scanned every
  entry on every reservation. It now never evicts unexpired identities and
  performs normal reservations without a full scan.
- Canonical JSON parsing could still ignore unknown nested fields. Peer and
  host inputs now require an exact canonical deserialize/serialize round trip.
- Enrollment was checked at handshake but needed fresh source and local checks
  at execution ingress. Both are reread before acceptance.
- Result size was bounded by framing but not by the authored delegation limit
  on both sides. Target and source now enforce the exact result contract.
- The existing PostgreSQL reader uses `NoTls`; host startup now permits only an
  explicit Unix socket or loopback address.
- Transport outcomes were enforced but not mandatorily evidenced. A bounded
  context-free append-only evidence descriptor and digest-bound records are now
  part of the host contract.

## Contract Refinements

- Duplicate envelopes are rejected instead of returning cached business
  results. This keeps replay protection a generation-local guard rather than a
  hidden persistence or memory layer.
- Route epoch is signed source projection state. Durable placement equality is
  independently rederived at target ingress rather than treating that epoch as
  standalone database authority.
- The server remains serial in V0. Concurrency is an explicit later
  optimization and no throughput claim is made here.

## Remaining Bounded Risks

- Sprint 6C must prove that real host configuration, peer generation
  projection, chamber activation, and route installation all descend from
  current authority rather than test injection.
- The two-cell process/network path has not yet been measured under gVisor, and
  suspension/revocation convergence still needs the end-to-end closure proof.
- Replay state is generation-local and in memory. Cell loss can leave execution
  uncertain; exactly-once execution is not claimed.
- Transport-key rotation, endpoint mutation, remote PostgreSQL TLS, concurrent
  chamber execution, automatic retry, failover, and multi-hop routing remain
  outside V0.
- Realtime business-logic execution evidence remains a required dedicated
  review after Sprint 6 and before automated scale/orchestration.
- The previously approved machine-sensitive core performance suite remains
  deferred until a clean-machine rerun.

None of these risks contradicts the approved Sprint 6B scope.

## Validation

- Cadenza core: production build and all 143 non-performance tests passed.
- Environment bootstrap and distribution authority: typecheck and all 26 tests,
  including PostgreSQL migration and hostile role boundaries, passed.
- Chamber: formatting, strict Clippy, and all target tests passed.
- Cell: formatting, strict Clippy, and all target tests passed; one existing
  PostgreSQL/Node integration remains intentionally ignored.
- Linux Rust 1.97 container: strict Clippy, three host contract tests, and two
  fixed-argument/root-rejection process tests passed.
- Contract authority, fixture, and three cell transport/host schemas parse as
  valid JSON; the workspace agent harness passes.

## Links

- [Cell peer transport contract](v0.md)
- [Cell peer transport conformance](conformance-v0.md)
- [Neutral transport fixture](fixtures/v0-peer-transport.json)
- [Approved Sprint 6 design](../../agent-harness/exec-plans/active/2026-07-14-multi-cell-static-placement-design.md)
- [Multi-cell foundation decision](../../decisions/2026-07-14-multi-cell-static-placement-foundation.md)
- [Intended whole](../../cadenza-intended-whole.md)
