# Sprint 10F RC2 Publication CI Repair

Date: 2026-07-28

## Context

The first protected-review pass for the approved Sprint 10F RC2 candidate
exposed five publication-wiring failures. Public workspace documentation
omitted one linked execution plan. Core commit lint rejected one overlong line
in an unmerged commit body. Chamber, Cell, and Reference System CI still
checked out RC1 dependency tags while validating RC2-bound packages,
contracts, and generated evidence.

The runtime, business-flow, security, and contract tests that ran against
coherent dependency identities did not expose a behavioral defect. No RC2 tag
or release had been created.

## Decision

Repair the publication wiring and replace only the affected candidate scope.

- Preserve every failed branch, pull request, and check as audit evidence.
- Create a new Core branch from public `main` and recreate the unmerged
  candidate changes with the offending commit body wrapped correctly.
- Add the omitted public execution plan to Workspace.
- Pin Chamber CI to the exact approved Core and Environment candidate commits.
- Pin Cell CI to the exact approved Core, Environment, and Chamber candidate
  commits.
- Pin Reference System CI to the exact approved Core candidate commit.
- Reconstruct the candidate twice and freeze replacement identities only for
  Workspace, Core, Chamber, Cell, Reference System, their derived artifacts,
  and the aggregate manifest.

Exact commit pins are required because the RC2 tags cannot exist until the
protected review checks pass. They also make cross-repository validation
reproducible after publication.

## Consequences

- The original affected candidate commits and aggregate manifest become
  superseded only after the repaired candidate passes complete validation and
  byte-identical reconstruction.
- Python and Environment retain their original RC2 candidate identities.
- Elixir and C# retain their signed RC1 identities.
- RC1 tags, failed review evidence, package registries, and legacy repositories
  remain untouched.
- Core receives a replacement PR rather than a rewritten remote branch.
- Chamber, Cell, Reference System, and Workspace receive additive repair
  commits on their existing review branches.

## Alternatives

1. Bypass required checks with administrator privileges. Rejected because it
   would contradict the approved review ratchet and conceal real publication
   incoherence.
2. Create RC2 tags before review completes. Rejected because tags are release
   attestations and must bind reviewed commits.
3. Force-push or rebase the existing Core branch. Rejected because the failed
   branch and pull request are valuable audit evidence and remote history must
   not be rewritten.
4. Permanently weaken commit-lint rules. Rejected because correcting the
   unmerged history preserves the intended governance without dead exceptions.
5. Change runtime behavior or generated evidence. Rejected because the
   failures are dependency-identity and publication-input defects.

## Links

- [Publication decision](./2026-07-28-sprint-10f-rc2-publication.md)
- [Publication execution plan](../agent-harness/exec-plans/active/2026-07-28-sprint-10f-rc2-publication.md)
- [Original candidate decision package](../publication/sprint-10f-rc2-publication-decision-v1.md)
