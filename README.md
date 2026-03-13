# Mood Tunes

A full-stack mood-based music recommendation app.

Users pick a mood and language, then the app shows songs and opens playable YouTube links.

## Live Project

- Frontend (GitHub Pages): https://prudviraj12345.github.io/Mood-Tunes/
- Backend API (local by default): http://127.0.0.1:5000

## Tech Stack

- Frontend: React + Vite + React Router
- Backend: Flask + Flask-CORS
- Data: JSON dataset (songs.json)
- YouTube resolution: yt-dlp (with fallback search resolver)

## Repository Structure

```text
Mood-Tunes/
  .github/
    workflows/
      deploy-pages.yml
  index.html                          # Root redirect for GitHub Pages URL
  music-recommendation-app/
    README.md
    backend/
      app.py
      requirements.txt
      songs.json                      # Dataset
      songs/                          # Optional local mp3 files
    frontend/
      package.json
      vite.config.js
      index.html
      src/
        App.jsx
        main.jsx
        index.css
        components/
          StartPage.jsx
          MoodPage.jsx
          LanguagePage.jsx
          SongsPage.jsx
          Player.jsx
```

## How Songs Work

Songs are not stored in a database.

- Dataset source: music-recommendation-app/backend/songs.json
- Optional audio files: music-recommendation-app/backend/songs/
- Backend filters songs by mood and language.
- Frontend also mixes in trending/generated entries for better UX.
- Play action resolves a YouTube watch link and opens it.

### Dataset Object Format

```json
{
  "title": "Butta Bomma",
  "mood": "happy",
  "language": "telugu",
  "url": "songs/buttabomma.mp3",
  "youtube_channel": "https://www.youtube.com/@adityamusic"
}
```

## API Endpoints

- GET / -> health message
- GET /songs/<mood>/<language> -> filtered songs from songs.json
- GET /songs/<path:filename> -> serves local audio from backend/songs/
- GET /youtube-play-url?q=<query> -> returns resolved YouTube watch URL

Example:

- http://127.0.0.1:5000/songs/happy/telugu

## Clone and Run Locally

## 1) Clone Repository

```bash
git clone https://github.com/prudviraj12345/Mood-Tunes.git
cd Mood-Tunes/music-recommendation-app
```

## 2) Run Backend (Terminal 1)

### Windows (PowerShell)

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
cd backend
pip install -r requirements.txt
python app.py
```

Backend starts at:

- http://127.0.0.1:5000

## 3) Run Frontend (Terminal 2)

```powershell
cd Mood-Tunes\music-recommendation-app\frontend
npm install
npm run dev
```

Frontend starts at:

- http://127.0.0.1:5173

## 4) Production Build Test

```powershell
cd Mood-Tunes\music-recommendation-app\frontend
npm run build
```

## Deployment

## Frontend Deployment (GitHub Pages)

This repo uses GitHub Actions workflow:

- .github/workflows/deploy-pages.yml

Steps:

1. Push to main branch.
2. In GitHub: Settings -> Pages -> Source = GitHub Actions.
3. Workflow builds frontend and deploys to Pages.

Note:

- Root index.html redirects the repo URL to the frontend build path.

## Backend Deployment (Optional)

GitHub Pages cannot host Flask backend.

To make full app online, deploy backend separately (Render, Railway, etc.), then set frontend env:

- VITE_API_BASE_URL=https://your-backend-url

App fallback (local dev):

- http://127.0.0.1:5000

## Add or Update Songs

1. Add or edit entries in music-recommendation-app/backend/songs.json.
2. If using local mp3, put files in music-recommendation-app/backend/songs/.
3. Ensure each song url matches the filename path.
4. Restart backend.

## Common Issues

## 1) GitHub Pages shows 404

- Ensure Pages Source is GitHub Actions.
- Check Actions workflow run is successful.
- Hard refresh browser after deploy.

## 2) Frontend loads but songs fail

- Backend not running or wrong API URL.
- Start Flask backend locally, or set VITE_API_BASE_URL to deployed backend.

## 3) YouTube link fallback behavior

- If direct resolver fails, app opens YouTube search results for that query.

## License

This project is for learning and demonstration purposes.
