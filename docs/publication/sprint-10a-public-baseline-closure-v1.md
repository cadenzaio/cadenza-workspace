# Sprint 10A Public Baseline Closure V1

Date: 2026-07-27
Status: passed

## Verdict

Sprint 10A passes. The canonical workspace root now has one standalone
public-lineage Git repository, the eight official child repositories remain
independent, the old private-lineage root and excluded local material remain
preserved outside public ancestry, and the post-RC Chamber and Cell commits
have been carried onto the common Sprint 10 branch without rewriting RC1.

## Exact Source Baseline

| Repository | Branch | Commit | Relationship |
| --- | --- | --- | --- |
| `cadenza-workspace` | `codex/distributed-foundation-consolidation-hardening` | `45817adc9a21095d4d6c88dae51a4f130beab38a` | signed commit directly on public `main` |
| `cadenza-chamber` | `codex/distributed-foundation-consolidation-hardening` | `09e119776a1fa02b53fe44f28597d61d1cf3f766` | post-RC routing closure on public `main` |
| `cadenza-cell` | `codex/distributed-foundation-consolidation-hardening` | `19322528d90b03a3611d373c96c8ab7a4b7090b2` | post-RC lifecycle hardening after routing proof |

The immutable public workspace parent is
`574ad5130f4ce2bcefecf92accfb7637b3da1093`. The prior private-lineage head is
`3381fbfc58c3960d6a40a11608597a69fb96f4a8`.

## Ancestry And Custody Proof

- Public `origin/main` is an ancestor of the Sprint 10 root.
- The prior private head is not an ancestor of the Sprint 10 root.
- The prior private head has no merge base with the Sprint 10 root.
- A standalone candidate clone contained no object for the prior private head;
  full unreachable-object inspection returned no findings.
- The old root, legacy repositories, Memory artifacts, communication drafts,
  and unrelated local files remain in a dated local archive.
- Existing Codex worktrees were repaired to retain their old private Git
  custody. Their content, including unrelated dirty work, was not modified.
- Only the eight official child repositories moved under the canonical public
  workspace path.

Detailed classification is recorded in
[Root Custody Classification V1](./sprint-10a-root-custody-classification-v1.md).

## Imported Post-RC Meaning

The public contract now states:

- multi-candidate task and signal route selection is sender-side;
- V0 uses bounded deterministic round-robin per sending Chamber, route group,
  and route epoch;
- Cell validation resolves exactly the selected member and never silently
  substitutes another replica;
- signal fan-out remains once per subscribing slice, selecting one replica
  within each slice;
- actor-owner routing remains authority-directed;
- started or uncertain execution is never automatically retried elsewhere.

The separate Cell lifecycle repair retains exact custody until pending
activation or prepared Chamber work is retired, preserves the empty-custody
fence, and treats identity-matched `CustodyPending` as bounded deferral rather
than false lifecycle progress.

## Validation

Workspace:

- `./scripts/workspace-snapshot.sh`: passed; all official repositories clean.
- `./scripts/check-agent-harness.sh`: passed.
- `node scripts/check-public-documentation-links.mjs`: passed across 68 files
  and five current-direction checks.
- `node scripts/prepare-public-workspace.mjs --check`: passed with 365
  allowlisted files.
- Root Ed25519 commit verification: good signature for
  `emil@canaray.com`.

Chamber:

- `cargo fmt --check`: passed.
- `cargo clippy --locked --all-targets --all-features -- -D warnings`: passed.
- `cargo test --locked --all-targets`: passed.

Cell:

- `cargo fmt --check`: passed.
- `cargo clippy --locked --all-targets --all-features -- -D warnings`: passed.
- `cargo test --locked --all-targets`: passed.
- One existing integration test remained explicitly ignored because it
  requires local PostgreSQL and Node runtimes. Privileged and external-runtime
  proof remains owned by Sprint 10C rather than being inferred from this
  native-suite pass.

## Signing Posture

All imported post-RC source commits carry DCO signoff. The Cell lifecycle
commit and both new workspace commits are Ed25519-signed. Earlier routing
commits predate key provisioning and remain unrevised so their reviewed
identities and evidence are not rewritten. All new Sprint 10 commits are
configured to sign.

## Limits

This closure proves public source custody, post-RC source integration, native
repository validation, and documentation governance. It does not prove the
complete four-core conformance pass, recursive dead-purpose review, privileged
Linux/gVisor system execution, isolated performance evidence, or Sprint 10
closure. Those remain the work of Sprints 10B through 10F.
