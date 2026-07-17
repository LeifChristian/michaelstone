# Music

Drop audio files here. They are picked up automatically (no config edit).

## Naming / order

```
01-first-song.mp3
02-another-title.mp3
```

Title on the site = filename without the number prefix  
(`01-first-song.mp3` → **First Song**)

## Format

**Prefer mp3** — much smaller than wav for phone / QR visitors.

If you have wavs:

```bash
brew install ffmpeg
npm run convert:wav
```

That writes `.mp3` next to each `.wav`. Commit the mp3s; remove wavs when ready.

Supported: `.mp3` `.wav` `.m4a` `.ogg` `.aac` `.flac`
