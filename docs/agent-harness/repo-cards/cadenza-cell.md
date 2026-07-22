# cadenza-cell

Role: official trusted cell substrate and authority for cell lifecycle, deterministic containment plans and launcher policy, chamber process custody, capability brokers, route-member interpretation, authenticated peer transport, evidence publication, and termination.

Enter this repo when:

- a chamber must start inside approved containment.
- a cell containment plan or launcher policy changes.
- a chamber requests a mounted host capability.
- runtime credentials or trusted provider adapters are introduced.
- local chamber lifecycle, evidence, or termination changes.
- opaque route members must resolve to local or authenticated remote ingress.
- the fixed unprivileged cell-host process or peer protocol changes.

Read before editing:

- `docs/cadenza-intended-whole.md`
- `docs/cadenza-environment.md`
- `docs/cadenza-language-runtime-contract.md`
- `docs/decisions/2026-07-13-trusted-cell-first-activation.md`
- `docs/agent-harness/exec-plans/completed/2026-07-13-trusted-cell-first-activation-design.md`
- `docs/agent-harness/exec-plans/active/2026-07-14-multi-cell-static-placement-design.md`
- `docs/contracts/cell-peer-transport/v0.md`
- `cadenza-cell/AGENTS.md`

First files:

- `cadenza-cell/README.md`
- `cadenza-cell/contracts/v0.md`
- `cadenza-cell/src/lib.rs`
- `cadenza-cell/tests/`

Primary commands:

- `cd cadenza-cell && cargo fmt --check`
- `cd cadenza-cell && cargo clippy --locked --all-targets --all-features -- -D warnings`
- `cd cadenza-cell && cargo test --locked --all-targets`

Contract role:

- authority for `cell_runtime_contracts` in `contracts.config.json`.
- consumer of chamber contracts from `cadenza-chamber` and authority/bootstrap contracts from `cadenza`.

Routing notes:

- update `cadenza-chamber` first when the chamber host protocol or containment attestation meaning changes.
- update `cadenza` first when authority, bootstrap, gateway, or PostgreSQL contract meaning changes.
- durable placement meaning remains in `cadenza`; this repo consumes exact route projections and owns local/remote enforcement and peer transport.
- do not add scheduling, actor residency, scaling, plugins, secrets, UI, CLI, agents, or memory during Sprint 6.
- macOS tests do not prove privileged containment; Linux gVisor evidence is mandatory.
