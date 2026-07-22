# cadenza-chamber

Role: official low-level chamber runtime substrate and authority for chamber activation, immutable runtime images, neutral adapter protocol and artifacts, language-adapter integration packages, lifecycle, primitive ingress, normalized outcomes, and runtime evidence.

Enter this repo when:

- a task consumes an environment-bootstrap handoff.
- chamber activation or lifecycle changes.
- a language runtime adapter is added or changed.
- primitive execution crosses a chamber boundary.
- chamber evidence or normalized runtime outcomes change.

Read before editing:

- `docs/cadenza-intended-whole.md`
- `docs/cadenza-language-role-doctrine.md`
- `docs/cadenza-language-runtime-contract.md`
- `docs/contracts/environment-bootstrap/v0.md`
- `docs/decisions/2026-07-12-chamber-runtime-foundation.md`
- `cadenza-chamber/AGENTS.md`

First files:

- `cadenza-chamber/README.md`
- `cadenza-chamber/contracts/v0.md`
- `cadenza-chamber/src/lib.rs`
- `cadenza-chamber/tests/`

Primary commands:

- `cd cadenza-chamber && cargo fmt --check`
- `cd cadenza-chamber && cargo clippy --locked --all-targets --all-features -- -D warnings`
- `cd cadenza-chamber && cargo test --locked --all-targets`

Contract role:

- Authority for `chamber_runtime_contracts` in `contracts.config.json`.
- Consumer of `environment_bootstrap_contracts` and `core_runtime_primitives` from `cadenza`.
- Owner of the TypeScript reference adapter, which consumes but does not define
  TypeScript primitive semantics.

Routing notes:

- Change `cadenza` first when bootstrap or primitive meaning changes.
- Preserve adapter-to-core dependency direction; no core imports Chamber
  adapter behavior.
- Do not add cell placement, distributed routing, credential custody, or environment authority here.
- A child process is not a security sandbox; privileged activation requires the separately governed trusted cell host.
