# Persistence-Agnostic Core

## Context

The TypeScript core previously included actor session policy, session TTL eviction, external durable-state hydration, and an opt-in strict write-through persistence intent. During the Sprint 1 coherence review, this was identified as a boundary leak: persistence and session lifecycle are distribution/environment concerns, while the core repo should define and materialize primitives.

## Decision

The official Cadenza core is persistence-agnostic.

Core actors may keep local in-memory durable/runtime state as primitive behavior, but core does not own:

- database or storage persistence
- strict write-through persistence intents
- external actor state hydration
- actor session TTL/lifecycle policy
- distributed actor synchronization

Those capabilities belong in later chamber, cell, and distribution extensions.

## Consequences

- The TypeScript core removes actor persistence/session contract fields and implementation hooks.
- Actor durable state remains a local in-memory primitive state, not a storage guarantee.
- Future persistence implementations must wrap or extend core primitives from outside the core package.
- Polyglot core repos should follow this boundary unless a later superseding decision changes it.

## Alternatives

- Keep a minimal opt-in persistence bridge in core. Rejected because it still makes core responsible for environment/distribution semantics.
- Keep session TTL but remove storage persistence. Rejected for now because actor session lifecycle is also an environment/distribution concern and was excluded from the current Python core scope.

## Links

- `cadenza/docs/architecture.md`
- `cadenza/docs/product.md`
- `cadenza/docs/contract-foundation-inventory.md`
