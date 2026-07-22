# Workspace Knowledge Index

This is the shortest route through the workspace meta repo. Use it instead of scanning the root blindly.

## Start Here

1. Read [../AGENTS.md](../AGENTS.md) for non-negotiable workflow and safety rules.
2. Read [cadenza-learning-path.md](./cadenza-learning-path.md) if the task changes behavior, contracts, or docs about how Cadenza works.
3. Read [vision.md](./vision.md) if the task affects architecture, persistence, or long-term platform direction.
4. Read [cadenza-intended-whole.md](./cadenza-intended-whole.md) when the task affects roadmap, architecture, contracts, or implementation priorities.
5. Read [agent-harness/README.md](./agent-harness/README.md) for the repository operating model.
6. Open the relevant repo card under [agent-harness/repo-cards/](./agent-harness/repo-cards/README.md) before entering a child repo.
7. Run `./scripts/workspace-snapshot.sh` when the task could touch more than one repo.

## If The Task Is About

- Shared contracts:
  - [../contracts.config.json](../contracts.config.json)
  - [workspace-map.md](./workspace-map.md)
  - authority repo card under [agent-harness/repo-cards/](./agent-harness/repo-cards/README.md)
- Learning how to use Cadenza:
  - [architecture/atlas/README.md](./architecture/atlas/README.md)
  - [guides/application-author.md](./guides/application-author.md)
  - [guides/glossary.md](./guides/glossary.md)
  - [cadenza-learning-path.md](./cadenza-learning-path.md)
  - [cadenza-flow-design.md](./cadenza-flow-design.md)
  - [../cadenza/README.md](../cadenza/README.md)
  - [../cadenza-cell/README.md](../cadenza-cell/README.md)
  - [../cadenza-chamber/README.md](../cadenza-chamber/README.md)
  - [../cadenza-reference-system/README.md](../cadenza-reference-system/README.md)
- Long-term platform direction:
  - [cadenza-intended-whole.md](./cadenza-intended-whole.md) for the coherence standard used to judge roadmap and architecture changes
  - [cadenza-language-role-doctrine.md](./cadenza-language-role-doctrine.md) for language-role boundaries, materialization rules, and next-language selection criteria
  - [cadenza-language-runtime-contract.md](./cadenza-language-runtime-contract.md) for adapter materialization, containment, evidence, and runtime security requirements
  - [../cadenza-chamber/docs/coherence-review-sprint-4b.md](../cadenza-chamber/docs/coherence-review-sprint-4b.md) for the implemented non-privileged chamber verdict
  - [../cadenza-chamber/docs/cross-language-pressure-review-sprint-4b.md](../cadenza-chamber/docs/cross-language-pressure-review-sprint-4b.md) for Python, Elixir, and C# contract portability
  - [contracts/authority-security/v0.md](./contracts/authority-security/v0.md) for the first language-neutral authority/security semantic contract
  - [contracts/authority-security/canonical-flows-v0.md](./contracts/authority-security/canonical-flows-v0.md) for the consolidated eight-flow choreography catalog
  - [contracts/authority-security/runtime-gateway-v0.md](./contracts/authority-security/runtime-gateway-v0.md) for the contained authority gateway, broker, evidence, database-role, and operational-transition boundary
  - [contracts/local-orchestration/v0.md](./contracts/local-orchestration/v0.md) for cell generations, host meta authority, chamber projections, and local primitive transport
  - [contracts/cell-peer-transport/v0.md](./contracts/cell-peer-transport/v0.md) for opaque local/remote route interpretation, authenticated peer transport, and started-state preservation
  - [contracts/cell-peer-transport/security-review-v0.md](./contracts/cell-peer-transport/security-review-v0.md) for the Sprint 6B transport security and coherence gate
  - [contracts/distribution/sprint-6-closure-review-v0.md](./contracts/distribution/sprint-6-closure-review-v0.md) for the complete Sprint 6 authority, runtime, transport, Linux, and coherence verdict
  - [../cadenza-cell/docs/two-cell-gvisor-evidence-2026-07-14.md](../cadenza-cell/docs/two-cell-gvisor-evidence-2026-07-14.md) for the measured Sprint 6C two-cell process and network proof
  - [contracts/execution-evidence/v0.md](./contracts/execution-evidence/v0.md) for the approved realtime execution identities, causal flows, custody boundary, evidence profiles, and meta-processing recursion rule
  - [contracts/execution-evidence/coherence-review-v0.md](./contracts/execution-evidence/coherence-review-v0.md) for the protocol's identity, boundary, pressure, temporal-stewardship, and false-success verdict
  - [contracts/execution-evidence/implementation-coherence-review-v0.md](./contracts/execution-evidence/implementation-coherence-review-v0.md) for the Sprint 6D custody, observation-basis, recursion, pressure, and false-success implementation review
  - [contracts/execution-evidence/typescript-core-closure-v0.md](./contracts/execution-evidence/typescript-core-closure-v0.md) for the Sprint 6D.1 TypeScript authority implementation and coherence gate
  - [contracts/execution-evidence/official-core-parity-closure-v0.md](./contracts/execution-evidence/official-core-parity-closure-v0.md) for the Sprint 6D.2 Python, Elixir, and C# parity, idiomatic translation, conformance, and coherence gate
  - [contracts/execution-evidence/chamber-capture-closure-v0.md](./contracts/execution-evidence/chamber-capture-closure-v0.md) for the Sprint 6D.3 chamber capture and cell receipt-transport closure
  - [contracts/execution-evidence/trusted-facade-provider-closure-v0.md](./contracts/execution-evidence/trusted-facade-provider-closure-v0.md) for the Sprint 6D.5B generated-facade, typed-provider, unknown-commit, and credential-boundary closure gate
  - [contracts/execution-evidence/system-closure-v0.md](./contracts/execution-evidence/system-closure-v0.md) for the Sprint 6D.6 two-cell outage, recovery, disclosure, pressure, security, operational-complexity, and coherence closure gate
  - [contracts/graph-conclusion/v0.md](./contracts/graph-conclusion/v0.md) for deterministic run-result composition, provenance conflicts, and relationship contribution policy
  - [contracts/actor-core/v1.md](./contracts/actor-core/v1.md) for the minimal semantic actor, task-side binding, local sequencing, and candidate-state contract
  - [contracts/actor-core/sprint-8a-closure-review-v1.md](./contracts/actor-core/sprint-8a-closure-review-v1.md) for the four-core and Chamber Sprint 8A coherence gate
  - [cadenza-meta-slice-language-fit-review.md](./cadenza-meta-slice-language-fit-review.md) for matching planned meta slices to likely implementation languages
  - [vision.md](./vision.md) for the agent OS north star, local-to-enterprise scaling, and why memory is one subsystem of the broader operating substrate
  - [cadenza-python-translation-readiness.md](./cadenza-python-translation-readiness.md) for the three-category language translation scan rule and Python readiness gate
  - [cadenza-elixir-translation-readiness.md](./cadenza-elixir-translation-readiness.md) for post-Python translation lessons and the Elixir readiness gate
  - [cadenza-elixir-pass-2-closure-review.md](./cadenza-elixir-pass-2-closure-review.md) for the Elixir Pass 2 closure verdict and next-language selection criteria
  - [cadenza-csharp-closure-review.md](./cadenza-csharp-closure-review.md) for the C# Pass 1 closure verdict and Sprint 1B handoff
  - [cadenza-environment.md](./cadenza-environment.md)
  - [cadenza-schema-proposal.md](./cadenza-schema-proposal.md)
  - [cadenza-flow-design.md](./cadenza-flow-design.md)
  - [architecture.md](./architecture.md)
- Cross-repo design:
  - [agent-harness/templates/design-proposal.md](./agent-harness/templates/design-proposal.md)
  - [agent-harness/templates/execution-plan.md](./agent-harness/templates/execution-plan.md)
  - [agent-harness/templates/coherence-review.md](./agent-harness/templates/coherence-review.md)
  - [agent-harness/exec-plans/active/2026-07-21-distributed-foundation-stabilization-publication-design.md](./agent-harness/exec-plans/active/2026-07-21-distributed-foundation-stabilization-publication-design.md)
  - [publication/sprint-9a-truth-baseline-and-boundary-gate-v1.md](./publication/sprint-9a-truth-baseline-and-boundary-gate-v1.md)
  - [publication/sprint-9c-closure-review-v1.md](./publication/sprint-9c-closure-review-v1.md)
  - [publication/sprint-9c-agent-authoring-trial-v1.md](./publication/sprint-9c-agent-authoring-trial-v1.md)
  - [publication/sprint-9d-navigation-coherence-review-v1.md](./publication/sprint-9d-navigation-coherence-review-v1.md)
  - [publication/sprint-9d-closure-review-v1.md](./publication/sprint-9d-closure-review-v1.md)
  - [agent-harness/exec-plans/completed/2026-07-20-distributed-actor-lifecycle-sprint-8-design.md](./agent-harness/exec-plans/completed/2026-07-20-distributed-actor-lifecycle-sprint-8-design.md)
  - [decisions/2026-07-20-distributed-foundation-publication-and-product-boundary.md](./decisions/2026-07-20-distributed-foundation-publication-and-product-boundary.md)
  - [agent-harness/exec-plans/completed/2026-07-12-authority-tags-policy-flow-design.md](./agent-harness/exec-plans/completed/2026-07-12-authority-tags-policy-flow-design.md)
  - [agent-harness/exec-plans/completed/2026-07-12-environment-bootstrap-design.md](./agent-harness/exec-plans/completed/2026-07-12-environment-bootstrap-design.md)
  - [agent-harness/exec-plans/completed/2026-07-12-chamber-runtime-foundation-design.md](./agent-harness/exec-plans/completed/2026-07-12-chamber-runtime-foundation-design.md)
  - [agent-harness/exec-plans/completed/2026-07-13-trusted-cell-first-activation-design.md](./agent-harness/exec-plans/completed/2026-07-13-trusted-cell-first-activation-design.md)
  - [agent-harness/exec-plans/completed/2026-07-13-single-cell-multi-chamber-orchestration-design.md](./agent-harness/exec-plans/completed/2026-07-13-single-cell-multi-chamber-orchestration-design.md)
  - [agent-harness/exec-plans/completed/2026-07-14-multi-cell-static-placement-design.md](./agent-harness/exec-plans/completed/2026-07-14-multi-cell-static-placement-design.md)
  - [agent-harness/exec-plans/completed/2026-07-15-execution-evidence-protocol-design.md](./agent-harness/exec-plans/completed/2026-07-15-execution-evidence-protocol-design.md)
  - [agent-harness/exec-plans/completed/2026-07-15-execution-evidence-implementation-design.md](./agent-harness/exec-plans/completed/2026-07-15-execution-evidence-implementation-design.md)
  - [agent-harness/exec-plans/completed/2026-07-17-scale-placement-reconciliation-design.md](./agent-harness/exec-plans/completed/2026-07-17-scale-placement-reconciliation-design.md)
  - [agent-harness/exec-plans/completed/2026-07-19-scale-orchestration-system-closure-sprint-7g-design.md](./agent-harness/exec-plans/completed/2026-07-19-scale-orchestration-system-closure-sprint-7g-design.md)
  - [contracts/distribution/sprint-7g-closure-review-v0.md](./contracts/distribution/sprint-7g-closure-review-v0.md)
  - [agent-harness/exec-plans/completed/2026-07-19-stem-recovery-fencing-sprint-7f-design.md](./agent-harness/exec-plans/completed/2026-07-19-stem-recovery-fencing-sprint-7f-design.md)
  - [agent-harness/exec-plans/completed/2026-07-17-autonomous-cell-runtime-convergence-sprint-7c-design.md](./agent-harness/exec-plans/completed/2026-07-17-autonomous-cell-runtime-convergence-sprint-7c-design.md)
  - [agent-harness/exec-plans/completed/2026-07-18-stem-cell-meta-slice-sprint-7d-design.md](./agent-harness/exec-plans/completed/2026-07-18-stem-cell-meta-slice-sprint-7d-design.md)
  - [agent-harness/exec-plans/completed/2026-07-19-pre-enrolled-cell-supply-sprint-7e-design.md](./agent-harness/exec-plans/completed/2026-07-19-pre-enrolled-cell-supply-sprint-7e-design.md)
  - [agent-harness/exec-plans/completed/2026-07-17-reconciliation-postgres-authority-sprint-7b-design.md](./agent-harness/exec-plans/completed/2026-07-17-reconciliation-postgres-authority-sprint-7b-design.md)
  - [agent-harness/exec-plans/completed/2026-07-17-scale-placement-reconciliation-sprint-7a.md](./agent-harness/exec-plans/completed/2026-07-17-scale-placement-reconciliation-sprint-7a.md)
  - [contracts/distribution/sprint-7a-closure-review-v0.md](./contracts/distribution/sprint-7a-closure-review-v0.md)
  - [contracts/distribution/sprint-7b-closure-review-v0.md](./contracts/distribution/sprint-7b-closure-review-v0.md)
  - [contracts/distribution/sprint-7d-closure-review-v0.md](./contracts/distribution/sprint-7d-closure-review-v0.md)
  - [contracts/distribution/sprint-7e2-closure-review-v0.md](./contracts/distribution/sprint-7e2-closure-review-v0.md)
  - [contracts/distribution/sprint-7e3-linux-cell-supply-closure-review-v0.md](./contracts/distribution/sprint-7e3-linux-cell-supply-closure-review-v0.md)
  - [contracts/distribution/sprint-7f-closure-review-v0.md](./contracts/distribution/sprint-7f-closure-review-v0.md)
  - [contracts/distribution/sprint-7e-closure-review-v0.md](./contracts/distribution/sprint-7e-closure-review-v0.md)
  - [decisions/2026-07-18-operational-authority-mount-promotion.md](./decisions/2026-07-18-operational-authority-mount-promotion.md)
  - [decisions/2026-07-19-separate-activation-and-containment-lifetimes.md](./decisions/2026-07-19-separate-activation-and-containment-lifetimes.md)
  - [decisions/2026-07-19-pre-enrolled-cell-supply.md](./decisions/2026-07-19-pre-enrolled-cell-supply.md)
  - [decisions/2026-07-15-realtime-execution-evidence-implementation.md](./decisions/2026-07-15-realtime-execution-evidence-implementation.md)
  - [decisions/2026-07-12-chamber-runtime-foundation.md](./decisions/2026-07-12-chamber-runtime-foundation.md)
  - [contracts/environment-bootstrap/v0.md](./contracts/environment-bootstrap/v0.md)
  - [contracts/environment-bootstrap/conformance-v0.md](./contracts/environment-bootstrap/conformance-v0.md)
  - [contracts/environment-bootstrap/coherence-review-v0.md](./contracts/environment-bootstrap/coherence-review-v0.md)
  - [contracts/local-orchestration/v0.md](./contracts/local-orchestration/v0.md)
  - [contracts/local-orchestration/conformance-v0.md](./contracts/local-orchestration/conformance-v0.md)
  - [contracts/local-orchestration/closure-review-v0.md](./contracts/local-orchestration/closure-review-v0.md)
  - [contracts/distribution/v0.md](./contracts/distribution/v0.md)
  - [contracts/distribution/conformance-v0.md](./contracts/distribution/conformance-v0.md)
  - [contracts/distribution/closure-review-v0.md](./contracts/distribution/closure-review-v0.md)
  - [contracts/cell-peer-transport/v0.md](./contracts/cell-peer-transport/v0.md)
  - [contracts/cell-peer-transport/conformance-v0.md](./contracts/cell-peer-transport/conformance-v0.md)
  - [contracts/execution-evidence/v0.md](./contracts/execution-evidence/v0.md)
  - [decisions/2026-07-14-serialized-chamber-quiescence-v0.md](./decisions/2026-07-14-serialized-chamber-quiescence-v0.md)
  - [agent-harness/exec-plans/completed/2026-07-12-csharp-core-design-proposal.md](./agent-harness/exec-plans/completed/2026-07-12-csharp-core-design-proposal.md)
  - [decisions/README.md](./decisions/README.md)
- Capturing out-of-scope follow-up work:
  - [../AGENTS.md](../AGENTS.md)
  - [agent-harness/exec-plans/README.md](./agent-harness/exec-plans/README.md)
- Ambiguity or safe assumptions:
  - [agent-harness/templates/clarification-comment.md](./agent-harness/templates/clarification-comment.md)
  - [agent-harness/templates/assumptions.md](./agent-harness/templates/assumptions.md)
- Repository routing:
  - [agent-harness/repo-cards/README.md](./agent-harness/repo-cards/README.md)
- Operating and contributing:
  - [guides/runtime-operator.md](./guides/runtime-operator.md)
  - [guides/contributor.md](./guides/contributor.md)
  - [guides/evidence-interpretation.md](./guides/evidence-interpretation.md)
  - [guides/compatibility.md](./guides/compatibility.md)
  - [guides/troubleshooting.md](./guides/troubleshooting.md)
- Current harness health:
  - [agent-harness/quality-score.md](./agent-harness/quality-score.md)
  - [agent-harness/exec-plans/README.md](./agent-harness/exec-plans/README.md)
- Product and architecture context:
  - [architecture.md](./architecture.md)
  - [cadenza-environment.md](./cadenza-environment.md)
  - [cadenza-schema-proposal.md](./cadenza-schema-proposal.md)
  - [cadenza-flow-design.md](./cadenza-flow-design.md)
  - [workspace-map.md](./workspace-map.md)

## Primary References

- Workspace governance: [../AGENTS.md](../AGENTS.md)
- Visual architecture atlas: [architecture/atlas/README.md](./architecture/atlas/README.md)
- Intended whole: [cadenza-intended-whole.md](./cadenza-intended-whole.md)
- Language role doctrine: [cadenza-language-role-doctrine.md](./cadenza-language-role-doctrine.md)
- Language runtime contract: [cadenza-language-runtime-contract.md](./cadenza-language-runtime-contract.md)
- Meta-slice language fit review: [cadenza-meta-slice-language-fit-review.md](./cadenza-meta-slice-language-fit-review.md)
- Learning path: [cadenza-learning-path.md](./cadenza-learning-path.md)
- Flow design: [cadenza-flow-design.md](./cadenza-flow-design.md)
- Long-term direction: [vision.md](./vision.md)
- Environment model: [cadenza-environment.md](./cadenza-environment.md)
- Schema proposal: [cadenza-schema-proposal.md](./cadenza-schema-proposal.md)
- Python translation readiness: [cadenza-python-translation-readiness.md](./cadenza-python-translation-readiness.md)
- Elixir translation readiness: [cadenza-elixir-translation-readiness.md](./cadenza-elixir-translation-readiness.md)
- Elixir Pass 2 closure review: [cadenza-elixir-pass-2-closure-review.md](./cadenza-elixir-pass-2-closure-review.md)
- C# Pass 1 closure review: [cadenza-csharp-closure-review.md](./cadenza-csharp-closure-review.md)
- Agent harness design: [agent-harness/README.md](./agent-harness/README.md)
- Cross-repo helper/global contract: [architecture.md](./architecture.md)
- Contract authority map: [../contracts.config.json](../contracts.config.json)
- Automation scaffolding: [../automation.config.json](../automation.config.json)
- External reference: [references/openai-harness-engineering-2026-02-11.md](./references/openai-harness-engineering-2026-02-11.md)

## Why This Structure Exists

The harness is shaped around the repository-legibility ideas in OpenAI's "Harness Engineering" article: keep the main instructions short, move volatile context into versioned docs, and make the right next file obvious.
