#!/usr/bin/env bash
# Add a server to a Pyo cluster:
#
#   curl -fsSL https://pyo.dev/join.sh | bash -s -- --server <host> --token <token> --name <name> --k3s <version>
#
# Your Pyo serves the same script at <your-pyo>/install/join.sh, and its
# dashboard shows the exact command to copy (Add server). This one runs join.sh
# from the Pyo release given with --version (else the latest release on
# GitHub), and passes its arguments and environment on to it.
# The script asks sudo for root when it needs it.
#
# To read the script before running it:
#
#   curl -fsSL https://github.com/upsetdev/pyo/releases/latest/download/join.sh
#
# Docs: https://pyo.dev/docs/servers
set -euo pipefail

PYO_RELEASES="https://github.com/upsetdev/pyo/releases"
PYO_SCRIPT=""

cleanup() {
  if [ -n "$PYO_SCRIPT" ]; then rm -f "$PYO_SCRIPT"; fi
}

# The release's join.sh when --version names one, so a Pyo's command runs
# the script of its own release. Else the latest release's.
script_url() {
  local version=""
  while [ $# -gt 0 ]; do
    case "$1" in
      --version) version="${2:-}"; shift 2 || shift ;;
      *) shift ;;
    esac
  done
  version="${version#v}"
  if [[ $version =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.]+)?$ ]]; then
    echo "$PYO_RELEASES/download/v$version/join.sh"
  else
    echo "$PYO_RELEASES/latest/download/join.sh"
  fi
}

# Everything runs from here, after bash has read the whole file: piped into
# bash, the script must not read what's left of this one as its input.
main() {
  local url
  url="$(script_url "$@")"
  PYO_SCRIPT="$(mktemp)"
  trap cleanup EXIT
  if ! curl -fsSL "$url" -o "$PYO_SCRIPT"; then
    echo "pyo: couldn't download join.sh from $url" >&2
    exit 1
  fi
  bash "$PYO_SCRIPT" "$@"
}

main "$@"
