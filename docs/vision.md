# Cadenza Vision

## Core Thesis

In the age of agentic AI, the hardest problem is no longer generating code. The harder problem is understanding, evolving, and reliably orchestrating large living systems at scale.

File-based codebases are a poor substrate for that future. They scatter state, hide runtime behavior, fragment context, and make safe experimentation difficult. Agents can generate snippets quickly, but they struggle to reason over the whole system, test changes safely, and evolve the platform without human glue.

Cadenza is meant to be the substrate that fixes that.

## Agent Operating System Direction

Cadenza should be understood first as an agent-native operating system, not as a standalone memory product, a standalone agent, or a conventional application framework.

The durable product direction is:

> Cadenza is an agent-native operating system that unifies memory, execution, authority, policy, evidence, and extensibility across local and distributed environments.

This means memory is an operating-system subsystem, not the whole product. The memory system matters because it gives agents a cognitive substrate that maps directly to executable primitives, governed authority, policy decisions, execution evidence, documentation projections, and future self-extension. Its purpose is not to claim the best generic memory model. Its purpose is to let agents safely operate inside Cadenza without repeatedly rediscovering architecture from files or stale conversation context.

The same architectural model should scale across deployment sizes:

- a single-machine Cadenza instance can act as a personal agent OS with local authority, local memory, local plugins, and local execution
- a team Cadenza environment can add shared governed memory, shared slices, controlled plugins, and collaborative development flows
- an enterprise Cadenza environment can add distributed cells, nested authority, policy-driven execution, audit evidence, durable flows, specialized agents, and compliance boundaries

These should be deployment scales of the same OS model, not separate products with separate mental models.

## Open-Source And Managed Product Boundary

The open-source Cadenza direction is a complete inspectable development and
runtime system. Its first distributed foundation ends with governed actor
residency and persistence. After that milestone, the official repositories
should stop for code review, coherence review, hardening, documentation, and
GitHub publication before feature expansion resumes.

Later open-source work should add authority-native generated expansion, the
general security and plugin lifecycle, and a simple read-only observer for
internal state and evidence. Memory is the first official plugin and must use
the same public lifecycle and authority boundaries as other plugins.

The read-only observer is not the final product console. It exists to prove
that environment, runtime, authority, and evidence state can be interpreted by
humans without granting control-plane affect.

The final mutating UI, agent integration, user-intent automation, cloud
management, multi-environment management, and fully automated operational
system belong to the managed product. That product should build on the same
Cadenza contracts rather than creating a second runtime or authority model.

This direction comes from the April-May 2026 architecture drilling around cells, chambers, security, plugins, meta memory, and the first comparison benchmarks for Cadenza memory. The benchmark result is evidence that the memory subsystem can be viable, but the strategic claim is broader: Cadenza gives agents an executable, governed body rather than only tools and context.

## What Cadenza Is Becoming

Cadenza is moving toward a single queryable and executable graph stored in a database, where tasks, signals, intents, actors, facts, UI, and execution traces are structured data that agents can read, write, reason about, and evolve in real time.

That graph is not meant to be a passive metadata layer around file-based code. It is meant to become the primary development substrate, with file-based repos shrinking toward the minimum bootstrap/runtime code that still needs to exist outside the graph.

In the end state:

- executable primitives are first-class graph nodes
- knowledge is first-class through a dedicated `Fact` primitive
- helper/global support components exist below the first-class primitive layer to reduce duplication and retrieval surface
- primitives are connected through typed edges and tags
- development happens inside live simulator branches rather than dead text branches
- promotion into larger environments is a graph-native merge/publish operation
- environments become the main deployable unit: seeded database, engines, and optional UI console
- execution engines stay thin and dumb, materializing the graph rather than owning platform semantics
- agents and humans collaborate against the same live structure with scoped authority and observability

That gives agents:

- better context than file crawling alone
- safer experimentation through branching and rollback
- native orchestration through tasks, signals, intents, and inquiries
- native semantic context through facts, edges, and tags
- variable-resolution retrieval instead of forcing whole-file loading
- a meta-layer that supports self-extension and self-evolution

Cadenza does not compete with agents. It gives them the substrate they need to move from small scripts to production systems that can run real organizations.

## Facts And Executable Knowledge

Facts should become their own primitive type rather than being hidden inside actor state, comments, detached metadata, or external memory systems.

That separation matters:

- actors own evolving keyed runtime or application state
- tasks own executable transformation
- intents own request and response contracts
- signals own event propagation
- facts own structured assertions, provenance, semantic relationships, and executable knowledge hooks

This keeps the graph legible and prevents the system from collapsing state, behavior, and truth into one undifferentiated layer.

Facts should be queryable and linkable like other primitives. They should support provenance, authority, timestamps, confidence where needed, and explicit relationships such as support, contradiction, dependency, or reference.

The agent-facing memory direction is documented in [cadenza-meta-memory.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/cadenza-meta-memory.md). That model treats Cadenza's own architecture, decisions, constraints, evidence, gaps, projections, and capsules as meta memory. The long-term goal is for Cadenza documentation to become human-readable projection from that meta memory rather than the deepest source of truth.

## Helpers And Globals

Not every reusable capability needs to be a first-class primitive.

As captured in [CAD-13](https://linear.app/cadenzaai/issue/CAD-13/design-a-layer-scoped-tools-primitive-for-reusable-db-native-runtime), Cadenza is also gaining helper and global components that support tasks without becoming first-class graph primitives themselves.

Their role is different:

- helpers provide shared reusable functions
- globals provide shared immutable values
- tasks materialize and use those capabilities through a tools-like surface
- helper/global connectivity lives on a different plane from first-class primitive relationships

Even though they are not first-class primitives, they still need to remain legible and queryable enough to matter operationally:

- they can be tagged
- they can be connected to facts
- they can carry dependency metadata
- they can affect many tasks at once

That shared nature is important. When reusable logic or values are centralized in helpers/globals, the system can express broad behavior changes through a smaller surface area. That reduces duplicate implementation, reduces duplicate knowledge edges, and gives agents a more compact retrieval target than copying equivalent logic across many tasks.

This creates a more agile multi-level system:

- first-class primitives model the core runtime graph
- helpers/globals provide shared support surfaces below that graph
- facts can still connect meaningfully into both layers

## Edges, Tags, And Graph Structure

Every meaningful primitive should be interconnected.

Edges express relationships with stronger structural or semantic meaning, for example:

- task emits signal
- task handles intent
- actor owns actor task
- task inquires intent
- fact refers to entity or supports another fact
- primitive depends on fact
- task depends on helper or global
- helper depends on helper or fact
- simulator branch diverges from a source primitive

Tags provide dynamic grouping and slicing, for example:

- `incident`
- `billing`
- `critical-path`
- `customer-x`
- `stale`
- `meta`
- `business`

The graph must distinguish between:

- authoritative structure, which is deterministic and maintained directly from primitive definitions and declared dependencies
- derived structure, which is inferred, confidence-bearing, and governed separately

This distinction is necessary to avoid graph pollution and to keep maintenance cost bounded.

It must also distinguish between planes of connectivity:

- first-class primitive relationships
- helper/global dependency relationships
- derived or inferred semantic relationships

Those planes can intersect, but they should not collapse into one undifferentiated edge model.

## Simulator-Backed Development

Development should happen inside smaller, cheaper simulator systems that run a minimal viable live slice of the graph.

This changes the basic workflow:

- create or fork a simulator from an existing graph slice
- evolve primitives, facts, edges, tags, and policies inside that live branch
- validate behavior, retrieval quality, invariants, and cost in the simulator
- merge or promote approved changes into larger environments or production

That is better aligned with the medium than editing files and later translating those edits into a live system.

The simulator model matters because it preserves the advantages of branching while keeping development native to the running graph. It also creates a safer path for agent collaboration, policy checks, rollback, and staged promotion.

## Retrieval And Context Efficiency

One of the biggest advantages of a graph-native system is that context can become more selective and more deterministic.

Today, even with indexed codebases and external knowledge graphs, agents still have to bridge multiple systems:

- code structure
- runtime structure
- semantic knowledge
- operational traces

That means repeated inference, repeated summarization, and repeated context assembly.

Cadenza should reduce that cost by allowing variable-resolution reads of the same authoritative source. For each primitive, an agent should be able to choose the fidelity it needs:

- identity only
- name only
- description and public contract
- edges and tags
- execution metadata
- provenance and history
- full implementation payload

In many cases, knowing a task name or description will be enough. In other cases, the full handler body or dependent graph neighborhood will be required. The system should support that progression directly instead of forcing broad context loading up front.

This is important for both quality and efficiency. It reduces token waste, lowers energy use, and makes agent reasoning more targeted.

## Knowledge Graph Maintenance

The hardest caveat in this direction is maintaining the graph itself.

Knowledge graphs are useful, but they become expensive when they act as a secondary memory system that has to be refreshed, compacted, or reconciled after the real system changes.

Cadenza should instead aim for a maintenance model where most graph updates are deterministic cascades from authoritative primitive changes:

- a primitive changes
- directly related edges, tags, and materialized projections update immediately
- only adjacent or explicitly dependent structure is recomputed
- higher-order inferred relationships can be refreshed lazily or under policy

If that works, graph maintenance starts to look more like maintaining indexes and derived tables than repairing a drifting memory cache.

The same principle should apply to helpers and globals. Because they are shared surfaces rather than repeated local copies, a single helper/global change can deterministically cascade into multiple task-level impacts without requiring every affected task to carry its own duplicate knowledge edges.

The meta-memory model extends this maintenance principle to agent development itself. Human and agent conversations should be captured as source events, distilled incrementally into candidate knowledge, and propagated through impact projections, capsules, and context packets. Scheduled maintenance remains a safety net; proactive impact detection is the default.

## Engines And Deployment

The execution engines should become intentionally dumb sandboxes.

Their job is to:

- receive graph-defined system structure from the database
- parse and materialize primitives and support components
- execute the resulting system safely
- expose runtime observations back into the graph

Their job is not to own platform semantics, business logic, or the meta layer.

If designed correctly:

- the meta layer also lives in the database-native graph
- engines stay thin and replaceable
- environments own schema, seeding, and bootstrap while core stays database-agnostic
- deployment complexity falls because shipping a system becomes mostly about running a sandbox that materializes the authoritative graph
- the distinction between code deployment and system evolution narrows substantially

## Environment Model

The next deployable boundary is a Cadenza environment.

For the current iteration, an environment is:

- a seeded database
- one or more engines
- an optional UI console
- bootstrap and materialization rules owned by the environment layer

Within that split:

- `cadenza` remains the database-agnostic primitive and runtime core
- the environment layer owns schema, seed data, and bootstrap
- the engine layer bridges database graph slices into core materialization

Engines materialize only what the core can represent. That includes structures such as tasks, intents, signals, actors, helpers, and globals. Facts remain database-native unless and until the core gains a representation for them.

This is one of the reasons the database-native direction matters so much. The more semantics move into the graph and out of bespoke engine code, the closer Cadenza gets to a publish model where the system is updated by promoting graph structure rather than rebuilding thick runtime hosts.

## Why The Current Repos Still Matter

The current file-based repos are the bridge into that future.

- `cadenza/` sharpens the primitive model.
- `cadenza-service/` proves distributed execution and metadata propagation.
- `cadenza-db/` pushes the system toward persisted, queryable structure.
- a future environment repo should own environment schema, seeded graph definitions, and bootstrap setup.
- UI and demo repos expose how the system behaves in practice.

The file repos are not the end state. They are the transition layer while the database-native system becomes capable enough to absorb more of the platform.

## Practical Implications For Agents

When choosing how to implement a change, prefer the path that:

1. increases structure over hidden glue
2. improves introspection and traceability
3. keeps behavior queryable and evolvable
4. uses Cadenza primitives instead of bypassing them
5. makes future migration into the database-native graph easier

When a change does the opposite, it needs stronger justification.

## Near-Term Direction

- deepen the docs that teach correct use of Cadenza
- keep extending Cadenza with its own primitives where that increases leverage
- strengthen contract clarity, metadata, and actor/state semantics
- reduce accidental complexity in the file-based repos

## Long-Term Direction

- move toward a database-native repo
- keep only the minimum necessary bootstrap/runtime code in file-based repos
- make simulator branches and graph-native promotion part of the normal development workflow
- introduce facts as first-class primitives with typed edges and tags across the graph
- internalize Cadenza's own meta memory so docs, agent context, impact analysis, and executable grounding are derived from accepted knowledge and evidence
- introduce helper/global support components that stay queryable, taggable, and connected without becoming first-class primitives
- make system evolution, orchestration, testing, and rollback increasingly data-native
- keep engines thin so they materialize graph-defined behavior instead of owning platform logic
- make retrieval progressively selective so agents and humans read only the fidelity they need
- support live collaboration, monitoring, and development against the same running structure
- enable one publish action to upgrade larger slices of the system safely
