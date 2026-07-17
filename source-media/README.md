# Source media (not deployed)

Keep WAV masters here. Cloudflare Pages rejects files over **25 MiB**, so these must stay out of `public/`.

```bash
# Convert to mp3
npm run convert:wav -- source-media/wavs

# Then copy into public/music with numbered names, e.g.
# 03-Road to Redemption Mix.mp3
```
