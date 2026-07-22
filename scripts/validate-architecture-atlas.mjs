import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const workspaceRoot = path.resolve(import.meta.dirname, "..");
const manifestPath = path.join(
  workspaceRoot,
  "docs/architecture/atlas/manifest.json",
);
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const requireRendered = process.argv.includes("--require-rendered");
const listOnly = process.argv.includes("--list");
const requiredCoreIds = Array.from(
  { length: 13 },
  (_, index) => `${String(index + 1).padStart(2, "0")}-`,
);
const requiredStrings = [
  "id",
  "title",
  "kind",
  "question",
  "scope",
  "source",
  "rendered",
  "lastValidated",
];
const requiredArrays = [
  "audience",
  "omits",
  "identities",
  "states",
  "affects",
  "boundaries",
  "roles",
  "evidence",
];
const supportedDirectives = new Set([
  "flowchart",
  "sequenceDiagram",
  "stateDiagram-v2",
]);
const ids = new Set();
const renderedPaths = new Set();
const errors = [];

if (manifest.version !== 1) {
  errors.push("manifest.version must be 1");
}
if (!String(manifest.renderer).includes("@sha256:")) {
  errors.push("manifest.renderer must use an immutable image digest");
}

for (const diagram of manifest.diagrams ?? []) {
  for (const field of requiredStrings) {
    if (typeof diagram[field] !== "string" || diagram[field].trim() === "") {
      errors.push(`${diagram.id ?? "unknown"}: ${field} must be non-empty`);
    }
  }
  for (const field of requiredArrays) {
    if (!Array.isArray(diagram[field]) || diagram[field].length === 0) {
      errors.push(`${diagram.id ?? "unknown"}: ${field} must be non-empty`);
    }
  }
  if (ids.has(diagram.id)) {
    errors.push(`${diagram.id}: duplicate id`);
  }
  ids.add(diagram.id);
  if (renderedPaths.has(diagram.rendered)) {
    errors.push(`${diagram.id}: duplicate rendered path`);
  }
  renderedPaths.add(diagram.rendered);

  for (const role of diagram.roles ?? []) {
    if (!manifest.allowedRoles.includes(role)) {
      errors.push(`${diagram.id}: unknown visual role ${role}`);
    }
  }

  const sourcePath = path.resolve(workspaceRoot, diagram.source);
  const renderedPath = path.resolve(workspaceRoot, diagram.rendered);
  if (!sourcePath.startsWith(workspaceRoot + path.sep)) {
    errors.push(`${diagram.id}: source escapes workspace`);
  } else if (!fs.existsSync(sourcePath)) {
    errors.push(`${diagram.id}: missing source ${diagram.source}`);
  } else {
    const source = fs.readFileSync(sourcePath, "utf8");
    const directive = source
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find((line) => line !== "" && !line.startsWith("%%"))
      ?.split(/\s+/)[0];
    if (!supportedDirectives.has(directive)) {
      errors.push(`${diagram.id}: unsupported Mermaid directive ${directive}`);
    }
  }
  if (!renderedPath.startsWith(workspaceRoot + path.sep)) {
    errors.push(`${diagram.id}: rendered path escapes workspace`);
  } else if (requireRendered) {
    if (!fs.existsSync(renderedPath)) {
      errors.push(`${diagram.id}: missing rendered output ${diagram.rendered}`);
    } else if (!fs.readFileSync(renderedPath, "utf8").includes("<svg")) {
      errors.push(`${diagram.id}: rendered output is not SVG`);
    } else {
      const svg = fs.readFileSync(renderedPath, "utf8");
      const viewBox = svg.match(/viewBox="[^"]*\s([0-9.]+)\s([0-9.]+)"/);
      if (!viewBox) {
        errors.push(`${diagram.id}: rendered output has no measurable viewBox`);
      } else {
        const width = Number(viewBox[1]);
        const height = Number(viewBox[2]);
        const maxWidth = ["sequence", "journey"].includes(diagram.kind)
          ? 2100
          : 1500;
        if (width < 200 || height < 120) {
          errors.push(`${diagram.id}: rendered output is unexpectedly small`);
        }
        if (width > maxWidth) {
          errors.push(
            `${diagram.id}: rendered width ${width} exceeds ${maxWidth}px narrow-review limit`,
          );
        }
      }
    }
  }

  for (const evidence of diagram.evidence ?? []) {
    const evidencePath = path.resolve(workspaceRoot, evidence);
    if (
      !evidencePath.startsWith(workspaceRoot + path.sep) ||
      !fs.existsSync(evidencePath)
    ) {
      errors.push(`${diagram.id}: missing evidence ${evidence}`);
    }
  }
}

for (const prefix of requiredCoreIds) {
  if (![...ids].some((id) => id.startsWith(prefix))) {
    errors.push(`missing required core atlas view ${prefix}*`);
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

if (listOnly) {
  for (const diagram of manifest.diagrams) {
    console.log(`${diagram.source}\t${diagram.rendered}`);
  }
} else {
  console.log(
    `Architecture atlas validated: ${manifest.diagrams.length} diagrams, ${ids.size} unique diagram ids.`,
  );
}
