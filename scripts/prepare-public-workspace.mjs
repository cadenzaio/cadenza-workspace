#!/usr/bin/env node

import {
  chmodSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, relative, resolve, sep } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const allowlist = JSON.parse(
  readFileSync(
    resolve(root, "release/public-workspace-allowlist.json"),
    "utf8",
  ),
);
const arguments_ = process.argv.slice(2);
const checkOnly = arguments_.includes("--check");
const outputArgument = arguments_.find(
  (argument) => !argument.startsWith("--"),
);
if (!checkOnly && !outputArgument) {
  throw new Error("an output directory is required unless --check is used");
}
const temporary = checkOnly;
const outputRoot = temporary
  ? mkdtempSync(resolve(tmpdir(), "cadenza-public-workspace-"))
  : resolve(outputArgument);

try {
  if (!temporary) {
    if (outputRoot === root || outputRoot.startsWith(`${root}${sep}`)) {
      throw new Error(
        "public workspace output must be outside the private workspace",
      );
    }
    rmSync(outputRoot, { recursive: true, force: true });
    mkdirSync(outputRoot, { recursive: true });
  }

  const matchers = allowlist.include.map(globMatcher);
  const files = collectFiles(root).filter((path) => {
    const relativePath = toRelative(path);
    return (
      matchers.some((matcher) => matcher.test(relativePath)) &&
      !allowlist.forbidden_path_fragments.some((fragment) =>
        relativePath.includes(fragment),
      )
    );
  });
  for (const source of files) {
    const relativePath = toRelative(source);
    const destination = resolve(outputRoot, relativePath);
    mkdirSync(dirname(destination), { recursive: true });
    const content = readFileSync(source);
    writeFileSync(
      destination,
      isText(relativePath)
        ? publicProjection(content.toString("utf8"))
        : content,
    );
    chmodSync(destination, statSync(source).mode);
  }

  const validation = spawnSync(
    process.execPath,
    [resolve(root, "scripts/validate-public-workspace.mjs"), outputRoot],
    { encoding: "utf8" },
  );
  if (validation.status !== 0) {
    process.stderr.write(validation.stderr);
    process.exit(validation.status ?? 1);
  }
  process.stdout.write(validation.stdout);
  process.stdout.write(
    checkOnly
      ? `Curated workspace export check passed (${files.length} files).\n`
      : `Curated workspace exported to ${outputRoot} (${files.length} files).\n`,
  );
} finally {
  if (temporary) rmSync(outputRoot, { recursive: true, force: true });
}

function collectFiles(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name))
    .flatMap((entry) => {
      const path = resolve(directory, entry.name);
      const relativePath = toRelative(path);
      if (entry.isDirectory()) {
        if (shouldPrune(relativePath)) return [];
        return collectFiles(path);
      }
      return entry.isFile() ? [path] : [];
    });
}

function shouldPrune(path) {
  const first = path.split("/")[0];
  return (
    first === ".git" ||
    first === ".release-sync-worktrees" ||
    first === "node_modules" ||
    first === "cadenza" ||
    first.startsWith("cadenza-")
  );
}

function toRelative(path) {
  return relative(root, path).split(sep).join("/");
}

function globMatcher(pattern) {
  const expression = pattern
    .replace(/[.+^${}()|[\]\\]/gu, "\\$&")
    .replaceAll("**", "\u0000")
    .replaceAll("*", "[^/]*")
    .replaceAll("\u0000", ".*");
  return new RegExp(`^${expression}$`, "u");
}

function isText(path) {
  return !/\.(png|jpg|jpeg|gif|pdf|wasm)$/iu.test(path);
}

function publicProjection(content) {
  return content
    .replaceAll(
      "https://github.com/cadenzaio/cadenza-workspace/blob/main/",
      "https://github.com/cadenzaio/cadenza-workspace/blob/main/",
    )
    .replaceAll(
      "https://github.com/cadenzaio/cadenza-workspace",
      "https://github.com/cadenzaio/cadenza-workspace",
    )
    .replaceAll("dotnet", "dotnet")
    .replaceAll(
      "coherent_creation_master_document_final.docx (private source retained by the project owner)",
      "coherent_creation_master_document_final.docx (private source retained by the project owner)",
    )
    .replaceAll("<absolute-user-path>", "<absolute-user-path>")
    .replaceAll("<local-user-path>", "<local-user-path>");
}
