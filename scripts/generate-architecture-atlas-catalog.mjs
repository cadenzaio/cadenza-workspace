import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(import.meta.dirname, "..");
const atlasRoot = path.join(root, "docs/architecture/atlas");
const manifest = JSON.parse(
  fs.readFileSync(path.join(atlasRoot, "manifest.json"), "utf8"),
);
const outputPath = path.join(atlasRoot, "catalog.md");

function link(relativePath, label = relativePath) {
  const target = path.relative(atlasRoot, path.join(root, relativePath));
  return `[${label}](${target.startsWith(".") ? target : `./${target}`})`;
}

const lines = [
  "# Cadenza Architecture Atlas Catalog",
  "",
  "This catalog is generated from `manifest.json`. Each entry is an interpretive",
  "contract for one canonical visual, not a decorative caption.",
  "",
];

for (const diagram of manifest.diagrams) {
  lines.push(
    `## ${diagram.title}`,
    "",
    `- **Audience:** ${diagram.audience.join(", ")}.`,
    `- **Question:** ${diagram.question}`,
    `- **Scope:** ${diagram.scope}`,
    `- **Intentionally omits:** ${diagram.omits.join(", ")}.`,
    `- **Identities:** ${diagram.identities.join(", ")}.`,
    `- **States:** ${diagram.states.join(", ")}.`,
    `- **Affects:** ${diagram.affects.join(", ")}.`,
    `- **Boundaries:** ${diagram.boundaries.join(", ")}.`,
    `- **Owner:** ${diagram.owner ?? manifest.owner}.`,
    `- **Last validated:** ${diagram.lastValidated}.`,
    `- **Visual:** ${link(diagram.rendered, "rendered SVG")} and ${link(diagram.source, "canonical Mermaid source")}.`,
    `- **Evidence:** ${diagram.evidence.map((item) => link(item)).join(", ")}.`,
    "",
  );
}

const output = lines.join("\n");
if (process.argv.includes("--check")) {
  if (
    !fs.existsSync(outputPath) ||
    fs.readFileSync(outputPath, "utf8") !== output
  ) {
    console.error("Architecture atlas catalog is stale; regenerate it.");
    process.exit(1);
  }
  console.log(
    `Architecture atlas catalog is current (${manifest.diagrams.length} entries).`,
  );
} else {
  fs.writeFileSync(outputPath, output);
  console.log(
    `Generated architecture atlas catalog (${manifest.diagrams.length} entries).`,
  );
}
