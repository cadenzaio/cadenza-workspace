# Sprint 10A Root Custody Classification V1

Date: 2026-07-27
Status: implementation evidence

## Purpose

Record how the pre-consolidation root workspace was preserved and how local
content was classified before any post-RC record entered the curated public
lineage.

## Source Identities

- Curated public parent:
  `574ad5130f4ce2bcefecf92accfb7637b3da1093`
- Prior local private-lineage head:
  `3381fbfc58c3960d6a40a11608597a69fb96f4a8`
- The two commits have no merge base.
- The Sprint 10 branch was created directly from the curated public parent.

## Non-Destructive Preservation

The prior root state is retained outside the public workspace in a
permission-restricted local backup. The backup contains:

- a complete Git bundle of all pre-consolidation refs;
- a tracked working-tree patch;
- a NUL-delimited porcelain status inventory;
- an archive of root meta-repository content;
- per-file and archive SHA-256 inventories.

The bundle verifies as complete. The archive passes gzip validation. The
backup manifest is retained with the backup rather than published because it
contains local paths.

## Classification

### Public Main Authority

Curated public bytes remain authoritative where the old root differs only by:

- absolute workstation paths;
- private source-document locations;
- local toolchain paths;
- links rewritten for GitHub publication;
- public-projection script inputs.

These old-root variants are not imported.

### Approved Post-Publication Records

The following content enters the public lineage:

- the approved Sprint 10 design and decision;
- sender-side replica routing closure plan, decision, contract clarification,
  and closure review;
- supply-restart lifecycle hardening plan and decision;
- Sprint 9 parent closure and current-roadmap repairs.

The corresponding Chamber and Cell source commits remain separate
repository-local changes and are carried forward without rewriting RC1.
Historical links to the Sprint 9 parent were repaired when its plan moved from
`active/` to `completed/`; the decision content itself was not superseded.

### Preserved Outside Public Ancestry

The following material remains in the local preservation boundary:

- old service, database, UI, demo, CLI, and release-sync records;
- Memory and weave designs, corpora, benchmarks, scripts, and generated files;
- the old Sprint 9F working plan whose public outcome is already represented by
  publication evidence;
- private-history Git commits and stale worktree refs;
- local tooling caches and IDE or browser state.

### Communication Strategy Artifacts

The separate communication task produced strategy, claim-ledger,
truth-and-limits, demonstration, red-team, execution-plan, and decision
drafts. Their own governance marks them local or requires separate publication
review. They are therefore preserved outside this affected scope and are not
imported by Sprint 10A.

## Ancestry Gate

Sprint 10A requires all of the following before primary root custody changes:

- public `origin/main` is an ancestor of the candidate branch;
- the prior private-lineage head is not an ancestor and shares no merge base
  with the candidate;
- no merge, rebase, or cherry-pick from private history is used;
- imported content is represented only by new public-lineage commits;
- public allowlist, link, documentation-authority, and harness checks pass.

## Limits

This classification proves source custody and ancestry. It does not yet prove
the post-RC product commits, complete cross-repository conformance, privileged
Linux execution, or Sprint 10 closure.
