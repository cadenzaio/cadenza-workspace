# cadenza-integrations

Status: deferred/private; not an official distributed-foundation repository

Role: possible future home for host- or product-specific adapters that consume
official Cadenza contracts without redefining them.

Enter this repo when:

- an approved future design explicitly activates an integration surface
- a host-specific adapter can remain a consumer of official public contracts
- the work does not belong in core, Environment, Chamber, or Cell

Read before editing:

- `docs/cadenza-learning-path.md`
- `docs/vision.md`
- `docs/cadenza-language-runtime-contract.md`

Current boundary:

- no integration or CLI surface is part of the current release candidate
- this card grants no contract authority and defines no current commands
- activation requires an approved design and a repo-local governance contract

Routing note:

- primitive semantics route to `cadenza`
- durable authority and policy route to `cadenza-environment`
- language materialization and runtime lifecycle route to `cadenza-chamber`
- containment, host capabilities, and peer transport route to `cadenza-cell`
