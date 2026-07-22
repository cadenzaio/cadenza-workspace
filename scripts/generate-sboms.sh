#!/usr/bin/env bash
set -euo pipefail

workspace_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
output_root="$workspace_root/docs/security/sbom"
required_syft_version="1.49.0"
repos=(
  "cadenza"
  "cadenza-python"
  "cadenza-elixir"
  "cadenza-csharp"
  "cadenza-environment"
  "cadenza-chamber"
  "cadenza-cell"
)

if ! command -v syft >/dev/null 2>&1; then
  echo "syft $required_syft_version is required" >&2
  exit 1
fi
if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required to normalize generated SBOMs" >&2
  exit 1
fi

actual_syft_version="$(syft version -o json | awk -F'"' '/"version"/ { print $4 }')"
if [[ "$actual_syft_version" != "$required_syft_version" ]]; then
  echo "syft $required_syft_version is required; found $actual_syft_version" >&2
  exit 1
fi

temporary_root="$(mktemp -d)"
trap 'rm -rf "$temporary_root"' EXIT

for repo in "${repos[@]}"; do
  repo_root="$workspace_root/$repo"
  if [[ ! -d "$repo_root" ]]; then
    echo "missing official repository: $repo" >&2
    exit 1
  fi

  syft scan "dir:$repo_root" \
    --source-name "$repo" \
    --parallelism 1 \
    --override-default-catalogers github-actions-usage-cataloger \
    --override-default-catalogers javascript-lock-cataloger \
    --override-default-catalogers python-package-cataloger \
    --override-default-catalogers dotnet-packages-lock-cataloger \
    --override-default-catalogers elixir-mix-lock-cataloger \
    --override-default-catalogers rust-cargo-lock-cataloger \
    --exclude '**/.git/**' \
    --exclude '**/.venv/**' \
    --exclude '**/_build/**' \
    --exclude '**/bin/**' \
    --exclude '**/build/**' \
    --exclude '**/deps/**' \
    --exclude '**/dist/**' \
    --exclude '**/node_modules/**' \
    --exclude '**/obj/**' \
    --exclude '**/target/**' \
    --output "cyclonedx-json=$temporary_root/$repo.raw.cdx.json" \
    --quiet

  jq -c --arg repo "$repo" \
    'del(.serialNumber, .metadata.timestamp)
     | .metadata.component["bom-ref"] = ("urn:cadenza:source:" + $repo)' \
    "$temporary_root/$repo.raw.cdx.json" \
    | sed "s#$repo_root##g" \
    > "$temporary_root/$repo.cdx.json"
done

mkdir -p "$output_root"
for repo in "${repos[@]}"; do
  mv "$temporary_root/$repo.cdx.json" "$output_root/$repo.cdx.json"
done

echo "Generated ${#repos[@]} CycloneDX SBOMs with syft $required_syft_version."
