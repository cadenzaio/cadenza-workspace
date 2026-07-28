# Sprint 10B TypeScript Actor API Purpose Repair Design

Date: 2026-07-27

## Status

- State: `done`; implementation, dependency repair, exact artifact
  propagation, and all validation gates pass.
- Parent WIP:
  [Sprint 10 distributed foundation consolidation and hardening](../active/2026-07-25-distributed-foundation-consolidation-hardening-design.md).
- External GitHub mutation: none.
- Approval received from the user on 2026-07-27:
  `Sprint 10B TypeScript actor API purpose repair design approved. Proceed.`
- Completed dependency repair:
  [Core TypeDoc transitive security repair](2026-07-27-core-typedoc-transitive-security-repair-design.md).
- Core commit: `1cf98d5`.
- Reference-system commit: `4d610e3`.

## Context

The Sprint 10B unused-symbol review ran the TypeScript core with
`noUnusedLocals` and `noUnusedParameters`. It found three public actor-shape
issues:

1. `ActorStateDefinition<D, R>` does not use `R`. Serialized actor state
   contains durable initial state plus durable/runtime schemas and
   descriptions; it does not contain runtime state.
2. `Cadenza.createActorFromDefinition(definition, options)` ignores `options`
   and constructs its own internal definition-source option.
3. `Task.getTag(context)` intentionally ignores `context` in the base
   implementation, while subclasses and configured tag getters may use it.

Python, Elixir, and C# express the same serialized actor definition without a
phantom runtime-state type or public factory option. Neutral actor fixtures do
not contain either concept.

Leaving the first two findings in place would preserve public API that has no
current affect. Adding runtime state to serialized definitions merely to use
the generic would instead violate the separation between serialized authority
and runtime-owned state.

## Proposed Approach

1. Make serialized definition types describe only serialized meaning:
   - `ActorStateDefinition<D>`
   - `ActorDefinition<D>`
   - `ActorSpec<D>`
2. Keep `Actor<D, R>`, actor task handlers, runtime state stores, and runtime
   state mutators generic in `R`.
3. Keep `createActor` and `createActorFromDefinition` generic in the returned
   runtime state type, but remove the ignored public options argument.
4. Keep definition-source custody as a module-internal factory concern used to
   preserve exact `toDefinition()` round trips. Remove `ActorFactoryOptions`
   from the package entrypoint and from public `Cadenza` creation methods.
5. Retain `Task.getTag(context)` as a purposeful override hook, rename the base
   parameter to `_context`, and document why the argument remains.
6. Enable `noUnusedLocals` and `noUnusedParameters` in the core compiler
   configuration.

This changes TypeScript API shape but does not change neutral JSON actor
definitions, actor runtime behavior, other language APIs, Environment
authority, Chamber protocol, or Cell behavior.

## Impacted Repos

- Authority and implementation: `cadenza`.
- Direct proof consumer: `cadenza-reference-system`.
- Workspace evidence and checked package digest: `cadenza-workspace`.
- No semantic propagation: `cadenza-python`, `cadenza-elixir`,
  `cadenza-csharp`, `cadenza-environment`, `cadenza-chamber`, and
  `cadenza-cell`.

The TypeScript package module digest will change. The reference-system
distributed artifact must be regenerated from the exact packed core and its
checked digest updated in the same task.

## Risks

- **Breaking TypeScript source compatibility:** callers using the ignored
  options argument or importing `ActorFactoryOptions` will stop compiling.
- **Type inference:** callers that use runtime state `R` must continue to
  receive the intended `Actor<D, R>` type through explicit generic arguments
  or contextual return typing.
- **Definition fidelity:** materialized definitions must continue to round trip
  exactly through `toDefinition()`.
- **Artifact drift:** the reference artifact must not retain the old core
  module digest after package declarations or JavaScript output change.

The project already rejects backward compatibility with legacy versions for
this new major-version foundation. RC1 remains immutable; this repair belongs
to the post-RC consolidation lineage.

## Migration Strategy

1. Add compile-time type assertions for programmatic and definition-based
   actors with distinct durable and runtime state types.
2. Refactor the TypeScript types and internal creation path.
3. Remove the package export for `ActorFactoryOptions`.
4. Enable unused-symbol compiler checks.
5. Run format, typecheck, 148 core tests, build, API documentation generation,
   package smoke, and dependency audit.
6. Pack the exact core and run the clean reference-system release validator.
7. Regenerate only the digest-bound reference artifact if the core module
   digest changes.
8. Run workspace contract snapshots and documentation checks.

No compatibility shim or deprecation period is proposed.

## Alternatives

### Suppress The Findings

Rename every unused symbol with an underscore and retain the public API.

Rejected because the ignored options argument and exported factory type would
still claim affect they do not possess.

### Serialize Runtime State

Add runtime initial state to `ActorStateDefinition` so `R` becomes structurally
used.

Rejected because runtime state is runtime-owned and non-durable. Serialized
authority should not absorb it to satisfy a TypeScript type parameter.

### Honor Caller-Supplied Definition Source

Merge the public `options` argument into materialization.

Rejected because callers could present a source definition that differs from
the definition actually validated and materialized.

### Remove Runtime-State Typing Entirely

Collapse `Actor<D, R>` to one state type.

Rejected because durable and runtime state have different lifecycle,
persistence, and mutation meaning. Their distinction is purposeful.

## Assumptions

- Runtime state remains outside serialized actor authority.
- Exact definition round trips remain required.
- RC1 history and tags remain unchanged.

## Approval Gate

Required approval phrase:

`Sprint 10B TypeScript actor API purpose repair design approved. Proceed.`
