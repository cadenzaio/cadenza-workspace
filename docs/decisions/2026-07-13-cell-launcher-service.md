# Cell Launcher Service

## Context

Linux gVisor evidence proved the containment shape, measured inputs, chamber
protocol, hostile boundary, and cgroup limits. The proof still ran launcher code
inside one root-owned test process and therefore did not establish the required
privilege boundary between the unprivileged cell and privileged containment host.

## Decision

- implement `cadenza-cell-launcher` as a root-owned systemd socket-activated
  Linux service.
- use a root-owned Unix `SOCK_SEQPACKET` socket and verify the caller with
  `SO_PEERCRED` against one configured cell UID/GID.
- require a canonical, nonce-bound plan authorization signed by the enrolled cell
  key in addition to static launcher-policy validation.
- resolve the allowed cell public key from root-owned launcher configuration.
- transfer only the chamber protocol descriptor through `SCM_RIGHTS`.
- retain privileged process custody in the launcher for deadlines, cancellation,
  bounded stderr, status, kill, cleanup, and reap.
- return a measured launcher receipt; the cell signs the resulting containment
  measurement only after those observed facts agree with its requested plan.
- expose no generic OCI, command, mount, environment, path, signal, or process API.

Approved by the user on 2026-07-13.

## Consequences

- compromise of the unprivileged cell cannot widen the static containment shape.
- another local process must pass both peer-credential and cell-signature checks.
- the launcher becomes durable privileged state and must bound clients, frames,
  chambers, stderr, deadlines, and replay memory.
- systemd unit/socket hardening and Linux integration evidence become part of
  Sprint 4C.1 closure.

## Alternatives

- setuid one-shot helper: rejected because descriptor return, replay protection,
  deadline enforcement, cancellation, crash cleanup, and reap require durable
  privileged custody.
- rootless launcher: rejected because it cannot reliably own the required systemd
  cgroup and host process boundary.
- generic Docker/containerd API: rejected because its authority surface is much
  wider than the Cadenza containment contract.

## Links

- Parent decision: `docs/decisions/2026-07-13-trusted-cell-first-activation.md`
- Linux evidence: `cadenza-cell/docs/linux-gvisor-evidence-2026-07-13.md`
- Active plan: `docs/agent-harness/exec-plans/active/2026-07-13-trusted-cell-first-activation-design.md`
