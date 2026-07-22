# Cadenza Distributed Foundation Threat Model V1

Date: 2026-07-22

## Status And Scope

This threat model covers the release-candidate distributed foundation:

- the four official core-language repositories;
- Environment authority and its PostgreSQL adapter;
- Chamber activation, materialization, execution, and evidence capture;
- Cell containment, capability brokerage, transport, custody, reconciliation,
  supply, stem recovery, and actor ownership;
- source, dependency, generated-artifact, and CI inputs used to build them.

It does not cover Memory, plugins, CLI, observer UI, the managed product,
third-party business integrations, or a production cloud control plane.

## Security Objective

Cadenza must let authored business logic coordinate useful work without giving
that logic ambient access to deployment, topology, persistence, credentials,
host operations, or authority mutation. Every crossing from authored meaning
to durable or external affect must be explicit, narrowed, current, bounded,
attributable, and fail closed.

Security supports the intended whole; it does not replace it. A design that is
secure only by forcing infrastructure concerns back into business graphs is not
a successful Cadenza design.

## Protected Assets

1. Durable Environment authority, including logical objects, versions, tags,
   policies, placement, runtime state, actor state, and reconciliation state.
2. Bootstrap and operational trust roots, signing keys, transport keys, and
   purpose-separated PostgreSQL credentials.
3. Runtime-image identity, source and prebuilt artifact bytes, dependency locks,
   adapter bytes, and containment measurements.
4. Cell and Chamber generation identity, route authority, activation grants,
   actor assignment epochs, and residency grants.
5. Business input and result contexts. These may be sensitive even though the
   evidence protocol intentionally excludes their raw contents.
6. Execution evidence, custody order, commitments, processing state, and
   overarching trace continuity.
7. Host integrity, availability, process custody, and bounded compute, memory,
   process, filesystem, descriptor, and network resources.

## Trust Roles

| Role                   | Trusted for                                                                               | Not trusted for                                                                 |
| ---------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Core runtime           | Primitive semantics and local graph behavior                                              | Durable authority, persistence, containment, or host security                   |
| Business callable      | Its declared business function                                                            | Host access, authority, topology, credentials, evidence claims, or containment  |
| TypeScript adapter     | Translating a verified image into the TypeScript core                                     | Durable approval or ambient host capability                                     |
| Chamber                | Image verification, controlled materialization, execution framing, and normalized capture | Creating containment or independently widening capabilities                     |
| Unprivileged Cell host | Current authority, routing, lifecycle, evidence custody, and termination                  | Arbitrary root operations                                                       |
| Root-owned launcher    | One closed signed launch operation through pinned `runsc`                                 | Business meaning, arbitrary commands, paths, mounts, networking, or environment |
| Environment/PostgreSQL | Durable authority and exact role-owned operations                                         | Primitive execution semantics                                                   |
| Stem and supply roles  | Their explicit reconciliation or lifecycle operations                                     | Generic authority mutation                                                      |
| Peer Cell              | The signed generation-scoped claims accepted by current authority                         | Ambient trust based only on network reachability or a certificate               |
| Operator               | Correct host, database, key, identity, network, and lifecycle provisioning                | Bypassing contracts while retaining security claims                             |

No implementation language is trusted merely because it is TypeScript, Python,
Elixir, C#, or Rust. Trust follows the role and boundary.

## Attacker Capabilities

The model assumes an attacker may:

- supply arbitrary authored callable source and hostile business contexts;
- tamper with source slices, manifests, locks, binaries, rootfs trees, messages,
  evidence, grants, and persisted non-secret state;
- replay valid historical requests, envelopes, evidence, or launch operations;
- connect from an unauthorized local process or remote Cell identity;
- exploit stale routing, generation, placement, actor, or authority information;
- crash, hang, flood, overproduce stderr, send oversized frames, or exhaust
  bounded queues and journals;
- poison caller-controlled PostgreSQL `search_path` and attempt direct table or
  function access through a narrow role;
- compromise a movable CI tag or introduce a vulnerable dependency;
- inspect any data deliberately exposed inside its own Chamber sandbox.

The model does not claim protection after compromise of the host kernel, the
active PostgreSQL superuser, an active signing key, the root-owned launcher
service, or the reviewed `runsc` binary. It also does not claim protection from
hardware side channels or physical attacks.

## Boundary Model

### Definition To Execution

Definitions are serialized authority. Callable source becomes executable only
inside Chamber's adapter path after source, image, artifact, core, adapter, and
dependency identities have been verified. The core materializes Cadenza
primitives from callables already provided to it; it does not deserialize code
or decide authority.

The TypeScript adapter verifies each source digest, disables nested string and
Wasm code generation in its VM context, and bounds initial materialization time
(`cadenza-chamber/adapters/typescript/src/materialize.ts:1043`). Node explicitly
states that `node:vm` is not a security mechanism. Cadenza therefore treats the
entire Node/Chamber workload as untrusted and relies on the Cell-established
gVisor boundary, not the VM context, for host isolation.

### Chamber To Cell

Chamber receives only framed protocol descriptors and declared capability
facades. The adapter process starts with an empty environment and bounded
stdin/stdout/stderr supervision (`cadenza-chamber/src/adapter.rs:185`). Chamber
cannot create containment, read host credentials, select arbitrary providers,
or open an authority connection.

### Cell To Privileged Launcher

The unprivileged Cell and root-owned launcher communicate over a Unix socket.
The launcher verifies kernel-reported peer UID/GID
(`cadenza-cell/src/launcher_service.rs:823`) and accepts a closed signed request.
It launches a previously validated invocation with only the protocol and
custody descriptors inherited by the child
(`cadenza-cell/src/launcher_service.rs:216`).

The containment profile has no network, no capabilities, no new privileges, a
read-only content-addressed rootfs, namespace isolation, fixed environment
keys, and signed resource bounds (`cadenza-cell/src/containment.rs:22`). Source
isolation additionally forbids the authority-gateway artifact
(`cadenza-cell/src/containment.rs:256`).

### Cell To PostgreSQL

Cell receives purpose-separated database credentials through fixed inherited
descriptors and refuses root execution, duplicate descriptors, shared
principals, malformed credentials, and non-loopback/non-Unix-socket NoTLS
connections (`cadenza-cell/src/cell_host.rs:200` and
`cadenza-cell/src/cell_host.rs:1336`). Standard Cells must not receive
privileged authority credentials.

PostgreSQL roles are non-login, non-superuser, non-inheriting capability roles.
Schemas and functions are revoked from `PUBLIC`; each caller receives only the
required schema usage and function execution. Elevated functions lock
`search_path` to `pg_catalog`, qualify owned objects, validate exact JSON
shapes, and bind replay to immutable identity. Every migration is applied in a
transaction and recorded by checksum (`cadenza-environment/packages/environment-bootstrap/src/postgres/migrator.ts:24`).

### Cell To Cell

Peer transport uses TLS 1.3 mutual authentication with certificates pinned as
trust anchors and a second SPKI digest comparison against current authority
(`cadenza-cell/src/peer_transport.rs:1646`). TLS is necessary but insufficient:
signed envelopes also bind environment, source and target Cell generations,
session, attempt, route, image, deadline, and payload bounds. Current enrollment
and current ready generation are rechecked before affect
(`cadenza-cell/src/peer_transport.rs:1703`).

### Execution To Evidence

Language runtimes report bounded structural execution claims. Chamber validates
the image, invocation, trace, lane, profile, event, sequence, and disclosure
shape, then emits a commitment-only capture
(`cadenza-chamber/src/execution_evidence.rs:403`). Cell appends the normalized
record to a bounded, chained journal before issuing durable custody. Equal
replay returns the prior receipt; conflicting, absent, stale, or unverifiable
replay fails closed (`cadenza-cell/src/journal.rs:587`). Raw business context,
callable source, stack, endpoints, and credentials are forbidden evidence.

## Threat Register

| ID    | Scenario                                                                                       | Primary controls                                                                                                                                             | Residual risk                                                                    |
| ----- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| TM-01 | Authority record or operation is altered or replayed                                           | Canonical digests, immutable versions/evidence, exact operation schemas, expected revisions, idempotency conflict detection, role-owned functions            | Compromised authority owner or database superuser is outside this boundary       |
| TM-02 | Bootstrap trust root remains able to mutate an operational environment                         | Monotonic bootstrap states, handoff evidence, owner retirement, operational activation checks                                                                | Incorrect operator provisioning can invalidate the handoff claim                 |
| TM-03 | Callable source differs from approved definition                                               | Source digest, source-slice digest, image digest, artifact identity, version and policy authority                                                            | Approved malicious code remains malicious inside its sandbox                     |
| TM-04 | Callable escapes the JavaScript VM                                                             | VM context narrowing is defense in depth only; gVisor, no network, read-only rootfs, no capabilities, descriptor-only protocol                               | gVisor/host-kernel vulnerabilities and hardware side channels remain             |
| TM-05 | Adapter, Node, core, lock, Chamber, `runsc`, or rootfs is replaced                             | Content digests, manifest closure, symlink and undeclared-file rejection, signed containment measurement                                                     | Build/signing key compromise remains                                             |
| TM-06 | Unauthorized local process asks the launcher to run code                                       | Root-owned socket, `SO_PEERCRED` UID/GID check, signed nonce-bound request                                                                                   | Compromise of the authorized Cell OS account remains                             |
| TM-07 | Authorized request injects a command, mount, environment variable, path, or network mode       | Closed request schema, fixed `runsc` path/flags, measured OCI profile, content-addressed rootfs                                                              | A defect in launcher validation could widen the profile                          |
| TM-08 | Chamber obtains host or database credentials                                                   | Fixed descriptor custody in Cell, no credential-bearing Chamber messages, no ambient environment, source-isolated profile                                    | Business data deliberately passed in context is visible to that callable         |
| TM-09 | Narrow database role escalates through direct tables, broad grants, or `search_path` poisoning | NOLOGIN/NOINHERIT roles, revoke-first posture, execute-only functions, `pg_catalog` search path, hostile role tests                                          | Migration requires an exclusive trusted administrative session                   |
| TM-10 | Remote peer impersonates an enrolled Cell                                                      | TLS 1.3 mTLS, pinned certificate roots, SPKI digest, current enrollment, signed envelope                                                                     | Active peer private-key compromise remains until authority revocation propagates |
| TM-11 | Old peer request is replayed or arrives after authority changes                                | Nonces, attempt identity, expiry, session phase, generation, route epoch, projection revision, current-authority reread                                      | Clock integrity is an operator/host assumption                                   |
| TM-12 | Stale route, placement, residency, or actor assignment causes wrong affect                     | Generation and epoch fencing, route/residency grants, owner resolution, successor-first replacement                                                          | Temporary unavailability is preferred to ambiguous affect                        |
| TM-13 | Runtime forges evidence or exports sensitive context                                           | Chamber-owned validation/capture, forbidden-field rules, commitment-only evidence, Cell custody                                                              | Commitments prove equality/integrity, not semantic truth of hidden business data |
| TM-14 | Evidence is replayed, reordered, deleted too early, or fills storage                           | Per-source and custody chains, synchronized append, equal-replay receipts, historical lookup, acknowledgement checkpoints, terminal reserve, bounded journal | Prolonged ledger outage can stop new normal work by design                       |
| TM-15 | Workload exhausts CPU, memory, processes, frames, stderr, queues, or time                      | Signed cgroup limits, pids/memory/CPU limits, frame and stderr maxima, deadlines, cancellation, bounded journals and snapshots                               | Aggregate host admission control is still an operator responsibility             |
| TM-16 | Multiple stems or supply controllers create conflicting infrastructure effects                 | Leases, fencing epochs, serialized action authority, idempotent outcomes, current-revision checks                                                            | Database loss or incorrect external provider implementation can halt recovery    |
| TM-17 | Two Cells mutate one actor or an uncertain commit is repeated                                  | Assignment epochs, residency authority, per-key lanes, version-fenced idempotent commit, outcome resolution                                                  | Deliberate fail-closed pauses can increase latency during partitions             |
| TM-18 | Dependency or CI action changes without review                                                 | Lockfiles, frozen/locked installs, vulnerability audit, SBOMs, full-SHA GitHub Actions                                                                       | Registry or compiler compromise is not eliminated by locks alone                 |
| TM-19 | Secret or private material is published                                                        | Current-tree and history scanning, descriptor custody, evidence disclosure rules, publication gate                                                           | Automated detectors have false negatives and require human review                |
| TM-20 | An unsupported deployment is presented as secure                                               | Explicit deployment assumptions, measured Linux proof, known limitations, no stable/SLA claim                                                                | Operators can still bypass documented requirements                               |

## Fail-Closed Consequences

Security failures intentionally prefer denied or unavailable outcomes over
ambiguous affect. A stale revision, missing current authority, uncertain actor
commit, unavailable historical replay lookup, full evidence reserve, invalid
peer generation, or unverifiable artifact can stop work. Availability is not
allowed to silently weaken authority, evidence, or custody.

## Required Revalidation

Re-run this threat model when any of these change:

- a capability facade, PostgreSQL role, security-definer function, descriptor,
  launcher operation, containment profile, peer protocol, or evidence field;
- callable materialization or a language adapter;
- gVisor, Node, Rust, PostgreSQL, TLS, signing, or canonicalization dependencies;
- multi-tenant deployment assumptions;
- a new persistence adapter, meta slice, plugin, or managed control plane.

## Primary External References

- [Node.js VM documentation](https://nodejs.org/api/vm.html)
- [PostgreSQL guidance for safe `SECURITY DEFINER` functions](https://www.postgresql.org/docs/current/sql-createfunction.html)
- [GitHub secure Actions guidance](https://docs.github.com/en/code-security/tutorials/secure-your-organization/protect-against-threats)
- [gVisor security model](https://gvisor.dev/docs/architecture_guide/security/)
