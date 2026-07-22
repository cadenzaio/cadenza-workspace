# Cadenza Language Role Doctrine

Date: 2026-07-12

## Purpose

This doctrine defines how Cadenza should choose and use programming languages without weakening the intended whole.

Cadenza is language-agnostic at the primitive boundary. Tasks, actors, signals, intents, helpers, globals, schemas, cells, and chambers must remain interpretable as Cadenza identities before they are interpreted as JavaScript, Python, Elixir, C#, Rust, Ruby, Lua, or any other language.

At the same time, language choice matters. Different languages have different strengths for business logic, meta-layer features, chamber coordination, cell containment, sandboxing, UI, data processing, and low-level runtime implementation.

The goal is not to flatten language differences. The goal is to govern them so each language can serve the whole without fragmenting it.

## Core Principle

> Cadenza unifies languages through primitive contracts, but allows language-specific expression inside bounded execution roles.

Polyglot Cadenza should reduce technical debt from mixed-language systems by forcing languages to meet through explicit primitives, schemas, capabilities, evidence, and runtime boundaries rather than through ambient glue, hidden imports, transport conventions, or undocumented runtime coupling.

## Semantic Authority

TypeScript remains the current working implementation authority because it is the most mature core repo and the fastest proving ground for new contracts.

That authority should narrow over time.

The long-term semantic authority for Cadenza should be language-neutral:

- primitive and authority specifications
- JSON conformance fixtures
- shared invariants
- decision records
- cross-language compatibility tests

Official language cores should implement that semantic authority in their own idioms. They should not reverse-engineer meaning from TypeScript API shape when a language-neutral contract exists.

This is especially important for security and authority features. Tags, policy, materialization eligibility, capabilities, evidence, and access decisions must be language-neutral from the start, because they will govern every runtime and adapter.

## Runtime Substrate Boundary

The principle that "Cadenza extends Cadenza" applies to feature extension, not to the low-level runtime substrate.

Cadenza should use Cadenza primitives for meta slices that extend the core's feature set: policy flows, graph analysis, code generation, repair workflows, schema interpretation, memory-facing features, orchestration logic above the runtime substrate, and other database-authored behavior.

The runtime substrate itself is different. Core runtime logic, cells, chambers, sandboxing, process supervision, capability enforcement, and materialization hosts do not need to be built out of Cadenza primitives. Their purpose is to enable safe, stable, bounded execution of primitives.

This distinction prevents a bootstrap loop where the system must already trust and execute primitives in order to create the trusted runtime that executes primitives.

The boundary is:

- feature extensions should prefer Cadenza primitives when they can be safely represented as database-authored behavior
- runtime substrate components should use the language, runtime, and architecture that best preserve containment, correctness, speed, stability, and observability
- substrate internals should still be interpretable by Cadenza through capabilities, evidence, status, schemas, and authority records
- substrate internals should not pretend to be primitive graphs merely for aesthetic consistency

## The Materialization Rule

Business-logic languages and most meta-layer feature languages must be able to convert a database-authored string definition into a callable inside a controlled runtime layer.

This is required because Cadenza definitions will live in database authority. A language that cannot participate in controlled string-to-callable materialization cannot be a first-class authoring language for database-defined tasks or most database-defined meta features.

This rule does not mean core repos may `eval` source strings.

The boundary remains:

- database definitions are serialized authority for primitive shape, identity, schemas, options, wiring, and callable slots
- callable source materialization happens in controlled cells or chambers
- core language repos receive already-materialized callables and materialize primitives from them
- source and language metadata may support inspection, visualization, provenance, and controlled materialization, but they are not execution authority inside core

## Runtime Implementation Exemption

Low-level runtime implementation languages are exempt from the string-to-callable eligibility rule.

These languages do not implement Cadenza primitives as official language cores. They are used in the ordinary engineering sense to build the runtime substrate that safely hosts primitives.

They do not need to be good database-authored business-logic languages. Their job is different:

- containment
- sandboxing
- process/runtime isolation
- capability enforcement
- secure materialization orchestration
- small footprint
- speed
- stability
- observability
- embedding
- host/runtime lifecycle

A low-level runtime implementation language may be valuable precisely because it is conservative, compiled, memory-safe, small, or difficult to dynamically mutate.

## Language Roles

### 1. Core Contract Languages

Core contract languages prove that official Cadenza primitives can be expressed coherently across language ecosystems.

They should:

- preserve shared primitive meaning
- maintain conformance fixtures
- expose a purposeful primitive authoring surface
- avoid pulling chamber/cell/distribution/persistence concerns into core
- allow idiomatic language expression without changing the shared contract by accident

Current examples:

- TypeScript
- Python
- Elixir
- C#

### 2. Business-Logic Authoring Languages

Business-logic languages are used by humans and agents to write task, helper, actor, and workflow-local logic.

They should:

- support controlled string-to-callable materialization
- have useful ecosystem libraries
- be ergonomic for domain/application logic
- be familiar enough to reduce adoption friction
- support clear errors and debugging
- interoperate through primitive inputs/outputs, not direct object sharing

Examples to consider:

- TypeScript
- Python
- C#
- Ruby
- JavaScript
- Lua for embedded/scripting cases

### 3. Meta-Layer Feature Languages

Meta-layer feature languages implement Cadenza features that may themselves be represented as primitives and stored in database authority.

They should usually follow the same string-to-callable materialization rule as business-logic languages, because many meta features will also be database-authored.

This role covers feature-level extension of Cadenza. It does not require the low-level runtime substrate for cells and chambers to be authored as Cadenza primitive graphs.

They may be chosen feature-by-feature when a language has a specific advantage:

- graph processing
- parsing and transformation
- schema reasoning
- policy evaluation
- code generation
- workflow optimization
- UI/state interpretation
- agent tooling
- symbolic or functional expression

The meta layer must not become a hidden second architecture. Meta features should still expose their consequence through Cadenza primitives, signals, intents, evidence, and authority rules.

#### General-Purpose Default

C# is the default comparison baseline for new general-purpose meta slices. This
default exists to control the operational and interpretive complexity of the
meta layer; it is not a claim that C# is intrinsically best for every slice.

A slice should use C# when it satisfies the slice's semantic, security,
materialization, ecosystem, and operational needs without a stronger
slice-specific reason to introduce another language. A different language is
appropriate only when its benefit is material enough to outweigh both the C#
baseline and the additional cost of another runtime, adapter, dependency
surface, deployment image, toolchain, diagnostic model, and stewardship path.

The comparison must include:

- semantic and expressive fit for the slice
- containment, materialization, and capability behavior
- measured efficiency for the slice's actual workload rather than assumed
  language performance
- ecosystem or library advantage
- concurrency, resilience, latency, memory, and startup requirements where
  relevant
- adapter and chamber support already available
- testing, evidence, debugging, operations, and future maintenance cost
- the cumulative complexity of the language set already used by the meta layer

Language diversity is therefore a governed exception with an evidence burden,
not a feature to maximize. The selected language is authoritative for that
slice by default; duplicate implementations require a separate purpose and
contract.

The first execution-evidence processor remains a deliberate TypeScript
bootstrap exception. TypeScript is the only language with an official chamber
adapter at that stage, the processor is primarily custody and database I/O
bound, and introducing a C# adapter during the evidence-security pass would
expand the trusted surface without a demonstrated benefit. This exception does
not establish TypeScript as the general meta-layer default.

### 4. Execution Adapter Languages

Execution adapter languages are languages Cadenza can run through a language runtime contract without needing a full official core repo.

They are a way to support many business-logic languages without making every supported language a steward of the core contract.

Adapters should:

- satisfy the language runtime contract
- materialize source under cell/chamber policy
- normalize inputs and outputs through primitive schemas
- turn errors, logs, capability use, and resource use into evidence
- avoid becoming separate primitive implementations unless deliberately promoted to official core status

Example future adapters may include Ruby, Lua, JavaScript, C#, Python, or other languages where practical demand justifies support.

## Runtime Implementation Languages

Cell and chamber internals are not primitive language roles.

Cells are trusted runtime hosts and local authority boundaries. Chambers are isolated execution domains for materialized runtime slices. Their implementation languages should be selected for security and operational properties, not for business-logic ergonomics or primitive self-expression.

Cell/chamber implementation may involve ordinary systems engineering:

- a low-level containment substrate
- process supervision and lifecycle code
- one or more embedded business-logic language runtimes
- sandboxing or WebAssembly components
- capability brokers
- evidence and telemetry pipelines
- materialization orchestration

These implementation choices should optimize for:

- small trusted computing base
- secure process boundaries
- capability enforcement
- deterministic lifecycle
- observability
- performance
- embedding
- safe materialization handoff

Possible implementation candidates include Rust, Go, WebAssembly runtimes, and BEAM-inspired coordination patterns. These choices are evaluated as runtime engineering choices, not as next official Cadenza core languages.

## Language Boundary Rules

1. **Primitive Contracts Are The Boundary**

   Languages meet through Cadenza primitive definitions, context maps, schemas, signals, intents, capabilities, evidence, and snapshots.

2. **No Ambient Cross-Language Affect**

   One language runtime must not affect another through hidden global state, shared mutable objects, untracked imports, or undocumented runtime side channels.

3. **Database Authority Is Not Runtime Authority**

   Database definitions authorize shape and callable slots. A cell or chamber decides whether and how a callable string may be materialized under policy.

4. **Materialized Callables Are Scoped**

   A callable materialized from source must run inside a known cell/chamber boundary with explicit capabilities, inputs, outputs, and evidence.

5. **Language Metadata Is Interpretive**

   Language names, source strings, handler metadata, and package hints help systems interpret and materialize definitions. They do not override primitive identity, schema, or capability boundaries.

6. **Polyglot Is Mediated**

   A Python task should not call a C# task by importing C# objects. It should signal, invoke an intent, call a helper through a declared alias, or move through a primitive relationship.

7. **One Role Does Not Imply Another**

   A language may be excellent for business logic and inappropriate for chamber substrate. A language may be excellent for cell implementation and inappropriate for database-authored logic.

8. **Language-Specific Features May Enrich But Not Fragment**

   Macros, decorators, behaviours, type systems, async runtimes, supervision trees, or metaprogramming may be used when they compile down to coherent primitive meaning.

9. **Shared Tests Protect Shared Meaning**

   Official language cores should share conformance fixtures for primitive behavior. Language-specific tests should cover local idioms and runtime boundaries.

10. **Security Boundaries Override Convenience**

   If a language makes source materialization easy but unsafe, it is not automatically suitable. Controlled materialization, capability limits, and evidence matter more than convenience.

## Eligibility Gates

### Business-Logic Language Gate

A language is eligible as a first-class business-logic authoring language only if it can satisfy these conditions:

- controlled string-to-callable materialization is possible
- materialized code can be scoped to a cell/chamber boundary
- inputs and outputs can be normalized through schemas/interchange
- errors can be captured as evidence
- dependencies can be declared, constrained, or inspected
- capability access can be mediated
- the ecosystem materially helps users write intended function

### Meta-Layer Feature Language Gate

A language is eligible for database-authored meta features only if it can satisfy the business-logic gate or if the feature is explicitly not database-authored.

Additional criteria:

- the feature can express consequence through primitives
- the feature does not create a hidden second authority model
- generated or transformed definitions remain interpretable
- repair/evidence traces can explain why the meta feature acted

### Runtime Implementation Selection

A language or runtime is suitable for low-level cell/chamber implementation if it can strengthen containment and runtime stewardship.

It does not need string-to-callable materialization.
It does not need to express its own internals as Cadenza primitives.

Criteria:

- strong security posture
- small or controllable runtime footprint
- predictable lifecycle
- performance appropriate for runtime substrate
- good observability and operational tooling
- clear interop boundary with business-logic runtimes
- ability to enforce capabilities and sandboxing directly or through a proven runtime such as WebAssembly

## Mixing Languages

Mixing languages is justified when the mix reduces complexity at the Cadenza primitive level.

It is not justified when it merely moves complexity into hidden runtime glue.

Valid reasons to mix:

- a domain library materially improves task quality
- a runtime provides stronger isolation or safety
- a language expresses a meta feature more clearly
- a language provides important ecosystem reach
- a chamber can safely host multiple language runtimes behind one primitive contract

Invalid reasons to mix:

- developer preference without role advantage
- avoiding a missing primitive boundary
- bypassing schema/capability/evidence discipline
- hiding deployment or transport complexity from the graph
- copying legacy architecture into new language wrappers

## Current Strategic Reading

TypeScript, Python, Elixir, and C# already give Cadenza:

- web and package ecosystem reach
- general-purpose dynamic authoring
- AI/data ecosystem access
- BEAM supervision and concurrency lessons
- a statically typed general-purpose baseline for operational meta slices and
  enterprise application logic

Additional language decisions should therefore be role-driven:

- If the next priority is expressive authoring and DSL ergonomics, evaluate **Ruby**.
- If the next priority is lightweight database-authored scripting or embedded execution, evaluate **Lua**.
- If the next priority is cell/chamber runtime implementation, evaluate **Rust, WebAssembly, and possibly Go** as ordinary runtime engineering choices, not as primitive language translations.

## Selection Direction

Future language selection retains two separate concerns:

1. **Authoring Track**
   - Which additional business-logic/core language materially expands Cadenza's practical reach?
   - Which language best serves a specific meta slice when C# does not?

2. **Runtime Implementation Track**
   - Which ordinary low-level language/runtime best serves cell/chamber implementation?
   - Current leading direction: Rust plus WebAssembly investigation, with Elixir/BEAM lessons retained for chamber coordination.

These concerns should not be collapsed. The best authoring language and the best runtime implementation language are likely different, and only the first is an official primitive/core language decision.

## Doctrine Summary

- Cadenza primitives are language-agnostic.
- Cadenza extends Cadenza at the feature/meta layer, not at the low-level runtime substrate layer.
- Business-logic and database-authored meta languages must support controlled string-to-callable materialization.
- Core repos do not materialize source strings; cells/chambers do.
- Low-level runtime implementation languages are exempt from the materialization rule because they do not implement primitives as official core languages.
- Cell/chamber internals should be chosen for safe execution, stability, speed, footprint, and observability in the ordinary engineering sense, not for primitive self-expression.
- Polyglot execution is acceptable only through explicit primitive, schema, capability, and evidence boundaries.
- C# is the default comparison baseline for general-purpose meta slices, not a
  mandatory implementation language.
- A different meta-slice language must prove a material net benefit after the
  complexity of adding and operating that language is counted.
- Language choice must serve the intended whole, not local implementation taste.
