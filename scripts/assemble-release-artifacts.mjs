#!/usr/bin/env node

import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
} from "node:fs";
import { basename, resolve, sep } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { loadReleaseCandidate } from "./release-candidate.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const { candidate } = loadReleaseCandidate(root);
const outputArgument = argument("--output");
const stagingArgument = argument("--staging");
const workspaceArgument = argument("--workspace-repo");

if (!outputArgument)
  throw new Error("--output must identify the release artifact directory");
if (!stagingArgument)
  throw new Error("--staging must identify built package artifacts");
if (!workspaceArgument) {
  throw new Error(
    "--workspace-repo must identify the curated public workspace repository",
  );
}

const outputRoot = resolve(outputArgument);
const stagingRoot = resolve(stagingArgument);
const workspaceRoot = resolve(workspaceArgument);
if (outputRoot.startsWith(`${root}${sep}`)) {
  throw new Error(
    "release artifacts must be assembled outside the source workspace",
  );
}
if (!existsSync(stagingRoot))
  throw new Error(`package staging does not exist: ${stagingRoot}`);
if (!existsSync(workspaceRoot))
  throw new Error(`workspace repository does not exist: ${workspaceRoot}`);
if (existsSync(outputRoot) && readdirSync(outputRoot).length > 0) {
  throw new Error(`release artifact directory must be empty: ${outputRoot}`);
}

rmSync(outputRoot, { recursive: true, force: true });
for (const directory of ["source", "packages", "generated"]) {
  mkdirSync(resolve(outputRoot, directory), { recursive: true });
}

const assembledRepositories = candidate.repositories.filter(
  (repository) => (repository.release_action ?? "assemble") === "assemble",
);
for (const repository of assembledRepositories) {
  const repositoryRoot =
    repository.name === "cadenza-workspace"
      ? workspaceRoot
      : resolve(root, repository.path);
  assertClean(repository.name, repositoryRoot);
  const version = repository.display_version ?? repository.version;
  const archive = resolve(
    outputRoot,
    "source",
    `${repository.name}-${version}.tar.gz`,
  );
  run(
    "git",
    [
      "archive",
      "--format=tar.gz",
      `--prefix=${repository.name}-${version}/`,
      `--output=${archive}`,
      "HEAD",
    ],
    repositoryRoot,
  );
}

const packages = assembledRepositories.flatMap(packageArtifacts);
for (const filename of packages) {
  copyRequired(
    resolve(stagingRoot, filename),
    resolve(outputRoot, "packages", filename),
  );
}

const generated = [
  [
    "authority-gateway-v0.json",
    "cadenza-environment/packages/authority-gateway/artifact/authority-gateway-v0.json",
  ],
  [
    "typescript-chamber-adapter.json",
    "cadenza-chamber/adapters/typescript/artifact/adapter-artifact.json",
  ],
  [
    "reference-distributed-order-pricing-v1.json",
    "cadenza-reference-system/artifacts/distributed-order-pricing-v1.json",
  ],
];
for (const [filename, path] of generated) {
  copyRequired(resolve(root, path), resolve(outputRoot, "generated", filename));
}

process.stdout.write(
  `Assembled ${assembledRepositories.length} source archives, ${packages.length} packages, and ${generated.length} generated artifacts for ${candidate.release_key}.\n`,
);

function packageArtifacts(repository) {
  const version = repository.display_version ?? repository.version;
  switch (repository.package_role) {
    case "public_npm_package":
      return [`cadenza.io-core-${version}.tgz`];
    case "public_python_package":
      return [`cadenza_python-${repository.version}-py3-none-any.whl`];
    case "public_hex_package":
      return [`cadenza-${version}.tar`];
    case "public_nuget_package":
      return [`Cadenza.Core.${version}.nupkg`];
    case "public_source_private_assembly_packages":
      return [
        `cadenza.io-environment-authority-contracts-${version}.tgz`,
        `cadenza.io-authority-gateway-${version}.tgz`,
        `cadenza.io-environment-bootstrap-${version}.tgz`,
      ];
    case "public_rust_source_and_chamber_adapter":
      return [`cadenza-chamber-${version}.crate`];
    case "architecture_and_release_manifest":
    case "public_rust_source":
    case "public_source_private_proof_package":
      return [];
    default:
      throw new Error(
        `${repository.name}: unknown package role ${repository.package_role}`,
      );
  }
}

function assertClean(name, repositoryRoot) {
  const commit = run("git", ["rev-parse", "HEAD"], repositoryRoot).trim();
  if (!/^[a-f0-9]{40}$/u.test(commit))
    throw new Error(`${name}: missing exact commit`);
  const status = run(
    "git",
    ["status", "--porcelain=v1", "--untracked-files=all"],
    repositoryRoot,
  );
  if (status.length > 0)
    throw new Error(`${name}: source repository is not clean`);
}

function copyRequired(source, target) {
  if (!existsSync(source))
    throw new Error(`required release input is missing: ${basename(source)}`);
  cpSync(source, target);
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(" ")} failed in ${cwd}: ${result.stderr.trim()}`,
    );
  }
  return result.stdout;
}

function argument(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}
