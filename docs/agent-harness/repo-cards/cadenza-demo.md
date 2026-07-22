# cadenza-demo

Role: legacy multi-part demo workspace for end-to-end validation.

Enter this repo when:

- a task needs demo coverage across frontend, services, or database subprojects
- you need an example consumer of service and DB contracts

First files:

- `cadenza-demo/README.md`
- `cadenza-demo/frontend/package.json`
- `cadenza-demo/database/package.json`
- `cadenza-demo/services/`

Primary commands:

- There is no single root package; inspect the nested `package.json` files first.

Contract role:

- Consumer of service distribution and DB schema contracts

Routing note:

- Prefer this repo for older integrated demo flows; prefer `cadenza-demo-2` for the richer current IoT scenario.
