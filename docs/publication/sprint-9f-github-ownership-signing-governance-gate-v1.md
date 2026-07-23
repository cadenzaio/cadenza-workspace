# Sprint 9F GitHub Ownership, Signing, And Governance Gate V1

Date: 2026-07-23
Status: approved

## Context

The final Sprint 9F operational review inspected GitHub read-only and found
that the approved publication model contains four assumptions that are not true
or not yet operational:

1. `cadenzaio` is a personal GitHub account, not an organization.
2. The account has no registered SSH signing key, and the local Git
   configuration has no GPG or SSH signing identity.
3. The existing private `cadenza-workspace` repository contains private working
   history. Making that repository public, even after replacing `main`, could
   expose retained or known private objects and would violate the curated-clean
   history boundary.
4. `cadenzaio` is the only collaborator on the existing public `cadenza`
   repository. Enforcing one approving review together with no administrator
   bypass would leave no identity capable of merging future changes.

The existing public `cadenza/main` commit is an ancestor of the frozen v4
candidate, so its publication can remain a normal fast-forward that preserves
history. The other implementation/reference repositories are absent, the
workspace is private, the five named legacy repositories remain public and
unarchived, and the current public `cadenza/main` branch has no protection.

No GitHub state was changed during this review.

## Recommended RC1 Decision

### GitHub Owner

Publish RC1 under the existing personal `cadenzaio` account. Replace
“organization” with “GitHub owner” or “account” in current publication
guidance. Do not attempt an account-to-organization conversion as part of this
release.

This preserves all existing repository URLs and avoids coupling the source
release to a risky account migration. The limitation is explicit:
team-governance features and independent organizational custody are not part of
RC1.

### Private Workspace Custody

Before creating the public workspace repository:

1. rename the existing private repository to
   `cadenza-workspace-private-archive`;
2. verify that it remains private and retains its original default branch and
   history;
3. create a new `cadenza-workspace` repository from the approved curated
   history;
4. verify from an unauthenticated view that no private object, branch, tag,
   issue, release, or setting crossed into the new repository.

The private archive must never be used as a public release source.

### Review Protection

Use zero mandatory approving reviews for the single-maintainer RC1, while
still requiring:

- pull requests;
- all declared CI checks;
- DCO;
- resolved conversations;
- linear history;
- stale-conversation handling where applicable;
- no force push or branch deletion;
- no administrator bypass after bootstrap.

Record a governance ratchet: increase the requirement to one independent
approval before granting a second maintainer write authority or claiming
multi-maintainer governance. This is more truthful than either disabling
protection informally or making the repository impossible to maintain.

If the owner already has a trusted independent reviewer who will be added as a
collaborator before protection is enabled, retain the approved one-review rule
instead.

### DCO

Install and enable the approved GitHub DCO check for all nine repositories
during the separately authorized publication operation. Apply branch
protection only after the first CI and DCO checks exist under their exact
declared names.

### Release Signing

Use one dedicated, passphrase-protected Ed25519 SSH signing identity for RC1:

- register its public key with GitHub as a signing key;
- sign all nine annotated release tags;
- sign the distributed manifest and release assets with detached SSH
  signatures;
- publish the public key and fingerprint with the workspace release;
- keep the private key outside source, artifacts, logs, and inherited runtime
  configuration.

The project owner must provision or explicitly authorize generation and custody
of this key. An unencrypted key generated silently by automation is not
acceptable.

## Required Documentation And Candidate Effect

After approval:

- current publication guidance will use account/owner terminology;
- `release/required-checks.json` will encode the chosen review count;
- the final Sprint 9F closure report will state the personal-owner and signing
  limitations, private-workspace rename sequence, DCO prerequisite, and
  post-publication unauthenticated verification;
- the current known-security-limitations page will state that exact clean-room
  proof passed and only the post-publication remote-clone repetition remains.

These are curated-workspace-only changes. They require one final deterministic
workspace/manifest replacement freeze before publication approval. No
implementation repository, package, SBOM, contract, protocol, or executable
artifact changes.

## Alternatives

1. Convert `cadenzaio` into an organization before RC1. Rejected as the default:
   it is a high-impact account and ownership migration unrelated to proving the
   distributed foundation.
2. Make the existing private workspace repository public after force-replacing
   `main`. Rejected: branch replacement does not prove private objects and
   repository history are absent.
3. Keep one required review without adding a reviewer. Rejected: it makes the
   protected repositories operationally unmaintainable.
4. Remove review and administrator protection informally. Rejected: external
   settings would drift from the machine-readable release contract.
5. Publish unsigned tags or assets. Rejected: it contradicts the approved
   provenance policy.
6. Generate an unencrypted signing key automatically. Rejected: release
   convenience does not justify weak key custody.

## Approval

The user approved the recommended RC1 GitHub ownership, workspace custody,
review ratchet, DCO, and Ed25519 signing posture on 2026-07-23. Sprint 9F may
resume with curated-workspace-only documentation and release-control changes.
No external GitHub state is authorized by this approval.
