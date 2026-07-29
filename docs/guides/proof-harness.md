# Cadenza Proof Harness

## Purpose

The proof harness turns declared source and runtime inputs into evidence with
an explicit scope. It does not convert a passing test into a production SLA or
erase the limits of the host, database, containment, and key-custody model.

The authority manifest is [`proof/manifest.json`](../../proof/manifest.json).
Every report binds the exact manifest digest, source identities, commands or
scenarios, durations, result, and cleanup state.

## Tiers

### Fast

```sh
node scripts/run-proof.mjs fast
```

Fast proof checks workspace governance, shared contract snapshots, TypeScript
primitive behavior, Environment type contracts, the Chamber protocol, focused
Cell replica-route interpretation, and reference business flows. It is the
small detector for ordinary development.

### Complete

```sh
node scripts/run-proof.mjs complete
```

Complete proof runs every repository-owned non-privileged release validation.
It includes all four core languages, Environment, Chamber, Cell, the clean
reference consumer, package smoke tests, audits, documentation generation, and
release metadata. It does not prove Linux containment.

### Privileged

```sh
node scripts/run-proof.mjs privileged --lima cadenza-gvisor
```

Privileged proof:

1. rejects every dirty source repository in its affected scope;
2. packages only exact Git commits and transfers those archives to the
   declared isolated Linux guest;
3. verifies pinned Node, Rust, PostgreSQL, architecture, and `runsc`;
4. rebuilds Core, Environment, Chamber, the TypeScript adapter, the reference
   artifact, and a new rootfs from explicit inputs;
5. refuses a pre-existing installed rootfs with the resulting digest;
6. proves the exact contained Cell/Chamber handshake before long execution;
7. creates a fresh PostgreSQL cluster and generated fixture credentials for
   each scenario;
8. executes each scenario in a neutral delegated systemd cgroup with declared
   convergence and unit bounds;
9. removes processes, containers, bundles, sockets, cgroups, generated rootfs
   content, temporary authority, and credential files on success or failure.

Fixture credentials exist only in a root-owned `0600` file whose path, rather
than contents, enters the test process environment. The file is never a source
input, command argument, report field, or retained artifact.

The two privileged scenarios prove:

- distributed reference execution through two Cells;
- sender-side selection across two replicas;
- supply-role outage without false absence;
- provider-generation replacement and fresh Cell generations;
- post-restart execution, scale-down, dormant supply, and cleanup.

Sprint hardening can include the separately declared stem-loss scenario without
widening the ordinary development path:

```sh
node scripts/run-proof.mjs privileged --lima cadenza-gvisor --hardening
```

The hardening profile runs the two ordinary scenarios plus stem takeover, stale
authority-mount rejection, fresh-capacity resupply, post-recovery execution,
and exact cleanup.

## Evidence

Reports default to a temporary operating-system directory. Use `--output` to
select another path outside this workspace:

```sh
node scripts/run-proof.mjs fast --output /tmp/cadenza-fast-proof.json
```

A report states what passed, what inputs were measured, and what remains
outside the claim. A wider timeout is not performance evidence and cannot
replace observed state progress.

Failed privileged reports also identify the last non-secret phase, script
line, and exit status. They do not retain commands or process output because
those surfaces may contain credentials.

## Boundaries

- Fast and complete reports may describe a dirty worktree and are development
  evidence only.
- Privileged proof requires clean commits because mutable source cannot be a
  reproducible authority.
- The Lima transport is orchestration, not a security boundary. The Linux
  guest, host root, PostgreSQL superuser, installed `runsc`, and build
  toolchains remain trusted.
- gVisor evidence is measured containment, not hardware remote attestation.
- Representative scenarios do not prove every failure combination.
