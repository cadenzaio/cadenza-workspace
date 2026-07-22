# cadenza-environment

Role: durable authority for one Cadenza environment, including bootstrap,
policy, PostgreSQL persistence, reconciliation, supply, evidence-ledger
processing, and distributed actor authority.

Enter this repo when:

- a durable environment contract or exact authority operation changes
- PostgreSQL migrations or adapters change
- reconciliation, supply, ledger processing, or distributed actor authority changes

Read before editing:

- `docs/cadenza-intended-whole.md`
- `docs/cadenza-environment.md`
- `docs/publication/sprint-9a-environment-authority-boundary-amendment-v1.md`

First files:

- `cadenza-environment/README.md`
- `cadenza-environment/AGENTS.md`
- `cadenza-environment/contracts/`
- `cadenza-environment/packages/`

Primary commands:

- `cd cadenza-environment && npm run install:all`
- `cd cadenza-environment && npm run typecheck`
- `cd cadenza-environment && npm test`

Contract role:

- Authority for `authority_security_contracts`,
  `environment_bootstrap_contracts`, `distribution_authority_contracts`, and
  `execution_evidence_ledger_contracts` in `contracts.config.json`.

Routing note:

- primitive execution belongs in a language core; callable materialization
  belongs in Chamber; host custody belongs in Cell.
