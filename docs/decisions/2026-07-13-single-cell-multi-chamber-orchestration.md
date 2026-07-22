# Single-Cell Multi-Chamber Orchestration

## Context

The first trusted activation proves one cell can contain and activate one privileged chamber, but it does not define local truth for several chamber identities, projection freshness, chamber-to-chamber primitive transport, or successor-first replacement. Entering multi-cell distribution before those relationships are explicit would multiply ambiguous routing and failure semantics.

## Decision

- prove single-cell multi-chamber orchestration before multi-cell distribution.
- scope all host-local revisions and runtime frames to an explicit cell-generation identity.
- make `cadenza-cell` authoritative for host meta authority, chamber registry, projection publication, route validation, and local orchestration.
- make `cadenza-chamber` authoritative for projection application, runtime-only route state, generated proxy/forwarding support, and delegated-execution boundaries.
- use canonical full-replacement chamber projections with exact digest-bound acknowledgements.
- keep runtime-shape declarations immutable in chamber images and current candidate membership in dynamic projections.
- preserve only signal and delegation as cross-chamber execution relationships; inquiry remains local through generated responders.
- require the source chamber to select a projected target and the cell to validate that exact choice without silent rerouting.
- replace chambers by starting a successor, publishing and acknowledging new projections, then draining and stopping the predecessor.
- add a real gVisor source-isolation profile for business and meta-support chambers.
- exclude actors, persistence, placement, multi-cell networking, plugins, secrets, UI, CLI, agents, and memory.

## Consequences

- Sprint 5 is split into neutral contracts, host meta authority, chamber projection/lifecycle support, primitive transport, and an integrated Linux closure.
- a cell restart creates a new generation and terminates the previous generation's chambers; durable restart reconciliation remains deferred.
- actor-specific routing reasons and `sticky_actor_key` do not appear as unused V0 surface.
- the complete host evidence stream remains canonical and testable but does not acquire a final production persistence schema in this sprint.
- Sprint 6 may begin static multi-cell distribution only after this local boundary closes.

## Alternatives

- start with multi-cell distribution: rejected because network failure would obscure unresolved local authority and lifecycle semantics.
- route everything through a host-selected dispatcher: rejected because it hides stale source state and turns the host into a workflow engine.
- add a generic chamber RPC/capability: rejected because it bypasses Cadenza primitive meaning and creates ambient horizontal authority.
- include empty actor fields: rejected because speculative dead contract surface violates the spotless standard.
- use child processes as the final isolation proof: rejected because process separation is not source containment.

## Links

- [Approved design](../agent-harness/exec-plans/completed/2026-07-13-single-cell-multi-chamber-orchestration-design.md)
- [Intended whole](../cadenza-intended-whole.md)
- [Environment model](../cadenza-environment.md)
- [Trusted cell decision](2026-07-13-trusted-cell-first-activation.md)
