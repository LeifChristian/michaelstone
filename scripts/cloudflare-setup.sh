#!/usr/bin/env bash
# One-time Cloudflare Pages setup for michaelstone.
# Requires: wrangler logged in (`npx wrangler login`) OR CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PROJECT="michaelstone"
DOMAIN="michaelstonepoet.com"
REPO="LeifChristian/michaelstone"

echo "==> Checking Cloudflare auth..."
if ! npx wrangler whoami >/dev/null 2>&1; then
  echo "Not logged in. Run: npx wrangler login"
  exit 1
fi

echo "==> Account"
ACCOUNT_ID="$(npx wrangler whoami 2>/dev/null | grep -oE 'Account ID: [0-9a-f]+' | awk '{print $3}' || true)"
if [ -z "$ACCOUNT_ID" ]; then
  echo "Could not read Account ID from wrangler whoami."
  echo "Find it in Cloudflare Dashboard → Workers & Pages → right sidebar."
  read -r -p "Paste Cloudflare Account ID: " ACCOUNT_ID
fi
echo "Account ID: $ACCOUNT_ID"

echo "==> Create Pages project (if missing)"
npx wrangler pages project create "$PROJECT" --production-branch=main 2>/dev/null || true

echo "==> Build and deploy"
npm run deploy

echo ""
echo "==> GitHub Actions secrets (for auto-deploy on push)"
echo "Add these at: https://github.com/$REPO/settings/secrets/actions"
echo "  CLOUDFLARE_ACCOUNT_ID = $ACCOUNT_ID"
echo "  CLOUDFLARE_API_TOKEN  = (create at https://dash.cloudflare.com/profile/api-tokens)"
echo "    Template: Edit Cloudflare Workers — include Account / Cloudflare Pages / Edit"
echo ""
echo "==> Custom domain (dashboard — DNS must point here first)"
echo "  https://dash.cloudflare.com → Workers & Pages → $PROJECT → Custom domains"
echo "  Add: $DOMAIN and optionally www.$DOMAIN"
echo ""
echo "Done. Check Pages URL in deploy output above."
