# cadenza-db

Role: canonical metadata persistence schema and DB contract authority, including helper/global definition tables and tool-dependency snapshot materialization.

Enter this repo when:

- a task affects table shapes, keys, persistence triggers, or actor registry storage
- a contract belongs to `cadenza_db_schema_contracts`

Read before editing:

- `docs/cadenza-learning-path.md`
- `docs/vision.md`

First files:

- `cadenza-db/README.md`
- `cadenza-db/docs/architecture.md`
- `cadenza-db/package.json`
- `cadenza-db/src/`
- `cadenza-db/docs/`

Primary commands:

- `cd cadenza-db && npm test`
- `cd cadenza-db && npm run build`

Contract role:

- Authority for `cadenza_db_schema_contracts` in `contracts.config.json`

Routing note:

- Schema changes usually require a design proposal and consumer validation in `cadenza-service`, `cadenza-ui`, or `cadenza-engine`.
