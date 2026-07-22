# cadenza-integrations

Role: host and agent-specific adapters on top of the official Cadenza runtime protocol.

Enter this repo when:

- a task adds or updates a runtime client for `cadenza runtime stdio`
- a task adds or updates a host-specific wrapper such as Codex
- the change should consume the core runtime protocol without redefining it

Read before editing:

- `docs/cadenza-learning-path.md`
- `docs/vision.md`

First files:

- `cadenza-integrations/README.md`
- `cadenza-integrations/AGENTS.md`
- `cadenza-integrations/package.json`
- `cadenza-integrations/packages/`

Primary commands:

- `cd cadenza-integrations && yarn install`
- `cd cadenza-integrations && yarn build`
- `cd cadenza-integrations && yarn typecheck`
- `cd cadenza-integrations && yarn test`

Contract role:

- consumer of the `cadenza` runtime protocol

Routing note:

- if the runtime protocol itself must change, update `cadenza` first
- if transport/distribution service contracts must change, route to `cadenza-service`
