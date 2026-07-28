#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const [output, inputPath, manifestPath, resultsPath] = process.argv.slice(2);
if (!output || !inputPath || !manifestPath || !resultsPath) {
  throw new Error(
    "usage: write-privileged-report.mjs OUTPUT INPUT MANIFEST RESULTS",
  );
}

const input = JSON.parse(readFileSync(inputPath, "utf8"));
const manifestBytes = readFileSync(manifestPath);
const manifest = JSON.parse(manifestBytes);
const results = readFileSync(resultsPath, "utf8")
  .trim()
  .split("\n")
  .filter(Boolean)
  .map((line) => {
    const [scenario, status, duration] = line.split("\t");
    return { scenario, status, duration_ms: Number(duration) };
  });
const failure =
  process.env.PROOF_STATUS === "failed"
    ? {
        phase: process.env.PROOF_FAILURE_PHASE,
        line: Number(process.env.PROOF_FAILURE_LINE),
        exit_code: Number(process.env.PROOF_FAILURE_EXIT_CODE),
      }
    : null;

const report = {
  contract: "cadenza.proof-report",
  version: "1",
  tier: "privileged",
  profile: input.profile,
  status: process.env.PROOF_STATUS,
  proof_id: input.proof_id,
  started_at: process.env.PROOF_STARTED_AT,
  completed_at: new Date().toISOString(),
  duration_ms: Number(process.env.PROOF_DURATION_MS),
  manifest_digest: `sha256:${createHash("sha256").update(manifestBytes).digest("hex")}`,
  source: input.source,
  substrate: {
    kernel: process.env.PROOF_KERNEL,
    architecture: process.env.PROOF_ARCHITECTURE,
    node: process.env.PROOF_NODE,
    rust: process.env.PROOF_RUST,
    postgresql: process.env.PROOF_POSTGRESQL,
    runsc_digest: process.env.PROOF_RUNSC_DIGEST,
    cgroup_driver: "systemd_v2",
  },
  runtime_inputs: {
    rootfs_digest: process.env.PROOF_ROOTFS_DIGEST || null,
    chamber_digest: process.env.PROOF_CHAMBER_DIGEST || null,
    node_digest: process.env.PROOF_NODE_DIGEST || null,
    core_digest: process.env.PROOF_CORE_DIGEST || null,
    adapter_manifest_digest: process.env.PROOF_ADAPTER_MANIFEST_DIGEST || null,
    adapter_lock_digest: process.env.PROOF_ADAPTER_LOCK_DIGEST || null,
    reference_artifact_digest:
      process.env.PROOF_REFERENCE_ARTIFACT_DIGEST || null,
  },
  authority: {
    postgres_clusters: results.length,
    isolation: "fresh_cluster_per_scenario",
    fixture_credentials: "generated_ephemeral_file",
    fixture_credentials_retained: false,
  },
  results,
  failure,
  cleanup: JSON.parse(process.env.PROOF_CLEANUP),
  claims: [
    "fresh authority genesis and migration",
    "exact Cell/Chamber protocol compatibility before long execution",
    "distributed reference execution across two Cells",
    "two-member sender-side replica selection",
    "supply authority outage and provider-generation replacement",
    "post-restart execution and scale-down",
    ...(input.profile === "hardening"
      ? [
          "stem loss, successor takeover, stale mount rejection, and fresh capacity resupply",
        ]
      : []),
    "bounded process, container, bundle, socket, cgroup, rootfs, authority, and credential cleanup",
  ],
  limits: [
    "host root and Linux substrate remain trusted",
    "gVisor is measured containment rather than hardware attestation",
    "the proof is representative rather than combinatorially exhaustive",
  ],
  declared_timeouts: {
    convergence_seconds: manifest.tiers.privileged.convergence_timeout_seconds,
    scenario_unit_seconds:
      manifest.tiers.privileged.scenario_unit_timeout_seconds,
  },
};

mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
