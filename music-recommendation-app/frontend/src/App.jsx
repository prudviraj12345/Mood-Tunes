import { Route, Routes } from "react-router-dom";
import { useMemo, useState } from "react";
import StartPage from "./components/StartPage";
import MoodPage from "./components/MoodPage";
import LanguagePage from "./components/LanguagePage";
import SongsPage from "./components/SongsPage";
import Player from "./components/Player";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

export default function App() {
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedSong, setSelectedSong] = useState(null);

  const appState = useMemo(
    () => ({
      selectedMood,
      selectedLanguage,
      selectedSong,
      setSelectedMood,
      setSelectedLanguage,
      setSelectedSong
    }),
    [selectedMood, selectedLanguage, selectedSong]
  );

  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route
          path="/mood"
          element={<MoodPage appState={appState} />}
        />
        <Route
          path="/language"
          element={<LanguagePage appState={appState} />}
        />
        <Route
          path="/songs"
          element={<SongsPage appState={appState} apiBaseUrl={API_BASE_URL} />}
        />
        <Route
          path="/player"
          element={<Player appState={appState} apiBaseUrl={API_BASE_URL} />}
        />
      </Routes>
    </div>
  );
}
