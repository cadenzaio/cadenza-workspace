# Cadenza Contributor Guide

## Choose The Owning Repository

Use the [repository ownership view](../architecture/atlas/rendered/02-repository-contract-ownership.svg)
and [`contracts.config.json`](../../contracts.config.json) before changing a
shared meaning. Update the authority source first, propagate snapshots in the
same task, and run conformance in every affected language or runtime.

Repository-local ownership diagrams live at `docs/module-ownership.svg` in
each official repository. They show stable module responsibilities, not every
function call.

## Preserve The Whole

- Prefer Cadenza primitives for feature-extending meta slices.
- Use ordinary low-level code for Cell and Chamber substrate whose purpose is
  safe primitive execution.
- Keep core repositories persistence- and authority-agnostic.
- Keep durable desired state in Environment authority, containment and local
  custody in Cell, runtime admission and adapter hosting in Chamber, and
  portable primitive meaning in the language cores.
- Never import deployment or transport concerns into authored business logic.

## Change Discipline

Breaking contract changes require explicit design approval. Cross-repository
work uses one execution plan and independent commits. Tests scale with the
affected contract: local unit coverage is insufficient when shared semantics,
authority operations, custody, or transport changes.

Every architecture change must update its affected atlas source, cited
evidence, and validation date. A changed diagram that no longer renders or no
longer matches executable evidence is a failed change.

## Validation

Run repository-local commands from that repository. At workspace level run:

```bash
./scripts/workspace-snapshot.sh
./scripts/check-agent-harness.sh
node scripts/check-contract-snapshots.mjs
node scripts/validate-architecture-atlas.mjs --require-rendered
```
