# Design Proposal: Authority, Tags, Policy, And Flow Foundation

## Status

done

Approved by the user on 2026-07-12 with: "Design approved. Proceed."

Decision log: [docs/decisions/2026-07-12-authority-tags-policy-flow-foundation.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/decisions/2026-07-12-authority-tags-policy-flow-foundation.md)

## Context

- Problem:
  - Sprint 1 stabilized the core primitive contract and proved it across TypeScript, Python, Elixir, and C#.
  - The next roadmap phase must lay a broader preparation foundation before environment bootstrap, chambers, cells, distribution, actor persistence, generated bundles, memory, UI/UX, and agent layers build on top of it.
  - Current docs contain many environment-native concepts, but they are too broad to implement safely in one pass. Sprint 2 needs a realistic boundary that defines the authority surface without prematurely building the whole environment runtime.
  - TypeScript has been the working implementation authority, but authority/security semantics must not become TypeScript-shaped by accident now that the core is official in four languages.
- Why now:
  - Routines are removed; first-generation grouping is tag-only.
  - Core is persistence-agnostic, so database authority must be introduced as a layer above core rather than leaking back into core repos.
  - Callable materialization is now explicitly outside core, which means authority records must eventually describe what is allowed to materialize before cells/chambers exist.
  - The environment bootstrap step depends on stable vocabulary for logical objects, versions, tags, policy decisions, and domain-shaped authority flows.
- Evidence:
  - [docs/cadenza-intended-whole.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/cadenza-intended-whole.md)
  - [docs/cadenza-environment.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/cadenza-environment.md)
  - [docs/cadenza-schema-proposal.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/cadenza-schema-proposal.md)
  - [docs/cadenza-flow-design.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/cadenza-flow-design.md)
  - [docs/cadenza-language-runtime-contract.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/cadenza-language-runtime-contract.md)
  - [docs/agent-harness/exec-plans/completed/2026-07-10-official-core-translation-sprint-1b.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/agent-harness/exec-plans/completed/2026-07-10-official-core-translation-sprint-1b.md)

## Coherence Standard

Sprint 2 should preserve the intended whole:

> Cadenza should reduce accidental coding complexity so humans and agents can focus on business logic, intended application function, workflow shape, and the logic inside individual tasks.

For this sprint, the main coherence pressure is authority without infrastructure leakage.

The system needs governed identity, grouping, versioning, and policy, but ordinary business-flow authors should not have to think in database tables, migrations, placement, chamber topology, or raw CRUD tunnels.

## Proposed Approach

- Change summary:
  - Create an authority foundation inside the official TypeScript `cadenza` repo as contract/types/flow definitions, not as a database implementation.
  - Author every new authority/security concept first as a language-neutral semantic contract and conformance fixture shape, then implement the TypeScript version as the first proving implementation.
  - Define logical-object identity and immutable version vocabulary in a storage-agnostic way.
  - Define tag categories, tags, direct assignments, effective tags, and tag provenance as the first grouping/authority layer.
  - Define the initial policy decision contracts for resource access and tag management.
  - Define canonical authority flow contracts for:
    - `Version.CreateInitialObject`
    - `Version.CreateNextVersion`
    - `Version.SetCurrent`
    - `Tag.Assign`
    - `Tag.Remove`
    - `Tag.RecomputeEffectiveForObject`
    - `Policy.EvaluateResourceAction`
    - `Policy.EvaluateTagAction`
  - Record strict, bounded, and loose flow classifications for each canonical flow.
  - Keep these contracts storage-agnostic and primitive-shaped so they can later be seeded into environment authority and materialized by cells.

- Why this shape:
  - It gives the bootstrap layer a vocabulary to seed.
  - It replaces routine-style grouping with governed tag grouping.
  - It makes policy a first-class graph-native concern before cells and chambers need to enforce it.
  - It keeps `cadenza` focused on semantic contracts rather than environment database ownership.
  - It lets future `cadenza-environment` or chamber/cell repos consume a coherent contract instead of inventing authority structure from scratch.
  - It preserves implementation velocity while moving true authority away from "whatever TypeScript currently does" and toward specs, invariants, and conformance.

- Non-goals:
  - Do not create the environment database schema or migrations in Sprint 2.
  - Do not create a `cadenza-environment` repo yet.
  - Do not implement cells, chambers, placement, stem-cell reconciliation, distribution, actor persistence, generated bundles, plugins, secrets, evidence storage, memory, CLI, UI/UX, or agent APIs.
  - Do not add source-to-callable materialization, runtime adapters, Roslyn, sandboxing, or capability brokers to core.
  - Do not implement PostgresActor generated surfaces as the root authority substrate.
  - Do not turn policy into a conventional roles/permissions service detached from Cadenza primitives.

## Proposed Sprint Shape

### Sprint 2A0: Semantic Authority Governance

Purpose: establish the rule that security and authority contracts are language-neutral before they are TypeScript APIs.

Initial scope:

- define the language-neutral contract source layout for Sprint 2 authority/security concepts
- define fixture naming and versioning conventions
- define required translation-impact notes for every new authority/security concept
- define the working authority rule:
  - TypeScript remains the first implementation and current proving ground
  - language-neutral specs, invariants, fixtures, and decision records are the intended semantic authority
  - Python, Elixir, and C# consume the semantic contract rather than reverse-engineering TypeScript behavior
- add a Sprint 2 implementation checklist so no authority/security feature lands without:
  - semantic contract text
  - JSON fixture or fixture plan
  - TypeScript implementation evidence
  - translation impact classification

### Sprint 2A: Authority Vocabulary And Contracts

Purpose: define stable TypeScript contracts that can become seeded authority rows later.

Initial scope:

- `ObjectRegistryEntry` or equivalent logical object identity contract
- object type, lifecycle state, and taggable/policy-subject/resource flags
- immutable `ObjectVersion` contract and content hash expectations
- current-pointer and mark-assignment contracts
- tag category and tag contracts
- direct tag assignment and effective tag projection contracts
- resource policy rule and tag-management policy rule contracts
- policy decision envelope and denial/explanation shapes

### Sprint 2B: Canonical Flow Declarations

Purpose: define the domain-shaped flows above authority contracts without implementing database persistence.

Initial scope:

- flow declaration types for strict, bounded, and loose authority flows
- canonical request/result envelopes for version, tag, and policy flows
- validation helpers for names, lifecycle states, tag keys, and action names where useful
- documentation for each canonical flow using the flow-design norm:
  - semantic boundary
  - shape
  - strictness
  - primitive choreography
  - invariant boundary
  - reactive/deferred consequences

### Sprint 2C: Conformance And Translation Readiness

Purpose: prevent the new authority vocabulary from becoming TypeScript-only.

Initial scope:

- JSON fixture examples for authority contract snapshots and policy decisions
- a small TypeScript test suite proving stable serialization and validation
- translation readiness note for Python, Elixir, and C# authority contract parity
- decide whether translation repos should receive authority contracts immediately or wait until the TypeScript contract stabilizes through one more review

## Contract Authority Strategy

Sprint 2 changes contract governance for new security and authority work.

Current operational rule:

- TypeScript remains the working implementation authority for speed and continuity.
- TypeScript is not the long-term semantic authority by itself.
- New authority/security semantics should be grounded in:
  - language-neutral markdown contracts
  - JSON fixtures
  - explicit invariants
  - decision records
  - cross-language translation impact notes

Practical consequence:

- implementation can still begin in `cadenza`
- every new authority/security concept must have a language-neutral description before or alongside TypeScript code
- TypeScript tests prove the first implementation, but fixture/spec behavior is what Python, Elixir, and C# should follow later
- translation repos do not have to be updated in the same slice unless the user approves that scope, but no change should land without knowing how it should translate
- after Sprint 2A stabilizes, the workspace should decide whether to extract shared specs/fixtures into a dedicated `cadenza-conformance` area or keep them under workspace docs temporarily

## Impacted Repos

- Authority repo:
  - working implementation authority: `cadenza`
  - intended semantic authority for Sprint 2 security/authority concepts: language-neutral specs, fixtures, invariants, and decision records
- Workspace docs:
  - `docs/cadenza-schema-proposal.md`
  - `docs/cadenza-flow-design.md`
  - `docs/cadenza-environment.md`
  - `docs/cadenza-intended-whole.md`
  - `docs/agent-harness/exec-plans/active/2026-07-09-cadenza-official-roadmap.md`
- Translation repos:
  - `cadenza-python`
  - `cadenza-elixir`
  - `cadenza-csharp`
  - likely consumers after TypeScript contract review, not necessarily same-sprint implementation targets
- Deferred repos:
  - future `cadenza-environment`
  - future chamber runtime repo

## Contract Boundary

Sprint 2 should introduce authority contracts, not authority storage.

Allowed in `cadenza`:

- TypeScript types, schemas, validators, and fixtures for authority vocabulary
- primitive-shaped flow declarations
- serialization and conformance helpers
- docs explaining how these contracts serve later environment bootstrap
- references to language-neutral specs/fixtures that define shared semantics

Not allowed in `cadenza`:

- database clients
- migrations
- generated CRUD engines
- direct PostgresActor backing behavior
- cell/chamber placement or materialization enforcement
- runtime security enforcement beyond contract declarations

## Coherence Review

- Intended whole:
  - Sprint 2 should let future humans and agents describe what objects exist, which versions are current, how things are grouped, and which actions are allowed without forcing them into raw database mechanics.
- Participating identities:
  - logical object
  - object version
  - version pointer
  - version mark
  - tag category
  - tag
  - direct tag assignment
  - effective tag projection
  - policy rule
  - policy decision
  - canonical authority flow
- Governed affect:
  - version flows affect what graph content can be inherited or materialized
  - tag flows affect grouping, ownership, placement, and policy
  - policy flows affect read, write, execute, materialize, and tag-management authority
- Boundary:
  - Language-neutral specs/fixtures own the intended semantic contract; `cadenza` proves the first TypeScript implementation; environment authority owns durable storage later.
  - source materialization remains a cell/chamber adapter concern.
  - generated persistence surfaces remain higher-level expansions, not the root authority substrate.
- False success to avoid:
  - implementing database tables before semantic contracts are coherent
  - making tags decorative labels instead of governed authority inputs
  - making policy a generic permission service that cannot interpret Cadenza primitives
  - pulling bootstrap, cells, chambers, or distribution into this sprint
  - making the ordinary business authoring model think about placement or persistence too early

## Risks

- Breaking change risk:
  - Medium in `cadenza` if authority contracts reshape exported surfaces or primitive definition metadata.
  - Low for runtime execution if contracts are added without changing existing primitive behavior.
- Migration or rollout risk:
  - Low because this is a new major-version direction and legacy compatibility is not required.
  - Medium if downstream translation repos are updated too early before TypeScript contracts settle.
- Testing risk:
  - Medium because these contracts are foundational and may look valid structurally while missing semantic invariants.
  - Mitigation: add snapshot/validation tests and at least one fixture for each canonical flow family.
- Architecture risk:
  - High if Sprint 2 tries to become environment bootstrap or schema implementation.
  - Mitigation: enforce the contract-only boundary and stop at a new design gate before storage/bootstrap work.

## Migration Strategy

- Order of operations:
  1. Inventory current `cadenza` exports/docs for any existing tag, policy, version, mark, object, or authority concepts.
  2. Produce a repo-local Sprint 2 inventory note classifying what can be reused, deleted, or ignored.
  3. Create the language-neutral contract/fixture source layout for authority/security concepts.
  4. Draft semantic contracts and invariants for the first authority vocabulary slice.
  5. Implement storage-agnostic authority contract types in `cadenza`.
  6. Add validators and JSON snapshot helpers.
  7. Add canonical flow declaration contracts and docs.
  8. Add focused TypeScript tests and fixtures.
  9. Run coherence review against intended whole and language/runtime doctrine.
  10. Decide whether to propagate contracts to Python, Elixir, and C# now or defer until after one contract review cycle.

- Backward compatibility plan:
  - None required for legacy surfaces.
  - Existing core primitive APIs should not be changed unless the authority contract requires it and the change is explicitly documented.

- Validation plan:
  - `cd cadenza && yarn tsc --noEmit`
  - `cd cadenza && yarn vitest run --exclude tests/unit/performance.test.ts`
  - `cd cadenza && yarn build`
  - `cd cadenza && yarn prettier --check ...`
  - workspace `./scripts/check-agent-harness.sh`
  - `git diff --check` in root and `cadenza`

## Alternatives

- Option A: Implement the environment database schema now.
  - Benefit: moves quickly toward bootstrap.
  - Cost: risks encoding unstable semantics into storage and pulling persistence back into core planning.
- Option B: Start with tags only.
  - Benefit: narrower and directly replaces routines as grouping.
  - Cost: tags without logical objects, versions, and policy become decorative rather than authoritative.
- Option C: Start with policy only.
  - Benefit: focuses on security and authority.
  - Cost: policy needs subject/resource identity and effective tags to evaluate coherently.
- Option D: Start environment bootstrap now.
  - Benefit: visible progress toward a deployable environment.
  - Cost: bootstrap would inherit unresolved object/version/tag/policy vocabulary.

Recommendation: implement Sprint 2 as contract-only authority, tags, policy, and flow foundation before environment bootstrap.

## Assumptions

- `cadenza` remains the working TypeScript implementation authority in this phase.
- New security/authority semantics are governed by language-neutral specs, fixtures, invariants, and decisions.
- Authority storage belongs later in a dedicated environment layer, not in core.
- Tags are the first-generation grouping system.
- Policy is allow-only and default-deny.
- Version marks are separate from the main tag system in v1.
- Effective tags are authority projections with provenance, not merely cached arrays.
- Generated CRUD surfaces are useful later but are not the root authority substrate.
- Translation repos should not be updated until the TypeScript authority contract is stable enough to avoid churn, unless the user explicitly wants same-sprint propagation.

## Approval Gate

Implementation should start only after explicit approval:

> Design approved. Proceed.

## Progress - 2026-07-12

- Recorded the approved decision in [docs/decisions/2026-07-12-authority-tags-policy-flow-foundation.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/decisions/2026-07-12-authority-tags-policy-flow-foundation.md).
- Added the first language-neutral semantic contract at [docs/contracts/authority-security/v0.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/contracts/authority-security/v0.md).
- Added the first shared JSON authority/security fixture at [docs/contracts/authority-security/fixtures/v0-authority-foundation.json](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/contracts/authority-security/fixtures/v0-authority-foundation.json).
- Added TypeScript authority contract types and validators in `cadenza/src/authority/contracts.ts`.
- Exported the authority contracts from `cadenza/src/index.ts`.
- Added focused TypeScript tests in `cadenza/tests/unit/authority-contract.test.ts` proving the TypeScript implementation against the language-neutral fixture.
- Updated `cadenza/README.md` to document the new authority contract layer and its non-goals.
- Extended the neutral fixture and TypeScript validators with canonical flow declaration contracts for `Version.CreateInitialObject`, `Tag.Assign`, and `Policy.EvaluateResourceAction`.
- Extended the neutral contract, fixture, and TypeScript validators with request/result envelope contracts for `Version.CreateInitialObject` and `Tag.Assign`.
- Added envelope drift tests so flow results must agree with surrounding logical object, version, mark, tag, and direct-assignment authority records.
- Extended the same envelope pattern to `Policy.EvaluateResourceAction`.
- Added policy envelope validation that binds flow results back to existing policy decision evidence, including subject, resource, action, outcome, matched rules, and reasons.
- Added translation readiness notes in [docs/contracts/authority-security/translation-readiness-v0.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/contracts/authority-security/translation-readiness-v0.md).
- Added a coherence review in [docs/contracts/authority-security/coherence-review-v0.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/contracts/authority-security/coherence-review-v0.md).
- Identified the next decision gate: harden conformance before translation, or translate immediately and accept higher cross-repo churn.
- Added a neutral conformance note at [docs/contracts/authority-security/conformance-v0.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/contracts/authority-security/conformance-v0.md).
- Added a fixture-level conformance manifest with required case names and coverage proof names.
- Added denied policy evidence and rejected `Version.CreateInitialObject` / `Tag.Assign` envelope evidence to the shared fixture.
- Tightened TypeScript validation for stable authority keys, object keys, intent names in semantic payloads, allow-decision matched rules, decision reasons, manifest references, and rejected-flow semantics.
- Approved propagation of the hardened authority/security contract into the official language cores, beginning with Python.
- Added Python-native frozen authority contract dataclasses, tuple-backed collections, and explicit semantic validators in `cadenza-python/src/cadenza/authority.py`.
- Added Python conformance tests that consume the shared workspace fixture directly and prove positive, denied, rejected, naming, identity, reference, and envelope-drift behavior.
- Added Elixir authority contract structs and explicit semantic validators in `cadenza-elixir/lib/cadenza/authority/` and `cadenza-elixir/lib/cadenza/authority.ex`.
- Added Elixir conformance tests that consume the shared workspace fixture directly, preserve denied/rejected evidence, prove cross-reference and envelope invariants, and verify authored identities do not become dynamic atoms.
- Added C# immutable authority records, sealed flow-envelope contracts, and explicit semantic validators in `cadenza-csharp/src/Cadenza/AuthorityContracts.cs` and `cadenza-csharp/src/Cadenza/AuthorityContract.cs`.
- Added C# conformance tests that consume the shared workspace fixture directly and prove semantic parity, denied/rejected evidence, negative invariants, and exact neutral JSON serialization.
- Completed the first four-language horizontal interpretation cycle without requiring a semantic change to the neutral V0 contract.
- Completed request/result contracts for the five previously declaration-only flows: `Version.CreateNextVersion`, `Version.SetCurrent`, `Tag.Remove`, `Tag.RecomputeEffectiveForObject`, and `Policy.EvaluateTagAction`.
- Added immutable direct-tag-removal evidence so tag removal preserves historical assignment authority instead of erasing it.
- Added shared conformance coverage for all next-version outcomes, pointer update/no-change/stale rejection, tag removal, effective-tag recomputation, and tag-policy allow/deny decisions.
- Propagated the completed flow set through TypeScript, Python, Elixir, and C# without language-specific semantic exceptions.
- Added the consolidated eight-flow choreography catalog at [docs/contracts/authority-security/canonical-flows-v0.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/contracts/authority-security/canonical-flows-v0.md).
- Ran the Sprint 2 closure coherence review and identified six bounded relational-validation repairs required before closure.
- Enforced all six repairs authority-first in the neutral contract and TypeScript validator, then propagated equivalent validation and negative tests to Python, Elixir, and C#.
- Completed the final coherence review with a `fits` verdict and recorded the environment-bootstrap handoff in `docs/contracts/authority-security/coherence-review-v0.md`.

## Validation - 2026-07-12

- `cd cadenza && yarn tsc --noEmit`
- `cd cadenza && yarn vitest run tests/unit/authority-contract.test.ts`
  - Passed: 22
  - Failed: 0
- `cd cadenza && yarn vitest run --exclude tests/unit/performance.test.ts`
  - Passed: 135
  - Failed: 0
- `cd cadenza && yarn build`
- `cd cadenza && yarn prettier --check README.md src/authority/contracts.ts src/index.ts tests/unit/authority-contract.test.ts`
- `./scripts/check-agent-harness.sh`
- `git diff --check` in workspace root and `cadenza`
- `cd cadenza-python && python3 -m compileall src tests`
- `cd cadenza-python && PYTHONPATH=src python3 -m unittest discover -s tests`
  - Passed: 82
  - Failed: 0
- `cd cadenza-elixir && mix format --check-formatted`
- `cd cadenza-elixir && MIX_ENV=test mix compile --warnings-as-errors`
- `cd cadenza-elixir && mix test`
  - Passed: 70
  - Failed: 0
- `cd cadenza-csharp && dotnet format --verify-no-changes`
- `cd cadenza-csharp && dotnet build --no-restore -warnaserror`
  - Warnings: 0
  - Errors: 0
- `cd cadenza-csharp && dotnet test --no-build`
  - Passed: 36
  - Failed: 0

## Closure

- Sprint 2 authority, tags, policy, and canonical-flow foundation is complete.
- The final coherence judgment is `fits`.
- The next implementation stream is environment-bootstrap design, using the handoff constraints in `docs/contracts/authority-security/coherence-review-v0.md`.
- Optional follow-up remains deferred: neutral JSON Schema, split negative fixtures, and packaged conformance tooling.
