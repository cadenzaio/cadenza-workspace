# Sprint 9E Release Engineering And Public Packaging

Date: 2026-07-22

## Status

- State: `done`.
- Parent design:
  [Sprint 9 Distributed Foundation Stabilization And Publication](2026-07-21-distributed-foundation-stabilization-publication-design.md).
- Entry gate:
  [Sprint 9D Visual Architecture And Public Documentation Closure V1](../../../publication/sprint-9d-closure-review-v1.md).
- Active WIP: one cross-repository release-engineering stream.
- External GitHub or package-registry mutation: prohibited.

## Objective

Turn the approved source and documentation candidate into nine bounded,
governed, reproducible public-repository candidates whose exact source,
packages, contracts, protocols, toolchains, checks, and limitations can be
reviewed as one distributed release without implying shared version numbers or
production maturity.

## Execution Order

1. `completed` - close Sprint 9D records; inventory repository governance,
   package metadata, CI, generated artifacts, tracked outputs, versions,
   compatibility surfaces, and workspace-publication exclusions.
2. `completed` - establish shared release metadata and validation contracts:
   repository inventory, required-check policy, compatibility matrix,
   provenance schema, tag and withdrawal policy, and release-note boundaries.
3. `completed` - repair each repository's scoped governance, package metadata,
   artifact exclusions, changelog/release notes, and least-privilege CI without
   flattening language-native conventions.
4. `completed` - construct packages from clean source inputs and install or consume
   them in minimal TypeScript, Python, Elixir, and C# projects; package-check
   Environment, Chamber, Cell, workspace, and reference-system outputs under
   their actual publication roles.
5. `completed` - implement and validate the curated workspace export, public-file
   allowlist, disclosure exclusions, documentation/diagram checks, and exact
   repository required-check map.
6. `completed` - assemble candidate source commits or clean initial histories,
   compute artifact and contract digests, generate the distributed-foundation
   manifest, rerun release validation, and request release-candidate freeze
   approval.

## Release Boundaries

- `cadenza` preserves public history and targets `4.0.0-rc.1`.
- Python, Elixir, C#, Environment, Chamber, Cell, and the reference system use
  clean initial histories and independent `0.1.0-rc.1` identities where their
  native packaging syntax permits it.
- The workspace is exported from an explicit public allowlist into a clean
  history. Private workflow history, legacy implementation material, Memory,
  CLI, managed-product work, secrets, and unrelated artifacts are excluded.
- Apache-2.0, DCO 1.1, protected `main`, pull requests, scoped ownership,
  no-SLA support, public issue/discussion support, and private vulnerability
  reporting follow the approved Sprint 9A boundary.
- Registry publication, GitHub repository creation, pushes, tags, releases,
  branch-protection mutation, legacy notices, and archival remain prohibited
  until the separate Sprint 9F publication approval.
- Prepared branch-protection and required-check declarations are release
  artifacts. They become external state only during the approved publication
  operation.

## Validation Contract

- Every public repository must have purpose-specific governance and a CI path
  that can execute from its declared source and dependency inputs.
- Ordinary CI has read-only repository permissions and no ambient release
  credential or publication authority.
- Package contents are allowlisted, free of build caches and private paths,
  and reproducible where the native format permits deterministic output.
- Clean-consumer tests use built artifacts, never sibling source imports that
  conceal packaging defects.
- Compatibility is asserted only by the distributed-foundation manifest,
  including exact source commits, package versions, protocol/schema ranges,
  toolchains, generated artifact digests, and contract fixture digests.
- A release candidate may be withdrawn or superseded without rewriting
  history; registry publication remains independently gated.

## Assumptions

- The approved Sprint 9 design, Sprint 9A publication boundary, and Sprint 9D
  closure authorize this implementation scope.
- Existing governance files are candidate inputs, not accepted merely because
  they exist; their links, scope, and enforcement must be verified.
- Environment packages and the Chamber TypeScript adapter may remain private
  package artifacts when repository publication, generated runtime images, or
  source consumption better matches their actual ownership. Public package
  identity is not forced onto internal assembly units.
- The reference system is publicly source-visible proof but remains a private
  npm package because it is not a reusable framework dependency.
- Release-candidate commits are local until Sprint 9F. No external mutation is
  necessary to prove their content and digests.

These assumptions are direct consequences of approved publication decisions;
material changes require an amendment before implementation.

## Closure Review

[Sprint 9E Release Candidate Closure V1](../../../publication/sprint-9e-release-candidate-closure-v1.md)
records the exact local commits, manifest and package digests, validation
results, publication boundaries, and remaining Sprint 9F proof. The user
approved closure and the exact release-candidate freeze on 2026-07-22.
