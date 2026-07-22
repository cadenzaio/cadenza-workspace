#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const candidateBytes = readFileSync(resolve(root, "release/candidate.json"));
const candidate = JSON.parse(candidateBytes);
const requiredChecks = readJson("release/required-checks.json");
const failures = [];
const governanceFiles = [
  "LICENSE",
  "CODE_OF_CONDUCT.md",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "SUPPORT.md",
  "RELEASE.md",
  "CHANGELOG.md",
  ".github/CODEOWNERS",
  ".github/PULL_REQUEST_TEMPLATE.md",
  ".github/ISSUE_TEMPLATE/bug_report.yml",
  ".github/ISSUE_TEMPLATE/feature_request.yml",
  ".github/ISSUE_TEMPLATE/config.yml",
  ".github/workflows/ci.yml",
];

if (candidate.schema_version !== 1) fail("candidate schema_version must be 1");
if (candidate.registry_publication !== false) {
  fail("registry publication must remain false before its separate gate");
}
if (candidate.repositories.length !== 9) {
  fail("candidate must declare exactly nine public repositories");
}

const names = new Set();
const paths = new Set();
const canonicalLicense = read("cadenza/LICENSE");
for (const repository of candidate.repositories) {
  if (names.has(repository.name))
    fail(`duplicate repository name: ${repository.name}`);
  if (paths.has(repository.path))
    fail(`duplicate repository path: ${repository.path}`);
  names.add(repository.name);
  paths.add(repository.path);

  const repositoryRoot = resolve(root, repository.path);
  if (!existsSync(repositoryRoot)) {
    fail(`${repository.name}: repository path does not exist`);
    continue;
  }

  for (const path of governanceFiles) {
    requireFile(repository, path);
  }
  const licensePath = resolve(repositoryRoot, "LICENSE");
  if (
    existsSync(licensePath) &&
    readFileSync(licensePath, "utf8") !== canonicalLicense
  ) {
    fail(
      `${repository.name}: LICENSE differs from the canonical Apache-2.0 text`,
    );
  }

  const security = readOptional(repository, "SECURITY.md");
  if (
    security &&
    !security.includes(
      `github.com/cadenzaio/${repository.name}/security/advisories/new`,
    )
  ) {
    fail(
      `${repository.name}: SECURITY.md does not target its private advisory URL`,
    );
  }

  const workflow = readOptional(repository, ".github/workflows/ci.yml");
  if (workflow) validateWorkflow(repository, workflow);
  validateVersion(repository);
}

for (const assertion of candidate.source_assertions) {
  const content = readOptional(
    { name: assertion.path, path: "." },
    assertion.path,
  );
  if (content && !content.includes(assertion.contains)) {
    fail(
      `${assertion.path}: missing release assertion ${JSON.stringify(assertion.contains)}`,
    );
  }
}

validateMigrations();
validateContractDocuments();
validateRequiredChecks();

if (candidate.external_publication_controls.dco_check !== "required") {
  fail("DCO must be declared as a required external publication control");
}
if (candidate.external_publication_controls.default_branch !== "main") {
  fail("main must be the declared default branch");
}
if (candidate.external_publication_controls.pull_request_required !== true) {
  fail("pull requests must be required after repository bootstrap");
}

if (failures.length > 0) {
  for (const failure of failures) process.stderr.write(`${failure}\n`);
  process.exit(1);
}

const digest = createHash("sha256").update(candidateBytes).digest("hex");
process.stdout.write(
  `Release candidate metadata validated: ${candidate.repositories.length} repositories, sha256:${digest}.\n`,
);

function validateWorkflow(repository, workflow) {
  if (!workflow.includes("permissions:\n  contents: read")) {
    fail(`${repository.name}: CI must declare read-only contents permission`);
  }
  if (workflow.includes("pull_request_target:")) {
    fail(`${repository.name}: ordinary CI must not use pull_request_target`);
  }
  if (/^\s+[a-z-]+:\s+write\s*$/mu.test(workflow)) {
    fail(`${repository.name}: ordinary CI must not request write permission`);
  }
  for (const line of workflow.split("\n")) {
    const match = line.match(/\buses:\s*[^@\s]+@([^\s#]+)/u);
    if (match && !/^[a-f0-9]{40}$/u.test(match[1])) {
      fail(
        `${repository.name}: GitHub Action is not pinned by full commit SHA: ${line.trim()}`,
      );
    }
  }
  for (const job of repository.required_jobs) {
    if (!workflow.includes(`\n  ${job}:\n`)) {
      fail(`${repository.name}: CI is missing required job ${job}`);
    }
  }
}

function validateVersion(repository) {
  if (!repository.version_file) return;
  const content = readOptional(repository, repository.version_file);
  if (!content) return;
  let actual;
  let license;
  switch (repository.version_kind) {
    case "json":
      ({ version: actual, license } = JSON.parse(content));
      break;
    case "python":
      actual = matchVersion(content, /^version = "([^"]+)"$/mu);
      license = matchVersion(content, /^license = "([^"]+)"$/mu);
      break;
    case "elixir":
      actual = matchVersion(content, /version:\s*"([^"]+)"/u);
      license = content.includes('licenses: ["Apache-2.0"]')
        ? "Apache-2.0"
        : undefined;
      break;
    case "csharp":
      actual = matchVersion(content, /<Version>([^<]+)<\/Version>/u);
      license = matchVersion(
        content,
        /<PackageLicenseExpression>([^<]+)<\/PackageLicenseExpression>/u,
      );
      break;
    case "cargo":
      actual = matchVersion(content, /^version = "([^"]+)"$/mu);
      license = matchVersion(content, /^license = "([^"]+)"$/mu);
      break;
    default:
      fail(
        `${repository.name}: unknown version kind ${repository.version_kind}`,
      );
      return;
  }
  if (actual !== repository.version) {
    fail(
      `${repository.name}: expected version ${repository.version}, found ${actual}`,
    );
  }
  if (license !== "Apache-2.0") {
    fail(`${repository.name}: package metadata must declare Apache-2.0`);
  }
}

function validateMigrations() {
  const migrationRoot = resolve(
    root,
    "cadenza-environment/packages/environment-bootstrap/migrations",
  );
  const files = readdirSync(migrationRoot)
    .filter((file) => file.endsWith(".sql"))
    .sort();
  const expected = candidate.compatibility.environment_migrations;
  if (
    files.length !== expected.count ||
    files.at(0) !== expected.first ||
    files.at(-1) !== expected.last
  ) {
    fail(
      `environment migrations differ from declared ${expected.first}..${expected.last} (${expected.count})`,
    );
  }
}

function validateContractDocuments() {
  const documents = {
    primitive_core: "cadenza/contracts/core/v0/README.md",
    actor_core: "docs/contracts/actor-core/v1.md",
    graph_conclusion: "docs/contracts/graph-conclusion/v0.md",
    execution_evidence: "docs/contracts/execution-evidence/v0.md",
    authority_security: "docs/contracts/authority-security/v0.md",
    environment_bootstrap: "docs/contracts/environment-bootstrap/v0.md",
    distribution: "docs/contracts/distribution/v0.md",
    actor_distribution: "docs/contracts/actor-distribution/v1.md",
  };
  for (const [contract, path] of Object.entries(documents)) {
    if (!existsSync(resolve(root, path)))
      fail(`${contract}: missing authority document ${path}`);
  }
}

function validateRequiredChecks() {
  if (requiredChecks.schema_version !== 1) {
    fail("required checks schema_version must be 1");
  }
  const declared = new Map(
    requiredChecks.repositories.map((repository) => [
      repository.name,
      repository,
    ]),
  );
  if (declared.size !== candidate.repositories.length) {
    fail(
      "required checks must declare every candidate repository exactly once",
    );
  }
  for (const repository of candidate.repositories) {
    const checks = declared.get(repository.name)?.checks;
    if (!Array.isArray(checks)) {
      fail(`${repository.name}: missing required-check projection`);
      continue;
    }
    if (!checks.includes("DCO")) {
      fail(`${repository.name}: DCO is not a required projected check`);
    }
    for (const job of repository.required_jobs) {
      if (
        !checks.some(
          (check) =>
            check === `CI / ${job}` || check.startsWith(`CI / ${job} (`),
        )
      ) {
        fail(
          `${repository.name}: required job ${job} has no projected GitHub check`,
        );
      }
    }
  }
  for (const name of declared.keys()) {
    if (!names.has(name))
      fail(`required checks declare unknown repository: ${name}`);
  }

  const branch = requiredChecks.protected_branch;
  if (branch.name !== candidate.external_publication_controls.default_branch) {
    fail("required-check branch differs from candidate default branch");
  }
  if (branch.pull_request_required !== true || branch.approving_reviews < 1) {
    fail("protected main must require a reviewed pull request");
  }
  if (
    branch.force_push_allowed !== false ||
    branch.deletion_allowed !== false
  ) {
    fail("protected main must prohibit force push and deletion");
  }
}

function matchVersion(content, pattern) {
  return content.replace(/^\uFEFF/u, "").match(pattern)?.[1];
}

function requireFile(repository, path) {
  if (!existsSync(resolve(root, repository.path, path))) {
    fail(`${repository.name}: missing ${path}`);
  }
}

function readOptional(repository, path) {
  const target = resolve(root, repository.path, path);
  if (!existsSync(target)) {
    fail(`${repository.name}: missing ${path}`);
    return undefined;
  }
  return readFileSync(target, "utf8");
}

function read(path) {
  return readFileSync(resolve(root, path), "utf8");
}

function readJson(path) {
  return JSON.parse(read(path));
}

function fail(message) {
  failures.push(message);
}
