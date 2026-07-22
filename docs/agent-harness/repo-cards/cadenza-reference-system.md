# cadenza-reference-system

Role: official release-owned clean consumer and realistic order-to-fulfillment
proof. It owns business definitions, acceptance tests, deterministic boundary
providers, feature-purpose mapping, and business/system truth matrices. It
owns no Cadenza framework contract.

Enter this repo when:

- testing whether an application author can focus on workflow and business logic.
- adding or validating the order, inventory, cancellation, or fulfillment journeys.
- running the clean-context agent authoring trial.
- connecting exact reference source definitions to the distributed system proof.

Read before editing:

- `docs/cadenza-intended-whole.md`
- `docs/cadenza-flow-design.md`
- `docs/agent-harness/exec-plans/active/2026-07-21-distributed-foundation-stabilization-publication-design.md`
- `cadenza-reference-system/AGENTS.md`
- `cadenza-reference-system/docs/feature-purpose-matrix.md`

First files:

- `cadenza-reference-system/README.md`
- `cadenza-reference-system/src/system.ts`
- `cadenza-reference-system/tests/`
- `cadenza-reference-system/docs/truth-matrix.md`

Primary commands after installing an exact packed core release candidate:

- `cd cadenza-reference-system && npm run typecheck`
- `cd cadenza-reference-system && npm test`
- `cd cadenza-reference-system && npm run build`

Contract role:

- consumer only; no entry in `contracts.config.json`.
- framework findings are repaired in the authority repository and then
  revalidated here against a packed public artifact.

Routing notes:

- keep Cell, Chamber, route, credential, placement, persistence, transport,
  and evidence-custody mechanics out of `src/domain/`.
- keep deployment tags, policy, and source-slice descriptors under
  `src/authority/`.
- do not use legacy demos or legacy repositories as implementation authority.
