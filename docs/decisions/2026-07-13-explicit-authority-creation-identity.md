# Explicit Authority Creation Identity

## Context

The first PostgreSQL authority-provider design exposed two omissions in the
neutral canonical flow contracts. `Version.CreateInitialObject` did not carry
the logical object's `taggable`, `policy_subject`, and `policy_resource`
properties, and creation flows returned new authority keys without defining who
selected those identities.

Allowing a persistence provider to infer either concern would make object
authority and identity depend on storage-specific behavior.

## Decision

Authority creation requests must explicitly carry:

- all logical-object authority properties required to establish the object.
- every proposed identity for a version, mark, assignment, removal, or policy
  decision the flow may create.

The authority implementation validates uniqueness, ownership, policy, content,
and invariant agreement. It may reject a proposed identity but must not replace
it with a provider-generated identity. When a flow reuses existing authority,
the result names the existing identity and the unused proposal creates nothing.

Canonical payload digests are derived integrity data. A trusted broker or
provider recomputes them; authored callers do not gain authority by claiming an
unverified digest.

## Consequences

- `Version.CreateInitialObject` adds object authority flags plus proposed
  version and mark keys.
- `Version.CreateNextVersion` adds proposed version and mark keys.
- tag assignment/removal and policy-evaluation requests add their proposed
  evidence identities.
- TypeScript remains the first implementation authority and the updated neutral
  contract propagates to Python, Elixir, and C# before provider implementation.
- PostgreSQL remains responsible for atomic validation and commit, not identity
  invention.

## Alternatives

- Infer authority flags from `object_type`. Rejected because no governed type
  profile contract exists and future object types could acquire hidden meaning.
- Generate keys in PostgreSQL. Rejected because identity semantics would become
  persistence-specific and harder to reproduce across providers.
- Derive every identity from idempotency keys or payload hashes. Rejected as a
  universal rule because semantic identity and content identity are related but
  not interchangeable.

## Links

- [Authority Security Contract V0](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/contracts/authority-security/v0.md)
- [Canonical Authority Flows V0](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/contracts/authority-security/canonical-flows-v0.md)
- [Trusted Cell And First Activation Design](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/agent-harness/exec-plans/active/2026-07-13-trusted-cell-first-activation-design.md)
