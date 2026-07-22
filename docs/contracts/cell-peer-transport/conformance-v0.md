# Cell Peer Transport V0 Conformance

## Positive Proofs

- distinct Ed25519 cell certificates complete authority-pinned mutual TLS 1.3.
- signed controls bind exact source and target generations.
- an authority-derived remote route delegates over TCP and returns the
  normalized composed context.
- local and remote route-member selection use the same chamber callback.
- peer signal ingress preserves typed signal behavior and `no_forward` target
  delivery.
- source and target transport phases emit canonical digest-bound evidence with
  no raw business context or subject/principal data.
- the Linux cell-host source compiles under Rust 1.97.

## Negative Proofs

- reject certificate/private-key mismatch.
- reject unconfigured or authority-drifted SPKI.
- reject suspended or revoked enrollment.
- reject stale source or target generation.
- reject signature or signed-field mutation.
- reject route-member, assignment, image, lane, or responsibility drift.
- reject duplicate envelope and invalid replay transition.
- reject a replay ledger full of unexpired identities without evicting an
  unexpired replay guard.
- reject canonical JSON containing unknown contract fields.
- reject expired controls, deadlines, oversized context, result bound, and
  frame length before execution.
- reject arbitrary cell-host arguments and root execution.
- reject listener endpoint drift and noncanonical host config/control.
- preserve `execution_started: true` after connection loss following
  `proceed`.
- fail closed when mandatory transport evidence cannot be appended.

## Required Commands

```bash
cargo fmt --check
cargo clippy --locked --all-targets --all-features -- -D warnings
cargo test --locked --all-targets
```

The Linux-only host must additionally pass `cargo check --all-targets` and its
descriptor/lifecycle tests in the approved Linux environment before the Sprint
6B security gate closes.
