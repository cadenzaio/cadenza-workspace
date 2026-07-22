# Sprint 8B Actor Assignment And Residency Closure Review V1

Date: 2026-07-20

## Status

- Implementation state: `done`.
- Scope: global actor assignment, Cell owner resolution, Chamber residency,
  private owner endpoints, local/remote handler execution, and epoch fencing.
- Closure approval received: `Sprint 8B closure approved.` on 2026-07-20.
- Next phase: Sprint 8C hydration and strict write-through persistence is
  active.

## Intended Whole

Application authors express an actor-bound business task and its state key.
Cadenza resolves one current owner, executes only the actor handler there, and
continues the authored graph on the caller exactly once. Placement, owner
selection, generation fencing, endpoint derivation, and peer transport remain
runtime responsibilities.

## Delivered Contract

The neutral [Actor Distribution Contract V1](v1.md), four closed JSON schemas,
and canonical fixture define:

- digest-only assignment identity at database, route, grant, and evidence
  boundaries; raw state keys remain private invocation data.
- one immutable `actor_assignment_epoch` per ownership period.
- exact Cell, Cell generation, replica assignment, Chamber, image, slice, and
  placement provenance.
- deterministic generated owner endpoints bound to source task version,
  actor, access mode, Chamber, and image epoch.
- short-lived residency grants that carry current assignment authority but no
  database or topology capability.

## Authority Results

- PostgreSQL migration `013_actor_assignment_authority.sql` owns immutable
  placement history, immutable assignment epochs, and the current assignment
  pointer through purpose-separated owner, placement-operator, and resolver
  roles.
- `resolve_owner(jsonb)` validates the requesting ready Cell generation,
  serializes concurrent first touch with advisory transaction locks, bounds
  candidates at 4,096, and applies deterministic SHA-256 rendezvous selection.
- A healthy owner remains stable when capacity changes. Invalid ownership
  creates the next epoch lazily; the requester cannot nominate an owner.
- The Cell hashes raw state keys immediately, validates every PostgreSQL
  response field, derives the endpoint and grant itself, and rejects foreign,
  expired, or stale-local-generation answers.
- The target Cell independently re-resolves the digest before accepting a
  signed peer actor request. TLS identity does not substitute for current
  actor assignment authority.

## Runtime Results

- Chamber images contain one deterministic hidden endpoint per actor-bound
  task. The endpoint is not authored, registered, wired downstream, exposed as
  an intent, or independently placeable.
- Ordinary delegation to a hidden endpoint is denied. The separate Chamber
  protocol `0.8.0` command requires the exact endpoint and residency grant.
- Chamber residency is bounded to 65,536 keys and 1,024 pending invocations per
  key. Same-key work is serialized; distinct keys can progress independently.
- Older epochs, same-epoch identity drift, expired grants, stale Cell or
  Chamber generations, image drift, and forged endpoint provenance fail before
  handler affect.
- The TypeScript core exposes an internal continuation-style actor coordinator
  without adding persistence or topology to primitive definitions. Ordinary
  authored handlers still receive exactly five arguments; private execution
  identity reaches only the internal actor wrapper.
- Local owner execution validates and registers current residency before the
  handler resumes. Remote execution uses signed Cell peer protocol `0.2.0`,
  executes only the hidden owner endpoint, returns its result, and then runs
  caller relationships exactly once.

## Scenario Coverage

- two concurrent resolvers touching one unassigned actor key receive one owner
  and one assignment epoch.
- adding a ready replica does not move a healthy key.
- invalidating the owner produces exactly the next epoch on an eligible
  successor.
- no eligible owner and stale requesting generation fail closed.
- resolver credentials cannot read or mutate assignment tables directly.
- immutable placement and assignment history reject update and delete.
- raw state keys are absent from assignment and residency serialization.
- local owner execution accepts current authority and rejects stale epoch,
  generation, image, and endpoint identity.
- same-key calls serialize while different keys progress concurrently.
- simulated remote handler completion resumes downstream caller work once and
  does not replay owner-side relationships.
- real mutually authenticated Cell TLS transport carries a signed actor
  operation, bounded result, replay identity, and actor-specific transport
  evidence without raw context disclosure.

## Coherence Review

### Intent And Identity

Actor definition, state key, assignment epoch, replica assignment, Cell
generation, Chamber image, and task version remain separate identities. No
cache, route, process, or state version is allowed to impersonate ownership.

### Affect And Security

The caller can supply business input and a state key, but cannot select an
owner, endpoint, assignment epoch, grant, route member, or credential. The
Cell derives authority and the Chamber verifies it at the final execution
boundary. Remote trust is checked both through signed peer custody and fresh
target-side PostgreSQL resolution.

### Relationships And Interpretation

The actor handler crosses the ownership boundary; authored graph relationships
do not. This preserves the graph as caller-owned coordination and prevents
duplicate downstream affect. Explicit stale, invalid, unavailable, pressure,
denied, and transport outcomes preserve failure meaning across layers.

### Temporal Stewardship

Assignment epochs are immutable and monotonic. Generated endpoints are image
and version bound. Previous Cell generations, Chamber images, grants, and peer
messages cannot regain authority after succession.

### Operational Complexity

Sprint 8B adds no scheduler, rebalance controller, lease loop, or background
actor process. It adds one request-driven PostgreSQL resolver, one bounded
Chamber residency registry, generated image descriptors, and one operation on
the existing Cell and peer protocols. Healthy keys do not churn when capacity
changes.

## Deferred Scope And Risk

- Sprint 8B establishes ownership and execution location but does not claim
  durable actor state. Hydration, state validation, write-through commit,
  stable mutation identity, and unknown-commit resolution belong to Sprint 8C.
- Graceful assignment relinquishment, abrupt loss integration, actor lifecycle
  evidence, pressure destruction, and the definitive Linux/gVisor recovery
  proof belong to Sprint 8D.
- Chamber ingress is currently serialized through one mutable runtime. The
  per-key coordinator already proves stricter same-key behavior and independent
  key concurrency, but broader Chamber concurrency remains the separately
  deferred optimization pass.
- The four machine-sensitive TypeScript performance tests remain deferred
  until the agreed clean computer restart.

No unresolved authority or graph-continuation concern blocks Sprint 8B
closure. The deferred items are explicit dependencies of 8C or 8D rather than
missing 8B behavior.

## Validation

- TypeScript core: warning-free build and all 149 non-performance tests.
- TypeScript Chamber adapter: build and digest-pinned artifact generation.
- Chamber: formatting, clippy with warnings denied, and full Rust tests,
  including actor residency, hostile endpoint, and real adapter proofs.
- Cell: formatting, clippy with warnings denied, all enabled Rust tests, three
  actor assignment tests, and authenticated peer actor transport proof. One
  pre-existing opt-in PostgreSQL/Node protocol test remains explicitly ignored.
- Environment bootstrap: typecheck, build, all 107 tests, PostgreSQL migration
  replay, concurrent assignment, stable-owner, successor, immutability, and
  hostile resolver-role proofs.
- Workspace: neutral JSON contracts parse and the agent harness passes.

## Closure

Sprint 8B closure was approved on 2026-07-20. Sprint 8C must build on these
assignment and residency identities and may not make in-memory state or a
transport response into durable authority.
