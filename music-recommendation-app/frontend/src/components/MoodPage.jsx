import { useNavigate } from "react-router-dom";

const moods = [
  {
    key: "happy",
    title: "Happy",
    subtitle: "Sunshine pop and smile beats",
    accent: "sun"
  },
  {
    key: "sad",
    title: "Sad",
    subtitle: "Late night feels and soft vocals",
    accent: "moon"
  },
  {
    key: "chill",
    title: "Chill",
    subtitle: "Lofi textures and cafe vibe",
    accent: "wave"
  },
  {
    key: "energetic",
    title: "Energetic",
    subtitle: "Gym mode and hype drops",
    accent: "bolt"
  },
  {
    key: "romantic",
    title: "Romantic",
    subtitle: "Warm melodies for date mood",
    accent: "heart"
  }
];

export default function MoodPage({ appState }) {
  const navigate = useNavigate();
  const { setSelectedMood, setSelectedLanguage, setSelectedSong } = appState;

  const handleMoodClick = (moodKey) => {
    setSelectedMood(moodKey);
    setSelectedLanguage("");
    setSelectedSong(null);
    navigate("/language");
  };

  return (
    <main className="page">
      <div className="card vibe-card">
        <div className="brand-strip">
          <span className="brand-logo">MT</span>
          <span className="brand-name">MoodTunes Station</span>
          <span className="brand-pill">Live vibe picker</span>
        </div>

        <div className="sticker-zone" aria-hidden="true">
          <span className="sticker sticker-1">NEW DROP</span>
          <span className="sticker sticker-2">HOT MIX</span>
        </div>

        <h2 className="title">Pick Your Vibe</h2>
        <p className="subtitle">Choose a mood and we will spin tracks that match your energy.</p>

        <div className="vibe-grid">
          {moods.map((mood, index) => (
            <button
              key={mood.key}
              className={`option-btn vibe-option vibe-${mood.accent}`}
              style={{ animationDelay: `${index * 80}ms` }}
              onClick={() => handleMoodClick(mood.key)}
            >
              <span className="vibe-icon" aria-hidden="true" />
              <span className="vibe-content">
                <span className="vibe-title">{mood.title}</span>
                <span className="vibe-subtitle">{mood.subtitle}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
