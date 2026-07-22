# Environment Bootstrap Foundation

## Context

The core and authority/security foundations are stable, but Cadenza still needs a trustworthy genesis path for its first database-native environment. Normal authority writes must eventually pass through a privileged authority-access slice, while that slice cannot create the trust root that authorizes its own activation.

The older environment documentation assigned this responsibility to a separate `cadenza-environment` repository and referenced the legacy engine boundary. Current direction keeps the environment foundation in the official `cadenza` repository and introduces a separate chamber runtime only after bootstrap defines its activation contract.

## Decision

Implement the environment bootstrap foundation in the official `cadenza` repository behind an isolated `environment-bootstrap/` package boundary.

- `@cadenza.io/core` remains persistence-agnostic and does not depend on bootstrap code.
- PostgreSQL is the first authority-store adapter.
- static bootstrap authority is finite: schema, trust-root public state, first trusted-cell enrollment, pinned seed application, evidence, and handoff generation.
- seed packs are immutable and digest-addressed.
- bootstrap is monotonic, transactional, resumable, and idempotent; conflicting reruns fail closed.
- no callable source is materialized or executed during bootstrap.
- the milestone ends at `handoff_ready`; secure activation and `operational` state belong to the later chamber/runtime integration.
- static bootstrap is substrate code and is not translated automatically into every core language.

## Consequences

- The neutral bootstrap contract and fixtures become semantic authority before schema implementation.
- The `cadenza` repository gains an independently built child package without moving the stabilized root core package.
- Legacy `cadenza-db`, `cadenza-service`, demos, and engine repositories remain reference-only.
- Database constraints must preserve the authority/security invariants already proved across four languages.
- The chamber design receives an explicit, digest-bound activation handoff rather than inventing bootstrap semantics.
- Broader identity, plugins, agents, stem-cell reconciliation, distribution, UI, CLI, memory, and actor persistence remain deferred.

## Alternatives

- Put bootstrap inside `@cadenza.io/core`. Rejected because it violates the persistence-agnostic core boundary.
- Create a separate `cadenza-environment` repository. Rejected because it restores a premature hard repository boundary contrary to current direction.
- Reuse legacy database/service repositories. Rejected because they encode the previous service-centered architecture.
- Bootstrap through a generated `PostgresActor`. Rejected because generated authority surfaces depend on the authority gateway already existing.
- Build chambers first. Rejected because chambers need a precise authority and activation contract.

## Links

- Design proposal: [docs/agent-harness/exec-plans/completed/2026-07-12-environment-bootstrap-design.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/agent-harness/exec-plans/completed/2026-07-12-environment-bootstrap-design.md)
- Intended whole: [docs/cadenza-intended-whole.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/cadenza-intended-whole.md)
- Authority closure: [docs/contracts/authority-security/coherence-review-v0.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/contracts/authority-security/coherence-review-v0.md)
- Persistence boundary: [docs/decisions/2026-07-11-persistence-agnostic-core.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/decisions/2026-07-11-persistence-agnostic-core.md)
