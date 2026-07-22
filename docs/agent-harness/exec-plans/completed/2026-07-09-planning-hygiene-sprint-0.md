# Planning Hygiene Sprint 0

## Goal

- Outcome:
  - Establish the coherence foundation and planning hygiene needed before official Cadenza implementation begins.
- Why it matters:
  - The next implementation phase will stabilize `cadenza` as the official core foundation. Before code changes, the workspace needs one intended-whole standard, one roadmap, clean active-plan state, and a backlog that does not preserve legacy repo assumptions by accident.

## Current Status

- State: `done`
- Completed on 2026-07-12 after the intended whole, active-plan inventory, roadmap boundary, Contract Foundation backlog, Sprint 1 design, and harness validation were in place.
- Current repo:
  - `cadenza-workspace`
- Impacted repos:
  - `cadenza-workspace`
  - `cadenza`

## Scope

- In scope:
  - Define and document Cadenza's intended whole.
  - Add a reusable coherence review template.
  - Inventory active execution plans and classify them as current, completed, legacy-reference, superseded, or follow-up.
  - Update the master roadmap with planning-hygiene findings.
  - Produce the first Contract Foundation backlog for `cadenza`.
- Out of scope:
  - Product code changes.
  - Redesigning architecture unless a contradiction blocks planning.
  - Moving legacy repo implementation forward.
  - Updating demo repos.
  - Memory and Weave prototype implementation; these become a later dedicated sprint track after Cadenza stabilizes.

## Coherence Standard

- Primary standard:
  - [docs/cadenza-intended-whole.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/cadenza-intended-whole.md)
- Review template:
  - [docs/agent-harness/templates/coherence-review.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/agent-harness/templates/coherence-review.md)
- Rule:
  - Planning changes should preserve the intended whole and should not turn local documentation cleanup into ungrounded architectural drift.

## Workstreams

1. Intended whole
   - Create a short intended-whole artifact.
   - Define false-success cases.
   - Capture participating identities and review questions.

2. Plan inventory
   - Read active execution plans.
   - Classify by current relevance under the new official repo boundary.
   - Identify plans that should move to completed.
   - Identify plans that should remain as legacy reference.

3. Roadmap cleanup
   - Keep one master roadmap.
   - Remove or annotate stale assumptions about `cadenza-service`, `cadenza-db`, demos, and old `engine` terminology.
   - Preserve chamber runtime as a later official repo introduced after bootstrap.

4. Contract Foundation backlog
   - Produce the first implementation-ready backlog for `cadenza`.
   - Include acceptance criteria for a spotless core.
   - Identify design gates before any implementation begins.
   - Current draft:
     - [contract-foundation-backlog-2026-07-09.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/agent-harness/exec-plans/contract-foundation-backlog-2026-07-09.md)
   - Sprint 1 design proposal:
     - [2026-07-09-contract-foundation-design.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/agent-harness/exec-plans/completed/2026-07-09-contract-foundation-design.md)

## Questions Or Blockers

- Question 1:
  - Which existing `cadenza` public APIs still serve the intended whole strongly enough to remain in the new major core?
- Question 2:
  - Which completed active plans should be physically moved to `completed/` in this sprint versus merely classified first?

## Assumptions

- Assumption 1:
  - `cadenza` is the official near-term implementation repo.
- Assumption 2:
  - Legacy repos are reference-only.
- Assumption 3:
  - The future chamber runtime repo is introduced after environment bootstrap clarifies the materialization boundary.
- Assumption 4:
  - Specs may change, but only when the change is justified by coherence.
- Assumption 5:
  - Backwards compatibility is not required for the new major `cadenza` core; legacy dependencies can stay on previous core versions.
- Assumption 6:
  - All code in the stabilized core must serve a clear purpose in the intended whole, or it should be removed.

## Validation

- Checks to run:
  - `./scripts/check-agent-harness.sh`
- Docs to update:
  - `docs/cadenza-intended-whole.md`
  - `docs/agent-harness/templates/coherence-review.md`
  - `docs/agent-harness/exec-plans/active-inventory-2026-07-09.md`
  - `docs/agent-harness/exec-plans/contract-foundation-backlog-2026-07-09.md`
  - `docs/agent-harness/exec-plans/completed/2026-07-09-contract-foundation-design.md`
  - `docs/agent-harness/exec-plans/active/2026-07-09-cadenza-official-roadmap.md`
  - `docs/agent-harness/exec-plans/README.md`
  - `docs/index.md`

## Exit Criteria

- Condition 1:
  - Cadenza's intended whole is documented and linked.
- Condition 2:
  - Active execution plans are inventoried and classified.
- Condition 3:
  - The master roadmap reflects current repository and terminology boundaries.
- Condition 4:
  - A Contract Foundation backlog is ready for review before implementation.
- Condition 5:
  - Harness validation passes.
