# Sprint 9A Environment Authority Boundary Amendment V1

Date: 2026-07-21

## Status

- State: `closed`.
- Scope: repository ownership of environment authority, authority contracts,
  PostgreSQL persistence, bootstrap, reconciliation, supply, and distributed
  actor authority.
- Complexity gate: required. This is a breaking, multi-repository contract and
  architecture change.
- Approved on 2026-07-21 with the required approval phrase.
- Extraction closure approved by the user on 2026-07-21.
- Implementation is complete under the file-level
  [ownership manifest](sprint-9a-environment-authority-file-ownership-v1.md).
- Closure evidence:
  [Environment Authority Extraction Closure V1](sprint-9a-environment-authority-extraction-closure-v1.md).
- Required approval phrase:
  `Sprint 9A environment authority boundary amendment approved. Proceed.`

## Context

The Sprint 9A baseline describes `cadenza` as both the TypeScript primitive
core and the environment authority. That placement contradicts the approved
persistence-agnostic core direction and makes one language expression appear
to own the durable environment.

The repository currently contains three conceptually different wholes:

1. TypeScript expressions of Cadenza primitives and graph execution.
2. language-neutral execution evidence produced by those primitives.
3. durable environment authority: policy, bootstrap, PostgreSQL migrations,
   authority operations, reconciliation, supply, evidence-ledger processing,
   and distributed actor persistence.

The third whole has its own identity, state, security boundary, lifecycle, and
stewardship. Keeping it inside the TypeScript core causes vertical
fragmentation: a local language implementation appears to own system authority
that should govern all language runtimes equally.

## Intended Boundary

The core repositories express Cadenza primitive meaning in their languages.
They must be able to materialize already-governed primitive definitions and
emit neutral evidence without knowing which database, policy engine, gateway,
or environment granted the execution.

The environment repository governs durable environmental truth and the
operations that change it. PostgreSQL is its first persistence adapter, not
the identity of the repository or a dependency of core.

False success would be moving only the SQL directory while policy decisions,
bootstrap records, gateway operations, or reconciliation authority remain
exported by `cadenza`.

## Proposed Decision

Create a new official repository named `cadenza-environment`.

`cadenza-environment` becomes the implementation and contract authority for:

- environment identity, trust root, bootstrap state, seed packs, and
  operational handoff.
- durable logical-object versions, authority-bearing tag assignments, policy
  rules and decisions, and canonical authority operations.
- the authority gateway and its generated operation artifact.
- PostgreSQL schema, migrations, roles, exact-operation adapters, and
  persistence validation.
- placement desired state, reconciliation projections and plans, stem leases,
  recovery fencing, and control-plane outcomes.
- pre-enrolled Cell supply authority and provider observations.
- durable evidence ledger ingestion and processing authority.
- distributed actor placement, assignment epochs, hydration, mutation commit,
  lifecycle authority, and persistence adapters.

The repository may contain multiple packages or modules. PostgreSQL-specific
code must remain behind an explicit adapter boundary so the environment whole
does not become synonymous with one database implementation.

## Core Boundary

`cadenza`, `cadenza-python`, `cadenza-elixir`, and `cadenza-csharp` retain:

- task, signal, intent/inquiry, actor, helper, global, relationship, graph,
  conclusion, and specialized-task semantics.
- primitive definition identity, versions, names, and tags where those values
  are intrinsic metadata supplied with a definition.
- local primitive and graph execution behavior.
- runtime evidence production, trace continuity, and the custody-reporter
  interface required to make execution observable.
- neutral evidence fields that report which supplied definition, intent,
  signal, or execution grant participated.

They must not own or export:

- durable authority records or repositories.
- policy evaluation or policy-decision state machines.
- authority gateway operations.
- environment bootstrap or operational-transition state.
- SQL, database clients, migrations, or persistence adapters.
- placement, reconciliation, supply, stem, or distributed actor-persistence
  authority.
- durable evidence-ledger processing.

Authority-agnostic does not mean execution-evidence blind. A core may report
the authority context it received, but it may not discover, decide, persist,
or mutate that authority.

## Runtime Relationships

- `cadenza-environment` publishes governed definitions and runtime policy
  through explicit language-neutral contracts.
- Cell consumes environment authority for placement, activation, routing,
  supply, evidence custody, and actor coordination.
- Chamber receives narrowed activation and already-authorized definitions,
  controls callable materialization, and invokes the selected language core.
- language cores materialize primitive objects and execute them without a
  database or environment-authority dependency.
- execution evidence flows back through Chamber and Cell custody to the
  environment ledger boundary.

No core repository may depend on `cadenza-environment`. Environment and runtime
repositories may consume versioned core definition/evidence contracts where
the dependency direction requires it.

## Contract Authority Changes

Update `contracts.config.json` as follows during implementation:

| Contract family                                                                  | New authority         |
| -------------------------------------------------------------------------------- | --------------------- |
| `core_runtime_primitives`                                                        | `cadenza`             |
| runtime execution-evidence event and reporter contracts                          | `cadenza`             |
| durable execution-evidence custody entries, ledger, and processing attempts      | `cadenza-environment` |
| `authority_security_contracts` except intrinsic definition identity/tag metadata | `cadenza-environment` |
| `environment_bootstrap_contracts`                                                | `cadenza-environment` |
| `distribution_authority_contracts`                                               | `cadenza-environment` |
| `chamber_runtime_contracts`                                                      | `cadenza-chamber`     |
| `cell_runtime_contracts`                                                         | `cadenza-cell`        |

The implementation pass must split mixed contract families rather than retain
an inaccurate family name for convenience. Versioned, language-neutral
snapshots must let consumers validate independently without sibling checkout
paths.

## Repository Move Map

Move from `cadenza` to `cadenza-environment`:

- `environment-bootstrap/`.
- `authority-gateway/`.
- reconciliation and runtime-convergence contract artifacts.
- environment, authority, policy, distribution, evidence-ledger, supply, stem,
  and distributed actor-persistence contract sources and tests.

Remove the translated durable authority/security implementation and its
public exports from Python, Elixir, and C# core. Preserve only intrinsic
primitive metadata and neutral evidence reporting. Any language-specific
environment client should later be an adapter package, not part of a core
package.

The detailed file manifest will be produced before the first move because some
current files combine neutral evidence production with durable ledger
processing and must be split by responsibility.

## Publication Boundary Amendment

The candidate public set becomes nine repositories:

1. `cadenza` - TypeScript core.
2. `cadenza-python` - Python core.
3. `cadenza-elixir` - Elixir core.
4. `cadenza-csharp` - C# core.
5. `cadenza-environment` - durable environment authority and PostgreSQL
   adapter.
6. `cadenza-chamber` - Chamber runtime.
7. `cadenza-cell` - Cell runtime.
8. `cadenza-workspace` - curated architecture, neutral cross-repository
   contracts, decisions, release manifest, and system validation authority.
9. `cadenza-reference-system` - outside-in business-system proof.

`cadenza-integrations` remains deferred/private. The legacy `cadenza-db` must
not be revived or renamed into this role; its architecture is reference-only.

## Migration Strategy

1. Produce a file-level ownership and dependency manifest and freeze the
   affected contract families.
2. Create `cadenza-environment` with a clean initial history and repo-local
   governance.
3. Establish environment-owned neutral contract snapshots and standalone
   validation before changing consumers.
4. Move bootstrap, gateway, PostgreSQL, reconciliation, supply, ledger, and
   actor-authority implementation into the new repository.
5. Remove durable authority implementation and exports from all four core
   repositories; split mixed execution-evidence modules where required.
6. Update Cell, Chamber, workspace contract authority, release manifests, and
   integration tests to consume exact environment artifacts without hidden
   sibling paths.
7. Prove each repository from a standalone checkout, then run the explicit
   release-workspace and reference-system suites.
8. Run the recursive coherence review again before establishing publication
   release candidates.

No backwards-compatibility layer is required. This is the unpublished new
major direction, and retaining deprecated authority exports would violate the
spotless-core criterion.

## Risks And Controls

- **Contract cycles:** split neutral event production from durable custody and
  processing; reject any core dependency on environment.
- **Partial extraction:** use the file-level ownership manifest and forbidden
  import checks; moving SQL alone does not satisfy the gate.
- **Authority ambiguity:** assign every contract and generated artifact one
  named authority in `contracts.config.json`.
- **Repository proliferation:** keep the entire environment-authority whole in
  one repository with internal adapters rather than creating separate repos
  for database, gateway, reconciliation, and supply.
- **Translated-core drift:** remove the same non-core semantic surface from all
  four languages and validate synchronized public API inventories.
- **Lost evidence semantics:** retain core event production and supplied
  authority-context fields while moving only durable custody and processing.
- **Temporal loss:** preserve provenance in the workspace decision record and
  move history where practical, while the new public repository starts from a
  reviewed clean boundary.

## Alternatives Considered

### Move Only PostgreSQL Into `cadenza-authority-db`

Rejected. The database, gateway, bootstrap, reconciliation, supply, ledger,
and actor authority participate in one environment whole. Splitting storage
alone leaves semantic authority in core and creates another coordination
boundary.

### Put Environment Authority In Cell Or Chamber

Rejected. Cell and Chamber consume narrowed authority to host and execute
work. Owning global durable authority would collapse trust boundaries and make
runtime hosts their own governors.

### Put Product Code In `cadenza-workspace`

Rejected. The workspace is the cross-repository architecture and release
authority, not a deployable implementation repository.

### Keep The Current Placement

Rejected. It makes TypeScript core structurally privileged, contradicts the
persistence-agnostic core decision, and exports code that does not serve the
core whole.

## Approval Gate

Approval accepts:

1. `cadenza-environment` as a new official repository.
2. the complete environment-authority extraction rather than a SQL-only move.
3. removal of durable authority/security implementations from all four core
   repositories.
4. the evidence boundary: core produces neutral execution evidence;
   environment owns durable custody, ledger processing, and authority state.
5. the nine-repository candidate publication set.
6. the migration and validation sequence above.

This gate was approved on 2026-07-21. Extraction and contract mutation may
proceed in the documented migration order.

## Evidence

- [Sprint 9A Truth Baseline](sprint-9a-truth-baseline-and-boundary-gate-v1.md)
- [Persistence-Agnostic Core Decision](../decisions/2026-07-11-persistence-agnostic-core.md)
- [Environment Bootstrap Decision](../decisions/2026-07-12-environment-bootstrap-foundation.md)
- [Contract Authority Map](../../contracts.config.json)
- [Cadenza Intended Whole](../cadenza-intended-whole.md)
- Repository export and dependency scan performed on 2026-07-21.
