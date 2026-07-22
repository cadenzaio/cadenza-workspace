# Trusted Cell And First Activation

## Context

Environment Bootstrap V0 ends at `handoff_ready`, and the chamber foundation proves non-privileged materialization and execution. The seeded authority-access slice is privileged and cannot run safely in the development process model. Its activation requires containment established before chamber code starts, external credential custody, a domain-shaped authority broker, a real reproducible gateway artifact, and a post-bootstrap operational transition.

## Decision

- create `cadenza-cell` as an independent official Rust repository.
- keep the cell and chamber as separate trust domains and processes.
- require gVisor `runsc` for the first `trusted_control_v0` privileged containment profile; plain OCI/runc is not sufficient.
- invoke containment through a narrow static-policy launcher rather than a generic container daemon API.
- contain the Rust chamber executable and Node adapter together.
- keep database credentials, authority providers, keys, artifact resolution, and durable evidence outside the sandbox.
- expose `authority_access/admin` only through explicit broker methods backed by execute-only PostgreSQL functions.
- build the deterministic authority-gateway bundle under the authority-owning `cadenza` repository.
- preserve immutable bootstrap `handoff_ready` history and model `operational` as a separate post-bootstrap authority transition.
- split implementation into containment proof, authority broker/gateway, and first trusted activation.
- require Linux gVisor evidence before claiming privileged containment or operational completion.

## Consequences

- Sprint 4C.1 introduces cell and launcher contracts, a contained chamber process protocol, and synthetic privileged containment tests without credentials.
- Sprint 4C.2 introduces schema, database roles/functions, the real gateway artifact, and capability brokering only after containment review.
- Sprint 4C.3 performs first activation only in a disposable environment on an approved Linux runner.
- the current macOS workspace can build and test neutral contracts but cannot produce the required privileged containment evidence.
- Firecracker remains a later higher-assurance profile behind the same containment contract.

## Alternatives

- plain OCI/runc: rejected for privileged execution because the workload still reaches the host Linux kernel directly.
- Firecracker immediately: deferred because it adds KVM, guest kernel/rootfs, jailer, guest transport, and patch stewardship before the cell contract is proven.
- Docker/Kubernetes control APIs: rejected as the trusted V0 launcher because they expose a much broader generic control surface.
- cell and chamber in one process: rejected because chamber compromise would expose credentials and providers.
- database client inside gateway: rejected because it defeats capability mediation and credential isolation.

## Links

- Approved proposal: [docs/agent-harness/exec-plans/active/2026-07-13-trusted-cell-first-activation-design.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/agent-harness/exec-plans/active/2026-07-13-trusted-cell-first-activation-design.md)
- Chamber foundation: [docs/decisions/2026-07-12-chamber-runtime-foundation.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/decisions/2026-07-12-chamber-runtime-foundation.md)
- gVisor security architecture: https://gvisor.dev/docs/architecture_guide/intro/
- OCI Linux runtime configuration: https://specs.opencontainers.org/runtime-spec/config-linux/
