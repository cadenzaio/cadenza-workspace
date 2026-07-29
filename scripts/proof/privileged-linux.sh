#!/usr/bin/env bash
set -Eeuo pipefail

if [[ $# -ne 1 || ${EUID:-$(id -u)} -ne 0 ]]; then
  echo "usage: privileged-linux.sh WORKSPACE (run as root)" >&2
  exit 64
fi

workspace=$(realpath "$1")
manifest="$workspace/proof/manifest.json"
input="$workspace/proof-input.json"
state="$workspace/.proof-state"
evidence="$workspace/evidence"
results="$state/results.tsv"
rootfs="$state/rootfs"
reference_artifact="$state/reference-order-pricing.json"
installed_rootfs=""
active_cluster=""
active_socket=""
started_epoch=$(date +%s)
started_at=$(date --iso-8601=seconds)
proof_status=failed
cleanup_status=failed
proof_phase=preflight
failure_exit_code=0
failure_line=0

node_path=/home/emilforsvall.guest/.local/node-v24.18.0/bin
cargo_path=/home/emilforsvall.guest/.cargo/bin
postgres_bin=/usr/lib/postgresql/16/bin
runsc=/usr/local/libexec/cadenza/runsc
export CARGO_HOME=/home/emilforsvall.guest/.cargo
export RUSTUP_HOME=/home/emilforsvall.guest/.rustup
export PATH="$node_path:$cargo_path:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

mkdir -p "$state" "$evidence"
: >"$results"
umask 022

record_failure() {
  local status=$?
  if [[ $failure_exit_code -eq 0 ]]; then
    failure_exit_code=$status
    failure_line=${BASH_LINENO[0]}
  fi
  return "$status"
}
trap record_failure ERR

manifest_value() {
  node -e \
    'const value=process.argv[1].split(".").reduce((v,k)=>v[k],require(process.argv[2])); process.stdout.write(String(value))' \
    "$1" "$manifest"
}

runsc_digest="sha256:$(sha256sum "$runsc" | cut -d' ' -f1)"
expected_runsc=$(manifest_value tiers.privileged.expected.runsc_digest)
expected_node=$(manifest_value tiers.privileged.expected.node)
expected_arch=$(manifest_value tiers.privileged.expected.architecture)
expected_rust=$(manifest_value tiers.privileged.expected.rust)
expected_postgresql=$(manifest_value tiers.privileged.expected.postgresql)
convergence_timeout=$(manifest_value tiers.privileged.convergence_timeout_seconds)
unit_timeout=$(manifest_value tiers.privileged.scenario_unit_timeout_seconds)
profile=$(
  node -e \
    'const value=require(process.argv[1]).profile; if (!["ordinary","hardening"].includes(value)) process.exit(65); process.stdout.write(value)' \
    "$input"
)
mapfile -t scenarios < <(
  node -e '
    const manifest=require(process.argv[1]);
    const profile=process.argv[2];
    const scenarios=[...manifest.tiers.privileged.scenarios];
    if (profile === "hardening") scenarios.push(...manifest.tiers.privileged.hardening_scenarios);
    for (const scenario of scenarios) {
      if (!/^[a-z0-9_]+$/u.test(scenario)) process.exit(65);
      console.log(scenario);
    }
  ' "$manifest" "$profile"
)

backup_file() {
  local path=$1
  local name=$2
  if [[ -e "$path" ]]; then
    cp -a -- "$path" "$state/$name"
  else
    : >"$state/$name.absent"
  fi
}

restore_file() {
  local path=$1
  local name=$2
  if [[ -e "$state/$name" ]]; then
    cp -a -- "$state/$name" "$path"
  elif [[ -e "$state/$name.absent" ]]; then
    rm -f -- "$path"
  fi
}

stop_cluster() {
  if [[ -n "$active_cluster" && -d "$active_cluster/data" ]]; then
    runuser -u postgres -- "$postgres_bin/pg_ctl" \
      -D "$active_cluster/data" -m immediate -w stop >/dev/null 2>&1 || true
    active_cluster=""
  fi
  if [[ -n "$active_socket" ]]; then
    rm -rf -- "$active_socket"
    active_socket=""
  fi
}

clean_runsc() {
  local ids
  ids=$(
    "$runsc" --root=/run/cadenza/runsc list --format=json 2>/dev/null |
      node -e 'let b="";process.stdin.on("data",c=>b+=c).on("end",()=>{for(const x of JSON.parse(b)||[])console.log(x.id)})'
  ) || true
  while IFS= read -r id; do
    [[ -z "$id" ]] || "$runsc" --root=/run/cadenza/runsc delete --force "$id" >/dev/null 2>&1 || true
  done <<<"$ids"
}

finish() {
  local code=$?
  trap - ERR EXIT
  set +e
  stop_cluster
  rm -rf -- "$state"/postgres-*
  clean_runsc
  rm -rf -- /var/lib/cadenza/bundles/*
  [[ -z "$installed_rootfs" ]] || rm -rf -- "$installed_rootfs"
  rm -rf -- "$rootfs" "$state/preflight-rootfs"
  rm -f -- "$reference_artifact"
  restore_file /etc/cadenza/launcher-v0.json launcher-config
  restore_file /var/lib/cadenza/launcher-nonces-v0.json launcher-nonces
  find "$state" -type f -name 'proof-config.json' -delete

  local containers bundles cgroups clusters credentials
  containers=$("$runsc" --root=/run/cadenza/runsc list --format=json 2>/dev/null)
  bundles=$(find /var/lib/cadenza/bundles -mindepth 1 -maxdepth 1 -print -quit)
  cgroups=$(find /sys/fs/cgroup -maxdepth 7 -type d -iname '*cadenza*' -print -quit 2>/dev/null)
  clusters=$(find "$state" -maxdepth 1 -type d -name 'postgres-*' -print -quit)
  credentials=$(find "$state" -type f -name 'proof-config.json' -print -quit)
  if [[ "$containers" == "null" || "$containers" == "[]" ]] &&
    [[ -z "$bundles$cgroups$clusters$credentials" ]]; then
    cleanup_status=passed
  fi
  [[ $code -eq 0 && "$cleanup_status" == passed ]] && proof_status=passed

  export PROOF_STATUS="$proof_status"
  export PROOF_STARTED_AT="$started_at"
  export PROOF_DURATION_MS="$((($(date +%s) - started_epoch) * 1000))"
  export PROOF_KERNEL="$(uname -r)"
  export PROOF_ARCHITECTURE="$(uname -m)"
  export PROOF_NODE="$(node --version)"
  export PROOF_RUST="$(rustc --version | awk '{print $2}')"
  export PROOF_POSTGRESQL="$("$postgres_bin/postgres" --version | awk '{print $3}')"
  export PROOF_RUNSC_DIGEST="$runsc_digest"
  export PROOF_ROOTFS_DIGEST="${rootfs_digest:-}"
  export PROOF_CHAMBER_DIGEST="${chamber_digest:-}"
  export PROOF_NODE_DIGEST="${node_digest:-}"
  export PROOF_CORE_DIGEST="${core_digest:-}"
  export PROOF_ADAPTER_MANIFEST_DIGEST="${adapter_manifest_digest:-}"
  export PROOF_ADAPTER_LOCK_DIGEST="${adapter_lock_digest:-}"
  export PROOF_REFERENCE_ARTIFACT_DIGEST="${reference_artifact_digest:-}"
  export PROOF_CLEANUP="{\"status\":\"$cleanup_status\",\"containers\":0,\"bundles\":0,\"cgroups\":0,\"temporary_clusters\":0,\"credential_files\":0}"
  export PROOF_FAILURE_PHASE="$proof_phase"
  export PROOF_FAILURE_LINE="$failure_line"
  export PROOF_FAILURE_EXIT_CODE="$failure_exit_code"
  node "$workspace/scripts/proof/write-privileged-report.mjs" \
    "$evidence/report.json" "$input" "$manifest" "$results"
  chmod 0644 "$evidence/report.json"
  [[ "$proof_status" == passed ]] || code=1
  exit "$code"
}
trap finish EXIT

[[ -f "$manifest" && -f "$input" ]]
[[ "$(uname -m)" == "$expected_arch" ]]
[[ "$(node --version)" == "$expected_node" ]]
[[ "$(rustc --version | awk '{print $2}')" == "$expected_rust" ]]
[[ "$("$postgres_bin/postgres" --version | awk '{print $3}')" == "$expected_postgresql" ]]
[[ "$runsc_digest" == "$expected_runsc" ]]
[[ "$convergence_timeout" =~ ^[0-9]+$ && "$unit_timeout" =~ ^[0-9]+$ ]]
[[ ${#scenarios[@]} -ge 1 ]]
[[ -z ${CADENZA_PRESERVE_PROOF_DIRECTORY:-} ]]
[[ $unit_timeout -gt $convergence_timeout ]]

baseline=$("$runsc" --root=/run/cadenza/runsc list --format=json)
[[ "$baseline" == "null" || "$baseline" == "[]" ]]
[[ -z "$(find /var/lib/cadenza/bundles -mindepth 1 -maxdepth 1 -print -quit)" ]]
[[ ! -e "$rootfs" ]]
backup_file /etc/cadenza/launcher-v0.json launcher-config
backup_file /var/lib/cadenza/launcher-nonces-v0.json launcher-nonces

echo "[privileged] building exact Core, Environment, Chamber, and adapter inputs"
proof_phase=runtime-input-build
yarn --cwd "$workspace/cadenza" install --frozen-lockfile --ignore-scripts
yarn --cwd "$workspace/cadenza" build
npm --prefix "$workspace/cadenza-environment" run install:all
npm --prefix "$workspace/cadenza-environment" run build
npm --prefix "$workspace/cadenza-chamber/adapters/typescript" ci --ignore-scripts
npm --prefix "$workspace/cadenza-chamber/adapters/typescript" run typecheck
npm --prefix "$workspace/cadenza-chamber/adapters/typescript" run build
cargo build \
  --manifest-path "$workspace/cadenza-chamber/Cargo.toml" \
  --release --locked

core="$workspace/cadenza/dist/index.mjs"
chamber="$workspace/cadenza-chamber/target/release/cadenza-chamber"
adapter="$workspace/cadenza-chamber/adapters/typescript/artifact"
adapter_lock="$workspace/cadenza-chamber/adapters/typescript/package-lock.json"
node_binary="$node_path/node"
core_digest="sha256:$(sha256sum "$core" | cut -d' ' -f1)"
chamber_digest="sha256:$(sha256sum "$chamber" | cut -d' ' -f1)"
node_digest="sha256:$(sha256sum "$node_binary" | cut -d' ' -f1)"
adapter_manifest_digest="sha256:$(sha256sum "$adapter/adapter-artifact.json" | cut -d' ' -f1)"
adapter_lock_digest="sha256:$(sha256sum "$adapter_lock" | cut -d' ' -f1)"

node "$workspace/cadenza-reference-system/scripts/build-distributed-artifact.mjs" \
  "$reference_artifact" "$adapter_lock_digest" "$core_digest"
reference_artifact_digest="sha256:$(sha256sum "$reference_artifact" | cut -d' ' -f1)"

bash "$workspace/cadenza-cell/scripts/build-gvisor-rootfs.sh" \
  "$rootfs" "$chamber" "$node_binary" "$core" "$adapter" "$adapter_lock"

proof_phase=rootfs-authority-measurement
measure_output=$(
  CADENZA_ROOTFS_TO_MEASURE="$rootfs" cargo test \
    --manifest-path "$workspace/cadenza-cell/Cargo.toml" \
    --locked --test linux_gvisor \
    provisioned_rootfs_fixture_uses_authority_measurement \
    -- --ignored --exact --nocapture 2>&1
)
printf '%s\n' "$measure_output"
rootfs_digest=$(printf '%s\n' "$measure_output" | grep -Eo 'sha256:[0-9a-f]{64}' | tail -1)
[[ "$rootfs_digest" =~ ^sha256:[0-9a-f]{64}$ ]]
installed_rootfs="/var/lib/cadenza/rootfs/sha256-${rootfs_digest#sha256:}"
[[ ! -e "$installed_rootfs" ]] || {
  echo "fresh proof refuses an already-installed rootfs: $installed_rootfs" >&2
  exit 73
}

echo "[privileged] proving contained Cell/Chamber protocol compatibility"
proof_phase=cell-chamber-protocol-preflight
preflight="$state/preflight-rootfs"
cp -a -- "$rootfs" "$preflight"
CADENZA_RUNSC_DIGEST="$runsc_digest" \
  CADENZA_CHAMBER_DIGEST="$chamber_digest" \
  CADENZA_ROOTFS_STAGING="$preflight" \
  cargo test --manifest-path "$workspace/cadenza-cell/Cargo.toml" \
  --locked --test linux_gvisor \
  contained_chamber_communicates_only_through_inherited_descriptor \
  -- --ignored --exact --nocapture
rm -rf -- /var/lib/cadenza/bundles/*

run_scenario() {
  local scenario=$1
  local index=$2
  local cluster="$state/postgres-$index"
  local socket="/run/cadenza/proof-postgres-${index}-$$"
  local config="$cluster/proof-config.json"
  local port scenario_started status duration
  proof_phase="$scenario:authority-initialization"
  mkdir -p "$cluster/data" "$socket"
  active_socket="$socket"
  chown -R postgres:postgres "$cluster" "$socket"
  runuser -u postgres -- "$postgres_bin/initdb" \
    -D "$cluster/data" --no-locale --encoding=UTF8 \
    --auth-local=trust --auth-host=scram-sha-256 >/dev/null
  port=$(
    python3 -c 'import socket;s=socket.socket();s.bind(("127.0.0.1",0));print(s.getsockname()[1]);s.close()'
  )
  cat >>"$cluster/data/postgresql.conf" <<EOF
listen_addresses = '127.0.0.1'
port = $port
unix_socket_directories = '$socket'
password_encryption = 'scram-sha-256'
EOF
  runuser -u postgres -- "$postgres_bin/pg_ctl" \
    -D "$cluster/data" -w start >/dev/null
  active_cluster="$cluster"
  proof_phase="$scenario:credential-generation"
  node "$workspace/scripts/proof/create-privileged-config.mjs" \
    "$config" "$socket" "$port" "$rootfs" "$reference_artifact" \
    "$convergence_timeout"

  scenario_started=$(date +%s)
  echo "[privileged] $scenario"
  proof_phase="$scenario:execution"
  set +e
  systemd-run --quiet --wait --pipe --collect \
    --unit="proofcase-${index}-$(date +%s)" \
    --property=Delegate=yes \
    --property=KillMode=control-group \
    --property="RuntimeMaxSec=${unit_timeout}s" \
    --working-directory="$workspace/cadenza-cell" \
    --setenv="PATH=$PATH" \
    --setenv="CADENZA_PRIVILEGED_PROOF_CONFIG=$config" \
    cargo test --locked --test autonomous_cell_convergence \
    "$scenario" -- --ignored --exact --nocapture
  status=$?
  set -e
  duration="$((($(date +%s) - scenario_started) * 1000))"
  if [[ $status -eq 0 ]]; then
    printf '%s\tpassed\t%s\n' "$scenario" "$duration" >>"$results"
  else
    printf '%s\tfailed\t%s\n' "$scenario" "$duration" >>"$results"
  fi
  stop_cluster
  rm -rf -- "$cluster"
  [[ $status -eq 0 ]]
}

for index in "${!scenarios[@]}"; do
  run_scenario "${scenarios[$index]}" "$((index + 1))"
done
proof_phase=complete
