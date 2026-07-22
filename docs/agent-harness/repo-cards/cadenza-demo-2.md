# cadenza-demo-2

Role: current IoT-style demo stack for exercising distributed runtime metadata and actor flows.

Enter this repo when:

- a task needs realistic cross-service demo traffic
- you need a consumer example for current global signal and actor-session conventions

First files:

- `cadenza-demo-2/README.md`
- `cadenza-demo-2/runner/package.json`
- `cadenza-demo-2/database/package.json`
- `cadenza-demo-2/services/`

Primary commands:

- There is no single root package; inspect the nested `package.json` files first.

Contract role:

- Consumer of core, service, and DB contracts

Routing note:

- This repo is the best end-to-end check when a contract change needs a realistic downstream integration smoke test.
