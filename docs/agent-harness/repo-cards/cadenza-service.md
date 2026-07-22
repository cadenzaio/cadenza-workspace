# cadenza-service

Role: distributed runtime extension, metadata propagation layer, PostgresActor authority, and `service_manifest` authority for helper/global structural sync.

Enter this repo when:

- a task affects service distribution, remote execution, metadata sync, or PostgresActor behavior
- a contract belongs to `service_distribution_contracts`

Read before editing:

- `docs/cadenza-learning-path.md`
- `docs/vision.md`

First files:

- `cadenza-service/README.md`
- `cadenza-service/docs/architecture.md`
- `cadenza-service/docs/postgres-actor-guide.md`
- `cadenza-service/package.json`
- `cadenza-service/src/`
- `cadenza-service/tests/`

Primary commands:

- `cd cadenza-service && npm test`
- `cd cadenza-service && npm run build`
- `cd cadenza-service && npm run docs`

Contract role:

- Authority for `service_distribution_contracts` in `contracts.config.json`

Routing note:

- If a change touches generated database intents or metadata signals, check downstream impact on `cadenza-db`, `cadenza-ui`, and demo repos.
