#!/usr/bin/env bash
# Install Pyo, or update it to the latest release:
#
#   curl -fsSL https://pyo.dev/install.sh | bash
#
# This runs the installer from Pyo's latest release on GitHub, so this address
# always gives you the current version. Running it again on a machine that
# already has Pyo updates it. Any arguments are passed on to the installer.
#
# To read the installer before running it:
#
#   curl -fsSL https://github.com/upsetdev/pyo/releases/latest/download/install.sh
#
# Docs: https://pyo.dev/docs/install
set -euo pipefail

PYO_INSTALLER_URL="https://github.com/upsetdev/pyo/releases/latest/download/install.sh"
PYO_INSTALLER=""

cleanup() {
  if [ -n "$PYO_INSTALLER" ]; then rm -f "$PYO_INSTALLER"; fi
}

# Everything runs from here, after bash has read the whole file: piped into
# bash, the installer must not read what's left of this script as its input.
main() {
  PYO_INSTALLER="$(mktemp)"
  trap cleanup EXIT
  if ! curl -fsSL "$PYO_INSTALLER_URL" -o "$PYO_INSTALLER"; then
    echo "pyo: couldn't download the installer from $PYO_INSTALLER_URL" >&2
    exit 1
  fi
  bash "$PYO_INSTALLER" "$@"
}

main "$@"
