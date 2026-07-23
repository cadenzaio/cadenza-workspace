import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(import.meta.dirname, "..");
const authority = JSON.parse(
  fs.readFileSync(
    path.join(root, "release/public-documentation-authority.json"),
    "utf8",
  ),
);
const files = [];
const failures = [];

if (
  authority.schema_version !== 1 ||
  !Array.isArray(authority.current_roots) ||
  !Array.isArray(authority.current_direction_checks)
) {
  throw new Error("unsupported public documentation authority configuration");
}

function collect(relativePath) {
  const absolutePath = resolveInsideRoot(relativePath);
  if (!absolutePath) return;
  if (!fs.existsSync(absolutePath)) {
    failures.push(`missing current documentation root: ${relativePath}`);
    return;
  }
  const stat = fs.statSync(absolutePath);
  if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(absolutePath).sort()) {
      collect(path.join(relativePath, entry));
    }
  } else if (absolutePath.endsWith(".md")) {
    files.push(absolutePath);
  }
}

for (const entry of authority.current_roots) collect(entry);

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

for (const check of authority.current_direction_checks) {
  const file = resolveInsideRoot(check.path);
  if (!file) continue;
  if (!fs.existsSync(file)) {
    failures.push(`missing current-direction document: ${check.path}`);
    continue;
  }
  const source = fs.readFileSync(file, "utf8");
  for (const fragment of check.forbidden_fragments) {
    if (source.includes(fragment)) {
      failures.push(
        `${check.path}: forbidden legacy-authority fragment ${JSON.stringify(fragment)}`,
      );
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  `Public documentation authority validated across ${files.length} files and ${authority.current_direction_checks.length} current-direction checks.`,
);

function resolveInsideRoot(relativePath) {
  const absolutePath = path.resolve(root, relativePath);
  if (absolutePath !== root && !absolutePath.startsWith(root + path.sep)) {
    failures.push(`documentation authority path escapes root: ${relativePath}`);
    return null;
  }
  return absolutePath;
}
