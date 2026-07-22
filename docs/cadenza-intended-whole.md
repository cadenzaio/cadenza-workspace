# Cadenza Intended Whole

This document defines the coherence standard for Cadenza planning and implementation. It is intentionally short and load-bearing. It should guide future architecture decisions, sprint boundaries, implementation reviews, and specification changes.

The Coherent Creation source for this governance layer is:

- `coherent_creation_master_document_final.docx (private source retained by the project owner)`

## Intended Whole

Cadenza exists to reduce almost all accidental complexity around software creation, operation, deployment, scale, and distribution so humans and agents can focus their attention on the highest-value part of an application: the intended function, the business logic, and the logical flow of work.

It does this by making application behavior expressible as workflow-shaped Cadenza primitives: tasks, signals, intents, actors, helpers, globals, and future facts. The platform should let a creator describe what the system should do and how meaningful work moves through it, while Cadenza increasingly absorbs the surrounding operational burden of execution, distribution, authority, policy, observability, memory, and repair.

It preserves one intended whole through growth:

- business logic and intended function stay central and readable
- executable behavior is represented as explicit workflow primitives
- deployment, scale, distribution, runtime placement, authority, and observability become governed substrate concerns rather than repeated application burdens
- every meaningful part can affect the system only through ordered, governed, and observable relationships
- agents and humans can understand local flow state in relation to the whole application purpose
- future agents can inherit, question, repair, and extend the system without rediscovering hidden architecture from files, chat history, deployment glue, or ambient runtime behavior

## What Must Be Preserved

- **Primitive clarity**: tasks execute, signals detach, intents define request/response contracts, actors own keyed state authority, and future facts own structured knowledge.
- **Attention on intended function**: humans and agents should spend most of their creative and reasoning effort on business logic, workflow shape, state meaning, and domain behavior rather than deployment mechanics, scaling glue, transport code, or distributed coordination boilerplate.
- **Governed affect**: code, agents, policies, tags, secrets, capabilities, plugins, and runtime hosts must not gain consequence through ambient or invisible channels.
- **Interpretability across scale**: core primitives, environments, cells, chambers, support slices, generated bundles, and meta memory must remain mutually interpretable.
- **Temporal stewardship**: versions, decisions, traces, evidence, migrations, and repair history must let future agents understand why the system changed.
- **Fractal coherence**: the same pattern should recur at different scales: bounded identities, explicit state, governed relationships, interpretable evidence, and repairable boundaries.

## False Success

The following outcomes can look productive while weakening Cadenza:

- shipping features that make the core primitive model less exact
- making Cadenza powerful while still forcing creators to think mainly about deployment, transport, scaling, and operational wiring
- designing abstractions that hide business logic instead of making the intended function clearer
- preserving legacy repo boundaries because they are familiar
- adding runtime power before authority, evidence, and capability boundaries are defined
- making specs look complete while hiding open questions or unresolved contradictions
- making local demos work through special glue that cannot become part of the coherent graph
- treating memory as the product instead of as one operating-system subsystem
- creating APIs that are convenient now but make future graph-native execution, audit, or repair opaque
- implementing cells, chambers, plugins, or secrets as conventional platform plumbing with Cadenza labels attached
- making distribution visible too early in the authoring model, so local business flow design is polluted by infrastructure concerns
- allowing generated surfaces to become unmanaged hand-authored truth
- resolving current implementation pressure by exporting ambiguity, hidden coupling, or undocumented debt into the future

## Core Participating Identities

- `cadenza`: official TypeScript primitive and local execution authority; it is
  persistence- and environment-authority-agnostic.
- `cadenza-python`, `cadenza-elixir`, and `cadenza-csharp`: official language expressions of the shared primitive contract.
- `cadenza-environment`: official durable environment authority for bootstrap,
  policy, persistence, reconciliation, supply, evidence-ledger processing, and
  distributed actor authority.
- `cadenza-chamber`: official isolated runtime boundary for materialization and execution.
- `cadenza-cell`: official trusted local host boundary for containment, capability custody, and chamber orchestration.
- environment: deployable unit with seeded authority, cells, optional UI, and bootstrap rules.
- cell: trusted runtime host and local authority boundary.
- chamber: isolated execution domain for materialized runtime slices.
- primitive: task, signal, intent, actor, helper, global, and future fact.
- authority: graph-native source of allowed structure, policy, placement, and governed mutation.
- agent: participant that reads, writes, executes, reviews, repairs, and extends Cadenza under authority.
- human: participant that sets intent, reviews authority, interprets outcomes, and stewards direction.
- evidence: structured trace that makes consequence interpretable later.
- documentation: current projection and planning surface, not final authority.
- legacy repos: reference material only, not official forward implementation surfaces.

## Coherence Review Standard

Every substantial design or implementation review should ask:

1. What intended whole does this preserve or generate?
2. Which identities participate, and which hidden identities would become dangerous if unnamed?
3. What state changes, and what does that state mean for the whole?
4. What affect does this permit, deny, route, or record?
5. What boundaries preserve legitimate affect?
6. What relationships carry consequence, and are they explicit?
7. Can lower-level parts interpret the whole, and can the whole interpret part state?
8. Can sibling parts remain mutually interpretable without becoming unbounded?
9. Which shared fields need stewardship?
10. What trace lets future agents inherit, question, repair, or continue this work?
11. Where could this succeed locally while weakening Cadenza globally?
12. What repair or redesign would regenerate coherence?

## Specification Change Rule

Current specifications are working artifacts. They should not be treated as absolute or perfect.

A spec may change when the change is grounded in the intended whole and repairs or improves coherence. The justification should name the coherence pressure clearly, such as hidden affect, weak identity, state opacity, boundary leakage, relationship confusion, horizontal fragmentation, temporal opacity, or local success that would become global failure.

Unjustified change is drift. Justified change is stewardship.
