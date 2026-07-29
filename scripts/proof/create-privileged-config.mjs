#!/usr/bin/env node

import { randomBytes } from "node:crypto";
import { chmodSync, writeFileSync } from "node:fs";

const [output, socketDirectory, port, rootfs, referenceArtifact, timeout] =
  process.argv.slice(2);
if (
  !output ||
  !socketDirectory ||
  !/^[0-9]+$/u.test(port ?? "") ||
  !rootfs ||
  !referenceArtifact ||
  !/^[0-9]+$/u.test(timeout ?? "")
) {
  throw new Error(
    "usage: create-privileged-config.mjs OUTPUT SOCKET PORT ROOTFS REFERENCE_ARTIFACT TIMEOUT",
  );
}

const roles = {
  runtime: "cadenza_runtime_proof",
  convergence: "cadenza_convergence_proof",
  observation: "cadenza_observation_proof",
  issuer: "cadenza_issuer_proof",
  ledger: "cadenza_ledger_proof",
  authority_gateway: "cadenza_authority_gateway_proof",
  reconciliation: "cadenza_reconciliation_proof",
  stem_recovery: "cadenza_stem_recovery_proof",
};
const passwords = Object.fromEntries(
  Object.keys(roles).map((key) => [key, randomBytes(32).toString("hex")]),
);
const host = encodeURIComponent(socketDirectory);
const roleUrl = (key) =>
  `postgresql://${roles[key]}:${passwords[key]}@127.0.0.1:${port}/postgres`;

const config = {
  CADENZA_GVISOR_ROOTFS_STAGING: rootfs,
  CADENZA_REFERENCE_ORDER_PRICING_ARTIFACT: referenceArtifact,
  CADENZA_PROOF_CONVERGENCE_TIMEOUT_SECONDS: timeout,
  CADENZA_TWO_CELL_ADMIN_DATABASE_URL: `postgresql://postgres@/postgres?host=${host}&port=${port}`,
  CADENZA_TWO_CELL_RUNTIME_DATABASE_URL: roleUrl("runtime"),
  CADENZA_TWO_CELL_RUNTIME_ROLE: roles.runtime,
  CADENZA_TWO_CELL_RUNTIME_PASSWORD: passwords.runtime,
  CADENZA_TWO_CELL_CONVERGENCE_DATABASE_URL: roleUrl("convergence"),
  CADENZA_TWO_CELL_CONVERGENCE_ROLE: roles.convergence,
  CADENZA_TWO_CELL_CONVERGENCE_PASSWORD: passwords.convergence,
  CADENZA_TWO_CELL_OBSERVATION_DATABASE_URL: roleUrl("observation"),
  CADENZA_TWO_CELL_OBSERVATION_ROLE: roles.observation,
  CADENZA_TWO_CELL_OBSERVATION_PASSWORD: passwords.observation,
  CADENZA_TWO_CELL_ISSUER_DATABASE_URL: roleUrl("issuer"),
  CADENZA_TWO_CELL_ISSUER_ROLE: roles.issuer,
  CADENZA_TWO_CELL_ISSUER_PASSWORD: passwords.issuer,
  CADENZA_TWO_CELL_LEDGER_DATABASE_URL: roleUrl("ledger"),
  CADENZA_TWO_CELL_LEDGER_ROLE: roles.ledger,
  CADENZA_TWO_CELL_LEDGER_PASSWORD: passwords.ledger,
  CADENZA_TWO_CELL_AUTHORITY_GATEWAY_DATABASE_URL: roleUrl("authority_gateway"),
  CADENZA_TWO_CELL_AUTHORITY_GATEWAY_ROLE: roles.authority_gateway,
  CADENZA_TWO_CELL_AUTHORITY_GATEWAY_PASSWORD: passwords.authority_gateway,
  CADENZA_TWO_CELL_RECONCILIATION_DATABASE_URL: roleUrl("reconciliation"),
  CADENZA_TWO_CELL_RECONCILIATION_ROLE: roles.reconciliation,
  CADENZA_TWO_CELL_RECONCILIATION_PASSWORD: passwords.reconciliation,
  CADENZA_TWO_CELL_STEM_RECOVERY_DATABASE_URL: roleUrl("stem_recovery"),
  CADENZA_TWO_CELL_STEM_RECOVERY_ROLE: roles.stem_recovery,
  CADENZA_TWO_CELL_STEM_RECOVERY_PASSWORD: passwords.stem_recovery,
  CADENZA_TWO_CELL_ACTOR_ASSIGNMENT_PASSWORD: randomBytes(32).toString("hex"),
  CADENZA_TWO_CELL_ACTOR_HYDRATION_PASSWORD: randomBytes(32).toString("hex"),
  CADENZA_TWO_CELL_ACTOR_COMMIT_PASSWORD: randomBytes(32).toString("hex"),
  CADENZA_TWO_CELL_ACTOR_OUTCOME_PASSWORD: randomBytes(32).toString("hex"),
  CADENZA_TWO_CELL_SUPPLY_PROVIDER_PASSWORD: randomBytes(32).toString("hex"),
  CADENZA_TWO_CELL_SUPPLY_LIFECYCLE_PASSWORD: randomBytes(32).toString("hex"),
};

writeFileSync(output, `${JSON.stringify(config, null, 2)}\n`, {
  encoding: "utf8",
  mode: 0o600,
});
chmodSync(output, 0o600);
