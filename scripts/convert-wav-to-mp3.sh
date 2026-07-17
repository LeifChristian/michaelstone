#!/usr/bin/env bash
# Convert WAVs in public/music to mp3 (much smaller for phones / QR visitors).
# Requires: brew install ffmpeg
set -euo pipefail

DIR="$(cd "$(dirname "$0")/../public/music" && pwd)"
cd "$DIR"

shopt -s nullglob
wavs=(*.wav *.WAV)
if [ ${#wavs[@]} -eq 0 ]; then
  echo "No .wav files found in public/music"
  exit 0
fi

for f in "${wavs[@]}"; do
  out="${f%.*}.mp3"
  echo "Converting: $f → $out"
  ffmpeg -y -i "$f" -codec:a libmp3lame -qscale:a 2 "$out"
done

echo "Done. Prefer committing the .mp3 files (and remove .wav to keep the repo light)."
