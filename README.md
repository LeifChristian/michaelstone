# Michael Stone Memorial

Static memorial site — music, photographs, and story.  
**Domain:** [michaelstonepoet.com](https://michaelstonepoet.com)  
**Stack:** React · Vite · TypeScript · Cloudflare Pages (no backend)

---

## Local

```bash
npm install
npm run dev
```

---

## Adding photos & music (auto)

Drop files in `public/`. The site scans them on every dev/build. **No React edits.**

### Photos — `public/images/`

```
hero.jpg           ← homepage (excluded from gallery)
01-beach.jpg
02-studio.jpg
03-friends.jpg
```

Order = natural filename sort (`1`, `2`, `10` work).  
Lightbox carousel (arrows / swipe / keyboard) uses that same order.

### Music — `public/music/`

```
01-first-song.mp3
02-another-title.mp3
```

- Title = filename minus the number prefix  
- Player: play/pause, seek, prev/next, auto-advance  
- **Download** on the player and on each track row

**Prefer mp3 over wav** (phones + QR visitors). Convert:

```bash
brew install ffmpeg   # once
npm run convert:wav   # public/music/*.wav → *.mp3
```

Then commit the mp3s and delete the wavs when you’re happy.

### Story

Edit `content/biography.md`.

### Site copy

`src/config/site.ts` — name, subtitle, intro text.

---

## Deploy rundown (do this in order)

### Timing reality check

| Step | Typical time |
|------|----------------|
| Cloudflare Pages deploy | **1–3 minutes** |
| Custom domain if DNS already on Cloudflare | **minutes** |
| Switching Porkbun nameservers → Cloudflare | often **&lt;1 hour**, up to **24–48h** |

QR codes already hit `https://michaelstonepoet.com`. Get the **site** live first on a `*.pages.dev` URL, then attach the domain so you’re not blocked on DNS.

---

### Step 1 — Put the code on GitHub

```bash
# from this folder
git add .
git commit -m "Michael Stone memorial site"
# create a GitHub repo, then:
git remote add origin git@github.com:YOU/michaelstone.git
git branch -M main
git push -u origin main
```

---

### Step 2 — Cloudflare Pages (site goes live)

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Pick the `michaelstone` repo
3. Build settings:
   - **Framework preset:** Vite  
   - **Build command:** `npm run build`  
   - **Build output directory:** `dist`  
   - **Root directory:** `/` (unless the app isn’t at repo root)
4. **Save and Deploy**

You get something like `https://michaelstone.pages.dev` in a couple minutes. Open it on your phone and smoke-test Home / Music / Photos / Story.

**CLI alternative** (same result, no Git UI):

```bash
npx wrangler login
npm run deploy
```

---

### Step 3 — Point michaelstonepoet.com (Porkbun → Cloudflare)

**Recommended (what worked well before): Cloudflare DNS**

1. Cloudflare → **Add a site** → `michaelstonepoet.com` (Free plan)
2. Copy the two Cloudflare **nameservers**
3. Porkbun → domain → **Authoritative Nameservers** → paste Cloudflare’s nameservers → save
4. Wait until Cloudflare shows the zone **Active**
5. Pages project → **Custom domains** → Add:
   - `michaelstonepoet.com`
   - optionally `www.michaelstonepoet.com`
6. Cloudflare creates DNS + SSL. Wait for the padlock on `https://michaelstonepoet.com`

**If you keep DNS at Porkbun instead**

- In Pages → Custom domains, add the domain and follow the exact CNAME/A records Cloudflare shows
- Apex (`@`) is fiddlier than nameservers; prefer the Cloudflare DNS route if you can

---

### Step 4 — Go-live checklist

- [ ] `*.pages.dev` works on mobile
- [ ] Photos appear in the right order
- [ ] Music plays + download works
- [ ] `https://michaelstonepoet.com` loads with a valid certificate
- [ ] QR sticker scan lands on the homepage

After that, every push to `main` redeploys automatically.

---

## Why media “just works”

Browsers can’t list a `public/` folder on a static host. A tiny script (`scripts/scan-media.mjs`) runs before `dev` / `build` and writes `src/config/media.generated.ts` from whatever files are on disk. Cloudflare runs the same build, so production matches your laptop.
