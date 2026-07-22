#!/usr/bin/env bash
set -euo pipefail

workspace_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
manifest="$workspace_root/docs/architecture/atlas/manifest.json"
renderer="$(node -e 'const m=require(process.argv[1]); process.stdout.write(m.renderer)' "$manifest")"

node "$workspace_root/scripts/validate-architecture-atlas.mjs"
node "$workspace_root/scripts/generate-architecture-atlas-catalog.mjs"

while IFS=$'\t' read -r source rendered; do
  mkdir -p "$workspace_root/$(dirname "$rendered")"
  docker run --rm \
    -v "$workspace_root:/data" \
    -w /data \
    "$renderer" \
    -p /data/docs/architecture/atlas/puppeteer-config.json \
    -c /data/docs/architecture/atlas/mermaid-config.json \
    -b transparent \
    -i "/data/$source" \
    -o "/data/$rendered"
done < <(node "$workspace_root/scripts/validate-architecture-atlas.mjs" --list)

node "$workspace_root/scripts/validate-architecture-atlas.mjs" --require-rendered
node "$workspace_root/scripts/generate-architecture-atlas-catalog.mjs" --check
