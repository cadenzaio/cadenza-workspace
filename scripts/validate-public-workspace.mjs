#!/usr/bin/env node

import { readFileSync, readdirSync } from "node:fs";
import { relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const sourceRoot = fileURLToPath(new URL("..", import.meta.url));
const exportRoot = resolve(process.argv[2] ?? sourceRoot);
const allowlist = JSON.parse(
  readFileSync(
    resolve(sourceRoot, "release/public-workspace-allowlist.json"),
    "utf8",
  ),
);
const matchers = allowlist.include.map(globMatcher);
const failures = [];
const files = collectFiles(exportRoot);

for (const file of files) {
  const path = toRelative(file);
  if (!matchers.some((matcher) => matcher.test(path))) {
    failures.push(`path is outside the public allowlist: ${path}`);
  }
  for (const fragment of allowlist.forbidden_path_fragments) {
    if (path.includes(fragment))
      failures.push(`forbidden path fragment ${fragment}: ${path}`);
  }
  if (isText(file) && path !== "release/public-workspace-allowlist.json") {
    const content = readFileSync(file, "utf8");
    for (const fragment of allowlist.forbidden_content) {
      if (content.includes(fragment)) {
        failures.push(`forbidden content ${JSON.stringify(fragment)}: ${path}`);
      }
    }
  }
}

for (const required of [
  "README.md",
  "AGENTS.md",
  "LICENSE",
  "contracts.config.json",
  "release/candidate.json",
  "release/public-documentation-authority.json",
  "docs/architecture.md",
  "docs/architecture/atlas/README.md",
  "docs/security/cadenza-security-model-v1.md",
  "scripts/validate-release-candidate.mjs",
]) {
  if (!files.some((file) => toRelative(file) === required)) {
    failures.push(`public export is missing required file: ${required}`);
  }
}

if (failures.length > 0) {
  for (const failure of failures) process.stderr.write(`${failure}\n`);
  process.exit(1);
}

process.stdout.write(
  `Public workspace validated: ${files.length} allowlisted files.\n`,
);

function collectFiles(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name))
    .flatMap((entry) => {
      const path = resolve(directory, entry.name);
      if (entry.isSymbolicLink()) {
        failures.push(`symbolic links are not permitted: ${toRelative(path)}`);
        return [];
      }
      return entry.isDirectory()
        ? collectFiles(path)
        : entry.isFile()
          ? [path]
          : [];
    });
}

function isText(path) {
  return !/\.(png|jpg|jpeg|gif|pdf|wasm)$/iu.test(path);
}

function toRelative(path) {
  return relative(exportRoot, path).split(sep).join("/");
}

function globMatcher(pattern) {
  const expression = pattern
    .replace(/[.+^${}()|[\]\\]/gu, "\\$&")
    .replaceAll("**", "\u0000")
    .replaceAll("*", "[^/]*")
    .replaceAll("\u0000", ".*");
  return new RegExp(`^${expression}$`, "u");
}
