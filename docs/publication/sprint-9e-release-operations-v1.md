# Sprint 9E Release Operations V1

Date: 2026-07-23
Status: amended candidate procedure

## GitHub Ownership And Workspace Custody

- RC1 uses the existing personal `cadenzaio` GitHub owner. Organization custody
  is not claimed.
- The existing private `cadenza-workspace` repository is not a publication
  source. Rename it to `cadenza-workspace-private-archive`, verify that it
  remains private with its original history, then create a fresh public
  `cadenza-workspace` from the approved curated history.
- The existing public `cadenza` history is preserved by a normal fast-forward
  to the approved candidate. New implementation and reference repositories are
  created from their approved candidate histories.
- No public repository, tag, release, protection rule, or package is created
  before the final explicit publication decision.

## Tag Policy

- Tags are immutable signed release identities created only from approved
  clean candidate commits.
- `cadenza` uses `v4.0.0-rc.1`; new implementation and reference repositories
  use `v0.1.0-rc.1`; the workspace uses `distributed-foundation-rc.1`.
- A tag is not compatibility authority by itself. The distributed manifest
  binds all tags, commits, artifact digests, and protocol versions together.
- Ordinary CI cannot create tags or releases and receives read-only contents
  permission.

## Signing Identity

RC1 uses one dedicated passphrase-protected Ed25519 SSH signing identity:

1. provision it outside the workspace and release staging paths;
2. register its public key with GitHub as a signing key;
3. record and publish its public key and SHA-256 fingerprint;
4. sign all nine annotated release tags;
5. create detached SSH signatures for the aggregate manifest and release
   assets;
6. verify every tag and detached signature before making the releases public.

The private key must not enter source, archives, release assets, logs, CI
variables inherited by runtime jobs, or shell history. The owner must provision
the key or explicitly authorize its generation and custody. Unsigned release
identities are not an allowed fallback.

## Provenance

1. Validate all source repositories and the curated workspace export.
2. Build packages and release assets from clean source commits with pinned
   toolchains.
3. Run clean-consumer and cross-repository checks against those artifacts.
4. Generate the manifest outside the source repositories so it can include the
   already-frozen workspace commit without a self-referential commit cycle.
5. Sign the manifest and release assets during the separately approved GitHub
   publication operation.

The one-time dependency-ordered source bootstrap, DCO installation, review
ratchet, and final branch-protection settings are specified in
[Sprint 9E Required Checks V1](./sprint-9e-required-checks-v1.md). No CI
workflow is granted release or repository-write permission.

## Publication And Verification Procedure

1. Revalidate the exact approved commits, artifacts, manifest, source archives,
   DCO sign-offs, and signing public-key fingerprint.
2. Rename the existing private workspace repository and prove that the renamed
   repository remains private before creating any public workspace repository.
3. Install the GitHub DCO check and create or fast-forward repositories in the
   dependency order defined by the required-checks document.
4. Observe the exact CI and DCO check names on the published candidate commits.
5. Create and verify signed annotated tags, detached manifest and asset
   signatures, and GitHub prereleases. Do not publish registry packages.
6. Apply the machine-readable branch rules with zero mandatory approvals,
   pull requests, required checks, resolved conversations, linear history, no
   force push or deletion, and no administrator bypass.
7. Add legacy-direction notices and archive legacy repositories only as
   explicitly authorized by the final publication decision.
8. Enable private vulnerability reporting and retain secret scanning and push
   protection where GitHub supports them.
9. From an unauthenticated environment, clone every public tag, verify public
   histories and release assets, repeat the documented clean-consumer and
   workspace-reader checks, and confirm the private workspace archive is not
   visible.
10. Record the remote repository identities, tag object IDs, release asset
    digests, protection settings, DCO/CI check names, and verification result as
    publication evidence.

Any mismatch stops publication. Do not repair a public candidate in place;
withdraw or leave it unpublished, return to the affected release stage, and
produce a superseding candidate.

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
