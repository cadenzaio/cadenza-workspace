# Sprint 9 Distributed Foundation Stabilization And Publication Design Proposal

Date: 2026-07-21

## Current Status

- State: `in_progress`; Sprint 9A is closed and Sprint 9B recursive review is
  active.
- Complexity gate: required. This is a whole-system, multi-repository,
  security-sensitive release and public publication milestone.
- Prerequisite: Sprint 8D and final Sprint 8 closure are approved.
- Impacted repos: `cadenza-workspace`, `cadenza`, `cadenza-python`,
  `cadenza-elixir`, `cadenza-csharp`, `cadenza-chamber`, and `cadenza-cell`.
- Candidate public repository set: unresolved until Sprint 9A. Legacy and demo
  repositories remain reference-only and outside implementation scope.
- Required design approval phrase: `Design approved. Proceed.`
- Design approval received: `Design approved. Proceed.` on 2026-07-21.
- Publication itself requires a later, separate explicit approval after the
  release-candidate review.
- Parent roadmap:
  [Cadenza Official Implementation Roadmap](2026-07-09-cadenza-official-roadmap.md).
- Governing decision:
  [Distributed Foundation Publication And Product Boundary](../../../decisions/2026-07-20-distributed-foundation-publication-and-product-boundary.md).
- Sprint decision:
  [Distributed Foundation Stabilization And Publication](../../../decisions/2026-07-21-distributed-foundation-stabilization-and-publication.md).
- Sprint 9A baseline and decision gate:
  [Truth Baseline And Publication-Boundary Gate V1](../../../publication/sprint-9a-truth-baseline-and-boundary-gate-v1.md).
- Corrected final Sprint 9A publication gate:
  [Final Publication Boundary Gate V2](../../../publication/sprint-9a-final-publication-boundary-gate-v2.md).
- Final Sprint 9A publication gate approved by the user on 2026-07-21.
- Publication-boundary decision:
  [Distributed Foundation Publication Boundary](../../../decisions/2026-07-21-distributed-foundation-publication-boundary.md).
- Pending Sprint 9A design amendment:
  [Environment Authority Boundary Amendment V1](../../../publication/sprint-9a-environment-authority-boundary-amendment-v1.md).
- Amendment approval received:
  `Sprint 9A environment authority boundary amendment approved. Proceed.` on
  2026-07-21.
- Extraction ownership manifest:
  [Environment Authority File Ownership V1](../../../publication/sprint-9a-environment-authority-file-ownership-v1.md).
- Amendment decision:
  [Environment Authority Repository Boundary](../../../decisions/2026-07-21-environment-authority-repository-boundary.md).
- Amendment implementation closure:
  [Environment Authority Extraction Closure V1](../../../publication/sprint-9a-environment-authority-extraction-closure-v1.md).
- Environment authority extraction closure approved by the user on 2026-07-21.
- Implemented adapter/performance amendment:
  [Adapter Ownership And Performance Harness Amendment V1](../../../publication/sprint-9a-adapter-ownership-performance-harness-amendment-v1.md).
- Adapter/performance amendment approval received:
  `Sprint 9A adapter and performance amendment approved. Proceed.` on
  2026-07-21.
- Adapter/performance decision:
  [Chamber Adapter Ownership And Performance Evidence](../../../decisions/2026-07-21-chamber-adapter-ownership-and-performance-evidence.md).
- Adapter/performance baseline:
  [Core Performance Baseline V1](../../../publication/sprint-9a-core-performance-baseline-v1.md).
- Adapter/performance closure review:
  [Adapter And Performance Amendment Closure V1](../../../publication/sprint-9a-adapter-performance-closure-v1.md).
- Adapter/performance closure approved by the user on 2026-07-21.

## Context

Sprint 8 completed the first coherent distributed Cadenza model. The official
system now spans primitive semantics, four language expressions, environment
authority, PostgreSQL reconciliation, Cell trust and containment, Chamber
materialization and execution, distribution, evidence custody, scale, supply,
stem succession, and durable distributed actors.

That breadth creates a new risk: every part can pass its focused tests while
the published whole remains difficult to reproduce, secure, operate, explain,
or inherit. Publication must therefore be a feature-free proof of the whole,
not a packaging task performed after ordinary cleanup.

Current evidence also shows a material interpretation gap. The workspace has
only one high-level Mermaid runtime diagram. Public READMEs vary from concise
core descriptions to chronological sprint narratives, and no visual body
currently explains code ownership, runtime processes, trust boundaries,
authority paths, evidence custody, actor recovery, or scale behavior across
repositories.

## Intended Whole

Sprint 9 should produce a public distributed foundation that a new human or
agent can:

1. understand from the intended function down to local code responsibility.
2. build and validate from clean checkouts without private workspace history.
3. inspect across semantic, authority, runtime, security, evidence, and
   temporal boundaries.
4. extend without importing legacy architecture or inventing ambient affect.
5. evaluate honestly through explicit limitations and reproducible evidence.

False success would be clean CI and polished repositories that still require
oral history to understand, reproduce, secure, or operate.

## Proposed Approach

Run one feature-free Sprint 9 in six gated passes. Architectural repairs are
allowed when they restore the approved whole. New product features, expansion
bundles, plugins, Memory, observer UI work, CLI work, and managed-product work
remain frozen.

Visual documentation is a continuous review instrument across the sprint.
Draft diagrams begin in Sprint 9A, expose fragmentation during review, and are
only declared authoritative after the reviewed code and contracts freeze.

## Sprint 9A: Truth Baseline And Publication Scope

### Repository And Artifact Inventory

- classify every official repository, package, crate, namespace, adapter,
  migration, generated artifact, script, fixture, document, and test by
  purpose.
- identify dead, duplicate, legacy-derived, exploratory, generated, private,
  and public surfaces.
- inventory repository dirt, oversized artifacts, ignored files, local-only
  paths, credentials, binary outputs, heap snapshots, and machine-specific
  assumptions.
- map every shared contract to its authority source and every consumer.
- record a baseline validation result for every official repository before
  repairs begin.

### Publication Boundary Gate

The initial boundary recommendation is under amendment. The proposed corrected
boundary creates `cadenza-environment` for the complete durable
environment-authority whole and removes persistence and durable authority
ownership from all four core repositories. Sprint 9B remains gated until this
breaking multi-repository amendment is approved.

Sprint 9A must present and obtain explicit decisions for:

- the exact public repository set and the public home for cross-repository
  contracts, architecture, decisions, and diagrams.
- whether `cadenza-integrations` is official, deferred, or exploratory.
- repository names, GitHub organization, visibility, ownership, and default
  branch policy.
- license and copyright posture.
- contribution model, code of conduct, security-reporting route, and support
  expectations.
- public-history strategy: preserved history, curated new history, or a
  documented hybrid.
- release maturity and naming: preview, release candidate, or stable major.
- whether package-registry publication is part of Sprint 9 or a later release
  step. GitHub source publication does not silently imply registry release.

Recommendation: publish the six official implementation repositories plus one
curated public architecture/contract home, rather than publishing the current
workspace meta repository unchanged. Treat the first release as a preview or
release candidate until an external clean-room reproduction succeeds.

Gate: the release boundary is explicit enough that no later cleanup can
silently change what is public or what compatibility is promised.

## Sprint 9B: Recursive Code, Contract, And Coherence Review

Review from the whole downward and from each part back upward:

- intended-whole and twelve-question coherence review.
- public API and export review in each core language.
- cross-language semantic conformance and intentional divergence review.
- contract authority, schema, enum, nullability, naming, and version review.
- dependency direction and forbidden-coupling review.
- dead code, unreachable behavior, stale compatibility shim, obsolete feature,
  and speculative abstraction removal.
- state-machine, idempotency, concurrency, ordering, timeout, retry, and
  cancellation review.
- error taxonomy and fail-closed behavior review.
- generated/manual source ownership and reproducibility review.
- documentation claims checked against current code, contracts, and tests.

Every finding receives one disposition: `must_fix`, `accepted_limit`,
`post_publication`, or `not_a_defect`. Accepted limitations must be public when
they affect users, operators, or security interpretation. Contract changes
remain authority-first and require a design amendment when they alter approved
meaning.

Gate: every retained production file and public surface has a defensible
purpose in the intended whole, and no unresolved whole-breaking finding
remains.

## Sprint 9C: Security, Reproducibility, System Proof, And Operational Hardening

### Security

- threat-model authority, bootstrap, Cell, Chamber, callable materialization,
  PostgreSQL roles, peer transport, evidence, supply, stem, and actor paths.
- audit credential custody, capability narrowing, disclosure, replay,
  canonicalization, size bounds, resource pressure, and failure containment.
- scan current source, generated artifacts, dependencies, and candidate git
  history for secrets and unsafe publication material.
- run language-appropriate dependency, license, and vulnerability checks.
- produce an explicit security model, supported deployment assumptions,
  vulnerability-reporting policy, and known-limitations document.
- generate machine-readable dependency inventories or SBOMs for release
  artifacts where practical.

### Reproducibility And Operations

- prove builds and tests from fresh clones using documented, pinned toolchains.
- replay PostgreSQL migrations from an empty database and verify resulting
  authority shape.
- remove absolute developer paths and undocumented local prerequisites.
- verify deterministic generated artifacts and dependency locks.
- document supported operating systems, Node, Python, Elixir/OTP, .NET, Rust,
  PostgreSQL, Linux, and gVisor versions.
- define clean startup, health interpretation, drain, shutdown, failure,
  recovery, and complete cleanup procedures.
- preserve the isolated TypeScript core and retained-memory benchmark baseline;
  rerun it on a pinned release candidate without turning developer-machine
  variance into a correctness failure.
- repair repository-wide formatting and generated-artifact traversal so normal
  validation commands are bounded and reliable.

### Reference Business System

Build one release-owned, realistic reference system from public Cadenza
authoring surfaces. This is not a revived legacy demo and must not depend on
legacy repositories. Its final public location follows the Sprint 9A
repository-boundary decision.

The default domain is an order-to-fulfillment flow because it naturally needs
request/response, parallel decisions, keyed state, detached consequences,
rate-sensitive work, durable recovery, and interpretable business outcomes.
It should form a small coherent system rather than one oversized graph:

- order submission and acceptance.
- order-status inquiry and cancellation.
- inventory reservation and release.
- fulfillment progression and customer-notification coordination.

Together, those flows should include:

- a `submit-order` intent with validated input and explicit response.
- task graphs for validation, pricing, availability, risk, acceptance, and
  fulfillment, including fan-out, fan-in, deterministic conclusion, and one
  explicit composition-conflict proof.
- helpers for reusable domain calculations and globals for immutable business
  configuration.
- order and inventory actors with meaningful read/write behavior, durable
  state, idempotent mutations, and recovery after owner loss.
- detached signals for audit and fulfillment consequences while preserving the
  overarching trace.
- purposeful ephemeral, throttled, and debounced task behavior rather than
  artificial calls included only to increase coverage.
- tags, policy decisions, authority-defined source slices, and controlled
  capability providers where the business scenario legitimately requires
  them.
- deterministic test providers for payment, risk, and shipping boundaries so
  the scenario tests Cadenza integration without depending on third-party
  availability.
- execution across multiple Chambers and Cells without topology, credentials,
  transport, placement, or persistence logic entering authored business code.
- scale-out, route change, Chamber or Cell loss, retry, drain, actor recovery,
  evidence custody, and complete cleanup during representative runs.

Every currently official authored primitive must appear for a defensible
business reason: task, signal, intent, actor, helper, global, and specialized
task variants. Critical substrate features receive representative coverage,
not a contrived attempt to cover every internal branch. Future facts, Memory,
plugins, CLI behavior, and managed-product concerns remain outside this test.

The suite asserts two distinct outcomes:

1. **Business truth:** accepted and rejected orders, pricing, reservations,
   state transitions, fulfillment consequences, idempotency, and explicit
   failures are correct.
2. **System truth:** authority, placement, containment, routing, persistence,
   recovery, evidence, trace continuity, fencing, and cleanup behaved as
   claimed without leaking into the business model.

A feature-to-purpose matrix must connect each exercised primitive or critical
runtime feature to the business need, authored definition, expected outcome,
evidence proof, and relevant failure scenario. This prevents nominal coverage
from replacing meaningful use.

### Agent Authoring Trial

Run a clean-context authoring trial in which an agent receives the business
requirements, public packages, and candidate public documentation, but not
this conversation or undocumented workspace knowledge. The agent should:

- design and implement a bounded extension or second flow in the reference
  system using only public APIs.
- write domain-level acceptance tests.
- run it locally and through the supported distributed path.
- explain the resulting graph and expected evidence using public terminology.

Capture the first attempt and subsequent repair path. Evaluate the framework,
not the agent, using these questions:

- did business code remain focused on domain logic and workflow shape?
- did the agent import internals or encode Cell, Chamber, route, credential,
  placement, or persistence mechanics?
- which concepts required source-code archaeology or private explanation?
- which errors were actionable and which obscured the actual boundary?
- how much bespoke glue was required outside definitions and approved
  deployment authority?
- could the agent predict and interpret normal, denied, failed, and recovered
  execution evidence?

Agent difficulty is release evidence. Prompting around a confusing API or
missing document does not close the finding; the responsible code,
documentation, error, or example must be repaired or recorded as an accepted
public limitation.

Gate: a clean machine can reproduce the supported foundation, the reference
business system proves useful outside-in behavior, the clean-context agent can
author against public surfaces without infrastructure leakage, and no
unresolved critical or high-severity security issue remains.

## Sprint 9D: Visual Architecture Atlas And Public Documentation

### Visual Doctrine

Diagrams are interpretive contracts, not decoration. Each visual must state:

- its audience and question.
- its scope and abstraction level.
- what it intentionally omits.
- the identities, states, affects, and boundaries it depicts.
- the authoritative contracts, code areas, and tests that support it.
- its owner and last validation date.

The atlas uses one stable visual grammar for semantic authority, durable
authority, trusted hosts, isolated runtimes, business logic, control paths,
data paths, evidence paths, and forbidden affect. Boundary crossings and trust
changes must be visually explicit. One diagram must not attempt to explain the
entire system at every level.

Mermaid embedded in Markdown is the default source format for flow, sequence,
state, and dependency diagrams because it remains reviewable beside code.
Pinned rendered SVG or PNG assets may be published where portability or first
impression requires them. A more expressive orientation illustration is
allowed, but it cannot be the sole source for a technical claim.

### Required Atlas

1. **Intended whole:** authored business logic and workflow at the center,
   with operational complexity absorbed by governed substrate layers.
2. **Repository and contract ownership:** official repositories, authority
   direction, consumer direction, and public/private boundaries.
3. **System planes:** semantic definition, durable authority/control, runtime
   execution, business affect, and evidence/interpretation without conflating
   them.
4. **Definition to execution:** serialized definition authority, controlled
   callable materialization, primitive materialization, and Chamber execution.
5. **Environment bootstrap:** genesis through handoff-ready and operational,
   including trust-root retirement and authority-access activation.
6. **Runtime topology:** environment, PostgreSQL authority, stem, supply
   supervisor, Cells, Chambers, adapters, and authored logic.
7. **Graph behavior:** tasks, relationships, detached signals, inquiries,
   deterministic conclusion, contribution policy, and explicit composition
   failure.
8. **Distribution path:** local and remote route resolution, authenticated Cell
   transport, Chamber ingress, continuation, and stale-generation rejection.
9. **Execution evidence:** task/signal, graph, distribution, transport, custody,
   ledger processing, and overarching trace relationships.
10. **Scale and reconciliation:** desired state, singleton stem planning,
    action authority, Cell supply, Chamber convergence, and succession.
11. **Actor lifecycle:** first touch, assignment epoch, residency, hydration,
    strict write-through commit, uncertainty resolution, drain, owner loss,
    and recovery.
12. **Security and capability boundaries:** credential holders, literal
    capability surfaces, containment boundaries, denied paths, and disclosure
    boundaries.
13. **Reference business journey:** the order-to-fulfillment flow from authored
    intent through distributed execution, actor state, detached consequences,
    evidence, failure, and recovery.

### Code And Process Views

- each official repository receives a stable module/package ownership diagram;
  function-by-function graphs are excluded unless they explain a genuinely
  complex critical path.
- state diagrams cover Environment, Cell, Chamber, reconciliation action,
  evidence custody, and actor assignment/residency lifecycles.
- sequence diagrams cover at least a local graph run, distributed inquiry or
  delegation, detached trace continuation, scale change, Cell loss and stem
  succession, actor write, uncertain commit, and actor-owner recovery.
- paired happy-path and failure-path diagrams show where the system stops,
  retries, rejects, or recovers rather than depicting success alone.

### Documentation Set

- one public architecture landing page with three reading paths: orientation,
  application author, and runtime/security contributor.
- purpose-led README for every public repository, replacing sprint chronology
  with role, boundaries, current capability, quick start, validation, status,
  limitations, and links into the atlas.
- an application-author guide centered on workflow and business logic rather
  than deployment mechanics.
- runtime operator, contributor, security model, threat model, evidence
  interpretation, compatibility, and troubleshooting guides.
- small current examples inside official repositories; legacy demo repositories
  remain excluded.
- a guided reference-system walkthrough that keeps domain behavior primary and
  links each hidden runtime consequence to the relevant atlas view and
  evidence.
- terminology and naming glossary shared across languages and runtimes.

### Visual Validation

- render every diagram in a pinned validation environment.
- inspect desktop and narrow-width output for clipping, unreadable labels, and
  broken hierarchy.
- verify links and referenced artifacts.
- review each diagram against its cited contracts and executable evidence.
- fail documentation validation when canonical diagram sources cannot render.

Gate: a new reader can move from the whole to one critical execution or
failure path and back without relying on chat history or undocumented expert
interpretation.

## Sprint 9E: Release Engineering And Public Packaging

- normalize repository structure and package metadata without flattening
  language-native conventions.
- add scoped `LICENSE`, `SECURITY.md`, `CONTRIBUTING.md`, code-of-conduct, and
  support/status documents according to the Sprint 9A decisions.
- establish branch protection and required CI for format, lint, typecheck,
  build, unit, conformance, hostile, dependency, license, docs, and package
  smoke tests.
- create installable artifacts from clean checkouts and verify minimal consumer
  projects for each public language package.
- define contract compatibility and supported-version matrices across core,
  Chamber, Cell, database schema, adapters, and runtime protocols.
- generate changelogs and release notes from the new-major boundary without
  presenting legacy compatibility as supported.
- establish artifact checksums, release provenance, tag policy, and rollback or
  withdrawal procedure.
- freeze a release-candidate commit in each repository using one shared release
  manifest of exact commit and artifact digests.

Gate: the candidate can be reviewed and reproduced as the same bounded release
across all repositories.

## Sprint 9F: Definitive Proof, Release Review, And Publication

- run every repository's clean validation suite.
- run cross-language conformance and clean-consumer package smoke tests.
- run definitive Linux/gVisor bootstrap, containment, multi-Cell distribution,
  evidence, scale, supply, stem succession, actor failure, recovery, and cleanup
  scenarios against the exact release-candidate commits.
- rerun the complete reference business system and clean-context authoring
  acceptance suite against those same commits and artifacts.
- verify no process, container, credential, temporary authority, or generated
  release artifact remains after cleanup.
- complete a final recursive coherence, security, documentation, operational
  complexity, and public-disclosure review.
- produce one release-candidate closure report containing exact commands,
  environments, commits, artifact digests, results, accepted limitations, and
  unresolved non-blocking risks.
- request explicit user approval for publication.
- only after that approval, create or configure public GitHub repositories,
  push the approved histories and tags, enable agreed protections, and verify
  the public view from an unauthenticated clean clone.

Gate: publication is complete only when the exact reviewed release is publicly
reproducible and its documentation, diagrams, limitations, and security posture
are visible from outside the private workspace.

## Finding And Change Governance

- One active implementation stream remains the default.
- Findings are tracked by repository, severity, affected whole, evidence,
  disposition, owner, and verification result.
- A finding is not closed by explanation alone; its repair or accepted-limit
  documentation must be verified.
- Cross-repository contract repairs update the authority source first and
  propagate in the same task unless an explicit linked gate says otherwise.
- No failing test is silenced, threshold weakened, or scenario deleted to make
  the release green.
- New dependencies require purpose, maintenance, license, supply-chain, and
  footprint review.
- Publication commands remain separate from preparation commands and require
  final explicit approval.

## Validation Matrix

The release manifest must cover at least:

- TypeScript format, lint, typecheck, build, non-performance tests, performance
  baseline, package smoke test, dependency audit, and API/docs checks.
- Python compile, format/lint decision, unit/conformance tests, package build,
  isolated install smoke test, and dependency/license checks.
- Elixir format, compile warnings, unit/conformance tests, Hex package dry run,
  and dependency/license checks.
- C# format, build with warnings governed, unit/conformance tests, NuGet package
  dry run, and dependency/license checks.
- Chamber and Cell format, Clippy with warnings denied, unit/integration/hostile
  tests, audits, package checks, and Linux/gVisor proof.
- PostgreSQL empty-database migration replay, role-boundary tests, authority
  invariants, and cleanup.
- cross-repository contract snapshots, runtime protocol compatibility, docs
  links, diagram rendering, secret scanning, and release-manifest verification.
- reference-system business assertions, feature-to-purpose coverage,
  multi-Cell execution, failure/recovery, evidence, and cleanup.
- clean-context agent authoring trial with retained inputs, outputs, repair
  findings, and final validation.

Exact commands and supported toolchain versions are outputs of Sprint 9A and
9C; repo-local docs remain authoritative for repo-local commands.

## Risks

### Review Breadth

The foundation is large enough that an unstructured review could become
endless. Bounded passes, explicit severity/disposition, one WIP stream, and
per-pass closure gates prevent cleanup from turning into open-ended redesign.

### Visual False Confidence

A polished diagram can conceal ambiguity or imply guarantees the code does not
provide. Diagram claims therefore cite authority and evidence, include omitted
scope, and receive the same review discipline as code.

### Documentation Drift

Generated diagrams can become mechanically current but semantically wrong;
hand-authored diagrams can become stale. Cadenza should automate rendering and
link integrity while retaining human review of meaning.

### Publication Irreversibility

Secrets, private paths, unsuitable history, incorrect licensing, or overstated
stability are difficult to retract after public push. Candidate-history and
disclosure review must finish before any repository becomes public.

### Cross-Repository Version Confusion

Independent language and runtime versions can imply compatibility that was not
tested. One release manifest and compatibility matrix must bind the published
set without requiring all repositories to share one artificial semantic
version.

### Operational Complexity Growth

Release automation can become a second orchestration system. Keep automation
literal, bounded, inspectable, and subordinate to repo-native commands. Do not
introduce a new general release service in this sprint.

### Contrived System Coverage

Forcing every internal feature into one story could produce an unrealistic
demo that teaches bad design. The reference system requires every authored
primitive to serve a domain purpose while using representative, explicitly
bounded coverage for substrate behavior.

### Agent Trial Contamination

An agent carrying months of Cadenza context could make the framework look more
usable than it is. The authoring trial therefore starts from a clean context,
uses only candidate public materials, and retains its complete repair trail.

## Migration Strategy

There is no backward-compatibility obligation. This is a new major-version
direction, and legacy consumers remain on previous releases. Stabilization may
remove obsolete exports or revise pre-public contracts when justified by the
intended whole and recorded through the normal authority-first design process.

Publication proceeds from private working trees to frozen release candidates,
then to public repositories only after clean-room validation and approval. No
package registry or production environment is mutated implicitly.

## Alternatives

### Publish Now And Improve Documentation Incrementally

Rejected. Public readers would inherit hidden architecture, unstable release
boundaries, and misleading maturity before the first complete system has been
reviewed as a whole.

### Finish Cleanup Before Drawing Diagrams

Rejected. Early diagrams are diagnostic tools that expose unclear identities,
relationships, and boundaries. Final diagrams are refreshed after repair.

### Generate Complete Code Graphs Automatically

Rejected as the primary visual strategy. Exhaustive graphs are easy to produce
but difficult to interpret and decay into visualized implementation noise.
Stable ownership and critical-path views better serve inheritance.

### One Giant Architecture Diagram

Rejected. It would collapse abstraction levels and hide rather than reduce
complexity. The atlas uses linked views with explicit scope.

### Publish The Workspace Exactly As It Exists

Rejected as a default. The meta repository currently mixes authoritative
cross-repository material with private workflow state, legacy planning, and
deferred Memory artifacts. Its public boundary requires an explicit decision
and curation pass.

## Assumptions

- Sprint 9 is feature-free except for repairs required to satisfy the release
  gate.
- The six currently documented implementation repositories are the official
  product candidates; `cadenza-integrations` remains unresolved.
- Legacy repositories and demos are not repaired or published as official
  Cadenza repositories.
- GitHub publication is intended, but no external repository operation occurs
  without a separate final approval.
- The first public release should default to preview or release-candidate
  maturity unless clean-room evidence justifies a stable major release.
- Public diagrams and documentation are versioned release artifacts, not
  informal ancillary material.
- The reference business system is a maintained release proof and teaching
  artifact, not an official product feature or a legacy demo successor.
- Performance thresholds remain distinct from correctness; results and
  machine context are published honestly.

Approval of this proposal confirms the sprint shape and assumptions, but not
the unresolved publication-boundary decisions listed in Sprint 9A.

## Exit Criteria

Sprint 9 is complete only when:

- every published file, dependency, contract, and public surface has a clear
  purpose.
- all must-fix findings are repaired and verified.
- all official repositories pass their clean, hostile, conformance, security,
  package, and documentation gates.
- definitive Linux/gVisor whole-system proofs pass against frozen release
  candidates.
- the realistic reference business system passes its business, authority,
  distributed-runtime, failure/recovery, evidence, and cleanup assertions.
- a clean-context agent can implement and explain a bounded business-flow
  extension without importing runtime infrastructure into authored logic.
- the visual atlas and public documentation accurately explain the whole,
  parts, boundaries, critical paths, failure behavior, and limitations.
- a clean external reader can understand and reproduce the supported system.
- the release manifest binds exact commits, artifacts, protocols, contracts,
  and compatibility.
- licensing, history, contribution, security, support, version, and public
  repository decisions are explicit.
- no secret, private path, unsupported legacy promise, or hidden operational
  prerequisite is published.
- the user approves the release-candidate closure review and separately
  approves publication.
- the approved repositories and tags are visible and reproducible from GitHub.

## Work Items After Approval

- [x] Execute Sprint 9A and present the publication-boundary decision gate.
- [x] Execute Sprint 9B and request code/contract/coherence closure. Approved
      on 2026-07-22.
- [x] Execute Sprint 9C and request security/reproducibility closure. Approved
      on 2026-07-22 in
      [Sprint 9C Closure Review V1](../../../publication/sprint-9c-closure-review-v1.md).
- [x] Execute Sprint 9D and request visual/documentation closure. Approved
      on 2026-07-22 in
      [Sprint 9D Closure Review V1](../../../publication/sprint-9d-closure-review-v1.md).
- [x] Execute Sprint 9E and request release-candidate freeze approval. Approved
      on 2026-07-22.
      Review requested in
      [Sprint 9E Release Candidate Closure V1](../../../publication/sprint-9e-release-candidate-closure-v1.md).
- [ ] Execute Sprint 9F, present the final review, and request explicit
      publication approval.

## Evidence

- [Cadenza Intended Whole](../../../cadenza-intended-whole.md)
- [Workspace Architecture](../../../architecture.md)
- [Sprint 8 Closure Review](../../../contracts/actor-distribution/sprint-8d-closure-review-v1.md)
- [Distributed Foundation Publication And Product Boundary](../../../decisions/2026-07-20-distributed-foundation-publication-and-product-boundary.md)
- User direction on 2026-07-21: code, process, behavior, and whole-system
  diagrams or illustrations should make Cadenza understandable across
  boundaries before publication.
