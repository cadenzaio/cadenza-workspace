# Sprint 8D Distributed Actor Failure And Closure Review V1

Date: 2026-07-20

## Status

- Implementation state: `done`.
- Scope: actor drain, owner loss and succession, bounded residency, lifecycle
  evidence, hostile failure behavior, and definitive distributed recovery.
- Sprint 8D and Sprint 8 closure approval received:
  `Sprint 8D and Sprint 8 closure approved.` on 2026-07-21.

## Intended Whole

Application authors express keyed stateful business logic through ordinary
actor-bound tasks. They do not coordinate owner choice, routes, hydration,
durable commits, failover, retries, drain, evidence, or cleanup. Cadenza keeps
one state authority, survives valid ownership change, and reports ambiguity
instead of converting infrastructure failure into false business success.

## Delivered System

- PostgreSQL owns deterministic first-touch assignment, immutable epochs,
  current pointers, durable state versions, mutation commitments, assignment
  ends, and exact generation/image-scoped relinquishment.
- Cells resolve local or remote owners, revalidate peer assignment authority,
  expose four purpose-separated persistence principals, record actor evidence,
  and relinquish assignments only after Chamber drain barriers.
- Chambers fence generated owner endpoints, serialize each actor/key lane,
  bound residency and pending calls, refresh same-epoch authority without
  invalidating queued work, and reject new work during drain.
- The TypeScript adapter hydrates before every distributed invocation, commits
  writes before acceptance, and releases the local state record after every
  successful or failed execution. This avoids an unbounded hidden state cache.
- The contained Cell/Chamber protocol now carries typed actor invocation in
  addition to hydration, commit, and outcome operations at version `0.10.0`.

## Failure Conclusions

Failure meaning is determined by the last authoritative boundary crossed:

- before hydration, stale or unavailable authority exposes no state.
- during a handler, candidate state and signals remain isolated.
- before commit, changed epoch, generation, image, or version rejects affect.
- after commit but before response, the stable mutation identity resolves the
  exact committed outcome without rerunning business logic.
- after owner loss, the predecessor cannot regain authority; the next valid
  touch creates a later epoch and hydrates the last committed version.
- during PostgreSQL outage, no Cell or Chamber invents assignment, state, or
  commit authority.

The complete mapping is in the
[Sprint 8D Scenario Matrix](sprint-8d-scenario-matrix-v1.md).

## Evidence Conclusions

Actor evidence uses the established layered protocol. Cell-observed actor
records bind assignment, route, persistence, mutation, versions, endpoint, and
execution ancestry. Ordinary task evidence proves handler execution,
Chamber/Cell lifecycle evidence proves drain and generation transition, and
PostgreSQL assignment-end history proves predecessor retirement. Raw state,
raw actor keys, business input/output, credentials, and endpoint payloads do
not enter evidence.

A lost process is not asked to attest its own loss. Succession is instead
proved by current generation/residency authority, immutable predecessor end,
and a strictly later assignment epoch. Hydration joins are absent because this
version deliberately performs no single-flight hydration optimization.

## Pressure And Operations

- one Chamber admits at most 65,536 actor residencies and 1,024 pending calls
  per key; idle grants and lanes are reclaimable.
- distributed adapter state is released after execution, including handler or
  commit failure, so high-cardinality keys do not bypass the Rust bound.
- owner selection considers at most 4,096 canonical candidates.
- keys, canonical state, result, depth, frames, deadlines, and evidence custody
  all have explicit bounds.
- no actor scheduler, rebalance loop, lease service, write-behind queue, or
  cache invalidation protocol was added.

Append-only assignment and mutation history grows with accepted business work.
It is deliberate authority and idempotency history, not a runtime queue. The
[Operational Complexity Inventory](sprint-8d-operational-complexity-v1.md)
records the capacity and future archival consequence explicitly.

## Findings Repaired During Closure

- Contained signal-driven actor execution lacked a typed `InvokeActor` host
  operation. Protocol `0.10.0` now carries it and has an exact round-trip test.
- Same-epoch assignment renewal originally compared renewable expiry as
  immutable identity. Renewal now retains the longest validity and queued work
  compares only assignment identity.
- The adapter's hydrated state map could outlive the bounded Chamber registry.
  Distributed execution now releases state on success and failure; local core
  actor behavior is unchanged.
- Actor state had a byte bound but no recursive depth bound. Chamber and
  PostgreSQL now reject depth above 64 before handler or durable affect.
- Persistence operations could reach PostgreSQL without full execution
  ancestry. Hydration, commit, and outcome contracts now require trace, graph,
  and task execution identities.
- The first relinquishment rule expected a `draining` database observation
  before the same local drain could publish it, creating a circular shutdown
  dependency. The scoped Cell now proves the local barrier; PostgreSQL fences
  the exact generation/image and does not infer local state from lagging
  observations.
- Linux proof setup exposed stale protocol binaries, noncanonical fixture
  ordering, and cluster-global proof-role reuse. The final rootfs is rebuilt
  from current sources and the recorded run starts from clean proof authority.
- The end-to-end proof treated absence from a compacted local evidence journal
  as missing evidence even when the record had reached immutable ledger
  custody. Final assertions now inspect the durable ledger, and the dead local
  byte-scan helper is removed.

## Recursive Coherence Review

### Intent And Identity

Actor definition, runtime state key, digest, assignment key, assignment epoch,
replica epoch, Cell generation, Chamber image, state version, mutation key, and
execution ancestry remain distinct. No cache, route, or process identity can
substitute for assignment or durable state authority.

### Affect And Interpretation

Only the owner endpoint can execute the handler; only exact PostgreSQL
persistence can accept a write. Remote execution returns only the handler
result to the caller, whose authored graph continues once. Candidate state and
signals remain hidden until commit acceptance.

### Temporal Stewardship

Epochs never revive, versions advance monotonically, mutation replay preserves
one identity, drains reject new work before relinquishment, and successor
hydration starts from the last committed version. Renewable lease time is not
mistaken for immutable assignment identity.

### Fragmentation And Operations

The actor lifecycle reuses placement, supply, routing, peer transport,
Chamber custody, PostgreSQL authority, and evidence processing. It adds no
parallel orchestration model. The conservative hydrate-and-release path trades
throughput for a smaller and more intelligible first environment.

No unresolved authority, hidden-affect, disclosure, fragmentation, temporal,
or runtime-pressure issue blocks the closure gate.

## Validation

- TypeScript core: typecheck, build, isolated async regression `15/15`, and
  all `152/152` non-performance tests.
- TypeScript Chamber adapter: typecheck, digest-pinned artifact build, and the
  actor-owner integration path against the rebuilt core.
- Chamber: formatting, warnings-as-errors clippy, and all Rust tests, including
  same-epoch renewal concurrency, bounded eviction, and protocol round trip.
- Cell: formatting, warnings-as-errors clippy, all enabled Rust tests, and the
  Linux-only lifecycle target compiled from current source.
- Environment bootstrap: typecheck, build, and all `107/107`
  PostgreSQL/contract tests.
- Workspace: actor JSON artifacts parse and the agent harness passes.
- Linux/gVisor: the exact current-source multi-Cell test passed in `597.98s`.
  Real business logic committed `count: 1`, retained its healthy epoch through
  scale-up, committed `count: 2`, survived owner withdrawal, rehydrated and
  committed `count: 3` at durable version `3` under successor epoch `2`, then
  relinquished both epochs. Final state had zero current actor assignments,
  durable actor/transport evidence, no Cell process, and no gVisor container.

The four machine-sensitive TypeScript performance tests remain deferred until
the agreed clean computer restart. The repository-wide Prettier command also
traverses large heap snapshots and reports older generated/source formatting;
that tooling and hygiene issue belongs to the post-Sprint-8 stabilization pass
and did not affect typecheck, build, or behavioral validation.

## Closure Gate

Implementation and validation satisfy the approved gate. Sprint 8D and Sprint
8 are closure-approved. The distributed-foundation stabilization and GitHub
publication milestone is now the next design gate; deferred performance reruns
and repository-wide formatting hygiene remain visible inputs to that review.
