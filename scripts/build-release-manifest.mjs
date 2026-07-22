#!/usr/bin/env node

import { createHash } from "node:crypto";
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { relative, resolve, sep } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const candidateBytes = readFileSync(resolve(root, "release/candidate.json"));
const candidate = JSON.parse(candidateBytes);
const outputPath = argument("--output");
const artifactArgument = argument("--artifacts");
const workspaceRepositoryArgument = argument("--workspace-repo");

if (!outputPath)
  throw new Error("--output must identify the manifest artifact path");
if (!artifactArgument)
  throw new Error("--artifacts must identify the artifact directory");
if (!workspaceRepositoryArgument) {
  throw new Error(
    "--workspace-repo must identify the curated public workspace repository",
  );
}
const artifactRoot = resolve(artifactArgument);
const workspaceRepositoryRoot = resolve(workspaceRepositoryArgument);
if (!existsSync(artifactRoot))
  throw new Error(`artifact root does not exist: ${artifactRoot}`);
if (!existsSync(workspaceRepositoryRoot)) {
  throw new Error(
    `curated workspace repository does not exist: ${workspaceRepositoryRoot}`,
  );
}
if (resolve(outputPath).startsWith(`${root}${sep}`)) {
  throw new Error(
    "the frozen manifest must be emitted outside the source commit it identifies",
  );
}

const repositories = candidate.repositories.map((repository) => {
  const repositoryRoot =
    repository.name === "cadenza-workspace"
      ? workspaceRepositoryRoot
      : resolve(root, repository.path);
  const commit = git(repositoryRoot, ["rev-parse", "HEAD"]).trim();
  if (!/^[a-f0-9]{40}$/u.test(commit)) {
    throw new Error(`${repository.name}: no exact source commit is available`);
  }
  const dirty = git(repositoryRoot, [
    "status",
    "--porcelain=v1",
    "--untracked-files=all",
  ]);
  if (dirty.length > 0) {
    throw new Error(
      `${repository.name}: source tree is not clean and cannot be frozen`,
    );
  }
  return {
    name: repository.name,
    version: repository.display_version ?? repository.version,
    tag: repository.tag,
    commit,
    source_tree_digest: digestTrackedTree(repositoryRoot),
    history: repository.history,
    package_role: repository.package_role,
  };
});

const contracts = JSON.parse(
  readFileSync(resolve(root, "contracts.config.json"), "utf8"),
);
const contractBundles = Object.fromEntries(
  Object.entries(contracts.snapshot_bundles)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([name, bundle]) => [
      name,
      digestPath(resolve(root, bundle.authority_repo, bundle.authority_path)),
    ]),
);

const generatedArtifacts = Object.fromEntries(
  [
    [
      "authority_gateway",
      "cadenza-environment/packages/authority-gateway/artifact/authority-gateway-v0.json",
    ],
    [
      "typescript_chamber_adapter",
      "cadenza-chamber/adapters/typescript/artifact/adapter-artifact.json",
    ],
    [
      "reference_distributed_pricing",
      "cadenza-reference-system/artifacts/distributed-order-pricing-v1.json",
    ],
  ].map(([name, path]) => [name, digestPath(resolve(root, path))]),
);

const releaseArtifacts = collectFiles(artifactRoot).map((path) => ({
  path: relative(artifactRoot, path).split(sep).join("/"),
  bytes: statSync(path).size,
  sha256: digest(readFileSync(path)),
}));

const manifest = {
  schema_version: 1,
  release_key: candidate.release_key,
  release_date: candidate.release_date,
  candidate_digest: digest(candidateBytes),
  repositories,
  toolchains: candidate.toolchains,
  compatibility: candidate.compatibility,
  contract_bundles: contractBundles,
  generated_artifacts: generatedArtifacts,
  release_artifacts: releaseArtifacts,
  registry_publication: false,
};

writeFileSync(resolve(outputPath), `${JSON.stringify(manifest, null, 2)}\n`);
process.stdout.write(
  `Frozen release manifest written for ${repositories.length} repositories and ${releaseArtifacts.length} artifacts.\n`,
);

function argument(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

function git(cwd, args) {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(
      `git ${args.join(" ")} failed in ${cwd}: ${result.stderr.trim()}`,
    );
  }
  return result.stdout;
}

function digestTrackedTree(repositoryRoot) {
  const paths = git(repositoryRoot, ["ls-files", "-z"])
    .split("\0")
    .filter(Boolean)
    .sort();
  const hash = createHash("sha256");
  for (const path of paths) {
    hash.update(path);
    hash.update("\0");
    hash.update(readFileSync(resolve(repositoryRoot, path)));
    hash.update("\0");
  }
  return `sha256:${hash.digest("hex")}`;
}

function digestPath(path) {
  if (!existsSync(path)) throw new Error(`release input is missing: ${path}`);
  if (statSync(path).isFile()) return digest(readFileSync(path));
  const hash = createHash("sha256");
  for (const file of collectFiles(path)) {
    hash.update(relative(path, file).split(sep).join("/"));
    hash.update("\0");
    hash.update(readFileSync(file));
    hash.update("\0");
  }
  return `sha256:${hash.digest("hex")}`;
}

function digest(bytes) {
  return `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
}

function collectFiles(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name))
    .flatMap((entry) => {
      const path = resolve(directory, entry.name);
      return entry.isDirectory()
        ? collectFiles(path)
        : entry.isFile()
          ? [path]
          : [];
    });
}
