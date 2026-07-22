#!/usr/bin/env node

import { cpSync, mkdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = fileURLToPath(new URL("..", import.meta.url));
const config = JSON.parse(
  readFileSync(resolve(workspaceRoot, "contracts.config.json"), "utf8"),
);

for (const [bundleName, bundle] of Object.entries(
  config.snapshot_bundles ?? {},
)) {
  const authority = resolve(
    workspaceRoot,
    bundle.authority_repo,
    bundle.authority_path,
  );
  for (const consumer of bundle.consumers) {
    const destination = resolve(workspaceRoot, consumer.repo, consumer.path);
    rmSync(destination, { recursive: true, force: true });
    if (statSync(authority).isFile()) {
      mkdirSync(dirname(destination), { recursive: true });
      cpSync(authority, destination);
    } else {
      mkdirSync(destination, { recursive: true });
      cpSync(authority, destination, { recursive: true });
    }
    process.stdout.write(
      `${bundleName}: synchronized ${consumer.repo}/${consumer.path}\n`,
    );
  }
}
