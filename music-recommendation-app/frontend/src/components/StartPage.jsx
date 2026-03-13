import { useNavigate } from "react-router-dom";

export default function StartPage() {
  const navigate = useNavigate();

  return (
    <main className="page start-page">
      <div className="card hero-card start-hero">
        <div className="brand-strip">
          <span className="brand-logo">MT</span>
          <span className="brand-name">MoodTunes Station</span>
          <span className="brand-pill">Music explorer</span>
        </div>

        <div className="sticker-zone" aria-hidden="true">
          <span className="sticker sticker-1">NEW VIBES</span>
          <span className="sticker sticker-2">DAILY MIX</span>
        </div>

        <div className="start-wave" aria-hidden="true">
          <span className="wave-bar bar-1" />
          <span className="wave-bar bar-2" />
          <span className="wave-bar bar-3" />
          <span className="wave-bar bar-4" />
          <span className="wave-bar bar-5" />
        </div>

        <h1 className="title">Your Mood, Your Playlist</h1>
        <p className="subtitle">
          Pick a mood, lock your language, and jump into tracks that match your energy instantly.
        </p>

        <div className="feature-pills" aria-hidden="true">
          <span className="feature-pill">Mood first</span>
          <span className="feature-pill">Language smart</span>
          <span className="feature-pill">Instant play</span>
        </div>

        <button className="primary-btn" onClick={() => navigate("/mood")}>
          Start Listening
        </button>
      </div>
    </main>
  );
}
