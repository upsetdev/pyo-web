#!/usr/bin/env bash
# Connect a machine to Pyo as a cluster, or refresh one that's connected:
#
#   curl -fsSL https://pyo.dev/connect.sh | bash -s -- --api <pyo-address-for-servers> --token <token>
#   curl -fsSL https://pyo.dev/connect.sh | bash
#
# Your Pyo serves the same script at <your-pyo>/install/connect.sh, and its
# dashboard shows the exact command to copy, with Pyo's address and the token.
# Run without them on a cluster's first server, it reads both from the agent
# already there. This one runs connect.sh from Pyo's latest release on GitHub,
# and passes its arguments and environment on to it.
# The script asks sudo for root when it needs it.
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

# connect.sh needs Pyo's address and the cluster's token (--api, --token),
# except on a cluster's first server, where it reads both from the agent to
# refresh it, or to disconnect a cluster (--uninstall).
has_what_it_needs() {
  local a api="" token=""
  for a in "$@"; do
    case "$a" in
      --api) api=1 ;;
      --token) token=1 ;;
      --uninstall) return 0 ;;
    esac
  done
  [ -n "$api" ] && [ -n "$token" ] && return 0
  [ -z "$api" ] && [ -z "$token" ] && command -v k3s >/dev/null
}

# Everything runs from here, after bash has read the whole file: piped into
# bash, the script must not read what's left of this one as its input.
main() {
  if ! has_what_it_needs "$@"; then
    echo "pyo: connect.sh needs your Pyo's address and this cluster's token." >&2
    echo "  Copy the command from your Pyo dashboard: Clusters > Add cluster, or the" >&2
    echo "  cluster's Settings to refresh one. It fills in --api and --token." >&2
    exit 2
  fi
  PYO_SCRIPT="$(mktemp)"
  trap cleanup EXIT
  if ! curl -fsSL "$PYO_SCRIPT_URL" -o "$PYO_SCRIPT"; then
    echo "pyo: couldn't download connect.sh from $PYO_SCRIPT_URL" >&2
    exit 1
  fi
  bash "$PYO_SCRIPT" "$@"
}

main "$@"
