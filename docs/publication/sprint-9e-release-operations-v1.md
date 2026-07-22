# Sprint 9E Release Operations V1

Date: 2026-07-22
Status: candidate procedure

## Tag Policy

- Tags are immutable signed release identities created only from approved
  clean candidate commits.
- `cadenza` uses `v4.0.0-rc.1`; new implementation and reference repositories
  use `v0.1.0-rc.1`; the workspace uses `distributed-foundation-rc.1`.
- A tag is not compatibility authority by itself. The distributed manifest
  binds all tags, commits, artifact digests, and protocol versions together.
- Ordinary CI cannot create tags or releases and receives read-only contents
  permission.

## Provenance

1. Validate all source repositories and the curated workspace export.
2. Build packages and release assets from clean source commits with pinned
   toolchains.
3. Run clean-consumer and cross-repository checks against those artifacts.
4. Generate the manifest outside the source repositories so it can include the
   already-frozen workspace commit without a self-referential commit cycle.
5. Sign the manifest and release assets during the separately approved GitHub
   publication operation.

The one-time dependency-ordered source bootstrap and final branch-protection
settings are specified in
[Sprint 9E Required Checks V1](./sprint-9e-required-checks-v1.md). No CI
workflow is granted release or repository-write permission.

## Withdrawal And Supersession

- Never rewrite or move an affected tag.
- Mark the GitHub prerelease withdrawn, state the reason and affected artifacts,
  and remove it from recommended installation paths.
- Publish a corrected prerelease with a new version and manifest.
- Registry artifacts, if separately published later, follow native yank or
  deprecation mechanisms rather than destructive deletion where possible.
- Security-sensitive withdrawal details follow the private advisory process
  until coordinated disclosure is safe.

## Rollback Boundary

Source publication is append-only. Runtime rollback means selecting a prior
approved manifest and reconciling deployment authority to its exact images and
protocol set; it never means combining arbitrary prior repository versions.
