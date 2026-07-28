#!/usr/bin/env node

import { createHash, randomBytes } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const manifestPath = resolve(root, "proof/manifest.json");
const manifestBytes = readFileSync(manifestPath);
const manifest = JSON.parse(manifestBytes);
const tierName = process.argv[2];
const tier = manifest.tiers[tierName];
const hardeningRequested = process.argv.includes("--hardening");
if (!tier) {
  fail(
    "usage: node scripts/run-proof.mjs <fast|complete|privileged> [options]",
  );
}
if (hardeningRequested && tierName !== "privileged") {
  fail("--hardening is available only for the privileged proof tier");
}

const requestedOutput = argument("--output");
const output = resolve(
  requestedOutput ??
    resolve(tmpdir(), `cadenza-${tierName}-proof-${Date.now()}.json`),
);
if (isInsideWorkspace(output)) {
  fail("proof evidence must be written outside the source workspace");
}

if (tierName === "privileged") {
  runPrivileged();
} else {
  runCommandTier();
}

function runCommandTier() {
  const started = Date.now();
  const results = [];
  for (const step of tier.commands) {
    process.stderr.write(`\n[${tierName}] ${step.label}\n`);
    const stepStarted = Date.now();
    const args = step.args.map((value) =>
      value.replaceAll("{workspace}", root),
    );
    const result = spawnSync(step.command, args, {
      cwd: resolve(root, step.cwd),
      env: { ...process.env, ...step.env },
      encoding: "utf8",
      stdio: "inherit",
    });
    const record = {
      label: step.label,
      cwd: step.cwd,
      command: [step.command, ...step.args],
      duration_ms: Date.now() - stepStarted,
      status: result.status,
    };
    results.push(record);
    if (result.status !== 0) {
      writeReport({
        status: "failed",
        started,
        results,
        source: sourceIdentities(tier.source_repositories),
      });
      process.exit(result.status ?? 1);
    }
  }
  writeReport({
    status: "passed",
    started,
    results,
    source: sourceIdentities(tier.source_repositories),
  });
}

function runPrivileged() {
  const lima = argument("--lima");
  if (!lima || !/^[a-zA-Z0-9._-]+$/u.test(lima)) {
    fail("privileged proof requires --lima NAME");
  }
  const source = sourceIdentities(tier.source_repositories, true);
  const temporary = mkdtempSync(resolve(tmpdir(), "cadenza-proof-input-"));
  const assembled = resolve(temporary, "workspace");
  const archive = resolve(temporary, "input.tar.gz");
  const proofId = `proof-${Date.now()}-${randomBytes(4).toString("hex")}`;
  const remote = `/home/emilforsvall.guest/.local/state/cadenza-proof/${proofId}`;
  const remoteArchive = `/tmp/${proofId}.tar.gz`;
  const started = Date.now();
  let status = 1;
  try {
    mkdirSync(assembled, { recursive: true });
    for (const repository of tier.source_repositories) {
      const destination =
        repository === "." ? assembled : resolve(assembled, repository);
      mkdirSync(destination, { recursive: true });
      const tar = spawnSync("git", ["archive", "--format=tar", "HEAD"], {
        cwd: resolve(root, repository),
        stdio: ["ignore", "pipe", "inherit"],
        maxBuffer: 256 * 1024 * 1024,
      });
      if (tar.status !== 0) throw new Error(`cannot archive ${repository}`);
      const extract = spawnSync("tar", ["-xf", "-", "-C", destination], {
        input: tar.stdout,
        stdio: ["pipe", "inherit", "inherit"],
      });
      if (extract.status !== 0) throw new Error(`cannot stage ${repository}`);
    }
    writeFileSync(
      resolve(assembled, "proof-input.json"),
      `${JSON.stringify(
        {
          proof_id: proofId,
          profile: hardeningRequested ? "hardening" : "ordinary",
          source,
        },
        null,
        2,
      )}\n`,
    );
    run("tar", ["--no-xattrs", "-czf", archive, "-C", assembled, "."], root);
    run("limactl", ["copy", archive, `${lima}:${remoteArchive}`], root);
    run(
      "limactl",
      [
        "shell",
        lima,
        "--",
        "bash",
        "-lc",
        `set -e; mkdir -p '${remote}'; tar -xzf '${remoteArchive}' -C '${remote}'; rm -f '${remoteArchive}'`,
      ],
      root,
    );
    const proof = spawnSync(
      "limactl",
      [
        "shell",
        lima,
        "--",
        "sudo",
        "bash",
        `${remote}/scripts/proof/privileged-linux.sh`,
        remote,
      ],
      { cwd: root, encoding: "utf8", stdio: "inherit" },
    );
    status = proof.status ?? 1;
    if (existsRemote(lima, `${remote}/evidence/report.json`)) {
      mkdirSync(dirname(output), { recursive: true });
      run(
        "limactl",
        ["copy", `${lima}:${remote}/evidence/report.json`, output],
        root,
      );
    }
  } catch (error) {
    process.stderr.write(
      `${error instanceof Error ? error.message : String(error)}\n`,
    );
  } finally {
    spawnSync(
      "limactl",
      ["shell", lima, "--", "sudo", "rm", "-rf", remote, remoteArchive],
      { cwd: root, stdio: "ignore" },
    );
    rmSync(temporary, { recursive: true, force: true });
  }
  if (!existsSync(output)) {
    writeReport({ status: "failed", started, results: [], source });
  }
  process.stderr.write(`Proof evidence: ${output}\n`);
  process.exit(status);
}

function sourceIdentities(paths, requireClean = false) {
  const unique = [...new Set(paths)];
  return unique.map((path) => {
    const cwd = resolve(root, path);
    const commit = capture("git", ["rev-parse", "HEAD"], cwd).trim();
    const status = capture(
      "git",
      ["status", "--porcelain=v1", "--untracked-files=all"],
      cwd,
    );
    if (requireClean && status.length > 0) {
      fail(`privileged proof requires a clean repository: ${path}`);
    }
    return { path, commit, worktree: status.length === 0 ? "clean" : "dirty" };
  });
}

function writeReport({ status, started, results, source }) {
  const report = {
    contract: "cadenza.proof-report",
    version: "1",
    tier: tierName,
    status,
    started_at: new Date(started).toISOString(),
    completed_at: new Date().toISOString(),
    duration_ms: Date.now() - started,
    manifest_digest: `sha256:${createHash("sha256").update(manifestBytes).digest("hex")}`,
    source,
    results,
  };
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
  process.stderr.write(`Proof evidence: ${output}\n`);
}

function existsRemote(lima, path) {
  return (
    spawnSync("limactl", ["shell", lima, "--", "sudo", "test", "-f", path], {
      cwd: root,
      stdio: "ignore",
    }).status === 0
  );
}

function capture(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: "utf8" });
  if (result.status !== 0) {
    fail(`${command} ${args.join(" ")} failed in ${cwd}`);
  }
  return result.stdout;
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    env: { ...process.env, COPYFILE_DISABLE: "1" },
    stdio: "inherit",
  });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed`);
  }
}

function argument(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

function isInsideWorkspace(path) {
  return path === root || path.startsWith(`${root}/`);
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
