import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(import.meta.dirname, "..");
const roots = [
  "docs/architecture.md",
  "docs/index.md",
  "docs/architecture/atlas/README.md",
  "docs/architecture/atlas/catalog.md",
  "docs/architecture/atlas/visual-grammar.md",
  "docs/guides",
  "cadenza/README.md",
  "cadenza-python/README.md",
  "cadenza-elixir/README.md",
  "cadenza-csharp/README.md",
  "cadenza-environment/README.md",
  "cadenza-chamber/README.md",
  "cadenza-cell/README.md",
  "cadenza-reference-system/README.md",
  "cadenza-reference-system/docs",
];
const files = [];

function collect(relativePath) {
  const absolutePath = path.join(root, relativePath);
  const stat = fs.statSync(absolutePath);
  if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(absolutePath).sort()) {
      collect(path.join(relativePath, entry));
    }
  } else if (absolutePath.endsWith(".md")) {
    files.push(absolutePath);
  }
}

for (const entry of roots) collect(entry);

const failures = [];
for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  for (const match of source.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const rawTarget = match[1].trim().replace(/^<|>$/g, "");
    if (
      rawTarget === "" ||
      rawTarget.startsWith("#") ||
      /^(https?:|mailto:)/.test(rawTarget)
    ) {
      continue;
    }
    const decodedTarget = decodeURIComponent(rawTarget.split("#", 1)[0]);
    const target = path.resolve(path.dirname(file), decodedTarget);
    if (!target.startsWith(root + path.sep) || !fs.existsSync(target)) {
      failures.push(
        `${path.relative(root, file)}: missing local link ${rawTarget}`,
      );
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  `Public documentation links validated across ${files.length} files.`,
);
