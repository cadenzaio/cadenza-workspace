#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = fileURLToPath(new URL("..", import.meta.url));
const config = JSON.parse(
  readFileSync(resolve(workspaceRoot, "contracts.config.json"), "utf8"),
);
const failures = [];

for (const [bundleName, bundle] of Object.entries(
  config.snapshot_bundles ?? {},
)) {
  const authority = resolve(
    workspaceRoot,
    bundle.authority_repo,
    bundle.authority_path,
  );
  if (!existsSync(authority)) {
    failures.push(`${bundleName}: authority snapshot is missing: ${authority}`);
    continue;
  }
  const expected = snapshot(authority);
  for (const consumer of bundle.consumers) {
    const destination = resolve(workspaceRoot, consumer.repo, consumer.path);
    if (!existsSync(destination)) {
      failures.push(
        `${bundleName}: consumer snapshot is missing: ${consumer.repo}/${consumer.path}`,
      );
      continue;
    }
    const actual = snapshot(destination);
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      failures.push(
        `${bundleName}: ${consumer.repo}/${consumer.path} differs from ${bundle.authority_repo}/${bundle.authority_path}`,
      );
    }
  }
}

if (failures.length > 0) {
  for (const failure of failures) process.stderr.write(`${failure}\n`);
  process.exit(1);
}

process.stdout.write(
  `Contract snapshots match across ${Object.keys(config.snapshot_bundles ?? {}).length} bundles.\n`,
);

function snapshot(target) {
  if (statSync(target).isFile()) {
    return [{
      path: "",
      sha256: createHash("sha256").update(readFileSync(target)).digest("hex"),
    }];
  }
  return collectFiles(target).map((file) => ({
    path: relative(target, file).split(sep).join("/"),
    sha256: createHash("sha256").update(readFileSync(file)).digest("hex"),
  }));
}

function collectFiles(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name))
    .flatMap((entry) => {
      const path = resolve(directory, entry.name);
      return entry.isDirectory() ? collectFiles(path) : entry.isFile() ? [path] : [];
    });
}
