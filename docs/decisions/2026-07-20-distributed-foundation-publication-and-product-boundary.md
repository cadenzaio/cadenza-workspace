# Distributed Foundation Publication And Product Boundary

Date: 2026-07-20

## Context

Sprint 7 completed autonomous placement, Cell supply, stem succession,
execution-evidence custody, and scale orchestration. Distributed actor
lifecycle and persistence remain the final missing part of the first complete
distributed Cadenza model.

The roadmap previously grouped generated expansion, advanced security, memory,
agents, projections, and UI into broad later phases. That grouping did not make
the post-distribution milestone, publication gate, first observer UI, plugin
sequence, or open-source boundary explicit.

## Decision

Sprint 8 will complete the first distributed Cadenza model through governed
actor residency, hydration, persistence, stale-owner fencing, and recovery.

After Sprint 8, feature work will pause for a dedicated distributed-foundation
stabilization and publication milestone. The official repositories will undergo
purpose, dead-code, architecture, coherence, security, disclosure, dependency,
license, documentation, test, and operational-complexity review before the
agreed public repository set is published to GitHub. Publication scope,
licensing, version labels, and whether the first publication is a preview or a
stable major release remain decisions for that milestone.

Post-publication work will proceed in this order:

1. authority-native generated expansion bundles.
2. a split advanced security and extension track, including the general plugin
   lifecycle.
3. a simple open-source read-only UI for internal state and evidence.
4. Memory as the first official plugin.

The first UI is an observer, not a control plane. Read-only behavior must be
enforced by authority and bounded projection contracts, not only by omitting
controls from the interface.

The final mutating UI, agent integration, cloud management, multi-environment
management, and fully automated operational system belong to the managed
product rather than the open-source Cadenza repositories.

Memory must use the same public plugin lifecycle and authority boundaries as
other plugins. It must not receive a privileged substrate exception because it
is the first official plugin.

## Consequences

- Sprint 8 becomes a major architectural closure, not merely another feature
  increment.
- Publication gets its own feature-free stabilization gate.
- Generated expansion and plugin architecture can evolve after the distributed
  foundation is public without being confused with missing runtime basics.
- The observer UI becomes a proof of upward interpretation and evidence quality
  before Memory or managed agent automation depends on those projections.
- Open-source Cadenza remains a complete inspectable development and runtime
  system; the managed product differentiates through fleet operations,
  automation, intent interpretation, and mutating product UX.
- A stable semantic-version promise must not be inferred merely from GitHub
  publication. The release gate must name compatibility commitments explicitly.

## Alternatives

### Continue Directly From Sprint 8 Into Expansion

Rejected. It would miss the first point at which the complete distributed model
can be reviewed as one whole and published without later features obscuring its
quality.

### Build Memory Before A System Observer

Rejected. Memory would depend on state and evidence that humans cannot yet
inspect coherently, making debugging and trust unnecessarily difficult.

### Make The First UI A Management Console

Rejected. Mutation, cloud control, and multi-environment operation introduce a
different authority and product scope. The first open-source UI should prove
interpretability without acquiring affect.

### Make Memory Part Of The Runtime Substrate

Rejected. Memory is a system extension and the first official plugin, not a
prerequisite for safe primitive execution.

## Links

- [Cadenza Official Implementation Roadmap](../agent-harness/exec-plans/active/2026-07-09-cadenza-official-roadmap.md)
- [Cadenza Intended Whole](../cadenza-intended-whole.md)
- [Cadenza Workspace Architecture](../architecture.md)
- User approval: `Agreed. So let's document this and move on to sprint 8.` on
  2026-07-20.
