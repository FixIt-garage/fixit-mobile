#!/usr/bin/env bash
# One-command local setup for fixit-mobile (macOS / Linux / Git Bash).
#
#   ./scripts/bootstrap.sh                                  # install deps, create .env
#   ./scripts/bootstrap.sh --api-url http://192.168.1.20:8000
#
# Then start the app with: npm start
# Safe to run again: an existing .env is kept.
set -euo pipefail

cd "$(dirname "$0")/.."

API_URL=""
while [ $# -gt 0 ]; do
  case "$1" in
    --api-url)
      API_URL="${2:-}"
      shift 2
      ;;
    -h | --help)
      sed -n '2,8p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *)
      echo "Unknown option: $1 (use --help)" >&2
      exit 2
      ;;
  esac
done

step() { printf '\n==> %s\n' "$1"; }
fail() {
  printf '\nERROR: %s\n' "$1" >&2
  exit 1
}

# IPv4 address of this computer on the local network (what a phone or emulator can reach):
# the address of the interface behind the default route, not e.g. a Docker bridge.
lan_ip() {
  local ip="" iface=""
  if [ "$(uname -s)" = "Darwin" ]; then # macOS
    iface="$(route -n get default 2>/dev/null | awk '/interface:/ { print $2 }' || true)"
    if [ -n "$iface" ]; then
      ip="$(ipconfig getifaddr "$iface" 2>/dev/null || true)"
    fi
  fi
  if [ -z "$ip" ] && command -v ip >/dev/null 2>&1; then # Linux (no traffic is sent)
    ip="$(ip -4 route get 1.1.1.1 2>/dev/null |
      awk '{ for (i = 1; i < NF; i++) if ($i == "src") { print $(i + 1); exit } }' || true)"
  fi
  if [ -z "$ip" ] && command -v hostname >/dev/null 2>&1; then
    ip="$(hostname -I 2>/dev/null | awk '{ print $1 }' || true)"
  fi
  printf '%s' "$ip"
}

step "Checking Node.js"
command -v node >/dev/null 2>&1 || fail "Node.js is not installed. Install Node $(cat .nvmrc) LTS: https://nodejs.org/"
node_version="$(node -p 'process.versions.node')"
if ! node -e '
  const [major, minor] = process.versions.node.split(".").map(Number);
  const ok = (major === 22 && minor >= 13) || (major === 24 && minor >= 3) || major >= 26;
  process.exit(ok ? 0 : 1);
'; then
  echo "WARNING: Node $node_version found, but Expo needs Node ^22.13 or ^24.3."
  echo "         With nvm: nvm install && nvm use   (reads .nvmrc)"
else
  echo "Node $node_version"
fi

step "Installing dependencies (npm ci)"
npm ci || fail "npm ci failed. See the output above."

step "Preparing .env"
if [ -f .env ]; then
  echo ".env already exists, keeping it."
else
  if [ -z "$API_URL" ]; then
    ip="$(lan_ip)"
    if [ -n "$ip" ]; then
      API_URL="http://${ip}:8000"
    else
      API_URL="http://localhost:8000"
      echo "WARNING: could not detect this computer's local IP. Using $API_URL,"
      echo "         which works only for the iOS Simulator and web. Edit .env for a phone or emulator."
    fi
  fi
  printf 'EXPO_PUBLIC_API_URL=%s\n' "$API_URL" >.env
  echo "Created .env with EXPO_PUBLIC_API_URL=$API_URL"
fi

cat <<'MSG'

FixIt mobile is ready.
  Start the app:  npm start   (then scan the QR code with Expo Go, or press "a" for Android)
  The backend must be running (fixit-backend: scripts/bootstrap) and reachable at the
  address in .env (EXPO_PUBLIC_API_URL).
MSG
