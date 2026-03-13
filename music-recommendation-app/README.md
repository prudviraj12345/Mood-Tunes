# Mood-Based Music Recommendation App (MoodTunes)

This project is a beginner-friendly full-stack app with:
- Frontend: React (Vite)
- Backend: Flask API
- Data source: `songs.json`

## Project Structure

```text
music-recommendation-app
  frontend
    src
      components
        StartPage.jsx
        MoodPage.jsx
        LanguagePage.jsx
        SongsPage.jsx
        Player.jsx
      App.jsx
      main.jsx
      index.css
  backend
    app.py
    songs.json
    songs/
```

## 1) Backend Setup (Flask)

Open terminal and run:

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend runs at:
- `http://127.0.0.1:5000`

## 2) Frontend Setup (React)

Open a second terminal and run:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:
- `http://127.0.0.1:5173`

## 3) App Flow

1. Start Page -> click **Start Listening**
2. Mood Selection -> choose mood
3. Language Selection -> choose language
4. Songs Page -> click **Play** on a song
5. Player Page -> use audio controls + Play/Pause buttons

## 4) Add Real Audio Files

The sample `songs.json` uses URLs like `songs/buttabomma.mp3`.

To play real songs:
1. Put your mp3 files inside `backend/songs/`
2. Update file names in `backend/songs.json` to match
3. Restart Flask server

## 5) API Endpoint

Get filtered songs:
- `GET /songs/<mood>/<language>`

Example:
- `GET http://127.0.0.1:5000/songs/happy/telugu`

It returns JSON like:

```json
[
  {
    "title": "Butta Bomma",
    "mood": "happy",
    "language": "telugu",
    "url": "songs/buttabomma.mp3"
  }
]
```
