#!/usr/bin/env bash
# Connect a machine to Pyo as a cluster, or refresh one that's connected:
#
#   curl -fsSL https://pyo.dev/connect.sh | sudo bash -s -- --api <pyo-address-for-servers> --token <token>
#   curl -fsSL https://pyo.dev/connect.sh | sudo bash
#
# Copy the command from the dashboard, which fills in Pyo's address and the
# token. Run without them on a cluster's first server, it reads both from the
# agent already there. This runs connect.sh from Pyo's latest release on
# GitHub. Pyo also serves its own copy at <pyo-address>/install/connect.sh.
# Any arguments are passed on to it.
#
# To read the script before running it:
#
#   curl -fsSL https://github.com/upsetdev/pyo/releases/latest/download/connect.sh
#
# Docs: https://pyo.dev/docs/clusters
set -euo pipefail

PYO_SCRIPT_URL="https://github.com/upsetdev/pyo/releases/latest/download/connect.sh"
PYO_SCRIPT=""

cleanup() {
  if [ -n "$PYO_SCRIPT" ]; then rm -f "$PYO_SCRIPT"; fi
}

# Everything runs from here, after bash has read the whole file: piped into
# bash, the script must not read what's left of this one as its input.
main() {
  PYO_SCRIPT="$(mktemp)"
  trap cleanup EXIT
  if ! curl -fsSL "$PYO_SCRIPT_URL" -o "$PYO_SCRIPT"; then
    echo "pyo: couldn't download connect.sh from $PYO_SCRIPT_URL" >&2
    exit 1
  fi
  bash "$PYO_SCRIPT" "$@"
}

main "$@"
