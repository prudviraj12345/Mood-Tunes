import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const languages = [
  {
    key: "english",
    title: "English",
    tagline: "Global chart toppers"
  },
  {
    key: "hindi",
    title: "Hindi",
    tagline: "Bollywood and indie heat"
  },
  {
    key: "telugu",
    title: "Telugu",
    tagline: "Mass beats and melody cuts"
  },
  {
    key: "tamil",
    title: "Tamil",
    tagline: "Kollywood rhythms and hooks"
  }
];

export default function LanguagePage({ appState }) {
  const navigate = useNavigate();
  const { selectedMood, setSelectedLanguage, setSelectedSong } = appState;

  useEffect(() => {
    if (!selectedMood) {
      navigate("/mood");
    }
  }, [selectedMood, navigate]);

  const handleLanguageClick = (languageKey) => {
    setSelectedLanguage(languageKey);
    setSelectedSong(null);
    navigate("/songs");
  };

  return (
    <main className="page">
      <div className="card vibe-card">
        <div className="brand-strip">
          <span className="brand-logo">MT</span>
          <span className="brand-name">Language Deck</span>
          <span className="brand-pill">Mood locked</span>
        </div>

        <div className="sticker-zone" aria-hidden="true">
          <span className="sticker sticker-3">SELECT LANG</span>
          <span className="sticker sticker-4">PLAY READY</span>
        </div>

        <h2 className="title">Select Language</h2>
        <p className="subtitle">Your mood is set. Now choose the language for your playlist.</p>

        <div className="vibe-grid language-grid">
          {languages.map((language, index) => (
            <button
              key={language.key}
              className="option-btn vibe-option language-option"
              style={{ animationDelay: `${index * 90}ms` }}
              onClick={() => handleLanguageClick(language.key)}
            >
              <span className="lang-logo" aria-hidden="true">
                {language.title.slice(0, 2).toUpperCase()}
              </span>
              <span className="vibe-content">
                <span className="vibe-title">{language.title}</span>
                <span className="vibe-subtitle">{language.tagline}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
