# Point Porkbun Domain → Cloudflare Pages

## Option A: CNAME (recommended)

1. Go to **Porkbun → Domain → DNS Records**
2. Delete any existing A or CNAME records for `@` or `www`
3. Add:

| Type | Host | Answer |
|------|------|--------|
| CNAME | _(blank for root)_ | `michaelstone.pages.dev` |
| CNAME | www | `michaelstone.pages.dev` |

4. In **Cloudflare Dashboard → Pages → michaelstone → Custom domains**, add your domain (e.g. `michaelstonepoet.com`)
5. Cloudflare will verify via the CNAME. SSL auto-provisions.

> Porkbun supports CNAME flattening at the root, so this works without an A record.

## Option B: Cloudflare Nameservers (if CNAME doesn't work)

1. In Cloudflare, add your domain as a site (free plan)
2. Cloudflare gives you two nameservers (e.g. `ada.ns.cloudflare.com`)
3. In Porkbun → Domain → Nameservers, replace defaults with Cloudflare's
4. Wait ~15min for propagation
5. In Cloudflare DNS, add CNAME `@` → `michaelstone.pages.dev`
6. In Pages → Custom domains, add your domain

Done. SSL is automatic either way.
