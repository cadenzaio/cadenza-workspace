import { existsSync, readFileSync } from "node:fs";
import { resolve, sep } from "node:path";

export function loadReleaseCandidate(root, argv = process.argv) {
  const index = argv.indexOf("--candidate");
  const argument =
    index === -1 ? "release/candidate.json" : argv[index + 1];
  if (!argument) {
    throw new Error("--candidate must identify a release candidate JSON file");
  }

  const releaseRoot = resolve(root, "release");
  const path = resolve(root, argument);
  if (path !== releaseRoot && !path.startsWith(`${releaseRoot}${sep}`)) {
    throw new Error("release candidate input must live under release/");
  }
  if (!existsSync(path)) {
    throw new Error(`release candidate does not exist: ${path}`);
  }

  const bytes = readFileSync(path);
  return {
    bytes,
    candidate: JSON.parse(bytes),
    path,
  };
}
