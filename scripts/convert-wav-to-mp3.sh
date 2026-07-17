#!/usr/bin/env bash
# Convert WAVs to mp3 (much smaller for phones / QR visitors).
# Usage:
#   npm run convert:wav              # public/wavs + public/music
#   npm run convert:wav -- public/wavs
# Requires: brew install ffmpeg
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIRS=()

if [ "$#" -gt 0 ]; then
  for d in "$@"; do
    DIRS+=("$ROOT/$d")
  done
else
  DIRS+=("$ROOT/source-media/wavs" "$ROOT/public/wavs" "$ROOT/public/music")
fi

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg not found. Install with: brew install ffmpeg"
  exit 1
fi

converted=0
skipped=0

for DIR in "${DIRS[@]}"; do
  if [ ! -d "$DIR" ]; then
    echo "Skip missing: $DIR"
    continue
  fi

  echo "==> $DIR"
  shopt -s nullglob
  wavs=("$DIR"/*.wav "$DIR"/*.WAV)
  if [ ${#wavs[@]} -eq 0 ]; then
    echo "  No .wav files"
    continue
  fi

  for f in "${wavs[@]}"; do
    size=$(wc -c < "$f" | tr -d ' ')
    if [ "$size" -eq 0 ]; then
      echo "  Skip empty: $(basename "$f")"
      skipped=$((skipped + 1))
      continue
    fi

    out="${f%.*}.mp3"
    echo "  $(basename "$f") → $(basename "$out")"
    ffmpeg -y -hide_banner -loglevel error -i "$f" -codec:a libmp3lame -qscale:a 2 "$out"
    converted=$((converted + 1))
  done
done

echo "Done. Converted: $converted  Skipped empty: $skipped"
