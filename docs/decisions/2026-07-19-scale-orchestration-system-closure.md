# Scale And Orchestration System Closure

Date: 2026-07-19

## Context

Sprints 7A through 7F separately established deterministic placement,
PostgreSQL reconciliation authority, autonomous Cell convergence, the contained
stem graph, pre-enrolled Cell supply, and fenced stem recovery. Sprint 7 cannot
close until these parts remain coherent in one failure lifecycle with execution
evidence and complete custody cleanup.

## Decision

Sprint 7G will prove one combined Linux/gVisor lifecycle with two independent
ready trusted-control Cells and one initially dormant standard pre-enrolled
Cell. Desired state must drive initial supply and execution, active stem loss
and cross-Cell succession, post-takeover scale-down, fresh resupply, renewed
execution, evidence continuity, and cleanup.

The sprint is closure and repair, not feature expansion. Expensive or
destructive boundaries remain focused tests linked through an explicit scenario
matrix. Findings may repair existing Sprint 7 responsibilities; a new
authority, policy loop, external dependency, or product feature requires a
separate design amendment.

## Consequences

- Existing Sprint 7E and 7F definitive proofs remain independent regressions.
- The new combined proof may use explicit harness fault injection and final
  teardown, but normal product lifecycle transitions must originate in desired
  state and current authority.
- Migration 011 and prior checksums remain immutable. A database repair needs
  migration 012 and focused upgrade tests.
- Sprint 7 closes only after security, disclosure, pressure, dead-code,
  operational-complexity, contract-authority, and recursive coherence reviews.
- Actor lifecycle, adaptive scaling, dynamic enrollment, concurrency, memory,
  agents, UI, CLI, and infrastructure-provider work remain out of scope.

## Alternatives

- Close from separate supply and recovery proofs: rejected because their
  interaction and evidence continuity would remain unproved.
- Put every failure into one monolithic test: rejected because diagnosis and
  bounded interpretation would degrade.
- Add a controller to stabilize the proof: rejected because it would hide
  whether Cadenza itself realizes desired state coherently.
- Expand runtime functionality before closure: rejected because it would
  multiply the state space before the first environment is understood.

## Links

- [Approved Sprint 7G design](../agent-harness/exec-plans/active/2026-07-19-scale-orchestration-system-closure-sprint-7g-design.md)
- [Parent Sprint 7 design](../agent-harness/exec-plans/active/2026-07-17-scale-placement-reconciliation-design.md)
- [Sprint 7F closure](../contracts/distribution/sprint-7f-closure-review-v0.md)
