# Cadenza Official Implementation Roadmap

## Goal

- Outcome:
  - Produce and maintain the master roadmap for implementing the documented Cadenza environment, cell, chamber, authority, policy, actor, and meta-layer features from the current documentation set.
- Why it matters:
  - The workspace now has many months of design notes. Implementation needs one realistic sequence that preserves the intended whole: Cadenza should reduce accidental software, deployment, scale, and distribution complexity so humans and agents can focus on business logic, intended function, and workflow shape. It also preserves the official authority split across the core language repos, chamber runtime, and trusted cell while the old service/database split remains legacy reference material.

## Current Status

- State: `in_progress`
- Completed foundation:
  - Sprint 0 planning hygiene and intended-whole governance.
  - Sprint 1A spotless TypeScript core and Sprint 1B Python, Elixir, and C# cores.
  - Sprint 2 authority, tags, policy, and canonical flow contracts.
  - Sprint 3 environment bootstrap through `handoff_ready`.
  - Sprint 4A/4B chamber foundation and Sprint 4C trusted cell activation through `operational`.
  - Sprint 5 distribution, Sprint 6 execution evidence, Sprint 7 scale and
    orchestration, and Sprint 8 distributed actor lifecycle and persistence.
- Current gate:
  - Sprint 8D and final Sprint 8 closure were approved on 2026-07-21.
  - [Sprint 9 distributed foundation stabilization and GitHub publication](2026-07-21-distributed-foundation-stabilization-publication-design.md)
    is approved and active.
  - [Sprint 9A truth baseline and publication-boundary gate](../../../publication/sprint-9a-truth-baseline-and-boundary-gate-v1.md)
    is in review. Sprint 9B repair remains frozen until its seven publication
    decisions are approved or amended.
- Current repo:
  - `cadenza-workspace`
- Impacted repos:
  - `cadenza-workspace`
  - `cadenza`
  - `cadenza-python`
  - `cadenza-elixir`
  - `cadenza-csharp`
  - `cadenza-chamber`
  - `cadenza-cell`

## Scope

- In scope:
  - Consolidate the environment-native roadmap from `docs/cadenza-environment.md`, `docs/cadenza-schema-proposal.md`, `docs/cadenza-flow-design.md`, and related active execution plans.
  - Treat `cadenza` as the TypeScript primitive authority and
    `cadenza-environment` as the durable environment authority repo.
  - Preserve the official language cores and the separate chamber and cell runtime authority boundaries introduced during Sprints 1B and 4.
  - Use legacy repos only as migration/reference inputs where their existing code or docs clarify prior behavior.
  - Identify design gates, implementation phases, feature slices, and validation expectations before product code work begins.
- Out of scope:
  - New implementation in this planning pass.
  - Continuing development of `cadenza-service`, `cadenza-db`, `cadenza-ui`, or demo repos as official Cadenza surfaces.
  - Updating demos that depend on the legacy service/DB split.

## Repository Boundary

- Official forward repos:
  - `cadenza`: TypeScript core, neutral semantic authority, authority/security contracts, and isolated environment bootstrap.
  - `cadenza-python`, `cadenza-elixir`, and `cadenza-csharp`: official language expressions of the neutral primitive contract.
  - `cadenza-chamber`: chamber activation, immutable runtime images, language-adapter hosting, primitive ingress, normalized outcomes, and chamber evidence.
  - `cadenza-cell`: trusted local host, containment, chamber process custody, capability brokering, local runtime authority, and cell lifecycle.
- Legacy/reference-only repos:
  - `cadenza-service`
  - `cadenza-db`
  - `cadenza-ui`
  - `cadenza-demo`
  - `cadenza-demo-2`
  - `cadenza-demo-service`
  - any other repo whose architecture depends on the legacy service/DB/demo split
- Planning rule:
  - Route each contract change to its authority repo before changing consumers.
  - Keep primitive semantics and environment authority in `cadenza`, chamber execution semantics in `cadenza-chamber`, and trusted local host semantics in `cadenza-cell`.
  - Legacy repos may be read for behavioral evidence, migration lessons, and compatibility risks, but they should not receive new official feature implementation.

## Coherence Governance

- Source:
  - `coherent_creation_master_document_final.docx (private source retained by the project owner)`
- Cadenza intended whole:
  - [docs/cadenza-intended-whole.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/cadenza-intended-whole.md)
- Status:
  - The Coherent Creation principles are governing methodology for Cadenza implementation, architecture review, and specification evolution.
- Core rule:
  - Cadenza specifications and documentation are not absolute. They are working artifacts that may change when a change is justified by stronger coherence with the intended whole.
- Change standard:
  - Any meaningful architecture or contract change should explain how it improves coherence according to the attached framework, especially:
    - intended whole
    - participating identities
    - state as whole-relevant meaning
    - affect and legitimate consequence
    - secure boundaries
    - ordered relationships
    - vertical and horizontal interpretation
    - stewardship of shared fields
    - temporal interpretability
    - fragmentation and repair.
- Recurring review step:
  - During planning, implementation, and review, agents should test code and architecture against the seven axioms:
    1. Intent defines coherence.
    2. Identity is the unit of participation.
    3. Affect gives identity consequence.
    4. Relationships order affect.
    5. Coherence requires bidirectional interpretation across scale.
    6. Coherence requires horizontal interpretability between part-wholes.
    7. Coherence requires temporal stewardship across states and generations.
- Practical review questions:
  - What intended whole does this change preserve or generate?
  - Which identities participate, and which hidden identities would become dangerous if unnamed?
  - What affect does this code or contract permit, deny, route, or record?
  - Does this relationship make consequence explicit, or does it create hidden coupling?
  - Can lower-level parts interpret the whole, and can the whole interpret part state?
  - Can sibling parts remain mutually interpretable without becoming unbounded?
  - What trace does this leave for future agents to understand, inherit, and repair?
  - Where could this succeed locally while weakening Cadenza globally?
- Implementation consequence:
  - "Matches the current docs" is not enough.
  - "Ships the requested feature" is not enough.
  - A change should preserve or regenerate coherence across core primitives, authority, runtime boundaries, evidence, documentation, and future inheritance.

## Roadmap Phases

1. Planning consolidation and repo-boundary cleanup
   - Status: `complete` in Sprint 0.
   - Carefully define and document the exact intended whole for Cadenza before restructuring implementation plans.
   - Use the intended whole as the coherence standard for roadmap decisions, sprint boundaries, repo boundaries, and future spec changes.
   - Document false-success cases where a sprint could appear successful locally while weakening the whole.
   - Review active execution plans.
   - Mark completed planning work as done or archive-ready.
   - Rewrite roadmap references that imply `cadenza-service` or `cadenza-db` remain official target repos.
   - Produce a first implementation backlog for `cadenza`.
   - Record the user's approval to begin with planning hygiene before product implementation.
   - Add Coherent Creation review to the workspace-wide agent workflow during planning hygiene so future agents see it before implementation.

2. Sprint 1A: TypeScript core contract foundation in `cadenza`
   - Status: `complete`.
   - Treat this as the quality bar for the rest of the architecture.
   - Stabilize the official core repo until it is clean, coherent, and ready to carry the new direction.
   - Preserve a spotless primitive foundation because the later environment, cell, chamber, authority, and orchestration layers inherit its architectural shape.
   - Treat this as a new major version; backwards compatibility with legacy consumers is not a requirement.
   - Remove dead, exploratory, or legacy code that no longer serves the intended whole.
   - Review each core contract against Coherent Creation axioms before treating it as foundational.
   - Make TypeScript spotless as the canonical reference implementation.
   - Key-first logical object identity.
   - Immutable semantic versioning.
   - Task-only execution model.
   - `TaskDefinition`, behavior declarations, extension declarations, and declared wiring.
   - Helper/global access by stable keys.
   - Remove or sharply constrain name-based APIs where they only preserve legacy behavior.
   - Early actor semantic cleanup where it belongs to core primitive integrity:
     - keep actors as keyed state-authority primitives
     - keep tasks as the only executable primitive
     - move actor-bound execution toward task-side binding semantics
     - defer distributed residency, hydration, and persistence behavior until the cell/chamber and placement layers exist.

3. Sprint 1B: Polyglot core foundation
   - Status: `complete` for Python, Elixir, and C#.
   - Begin after TypeScript is spotless.
   - Use one official repo per language implementation.
   - Define shared language-neutral markdown specs plus JSON fixtures.
   - First language targets:
     - Python as secondary general-purpose implementation
     - Elixir to take advantage of Beam-aligned distributed/resilience concepts
     - one additional language that can materialize a string into a function at runtime.

4. Authority, tags, policy, and flow primitives
   - Status: `complete` in Sprint 2.
   - Lay the broader preparation foundation on top of the cleaned core contracts.
   - Object registry and lifecycle foundations.
   - Version pointer and mark foundations.
   - Tag categories, assignments, effective tags, and policy evaluation.
   - Domain-shaped authority flows such as `Version.CreateInitialObject`, `Version.CreateNextVersion`, `Version.SetCurrent`, `Tag.Assign`, and `Policy.Evaluate*`.
   - Strict, bounded, and loose flow conventions from `docs/cadenza-flow-design.md`.

5. Environment bootstrap inside `cadenza`
   - Status: `complete` in Sprint 3 through signed `handoff_ready`.
   - Treat bootstrap as a major challenge and a separate foundation layer.
   - Seed vocabulary and seed packs.
   - Minimal authority-access slice.
   - Capability registry.
   - Trust bootstrap model.
   - First local environment bring-up path.

6. Chamber runtime repo introduction
   - Status: `complete` in Sprint 4A and 4B through non-privileged runtime conformance.
   - Introduce the official `cadenza-chamber` runtime repo after the environment bootstrap layer is stable enough to define what a chamber must materialize and execute.
   - Treat `engine` as legacy terminology for this runtime layer.
   - Reference prior design notes from `completed/2026-04-22-multi-engine-bridge-model.md` and `completed/2026-04-23-cell-execution-environment-frontier.md` when this sprint starts.
   - Keep the chamber repo focused on the actual Cadenza runtime boundary:
     - materialize assigned graph/runtime slices
     - run the local Cadenza runtime
     - expose the chamber primitive transport surface
     - avoid owning environment authority, policy, or bootstrap semantics.

7. Cells and chamber orchestration
   - Status: `complete` through Sprint 5.
   - Completed in Sprint 4C:
     - trusted local cell boundary, real gVisor containment, fixed capability broker, first privileged activation, bootstrap-owner retirement, and atomic `operational` transition.
   - Completed in Sprint 5:
     - single-cell multi-chamber host meta authority, chamber-specific projections, lifecycle replacement, and local primitive transport.
     - operational source activation, generated support, source-selected routing, serialized quiescence, and measured four-chamber gVisor conformance.
   - Enter distribution only after core contracts, authority foundations, environment bootstrap, and the chamber runtime boundary are stable.
   - Cell host boundary.
   - Chamber lifecycle.
   - Chamber primitive transport surface: delegation, signal, status.
   - Capability broker and mediated host powers.
   - Execution lanes: business, meta_support, trusted_control.
   - Host meta authority and chamber-local projections.

8. Multi-cell distribution and static placement
   - Status: `complete`; Sprint 6C implementation, measured two-cell Linux
     closure, and final recursive coherence/security review were accepted on
     2026-07-15.
   - Begin only after Sprint 5 proves local multi-chamber authority and primitive transport.
   - Additional governed cell enrollment and lifecycle.
   - Cell capability and capacity declarations.
   - Explicit placement units, replicas, and static replica-to-cell assignment.
   - Minimum authenticated inter-cell signal and delegation envelopes.
   - Static cross-cell route maps and failure semantics.
   - No dynamic scaling, optimizer, or stem-cell reconciliation yet.

Mandatory post-Sprint-6 gate before automated scale/orchestration:

- define and review realtime business-logic execution evidence as a coherent
  protocol rather than generic logging.
- Status: semantic protocol approved on 2026-07-15 and documented in
  `docs/contracts/execution-evidence/v0.md`. Sprint 6D.1 TypeScript authority
  implementation was accepted on 2026-07-15. Sprint 6D.2 Python, Elixir, and
  C# official-core parity was accepted on 2026-07-15. Sprint 6D.3 chamber
  capture and minimal dual-descriptor cell transport were accepted on
  2026-07-15. Sprint 6D.4 cell custody and distribution identity was accepted
  on 2026-07-16 under
  `docs/agent-harness/exec-plans/completed/2026-07-15-cell-custody-distribution-identity-design.md`;
  Sprint 6D.5 processing and ledger design was approved on 2026-07-16;
  Sprint 6D.5A, 6D.5B, 6D.5C, and 6D.5D are accepted. Sprint 6D.6 implementation
  and measured system closure were accepted on 2026-07-17; the
  completed Sprint 6D.5 plan is
  `docs/agent-harness/exec-plans/completed/2026-07-16-execution-evidence-ledger-processing-design.md`;
  later substrate passes remain governed by the Sprint 6D plan in
  `docs/agent-harness/exec-plans/completed/2026-07-15-execution-evidence-implementation-design.md`.
  The Sprint 7 execution-evidence prerequisite is satisfied. The TypeScript and official-core closure reviews are
  `docs/contracts/execution-evidence/typescript-core-closure-v0.md` and
  `docs/contracts/execution-evidence/official-core-parity-closure-v0.md`. The
  Sprint 6D.3 review is
  `docs/contracts/execution-evidence/chamber-capture-closure-v0.md`. The Sprint
  6D.4 review is
  `cadenza-cell/docs/custody-distribution-identity-closure-2026-07-15.md`. The
  Sprint 6D.5B review is
  `docs/contracts/execution-evidence/trusted-facade-provider-closure-v0.md`. The
  Sprint 6D.5C review is
  `cadenza-cell/docs/execution-evidence-processor-activation-closure-2026-07-17.md`.
  The Sprint 6D.5 closure review is
  `cadenza-cell/docs/execution-evidence-ledger-processing-closure-2026-07-17.md`.
  The Sprint 6D.6 system closure review is
  `docs/contracts/execution-evidence/system-closure-v0.md`.
  The completed protocol plan is
  `docs/agent-harness/exec-plans/completed/2026-07-15-execution-evidence-protocol-design.md`.
- cover live graph-run, task, relationship, context-composition, delegation,
  signal-ingress, failure, and conclusion state without exposing raw sensitive
  business context by default.
- reconcile this stream with existing authority, containment, chamber,
  transport, and lifecycle evidence so operators, humans, agents, and future
  UI surfaces interpret one execution truth.

9. Scale, placement reconciliation, and orchestration
   - Status: Sprint 7 is `complete` and closure-approved as of 2026-07-20.
     Sprint 7A contract and
     pure planner, Sprint 7B PostgreSQL authority, and Sprint 7C autonomous Cell
     convergence are complete and closure-approved. Sprint 7D stem-cell
     reconciliation and Sprint 7E pre-enrolled Cell supply are also complete
     and closure-approved. Sprint 7F stem recovery and fencing is also complete
     and closure-approved. Sprint 7G implementation and validation are complete
     after its combined proof exposed and repaired the automatic per-Cell
     execution-evidence processor placement deferred from Sprint 6D.5. The
     definitive Linux lifecycle passed and the recursive closure review was
     approved on 2026-07-20.
     The Sprint 7G closure review is
     `docs/contracts/distribution/sprint-7g-closure-review-v0.md`.
     The Sprint 7F closure review is
     `docs/contracts/distribution/sprint-7f-closure-review-v0.md`. The completed Sprint 7E record is
     `docs/agent-harness/exec-plans/completed/2026-07-19-pre-enrolled-cell-supply-sprint-7e-design.md`.
     The completed Sprint 7D record is
     `docs/agent-harness/exec-plans/completed/2026-07-18-stem-cell-meta-slice-sprint-7d-design.md`. See also
     `docs/agent-harness/exec-plans/completed/2026-07-17-scale-placement-reconciliation-design.md`.
   - Begin only after Sprint 6 and the realtime execution-evidence review gate.
   - Singleton environment-local stem-cell ownership.
   - Cell and replica reconciliation.
   - Capacity-aware assignment and lifecycle state.
   - Runtime materialization sequence.
   - Automatic convergence of existing derived route maps and bridge bindings.
   - Defer inferred demand misses, new bridge classes, and generalized runtime
     slimming until the reconciliation control plane is stable.

10. Sprint 8: final distributed model through actor lifecycle and persistence

- Status: `done`; Sprint 8D and final Sprint 8 closure were approved on
  2026-07-21.
- Design proposal:
  [Completed Sprint 8 design](../completed/2026-07-20-distributed-actor-lifecycle-sprint-8-design.md).
- Continue from the early core actor semantic cleanup in Sprint 1.
- Treat Sprint 8 as the final missing part of the first coherent distributed
  Cadenza model, not as an ordinary actor feature pass.
- Implement actor residency, first-touch hydration, assignment epochs,
  stale-owner rejection, durable persistence, commit evidence, drain, and
  recovery on top of the completed placement and Cell/Chamber substrate.
- Keep the primitive core persistence-agnostic. Runtime coordination and actor
  persistence remain governed runtime and extension responsibilities.
- Reference prior design notes from
  `completed/2026-04-23-actor-model-frontier.md` as non-authoritative evidence.

11. Distributed foundation stabilization and GitHub publication

- Status: `in_progress`; Sprint 9A inventory and baseline validation are
  complete, and its publication-boundary decision gate is in review.
- Design proposal:
  [Sprint 9 stabilization and publication](2026-07-21-distributed-foundation-stabilization-publication-design.md).
- Current gate:
  [Sprint 9A truth baseline and publication boundary](../../../publication/sprint-9a-truth-baseline-and-boundary-gate-v1.md).
- Sprint 8 closure approval satisfied the prerequisite on 2026-07-21.
- Freeze feature development while the complete distributed system is reviewed
  as one whole.
- Review every official repository for purpose, dead code, architecture,
  coherence, security, disclosure, dependencies, licensing, documentation,
  tests, operational complexity, and cross-repo contract agreement.
- Rerun definitive Linux failure, recovery, scale, evidence, and actor proofs.
- Define the public repository set, license, contribution model, version label,
  and whether the first publication is a preview or stable major release.
- Publish the approved official repositories to GitHub only after the release
  gate passes.

12. Generated expansion bundles

- Singleton expansion-control flow.
- Bundle, bundle member, and generated provenance authority.
- First shipped planner/backing reconciler for `cadenza.actor.postgres.v1`.
- Managed generated object ownership rules.

13. Advanced security and extension track

- Split this area into multiple implementation sprints before work starts.
- Trusted execution identity.
- Distributed-envelope hardening beyond the minimum transport contract.
- Secret broker references and controlled operations.
- General plugin identity, installation, activation, suspension, upgrade,
  removal, capability, placement, and evidence contracts.
- Supply-chain and runtime-image approval.
- Risk signals and containment flows.
- Complete the requested mature-system security review.

14. Read-only internal system observer

- Build a simple open-source UI whose only purpose is to visualize internal
  system state and evidence.
- Render bounded projections for authority, Cells, generations, Chambers,
  placement, supply, stem ownership, actor residency, expansion bundles,
  execution traces, custody, failures, and temporal transitions.
- Enforce read-only access through purpose-separated authority and projection
  contracts. The UI receives no mutation, deployment, cloud, or generic
  database capability.
- Use this pass to prove that Cadenza remains interpretable upward before Memory
  and managed agent automation depend on it.

15. Memory as the first official plugin

- Memory begins only after the general plugin lifecycle and read-only observer
  exist.
- Memory must install, activate, execute, upgrade, suspend, and retire through
  the same public extension contracts as any other plugin.
- Meta-memory ingestion, context packets, intent interpretation, documentation
  projection, and later Fact integration belong to this plugin track.
- Memory receives no privileged runtime or authority exception.

16. Managed product UI, agents, cloud, and multi-environment operations

- This is a separate managed-product track, not part of the open-source Cadenza
  repository roadmap.
- It owns the final mutating UI/UX, high-level agent integration, user-intent
  translation, cloud management, multi-environment management, and fully
  automated operational system.
- It should consume governed public/runtime projection and authority contracts
  rather than becoming a second Cadenza architecture.

## Design Gates

- Design approval is required before implementation for:
  - schema or persistence foundation changes
  - cell/chamber isolation and capability broker work
  - trust bootstrap, authorization, secrets, plugin activation, or containment
  - actor persistence semantics
  - any feature expected to exceed roughly 200 LOC
  - the new major `cadenza` public API contract
- Design proposals should include a short coherence review when they affect architecture, contracts, authority, runtime boundaries, or long-term documentation.
- Spec changes are allowed when justified, but the justification must identify what incoherence, fragmentation risk, missing identity, hidden affect, weak boundary, or temporal opacity the change repairs.

## Questions Or Blockers

- Current blocker:
  - Sprint 8 actor distributed lifecycle and persistence requires a design
    proposal and explicit approval before implementation.
- Deferred judgment:
  - Distributed actor residency, hydration, and persistence remain behind placement and multi-cell distribution.

## Assumptions

- Assumption 1:
  - `cadenza-service`, `cadenza-db`, and demo repos are legacy from this point forward and should not receive new official implementation work.
- Assumption 2:
  - Primitive and environment authority remain in `cadenza`; chamber runtime authority remains in `cadenza-chamber`; trusted local host authority remains in `cadenza-cell`; legacy repos remain reference-only.
- Assumption 3:
  - Single-cell multi-chamber semantics should be proven before multi-cell transport, placement, or scale multiplies lifecycle and routing failure modes.
- Assumption 4:
  - Actor primitive semantics should be cleaned early when they affect core integrity, but distributed actor lifecycle work should wait until the cell/chamber and placement layers provide the required substrate.
- Assumption 5:
  - Advanced security, evidence, plugin, secret, containment, agent API, console, and meta-memory work will be split into several later sprints rather than treated as two broad implementation phases.

## Validation

- Checks to run:
  - `./scripts/check-agent-harness.sh`
- Docs to update:
  - this execution plan
  - active sprint design and closure records
  - current repository routing and architecture references when authority boundaries change

## Exit Criteria

- Condition 1:
  - The workspace has one master roadmap reflecting the official core-language, chamber, and cell authority boundaries.
- Condition 2:
  - The next feature slice and its design gate are explicit before implementation begins.
- Condition 3:
  - Legacy repos are consistently treated as reference-only in planning.
- Condition 4:
  - Planning Hygiene has produced a documented intended-whole statement for Cadenza, plus false-success and fragmentation cases that future implementation reviews can use as a coherence standard.
