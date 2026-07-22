# Pre-Enrolled Cell Supply

Date: 2026-07-19

## Context

Sprint 7D reconciles desired placement across already running Cells but cannot
add eligible runtime capacity. Cadenza needs to absorb this operational burden
without giving a contained stem graph credentials, process control, launch
profiles, infrastructure APIs, or dynamic enrollment authority.

A database transaction can authorize desired process state but cannot prove a
Linux process exists. Request authority, provider realization, and Cell runtime
readiness must therefore remain distinct identities and evidence.

## Decision

- Restrict V1 supply to named, actively enrolled Cell identities backed by
  operator-provisioned, digest-pinned local profiles.
- Let the stem emit only the existing `request_cell_start`,
  `request_cell_drain`, and `request_cell_stop` actions containing a Cell key.
- Interpret committed supply actions as durable desired dispositions, never as
  proof that a process transition completed.
- Add a separate Rust supply supervisor in `cadenza-cell`. It reconciles exact
  PostgreSQL directives through locally custodied profiles and is not a meta
  slice or primitive runtime.
- Keep provider realization observations and Cell-signed generation lifecycle
  observations separate and require both where their meanings apply.
- Permit automatic release only for demand-managed profiles and only after the
  Cell is empty, unrelated to stem or authority custody, explicitly draining,
  and authorized to stop.
- Terminate unowned children after provider loss and create a fresh Cell
  generation after recovery rather than adopting uncertain process custody.
- Exclude dynamic enrollment, machine creation, cloud APIs, arbitrary launch
  input, provider-selected placement, and proactive healthy-replica repacking.

## Consequences

- Desired replica state can eventually add and remove local pre-authorized Cell
  capacity without exposing infrastructure mechanics to application authors.
- PostgreSQL remains semantic authority, the stem remains policy interpreter,
  the supply supervisor owns process realization, and each Cell remains local
  runtime custodian.
- Supply introduces one additional bounded reconciliation loop and trusted
  profile-custody process. Operational-complexity review is mandatory at every
  pass and at closure.
- Provider restart may delay replacement until prior Cell-generation authority
  stops or expires, favoring singular custody over fast ambiguous adoption.

## Alternatives

- Direct stem process capabilities and generic launch APIs were rejected as
  overbroad runtime authority.
- Cloud provisioning and dynamic enrollment were rejected as separate future
  trust and infrastructure problems.
- Storing launch profiles in PostgreSQL was rejected because deployment secret
  custody does not belong in graph authority.
- Treating directive commit as process success was rejected as false readiness.
- Embedding supply supervision in the stem Cell host was rejected because it
  couples policy-host loss to environment process-supply custody.

## Links

- [Approved Sprint 7E design](../agent-harness/exec-plans/completed/2026-07-19-pre-enrolled-cell-supply-sprint-7e-design.md)
- [Enrollment-scoped peer transport identity](2026-07-19-enrollment-scoped-peer-transport-identity.md)
- [Sprint 7 parent design](../agent-harness/exec-plans/active/2026-07-17-scale-placement-reconciliation-design.md)
- [Sprint 7D closure](../contracts/distribution/sprint-7d-closure-review-v0.md)
