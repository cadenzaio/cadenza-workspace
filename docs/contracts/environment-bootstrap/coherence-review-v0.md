# Environment Bootstrap V0 Coherence Review

Date: 2026-07-12

## Target

- Change: neutral environment-bootstrap contract and conformance fixture.
- Scope: genesis identities, trust, seed provenance, state transitions, evidence, and chamber handoff.
- Sources: intended whole, approved bootstrap design, authority/security closure, language runtime contract, environment and schema proposals.

## 1. Intended Whole

The contract creates the smallest trustworthy authority state from which Cadenza can later extend itself through governed primitives.

It avoids the false success of equating seeded rows with an operational environment. V0 ends at `handoff_ready` and does not execute source.

## 2. Identities

Environment, trust root, static bootstrap principal, first cell, bootstrap run, step evidence, capabilities, seed packs, seed applications, authority slice, handler artifact, activation policy, and handoff are explicit.

The first draft omitted the static bootstrap principal. That hidden identity was repaired by adding principal and proof references to normalized input, run state, and evidence.

## 3. State

The state machine is finite, ordered, monotonic, and stops before runtime activation. Adjacent transitions have explicit meaning and evidence.

Exact reruns preserve state; conflicting input cannot silently regenerate genesis.

## 4. Affect

Static bootstrap can create schema, public trust state, initial enrollment, governed seed state, and a handoff. It cannot execute code, activate plugins, operate chambers, or provide a permanent generic administration path.

## 5. Security Boundaries

Private key material, credentials, tokens, secrets, and source payloads are forbidden. Direct `authority_access` has one seeded holder.

The first draft used a digest-only handoff. That would detect drift but not authenticate it against authority-store tampering. The repair adds an Ed25519 trust-root attestation over the final handoff digest and conformance verification through public-key resolution.

## 6. Relationships

Seed applications reference exact pack identity and digest. The capability registry resulting state must agree with the content-addressed foundation pack. The authority slice agrees with its seeded logical object, version, pointer, mark, activation policy, and package-backed handler declaration.

The first draft covered only capability keys in the seed digest while listing full definitions outside the pack. That provenance gap was repaired by moving full capability definitions into digest-covered seed content.

## 7. Interpretation

The neutral contract provides downward meaning. The fixture provides upward proof through reproducible input, pack, semantic-content, evidence-chain, and handoff digests plus a verifiable public-key attestation.

Stable failure classes keep native implementation details from becoming the public contract.

## 8. Horizontal Interpretability

Canonical JSON restricts numbers and object keys enough for future languages to reproduce bytes without language-local map or floating-point behavior. Static bootstrap itself is not forced into every core language.

## 9. Shared Fields

Trust identity, capability vocabulary, seed manifests, authority records, evidence order, and handoff identity are shared fields. Neutral documentation and fixtures steward their meaning; PostgreSQL and TypeScript will prove implementations.

## 10. Temporal Stewardship

Immutable pack versions, content digests, migration history, monotonic transitions, append-only chained evidence, and signed handoff state preserve genesis interpretation for future chambers and repair tooling.

## 11. Fragmentation Test

The principal local-success/global-failure risks were:

- seed rows without complete provenance.
- an implied bootstrap actor.
- digest-only handoff authenticity.
- static-root expansion.
- persistence leakage into core.
- runtime activation claims before containment exists.

The first three were repaired in the contract. The latter three are explicit implementation boundaries and acceptance criteria.

## 12. Repair And Regeneration

No unresolved semantic repair blocks Sprint 3B.

Implementation must still prove:

- root core has no dependency on the bootstrap package or PostgreSQL.
- forbidden-material scanning is recursive and cannot be bypassed by nesting.
- canonicalization rejects unsupported numbers and non-ASCII object keys.
- negative fixtures isolate semantic failures by normalizing dependent digests where declared.
- signature verification is mandatory at the handoff boundary.

## Decision

- Coherence judgment: `fits` for Sprint 3A.
- Required follow-up: implement the isolated TypeScript contract package and conformance runner before schema work.

## Implementation Closure Review

Date: 2026-07-12

### Verdict

`fits`

The implemented foundation reaches `handoff_ready` without crossing into chamber activation or callable materialization.

### Evidence

- `environment-bootstrap/` is an independent package with its own manifest, lockfile, build, tests, and PostgreSQL dependency.
- the root `@cadenza.io/core` package has no bootstrap or PostgreSQL dependency and its complete non-performance suite remains unchanged.
- canonical JSON rejects unsafe numbers, non-ASCII object keys, and unpaired Unicode surrogates.
- seed packs cover full capability definitions, authority object/version/pointer/mark, activation policy, all eight canonical flow declarations, and the sole authority-access slice declaration.
- seed, semantic-content, input, evidence-chain, and handoff digests are verified.
- Ed25519 handoff signatures are verified against trusted public-key resolution outside candidate authority data.
- PostgreSQL migrations are ordered, checksummed, locked, idempotent, and reject drift.
- database constraints enforce version content identity, primary marks, active tag uniqueness, concurrent single-category cardinality, provenance agreement, policy family/action agreement, and allow-decision proof.
- bootstrap state transitions use environment-scoped advisory locking and compare-and-set updates.
- a simulated process interruption resumes from `foundation_seeded`.
- concurrent exact bootstrap calls converge to one run, five evidence records, and one handoff.
- exact reruns return the existing handoff; conflicting input fails closed.

### Boundary Review

- no source string is materialized or executed.
- no plugin, agent, UI, CLI, memory, placement, distribution, or actor-persistence behavior is seeded.
- database credentials, private keys, tokens, and secret values are absent from seed packs and handoff payloads.
- the package exposes one domain operation, `bootstrapEnvironment`, rather than arbitrary SQL or table CRUD.
- trusted key resolution is store/bootstrap configuration, not candidate handoff data.
- the environment remains `handoff_ready`, not `operational`.

### Residual Requirements

- deployment must own bootstrap database-credential custody, rotation, and retirement; the package cannot revoke credentials supplied by its caller.
- the future chamber/cell authority-access provider must use a narrower runtime database role and must not inherit the bootstrap owner credential.
- chamber activation must reverify handoff signature, evidence-chain digest, trust-root state, cell enrollment, seed digests, artifact digest, runtime requirement, capability requirement, activation policy, and authority revision.
- trust-root rotation, repair credentials, disaster recovery, and schema evolution after V0 require separate approved designs.

These requirements do not block bootstrap-foundation closure because they belong to deployment custody or the deliberately deferred activation boundary. They are explicit handoff constraints and must be treated as gates in the chamber design.
