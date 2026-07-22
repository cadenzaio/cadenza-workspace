# cadenza

Role: TypeScript primitive and local execution authority, including graph,
actor, and neutral runtime-evidence semantics. It is persistence- and
environment-authority-agnostic.

Enter this repo when:

- a task touches `Task`, `Signal`, `Intent`, `Actor`, or runner behavior
- a shared primitive or runtime-evidence contract changes

Read before editing:

- `docs/cadenza-learning-path.md`
- `docs/vision.md`

First files:

- `cadenza/README.md`
- `cadenza/docs/architecture.md`
- `cadenza/package.json`
- `cadenza/src/`
- `cadenza/tests/`

Primary commands:

- `cd cadenza && npm test`
- `cd cadenza && npm run build`
- `cd cadenza && npm run docs`

Contract role:

- Authority for `core_runtime_primitives` in `contracts.config.json`

Routing note:

- durable policy, bootstrap, persistence, reconciliation, supply, and actor
  authority belong in `cadenza-environment`, not this repository.
