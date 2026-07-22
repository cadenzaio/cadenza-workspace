# cadenza-demo-service

Role: standalone demo service repo used as a lightweight consumer of the service package.

Enter this repo when:

- a task needs a minimal distributed-service example
- you want a small reproduction surface for service-level regressions

First files:

- `cadenza-demo-service/package.json`
- `cadenza-demo-service/src/`

Primary commands:

- `cd cadenza-demo-service && npm run build`
- `cd cadenza-demo-service && npm start`

Contract role:

- Consumer of `@cadenza.io/service`

Routing note:

- This repo is useful for focused service regressions when the larger demo repos add too much noise.
