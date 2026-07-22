# Supported Security Deployment Assumptions V1

Date: 2026-07-22

## Scope

These assumptions define where the distributed-foundation security claims
apply. A system may run outside them for development, but it must not present
that execution as the reviewed production security profile.

## Required Production Assumptions

1. Chamber workloads run on a supported Linux host through the exact measured
   gVisor `runsc` binary and a content-addressed read-only rootfs.
2. The root-owned launcher binary, configuration, socket, nonce ledger, systemd
   units, `runsc`, rootfs store, and signing material are owned and writable only
   by their documented administrative identities.
3. The ordinary Cell host runs unprivileged and never as root. Cell, launcher,
   activation issuer, supply supervisor, and PostgreSQL principals remain
   separate identities with only their documented permissions.
4. Only fixed inherited descriptors carry configuration, keys, credentials,
   listener/control channels, journal custody, launcher access, and activation
   issuer access. No secret is passed through command arguments or ordinary
   environment variables.
5. PostgreSQL migrations run through one exclusive trusted administrative
   session. No untrusted role can connect before the complete migration set and
   revoke/grant posture commit successfully.
6. Purpose-separated database credentials map to distinct PostgreSQL principals.
   Cell's current NoTLS database adapter is restricted to a local Unix socket or
   loopback host; remote NoTLS transport is unsupported.
7. Cell-to-Cell paths use TLS 1.3 with enrolled Ed25519 identities. Host clocks
   are synchronized well enough for signed validity windows and lease deadlines.
8. Host cgroups, filesystems, descriptor limits, disk quotas, network policy,
   kernel hardening, firmware, and monitoring remain operational. gVisor is not
   treated as aggregate resource scheduling or network policy.
9. Different mutually hostile tenants do not share one Chamber sandbox. A
   sandbox exposes everything deliberately mounted or passed into it.
10. Signing keys, transport keys, evidence keys, activation issuer keys,
    PostgreSQL credentials, and administrative credentials are generated with
    appropriate entropy, stored outside source control, monitored, and revoked
    when compromise is suspected.
11. Release artifacts and action commits match the reviewed release manifest and
    checksums. Dependencies install from committed locks with lifecycle scripts
    disabled where the repository validation procedure specifies that posture.
12. Operators preserve evidence and failure records. They do not delete, edit,
    or bypass a failed authority, custody, containment, or recovery transition
    to force progress.

## Development Profiles

- macOS and non-gVisor Linux may exercise core, contract, adapter, protocol, and
  simulated runtime behavior. They do not prove host containment.
- A development host that starts Chamber directly must reject privileged
  activation and is suitable only for non-security integration work.
- Test certificates, fixture credentials, generated temporary clusters, and
  in-memory providers are test evidence only and must never be reused in a
  deployment.

## External Boundary Assumptions

Cadenza does not currently own:

- cloud account/IAM configuration;
- internet ingress, load balancers, WAF, DDoS controls, or service mesh policy;
- host image and kernel patch automation;
- hardware side-channel mitigation;
- secret-manager implementation and automated rotation;
- PostgreSQL backup encryption, geographic replication, or disaster-recovery
  infrastructure;
- third-party provider security.

Adapters for these concerns must preserve Cadenza's narrowing and evidence
contracts but are not implied by the current release candidate.

## Verification

The final release proof must record exact OS, architecture, kernel, `runsc`,
Rust, Node, PostgreSQL, database schema, artifact, and contract versions. It
must demonstrate startup, containment, distributed execution, failure,
recovery, drain, shutdown, and cleanup against those same inputs.
