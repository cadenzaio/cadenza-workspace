# Sprint 8C Actor Hydration And Persistence Closure Review V1

Date: 2026-07-20

## Status

- Implementation state: `done`.
- Scope: authoritative actor-state hydration, strict write-through mutation,
  unknown-commit recovery, precommit effect containment, and production Cell
  persistence-provider wiring.
- Closure approval: received as `Great. 8C is approved. Let's move on` on
  2026-07-20.
- Next phase: Sprint 8D distributed failure and system closure is active.

## Intended Whole

An application author expresses actor business logic and a deterministic state
key. Cadenza makes the current durable state available to that logic and makes
an accepted mutation durable before exposing its result or effects. Storage,
owner resolution, retry ambiguity, credentials, and generation fencing remain
runtime concerns and do not enter the authored graph or public primitive API.

## Delivered Contract

The neutral [Actor Distribution Contract V1](v1.md), six persistence schemas,
and canonical hydration/commit fixture define:

- exact hydration, commit, and mutation-outcome request and result shapes.
- assignment epoch, Cell generation, Chamber image, actor, and state-key digest
  authority on every durable operation.
- canonical JSON state and result bounds of 1 MiB each.
- monotonic state versions and one stable mutation key per handler attempt.
- explicit `absent`, `committed`, and `not_found` meanings without raw state-key
  disclosure outside the private invocation boundary.

## Persistence Authority

- PostgreSQL migration `014_actor_state_persistence.sql` owns the mutable
  current-state projection and immutable mutation-commit ledger.
- Hydration revalidates exact current residency before reading state. Commit
  locks the current row, requires the expected version, advances exactly one
  version, and rejects stale ownership or changed mutation content.
- Equal mutation-key replay returns the original committed result. A separate
  outcome resolver answers only whether that exact mutation committed.
- Hydration, commit, and outcome roles have non-overlapping function grants and
  no direct table authority. Assignment remains a fourth separate role.
- The production Cell host requires four distinct PostgreSQL principals,
  rejects connection-string variants that reuse one principal, and installs
  the exact resolver and state provider before serving work.

## Runtime Semantics

- The Chamber derives the mutation key from invocation, assignment, actor,
  state-key digest, and source-task identities. Authored code cannot choose it.
- The TypeScript adapter sends the raw state key only through its private local
  transport. The Chamber hashes it and requires equality with the residency
  grant before the persistence provider can be called. Persistence contracts,
  rows, routes, logs, and evidence retain only the digest.
- The persistence-agnostic core executes a write against isolated candidate
  state. The candidate becomes locally current only after the adapter's commit
  hook receives authoritative success or proves success through outcome lookup.
- Signals and progress produced by a write handler remain buffered until
  acceptance. Nested inquiries, delegation, generated support calls, signal
  forwarding, and capability-facade affect are rejected during the precommit
  interval.
- Rejected handlers, stale versions, commit rejection, and unresolved unknown
  outcomes leave local state and buffered effects unchanged.
- The current conservative implementation hydrates before each accepted local
  distributed-actor invocation and cleanly unloads that state instance after
  acceptance. This is bounded by serialized ingress and keeps durable state
  authoritative without adding cache invalidation machinery. Same-owner
  hydration caching remains an optimization for a later concurrency pass.

## Scenario Coverage

- absent durable state uses the actor's validated semantic initial state.
- committed durable state and version hydrate before handler access.
- a write from version 7 commits version 8 before local acceptance.
- equal stable mutation replay returns the original durable outcome.
- changed content under one mutation key is rejected.
- stale expected version and stale assignment authority fail before mutation.
- a commit response lost after durable commit is recovered through exact
  outcome lookup and accepted once.
- a rejected commit followed by `not_found` outcome remains failed and does not
  accept candidate state.
- candidate state and buffered signals are invisible before commit.
- handler failure and commit failure leak neither state nor signal affect.
- nested inquiry and external support affect are rejected during actor writes.
- a state key whose raw UTF-8 digest differs from residency authority is
  rejected before hydration-provider affect.
- a foreign or stale Cell generation is rejected by the Cell facade before
  persistence-provider affect.
- hostile PostgreSQL roles cannot cross hydration, commit, outcome, table, or
  assignment boundaries.

## Coherence Review

### Intent And Identity

Primitive actor meaning remains in the core while durable authority remains in
the environment. Actor state key, key digest, assignment epoch, state version,
mutation key, result digest, Cell generation, and Chamber image retain separate
identities and cannot substitute for one another.

### Affect And Security

Only PostgreSQL can authorize durable acceptance. The Chamber controls request
construction and validates the core-resolved raw key against Cell authority.
The Cell exposes exact operations through four bounded principals. Authored
handlers receive no provider, credential, query surface, assignment selector,
or mutation identity.

### Relationships And Interpretation

The core returns a candidate; the adapter interprets it into a durable commit;
the Chamber binds that commit to runtime authority; the Cell maps it to one
purpose-specific provider; PostgreSQL returns an exact typed outcome. Explicit
stale, conflict, invalid, unavailable, and unknown-outcome failures preserve
meaning in both directions.

### Temporal Stewardship

Expected versions prevent lost updates, assignment epochs fence previous
owners, stable mutation keys make retries interpretable, and the immutable
commit ledger resolves responses lost across the transport boundary. Local
memory never becomes evidence of durable success by itself.

### Operational Complexity

Sprint 8C adds no actor scheduler, write-behind queue, event-sourcing layer,
cache-coherence protocol, or general database facade. The request path performs
one bounded hydration and, for writes, one commit plus at most one outcome
lookup after an indeterminate response. Reconnecting commit repeats the exact
serialized request.

## Findings Repaired During Closure

- The initial generated-endpoint path trusted the grant digest without proving
  equality to the state key resolved inside the core. Hydration now carries the
  raw key only to the Chamber, which rejects mismatch before provider affect.
- The production Cell launcher initially did not install the completed actor
  providers. The fixed descriptor surface, supply profile, Linux proof fixture,
  and operator documentation now carry four purpose-separated credentials.
- Credential separation originally compared only complete connection strings.
  It now rejects reuse of one PostgreSQL principal through different options.
- A generic adapter test invoked a private distributed actor endpoint without a
  brokered host. That obsolete bypass was removed; the dedicated actor proof
  owns all generated-endpoint execution scenarios.
- Linux compilation found one stale task fixture missing the new actor binding
  field. The exact fixture was repaired and the full Linux target now compiles.

## Deferred Scope And Risk

- Sprint 8D owns graceful drain, abrupt owner loss, reassignment, successor
  hydration, route invalidation, supply interaction, actor lifecycle evidence,
  destructive pressure cases, and the definitive Linux/gVisor multi-Cell
  recovery proof.
- Cached first-touch hydration, high-cardinality residency pressure, and
  broader Chamber concurrency are not required for the 8C durability gate.
  The current serialized load-before-execute-and-unload behavior is correct but
  deliberately not the final performance model.
- The four machine-sensitive TypeScript performance tests remain deferred until
  the agreed clean computer restart.

No unresolved authority, durability, hidden-affect, disclosure, or operational
complexity issue blocks Sprint 8C closure. The remaining lifecycle cases need
the cross-generation system work explicitly assigned to Sprint 8D.

## Validation

- TypeScript core: warning-free build and all 151 non-performance tests.
- TypeScript Chamber adapter: build and digest-pinned artifact generation.
- Chamber: formatting, clippy with warnings denied, and all Rust tests,
  including state-key mismatch, commit recovery, and rejected-commit proofs.
- Cell: formatting, clippy with warnings denied, all enabled Rust tests, exact
  persistence-facade forwarding, and stale-generation rejection.
- Linux: all Cell targets compile in Rust 1.97 Docker; Linux-only host credential
  tests pass.
- Environment bootstrap: typecheck, build, and all 107 tests, including
  migration replay, hydration, commit replay, stale-version, outcome lookup,
  and hostile role boundaries.
- Workspace: neutral actor-distribution JSON artifacts parse and the agent
  harness passes.

## Closure Gate

Sprint 8C closure is approved. Sprint 8D must preserve the rule that only a
version-fenced durable commit or exact committed-outcome recovery can make an
actor write visible.
