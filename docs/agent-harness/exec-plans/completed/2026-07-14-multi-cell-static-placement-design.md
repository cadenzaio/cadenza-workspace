# Multi-Cell Distribution And Static Placement Design Proposal

Date: 2026-07-14

## Goal

- Outcome: prove that one Cadenza environment can govern more than one cell,
  assign explicit placement replicas to them, and carry ordinary delegation and
  signal behavior across cell boundaries without exposing deployment topology
  to authored business logic.
- Why it matters: Sprint 5 proved the complete local pattern. Sprint 6 must
  preserve that pattern across cells before scaling, automatic placement, actor
  residency, or orchestration multiplies its failure modes.

## Status

- State: `done`
- Current repo: `cadenza-workspace`
- Current phase: complete; Sprint 6 closure accepted on 2026-07-15.
- Complexity gate: required for authority/schema changes, a new cell process,
  authenticated network transport, breaking shared contracts, new dependencies,
  multi-repo work, and an implementation expected to exceed 200 LOC.

## Context

Sprint 5 established:

- one cell-generation identity with deterministic host meta authority.
- multiple contained chambers with immutable source images.
- chamber-specific projections and exact acknowledgement.
- source-selected local routing with no silent host reroute.
- successor-first replacement and serialized quiescence.
- generated proxy delegation and detached signal forwarding without topology in
  authored context.
- measured four-chamber Linux gVisor conformance.

Sprint 6 starts from four implementation facts that older proposals did not
fully account for:

1. `cadenza-cell` is currently a trusted library boundary. There is a
   privileged launcher executable, but no unprivileged cell-host daemon.
2. Chamber projections name candidate chamber keys. Treating a remote workload
   as a fake local chamber would corrupt that identity.
3. PostgreSQL activation authority is complete for the bootstrap authority
   slice, while general operational source slices are currently proved through
   strict in-memory conformance hosts.
4. Additional post-bootstrap cell enrollment, static placement authority, and
   distributed route projections do not yet exist.

Sprint 6 therefore cannot be only a network adapter. It must establish the
minimum authority, identity, process, and transport substrate that makes two
cells real and mutually interpretable.

## Intended Whole

Cadenza should make physical distribution an implementation consequence of the
same readable primitive flow. A creator should still signal, delegate, and
inquire through normal Cadenza APIs while the environment absorbs cell identity,
placement, routing, transport security, retries, and lifecycle checks.

False success would include:

- two logical cells simulated inside one test object.
- raw or merely signed plaintext transport.
- a generic RPC API beside Cadenza primitives.
- virtual remote chambers that blur chamber and placement-replica identity.
- placement records that are not connected to runtime route eligibility.
- manually injected route maps that bypass environment authority.
- introducing the stem cell, dynamic scheduling, or automatic healing before
  static assignment and transport semantics are stable.

## Scope

### In Scope

- a real unprivileged `cadenza-cell` host process with one cell-generation
  identity per process lifetime.
- post-bootstrap enrollment of additional governed cells.
- `trusted_control` and `standard` cell trust profiles.
- separate enrolled transport key identity in addition to the existing
  cell control/containment key.
- governed cell capability grants and bounded integer slot capacity.
- explicit static placement units, slice memberships, replicas, assignments,
  observed residencies, and route members.
- one chamber per placement-unit member per replica.
- deterministic static placement eligibility checks for trust, capabilities,
  assignment, and capacity.
- authority-derived cell and route projections.
- opaque route-member candidates in chamber projections.
- mutually authenticated encrypted cell transport.
- signed canonical delegation and signal envelopes.
- direct one-hop cell-to-cell routing only.
- bounded replay protection, deadlines, result limits, and started-state
  preservation.
- cell suspension/revocation and stale-route convergence.
- deterministic conformance, hostile-boundary tests, and a Linux gVisor
  two-cell closure proof.

### Out Of Scope

- stem-cell materialization or reconciliation.
- dynamic replica counts, automatic assignment, scheduling, optimization,
  anti-affinity, packing, or capacity-driven cell creation.
- automatic failover, healing, evacuation, or route convergence loops.
- multi-hop forwarding, relays, gateways, public ingress, service discovery, or
  cross-environment transport.
- exactly-once distributed execution or durable orchestration.
- cell transport-key rotation or endpoint mutation after initial enrollment.
- actor residency, hydration, ownership, or persistence.
- chamber execution concurrency.
- Python, Elixir, or C# chamber adapters.
- plugins, secrets, UI, CLI, agents, or memory.

## Proposed Approach

1. Stabilize general source, cell-enrollment, and static-placement authority in
   `cadenza` before adding network consequence.
2. Express enrollment and placement management as a contained Cadenza meta
   slice over fixed authority operations.
3. Generalize chamber routing from location-specific chamber keys to opaque
   route-member identities.
4. introduce a real unprivileged cell-host process and authority-pinned secure
   peer transport in `cadenza-cell`.
5. prove the same authored primitive flow first locally and then across two
   cell processes with separately contained chambers.
6. close with recursive coherence and security reviews before any stem-cell or
   dynamic-placement work begins.

## Impacted Repositories

- `cadenza`: general source authority, enrollment and placement schema,
  authority operations, projection readers, distribution-control meta slice,
  fixtures, and PostgreSQL conformance.
- `cadenza-chamber`: neutral route-member projection and private callback
  contracts; no network listener, cell placement, or peer credentials.
- `cadenza-cell`: cell-host process, enrollment proof verification, static
  placement interpretation, local/remote route resolution, TLS transport,
  signed envelopes, replay state, evidence, and Linux integration.
- `cadenza-workspace`: shared contracts, fixtures, decisions, execution plan,
  security/coherence review, and cross-repo evidence.

The official Python, Elixir, and C# cores are unaffected because primitive and
graph-conclusion meaning does not change.

## Identity And State Model

Sprint 6 keeps durable authority and runtime observation distinct.

### Cell Enrollment

`CellEnrollment` is durable environment authority:

- environment and cell key.
- trust profile: `trusted_control` or `standard`.
- existing cell control/containment public-key reference.
- separate transport public-key reference and digest.
- fixed internal transport endpoint and protocol.
- sorted capability grants using the governed capability registry.
- positive slot capacity.
- status: `active`, `suspended`, or `revoked`.
- enrollment grant, proof, authority revision, and evidence identity.

Enrollment status is not process readiness. `revoked` is terminal. A suspended
cell is not routable and cannot activate new work.

### Cell Generation

`CellGeneration` is runtime identity:

- environment key.
- cell key.
- fresh cell-generation key.
- process start identity.
- local state: `starting`, `ready`, `draining`, or `stopped`.

A TLS handshake binds the currently active peer generation. Restart creates a
new generation, so envelopes bound to the old target generation fail closed.

### Placement Unit

A static placement unit defines what scales together:

- unit key and immutable definition revision.
- mode: `singleton` or `replicated`.
- positive slot cost.
- sorted runtime-slice memberships with `primary` or `support` roles.
- derived required capabilities and trusted-cell requirement.

Every V0 membership is required. Roles express responsibility; they do not make
support members optional. Each placement replica materializes one chamber for
each unit member. This preserves the chamber's one-slice image boundary while
allowing several slices to scale as one unit.

### Replica, Assignment, And Residency

- `PlacementReplica` is stable workload identity for one copy of a unit.
- `ReplicaAssignment` is static authority binding one replica and assignment
  epoch to one enrolled cell.
- `ReplicaResidency` is signed observed state from the assigned cell and names
  the exact member chambers and image epochs.
- a replica is ready only when every required member has a ready residency.
- a `RouteMember` is derived from active enrollment, current assignment, ready
  residency, declared unit membership, and task/signal responsibility.

Static assignment is accepted only when the cell is active, trust-compatible,
capability-compatible, and has sufficient declared slot capacity. Sprint 6
validates a supplied assignment; it does not choose one.

## Authority Model

### General Source Authority

Sprint 6 introduces the durable general source-slice authority required by the
first environment. The bootstrap authority-access slice remains the privileged
special case, while common runtime identity, version, artifact, trust,
capability, runtime, activation, and revocation fields become readable through
one current activation-authority contract for any approved slice.

The existing authority slice is linked into that common contract rather than
silently duplicated. Source definitions remain serialized authority;
callable materialization remains inside the contained language adapter.

### Domain Operations

The fixed authority gateway gains explicit operations rather than generic CRUD:

- `RuntimeSlice.Register`
- `RuntimeSlice.Revoke`
- `Cell.Enroll`
- `Cell.Suspend`
- `Cell.Revoke`
- `Placement.DefineUnit`
- `Placement.DefineReplica`
- `Placement.AssignReplica`
- `Placement.PublishResidency`

Every mutation is canonical, idempotent, revision-bound, evidence-producing,
and transactionally constrained. Placement reads use a separate least-privilege
projection reader, not the mutation role.

`Cell.Enroll` requires:

- a short-lived environment-root-signed enrollment grant binding both cell
  keys, trust profile, capabilities, capacity, endpoint, protocol, nonce, and
  validity.
- proof of possession from the candidate cell transport key over the canonical
  grant digest.
- current active trust-root and environment authority.
- a unique enrollment grant and nonce.

The trusted cell broker verifies signatures before provider invocation. The
PostgreSQL transaction verifies the exact brokered proof record and commits the
enrollment and authority evidence together.

### Cadenza Extends Cadenza

The authority operations are substrate boundaries, not the management API.
Sprint 6 adds a contained distribution-control meta slice whose ordinary tasks
compose the enrollment and static-placement flows and delegate mutations to the
authority-access slice. It receives no database credential or generic host
power.

This keeps feature orchestration in Cadenza primitives while leaving signature
verification, transport, database enforcement, and process custody in the
runtime substrate.

## Route Model

The current `candidate_chamber_keys` contract cannot represent distribution
without misnaming remote workloads. Sprint 6 replaces it with opaque
`candidate_route_member_keys`.

Generated chamber support:

- sees only route-member identity, route epoch, and selection rule.
- selects one projected member deterministically.
- sends the selected member back through its private cell callback.
- never receives a cell endpoint, TLS identity, placement assignment, or
  transport credential.

The source cell resolves the selected route member through current host
authority to either:

- one exact local chamber; or
- one exact remote cell, placement replica, and destination member chamber.

The cell validates the source-selected member and never substitutes another
candidate. This generalizes Sprint 5 without leaking distribution into authored
logic or pretending that remote replicas are local chambers.

## Cell Host Process

Sprint 6 adds the unprivileged `cadenza-cell` executable. It owns:

- one cell-generation identity.
- local chamber orchestration.
- the launcher client and chamber descriptor custody.
- authority and placement projection readers.
- transport listener and peer sessions.
- transport private-key custody.
- distributed replay state and evidence.

It starts only through a fixed service shape with strict inherited descriptors
for configuration, transport key material, and deployment-owned credentials.
It does not accept arbitrary commands, mounts, executables, providers, or
network destinations. Private material never enters chamber frames, business
context, evidence, or logs.

## Inter-Cell Transport

### Channel

- TLS 1.3 over TCP.
- mutual authentication using the separately enrolled transport keys.
- peer certificate/public-key identity pinned to current authority rather than
  ambient public PKI.
- authority-projected fixed endpoints; no discovery or arbitrary destination.
- length-prefixed bounded canonical JSON frames inside TLS.
- one direct peer hop; no forwarding.

TLS provides peer authentication and confidentiality. Every execution envelope
is also Ed25519-signed with a domain-separated canonical digest so acceptance
and evidence remain independently interpretable after the connection ends.

### Handshake

The authenticated handshake binds:

- protocol version.
- environment key.
- source and target cell keys.
- both current cell-generation keys.
- current enrollment and route-projection revisions.
- random channel nonces.

Wrong environment, inactive enrollment, stale key, unsupported protocol, or
generation drift fails before execution traffic is accepted.

### Delegation Envelope

The signed body binds:

- envelope and idempotency identity.
- environment, source cell/generation, and target cell/generation.
- source chamber, image epoch, projection revision, route group, route epoch,
  and selected route-member key.
- target unit, replica, member chamber, task key, and assignment epoch.
- initiating subject and runtime principal.
- correlation identity, absolute deadline, and maximum result bytes.
- bounded ordinary context.
- issued/expires times and canonical body digest.

The target validates current enrollment, assignment, residency, route
membership, lane rules, deadline, signature, digest, generation, and replay
state before local chamber ingress. It returns the existing normalized
delegation outcome with target acceptance and started-state identity intact.

### Signal Envelope

Signal transport binds the same authority and route identities, replacing the
task/result fields with the signal key. The target injects the existing private
`no_forward` marker so a delivered signal cannot loop back into distributed
forwarding. Acceptance remains bounded ingress, not detached completion.

### Inquiry

No separate inquiry transport is introduced. As in Sprint 5, an inquiry uses a
generated local proxy task and crosses cells as ordinary delegation to the
declared target task. Graph conclusion remains owned by the target core.

### Replay And Failure

- envelope keys are unique within the source generation.
- the target keeps a bounded replay ledger for its generation.
- target-generation binding invalidates old envelopes after restart.
- duplicate envelopes are denied. The generation-local replay ledger is an
  execution guard, not a business-result cache or persistence layer.
- timeout before target graph start is not execution-started.
- timeout or connection loss after start remains started execution failure or
  transport uncertainty and is never presented as safely retryable.
- exactly-once execution across cell loss is not claimed.

## Implementation Slices

### Sprint 6A: Distribution Authority Foundation

Impacted repos: `cadenza`, `cadenza-cell`, `cadenza-workspace`.

- define neutral contracts and canonical fixtures.
- add general source-slice activation authority.
- add explicit source-slice registration and revocation operations.
- add root-authorized additional-cell enrollment and lifecycle operations.
- add governed capability/capacity declarations.
- add static unit, replica, assignment, residency, and route projections.
- add the distribution-control meta slice.
- prove transaction, idempotency, stale revision, capability, capacity, trust,
  signature, possession, suspension, and revocation behavior.

Gate: authority and schema coherence/security review before network transport.

Sprint 6A implementation and validation are complete. The gate review is
recorded in [Distribution V0 closure review](../../contracts/distribution/closure-review-v0.md).
The Sprint 6A review was accepted and Sprint 6B is complete.

### Sprint 6B: Cell Process And Authenticated Transport

Impacted repos: `cadenza-chamber`, `cadenza-cell`, `cadenza-workspace`.

- replace chamber candidates with opaque route-member identities.
- introduce the unprivileged cell-host executable.
- add authority-pinned TLS peer sessions and canonical signed envelopes.
- add local/remote route resolution without silent substitution.
- preserve delegation, signal, no-forward, deadline, and graph-conclusion
  semantics across cells.
- add hostile transport, replay, generation, enrollment, assignment, route,
  identity, frame, and result-bound tests.

Gate: transport security review before Linux closure.

### Sprint 6C: Two-Cell Environment Proof

Impacted repos: `cadenza`, `cadenza-chamber`, `cadenza-cell`,
`cadenza-workspace`.

- start two distinct cell-host processes with separate generations and keys.
- activate assigned source chambers under gVisor.
- prove remote delegation, inquiry-through-proxy, and detached signal.
- prove static replica eligibility and multi-member readiness.
- prove target replacement or route-epoch refresh without topology entering
  authored context.
- prove suspension/revocation removes remote eligibility.
- prove orderly cell/chamber drain and no remaining container, bundle, cgroup,
  listener, or process.

The Linux proof may run both cell processes on one isolated host. It proves
multi-cell process and network semantics, not independent-host fault domains or
production deployment certification.

## Contract Governance

Authority order:

1. `cadenza` defines source, enrollment, placement, and gateway authority.
2. workspace neutral contracts and fixtures define shared language-independent
   meanings.
3. `cadenza-chamber` changes route-candidate identity first for its contract.
4. `cadenza-cell` consumes both authorities and implements process/transport.

Breaking changes include:

- adding the transport key to cell enrollment/bootstrap fixtures.
- generalizing activation authority beyond the bootstrap slice.
- replacing candidate/selected chamber keys with route-member keys.
- extending the fixed authority gateway operation family.

Backward compatibility is not required. Protocol and fixture versions advance
explicitly; no legacy field is silently reinterpreted.

## Security Review Requirements

- enrollment root signature and candidate key possession.
- control/containment key separated from transport key.
- current enrollment and revocation checked at handshake and envelope ingress.
- TLS 1.3 mutual authentication with authority-pinned peer keys.
- signed canonical envelopes with domain separation.
- bounded frames, contexts, chains, results, clocks, and replay ledger.
- exact source and target generation binding.
- assignment/residency/route epoch revalidation before execution.
- no credentials, provider objects, private keys, or endpoints in chamber or
  callable payloads.
- no generic RPC, arbitrary destination, relay, shell, or network capability.
- started-state preservation under timeout and connection loss.
- structured evidence without raw business context or secrets.
- Linux process, listener, descriptor, containment, and cleanup inspection.

## Success Criteria

- a second standard cell can be enrolled only through a valid root grant and
  proof of transport-key possession.
- suspended or revoked cells cannot handshake, activate, receive assignment, or
  remain routable.
- capability, trust, or slot mismatch rejects static assignment.
- a placement replica becomes ready only when every required member chamber is
  ready on its assigned cell.
- source chambers select opaque route members and cannot see endpoints or peer
  credentials.
- remote delegation preserves graph conclusion and exact started-state meaning.
- remote signals preserve detached acceptance and no-forward behavior.
- inquiry uses the same local proxy API and distributed delegation path.
- stale generation, route, assignment, residency, replay, signature, or TLS
  identity fails before target graph start.
- two real cell-host processes and their contained chambers pass the Linux
  closure proof.
- authored business definitions are unchanged between local and remote
  placement.
- complete repository validation and a final recursive coherence/security
  review pass.

## Risks And Controls

- **Authority expansion becomes generic management CRUD.** Control: named
  domain operations, strict payloads, fixed broker dispatch, primitive-native
  distribution-control flows, and separate read projections.
- **Cell identity, process state, and placement state collapse together.**
  Control: separate enrollment, generation, assignment, residency, and route
  member identities with explicit transitions.
- **Remote topology leaks into chamber or business context.** Control: opaque
  route-member candidates and private host callbacks.
- **Transport authentication is mistaken for execution authorization.**
  Control: TLS authenticates the peer; every envelope still revalidates current
  enrollment, assignment, residency, route, lane, deadline, and signature.
- **Replay duplicates business affect.** Control: generation-bound envelope
  identity, bounded replay ledger, duplicate rejection, and no exactly-once
  claim.
- **Static placement grows into an implicit scheduler.** Control: validate
  explicit assignments only; no candidate ranking or assignment selection.
- **A multi-member unit becomes partially routable.** Control: unit readiness
  requires every required member residency.
- **The cell daemon becomes a generic service host.** Control: fixed startup
  descriptors, fixed protocols, named providers, and no arbitrary command,
  mount, provider, or destination surface.
- **Same-host Linux evidence is overstated.** Control: claim process/network
  conformance only; independent-host failure and production attestation remain
  future evidence.

## Migration Strategy

- Fresh environments use the expanded bootstrap cell enrollment including a
  distinct transport key.
- Existing development fixtures are regenerated; no compatibility adapter is
  introduced.
- the bootstrap authority slice is linked into the generalized source authority
  contract before ordinary source slices are registered.
- local Sprint 5 routes migrate mechanically from chamber candidates to route
  members that resolve to the same local chambers.
- inter-cell routes become eligible only after enrollment, assignment,
  residency, peer handshake, and route projection all agree.

## Alternatives

- **Represent remote replicas as virtual chambers:** rejected because chamber,
  replica, and cell are distinct identities.
- **Keep chamber keys and add cell keys beside them:** rejected because the
  chamber would become aware of placement topology and candidate meaning would
  branch by location.
- **Use signed plaintext TCP:** rejected because business context requires
  confidentiality as well as integrity.
- **Use TLS without signed envelopes:** rejected because durable evidence and
  replay interpretation should not depend on an ephemeral channel alone.
- **Reuse the containment/control key for transport:** rejected because process
  custody and network identity have different compromise and rotation domains.
- **Start with a generic message broker:** rejected because it adds an ambient
  authority and transport product before the direct cell contract is stable.
- **Implement the stem-cell reconciler now:** rejected because static identity,
  assignment, residency, and transport must be proven first.
- **Keep cells as in-process library objects:** rejected because it would not
  prove a cell process lifetime, peer authentication, network custody, or
  cleanup boundary.
- **Limit one placement unit to one slice:** rejected because it would duplicate
  slice identity instead of defining the higher-order unit that scales together.

## Decisions Requested

Approval of this design approves these five choices:

1. introduce the real unprivileged cell-host process in Sprint 6.
2. use a distinct enrolled transport key instead of reusing the cell
   control/containment key.
3. require authority-pinned mutual TLS plus signed canonical execution
   envelopes.
4. replace chamber candidate keys with opaque route-member identities.
5. allow multi-slice placement units, materialized as one chamber per member per
   replica, while keeping placement static and non-reconciling in Sprint 6.

## Questions Or Blockers

- None. The user accepted the Sprint 6 closure review on 2026-07-15.

## Sprint 6A Implementation Record

- Added the neutral distribution contract, conformance proof inventory,
  self-contained fixture, and contract-authority map.
- Added general runtime-slice authority, root-authorized cell enrollment,
  lifecycle, capability, capacity, placement, assignment, signed residency,
  route derivation, bounded readers, and immutable operation evidence.
- Expanded the immutable authority gateway from 9 to 18 exact operations and
  bound nested runtime validation, primitive identity, and result bounds to its
  published schema.
- Added cell-side Ed25519 verification for enrollment and residency before
  authority-provider use.
- Added the declarative distribution-control meta-slice fixture with no ambient
  database or authority capability.
- Proved fresh PostgreSQL migration, ordinary source activation, idempotency,
  capacity rejection, partial readiness, route derivation, suspension, standard
  cell privilege denial, and cross-role access denial.
- Regenerated the authority artifact and bootstrap fixtures at
  `sha256:19f11288cdf697978bf8cc17155a4f06554d81b9cb7eb1c012b328e5082f1d07`.

## Sprint 6B Implementation Record

- Generalized chamber projection candidates, private delegation, and signal
  callbacks from location-specific chamber keys to opaque route-member
  identities and advanced the chamber protocol to `0.6.0`.
- Bound route decisions to exact unit revision, replica, assignment epoch, cell
  generation, slice, lane, chamber, image, and responsibility authority before
  local or remote execution is selected.
- Added the real unprivileged Linux cell-host executable with one fixed
  descriptor-only startup surface and no arbitrary path, command, provider,
  destination, or ambient credential input.
- Added direct TLS 1.3 mutual peer transport with exact certificate roots,
  current-enrollment SPKI checks, signed controls/envelopes/results, and a
  reserve/accept/proceed execution-start boundary.
- Added bounded canonical framing, strict unknown-field rejection, current
  route revalidation, result limits, generation-local replay rejection, and
  conservative started-state preservation.
- Added mandatory digest-bound source and target transport evidence over a
  fixed append-only host descriptor without raw business context or
  subject/principal data.
- Proved stale generation, suspended enrollment, assignment drift, signature
  mutation, replay, expiry, unknown/noncanonical fields, oversized frames and
  results, connection loss after proceed, evidence failure, and host argument
  and root boundaries.
- Completed the security and coherence review at
  [Cell Peer Transport V0 review](../../../contracts/cell-peer-transport/security-review-v0.md).

## Sprint 6C Implementation Record

- Extended the real descriptor-only cell host with canonical startup
  activations, exact authority-derived route refresh, delegation control, and
  graceful stop.
- Required each startup bundle to equal the complete current assigned replica
  membership and revalidated active enrollment, control key, generation,
  assignment, source authority, artifact, runtime support, and containment
  before launch.
- Constructed `source_isolated_v0` plans inside the host, launched through the
  inherited root launcher session, registered ready chambers, and emitted
  transport-signed member residencies without giving chambers persistence or
  placement authority.
- Proved revision ordering: all grants bound to one authority revision activate
  before the first residency publication advances that revision.
- Corrected chamber result normalization so fulfilled delegation carries only
  the target core's composed context rather than an adapter/debug graph
  envelope.
- Added the Linux-only two-cell proof with two hosts, separate keys and TLS
  endpoints, three gVisor chambers, real PostgreSQL authority, partial
  multi-member readiness, remote inquiry, detached signal, route refresh,
  suspension, evidence, and complete cleanup.
- Passed the measured proof in 75.8 seconds and recorded exact artifacts in
  [Two-cell gVisor evidence](../../../../cadenza-cell/docs/two-cell-gvisor-evidence-2026-07-14.md).
- Completed the recursive Sprint 6 review at
  [Sprint 6 closure review](../../../contracts/distribution/sprint-6-closure-review-v0.md).

## Follow-Up Captured

- Realtime business-logic execution evidence is not yet a complete contract.
  Existing evidence covers bootstrap, authority, containment, lifecycle,
  delegation boundaries, and transport outcomes, but not a live per-task stream
  that can express graph/business execution state through the coherence
  protocol. This requires a dedicated review after Sprint 6 and before
  automated scale/orchestration. It is explicitly outside Sprint 6 so the
  distribution authority and transport contract remain bounded.

## Approval

The user approved this design with `Design approved. Proceed.` on 2026-07-14.
The user approved the completed Sprint 6 closure with
`Sprint 6 closure approved.` on 2026-07-15.
