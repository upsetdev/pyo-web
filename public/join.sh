#!/usr/bin/env bash
# Add a server to a Pyo cluster:
#
#   curl -fsSL https://pyo.dev/join.sh | sudo bash -s -- --server <host> --token <token> --name <name> --k3s <version>
#
# Copy the command from the dashboard (Add server), which fills these in.
# This runs join.sh from Pyo's latest release on GitHub. Pyo also serves its
# own copy at <pyo-address>/install/join.sh. Any arguments are passed on to it.
#
# To read the script before running it:
#
#   curl -fsSL https://github.com/upsetdev/pyo/releases/latest/download/join.sh
#
# Docs: https://pyo.dev/docs/servers
set -euo pipefail

PYO_SCRIPT_URL="https://github.com/upsetdev/pyo/releases/latest/download/join.sh"
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
    echo "pyo: couldn't download join.sh from $PYO_SCRIPT_URL" >&2
    exit 1
  fi
  bash "$PYO_SCRIPT" "$@"
}

main "$@"
