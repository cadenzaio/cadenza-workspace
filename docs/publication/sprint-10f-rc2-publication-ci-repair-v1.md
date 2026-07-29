# Sprint 10F RC2 Publication CI Repair V1

Date: 2026-07-28

## Status

`validated_replacement_freeze`

The user approved the Sprint 10F RC2 publication CI repair and affected-scope
replacement freeze on 2026-07-28.

## Failure Classification

The first protected-review pass exposed five publication-input defects:

1. the curated workspace omitted one linked Sprint 10F execution plan;
2. one unmerged Core commit body exceeded the restored commit-lint limit;
3. Chamber CI consumed RC1 Core and Environment dependencies;
4. Cell CI consumed RC1 Core, Environment, and Chamber dependencies; and
5. Reference System CI consumed RC1 Core while validating an RC2-bound
   generated artifact.

These failures did not justify bypassing required checks, weakening commit
governance, publishing tags early, or changing runtime behavior.

## Repair

- Workspace includes the missing plan and allowlists it for future curated
  exports.
- Core uses a new signed branch from public `main` with the same final source
  tree and a correctly wrapped commit body.
- Chamber, Cell, Reference System, and Workspace CI use full candidate commit
  SHAs to break the pre-tag publication cycle.
- Failed branches, pull requests, and check runs remain review evidence.

## Repaired Dependency Graph

| Consumer | Exact candidate dependencies |
| --- | --- |
| Workspace | Core `a4384818`, Chamber `c22d34cc`, Cell `29bcbefe`, Reference `8426e2d9` |
| Chamber | Core `a4384818`, Environment `96054f58` |
| Cell | Core `a4384818`, Environment `96054f58`, Chamber `c22d34cc` |
| Reference System | Core `a4384818` |

## Validation

- Core commit lint, formatting, typecheck, 148 tests, build, and SSH commit
  signature verification pass.
- Environment rebuilds the authority gateway at its frozen digest.
- Chamber adapter audit, typecheck, build, Rust formatting, clippy, complete
  tests, RustSec audit, and package verification pass.
- Cell formatting, clippy, complete tests, multi-chamber integration, RustSec
  audit, and locked metadata validation pass.
- Reference System packages RC2 Core, installs it as an external dependency,
  passes 9 tests, and regenerates the distributed artifact byte-identically.
- Workspace governance, curated export, candidate metadata, contract snapshots,
  public links, and architecture atlas checks pass in the nine-repository
  topology.

The external aggregate manifest is assembled only after the final Workspace
candidate commit. It owns the exact replacement identities, artifact
checksums, and its own independently published digest.

- final Workspace candidate:
  `90df7af273b4415c76f3351ce43153659343e183`;
- final aggregate manifest:
  `sha256:cc1c41ce6944a4b84380f4222d3952c46889d9fc9dd7b0d7444e05b906127055`;
- reproducibility: two complete 7-source, 6-package, 3-generated-artifact
  assemblies are byte-identical;
- schema: JSON Schema Draft 2020-12 validation passes;
- registry publication: `false`.

## Unchanged Boundaries

Python and Environment retain their original RC2 candidate commits. Elixir and
C# retain their signed RC1 identities. RC1 tags, registries, legacy
repositories, runtime contracts, protocol versions, generated runtime
artifacts, and package-publication boundaries remain unchanged.
