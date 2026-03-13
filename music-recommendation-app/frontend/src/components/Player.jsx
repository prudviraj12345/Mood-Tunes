import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Player({ appState, apiBaseUrl }) {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const { selectedSong, selectedMood, selectedLanguage } = appState;

  useEffect(() => {
    if (!selectedSong) {
      navigate("/songs");
    }
  }, [selectedSong, navigate]);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  if (!selectedSong) {
    return null;
  }

  const sourceUrl = selectedSong.url.startsWith("http")
    ? selectedSong.url
    : `${apiBaseUrl}/${selectedSong.url}`;

  return (
    <main className="page">
      <div className="card player-card">
        <h2 className="title">Now Playing</h2>
        <p className="song-title large">{selectedSong.title}</p>
        <p className="meta-text">
          Mood: {selectedMood} | Language: {selectedLanguage}
        </p>

        <audio
          ref={audioRef}
          controls
          src={sourceUrl}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          Your browser does not support the audio element.
        </audio>

        <div className="player-controls">
          <button className="primary-btn" onClick={handlePlay} disabled={isPlaying}>
            Play
          </button>
          <button className="secondary-btn" onClick={handlePause} disabled={!isPlaying}>
            Pause
          </button>
        </div>

        <button className="text-btn" onClick={() => navigate("/songs")}>
          Back to Songs
        </button>
      </div>
    </main>
  );
}
