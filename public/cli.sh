#!/bin/sh
# Install the Pyo CLI, or update it to the latest release:
#
#   curl -fsSL https://pyo.dev/cli.sh | sh
#
# This runs cli.sh from Pyo's latest release on GitHub, and passes its
# arguments and environment on to it. It downloads the CLI from that
# release and checks it against the release's checksum. PYO_VERSION=x.y.z
# installs another release, and PYO_INSTALL_DIR chooses the folder.
# It never uses sudo. Once installed, `pyo upgrade` updates it.
#
# To read the script before running it:
#
#   curl -fsSL https://github.com/upsetdev/pyo/releases/latest/download/cli.sh
#
# Docs: https://pyo.dev/docs/cli
set -eu

PYO_SCRIPT_URL="https://github.com/upsetdev/pyo/releases/latest/download/cli.sh"
PYO_SCRIPT=""

cleanup() {
  if [ -n "$PYO_SCRIPT" ]; then rm -f "$PYO_SCRIPT"; fi
}

# Everything runs from here, after sh has read the whole file: piped into
# sh, the script must not read what's left of this one as its input.
main() {
  PYO_SCRIPT="$(mktemp)"
  trap cleanup EXIT
  if ! curl -fsSL "$PYO_SCRIPT_URL" -o "$PYO_SCRIPT"; then
    echo "pyo: couldn't download cli.sh from $PYO_SCRIPT_URL" >&2
    exit 1
  fi
  sh "$PYO_SCRIPT" "$@"
}

main "$@"
