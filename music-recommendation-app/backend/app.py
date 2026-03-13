from pathlib import Path
import json
import subprocess
import sys
from urllib.parse import urlencode, quote_plus
from urllib.request import urlopen
from urllib.error import HTTPError, URLError

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

BASE_DIR = Path(__file__).resolve().parent
SONGS_FILE = BASE_DIR / "songs.json"
SONGS_DIR = BASE_DIR / "songs"


def load_songs():
  if not SONGS_FILE.exists():
    return []

  with SONGS_FILE.open("r", encoding="utf-8") as file:
    return json.load(file)


def build_youtube_search_url(query):
  return f"https://www.youtube.com/results?search_query={quote_plus(query)}"


def resolve_with_ytdlp(query):
  command = [
    sys.executable,
    "-m",
    "yt_dlp",
    f"ytsearch1:{query}",
    "--print",
    "%(id)s",
    "--skip-download",
    "--no-warnings"
  ]

  try:
    result = subprocess.run(
      command,
      capture_output=True,
      text=True,
      timeout=12,
      check=False
    )

    if result.returncode == 0:
      video_id = result.stdout.strip().splitlines()[0]
      if video_id:
        return {
          "watch_url": f"https://www.youtube.com/watch?v={video_id}",
          "source": "yt-dlp"
        }
  except (subprocess.SubprocessError, IndexError):
    pass

  return None


def resolve_youtube_watch_url(query):
  ytdlp_result = resolve_with_ytdlp(query)
  if ytdlp_result:
    return ytdlp_result

  api_url = "https://yt.lemnoslife.com/noKey/search?" + urlencode({
    "part": "id,snippet",
    "q": query,
    "type": "video",
    "maxResults": 1
  })

  try:
    with urlopen(api_url, timeout=8) as response:
      payload = json.load(response)

    items = payload.get("items", [])
    if items:
      video_id = items[0].get("id", {}).get("videoId")
      if video_id:
        return {
          "watch_url": f"https://www.youtube.com/watch?v={video_id}",
          "source": "resolved"
        }
  except (HTTPError, URLError, TimeoutError, json.JSONDecodeError):
    pass

  return {
    "watch_url": build_youtube_search_url(query),
    "source": "fallback-search"
  }


@app.get("/")
def home():
  return jsonify({"message": "MoodTunes API is running"})


@app.get("/songs/<mood>/<language>")
def get_songs(mood, language):
  songs = load_songs()

  filtered = [
    song for song in songs
    if song.get("mood", "").lower() == mood.lower()
    and song.get("language", "").lower() == language.lower()
  ]

  return jsonify(filtered)


@app.get("/songs/<path:filename>")
def serve_song(filename):
  return send_from_directory(SONGS_DIR, filename)


@app.get("/youtube-play-url")
def youtube_play_url():
  query = request.args.get("q", "").strip()

  if not query:
    return jsonify({"error": "Missing query parameter q"}), 400

  result = resolve_youtube_watch_url(query)
  return jsonify(result)


if __name__ == "__main__":
  app.run(debug=True)
