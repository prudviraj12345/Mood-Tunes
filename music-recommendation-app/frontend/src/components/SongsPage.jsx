import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MIN_SONGS_TO_SHOW = 10;

const toTitleCase = (value) => value.charAt(0).toUpperCase() + value.slice(1);

const TRENDING_BY_LANGUAGE = {
  english: [
    "Espresso - Sabrina Carpenter",
    "Birds of a Feather - Billie Eilish",
    "Beautiful Things - Benson Boone",
    "Fortnight - Taylor Swift",
    "Lose Control - Teddy Swims",
    "Houdini - Dua Lipa",
    "greedy - Tate McRae",
    "Flowers - Miley Cyrus",
    "Cruel Summer - Taylor Swift",
    "As It Was - Harry Styles"
  ],
  hindi: [
    "Aaj Ki Raat",
    "Tauba Tauba",
    "Heeriye",
    "Chaleya",
    "Sajni",
    "Kesariya",
    "Naina",
    "Soulmate",
    "Husn",
    "O Maahi"
  ],
  telugu: [
    "Kissik",
    "Sooseki",
    "Fear Song",
    "Kurchi Madathapetti",
    "Inthandham",
    "Naatu Naatu",
    "Samayama",
    "Srivalli",
    "Butta Bomma",
    "Oh My Baby"
  ],
  tamil: [
    "Kaavaalaa",
    "Hukum",
    "Naa Ready",
    "Arabic Kuthu",
    "Ordinary Person",
    "Megham Karukatha",
    "Rakita Rakita",
    "Vaathi Coming",
    "Achacho",
    "Rowdy Baby"
  ]
};

const TRENDING_BY_MOOD = {
  happy: [
    "Celebration song",
    "Dance hit",
    "Party anthem",
    "Feel good pop",
    "Uplifting song"
  ],
  sad: [
    "Heartbreak song",
    "Emotional melody",
    "Melancholy ballad",
    "Sad love song",
    "Pain song"
  ],
  chill: [
    "Lofi chill mix",
    "Relaxing song",
    "Late night vibe",
    "Cafe chill track",
    "Soft indie song"
  ],
  energetic: [
    "Workout banger",
    "High energy beat",
    "Pump up song",
    "Mass dance song",
    "Power anthem"
  ],
  romantic: [
    "Romantic melody",
    "Love duet",
    "Soft love song",
    "Date night song",
    "Heartfelt track"
  ]
};

const buildTrendingSongs = (mood, language) => {
  const languageTitles = TRENDING_BY_LANGUAGE[language] || [];
  const moodHints = TRENDING_BY_MOOD[mood] || [];
  const mergedTitles = [...languageTitles, ...moodHints]
    .filter((value, index, list) => list.indexOf(value) === index)
    .slice(0, MIN_SONGS_TO_SHOW);

  return mergedTitles.map((title, index) => ({
    id: `trending-${language}-${mood}-${index + 1}`,
    title,
    mood,
    language,
    url: "",
    search_query: `${title} ${language} ${mood} official video`,
    source: "trending"
  }));
};

const getYouTubeSearchUrl = (song, selectedMood, selectedLanguage) => {
  const query = encodeURIComponent(
    song.search_query || `${song.title} ${selectedLanguage} ${selectedMood} official video`
  );

  return `https://www.youtube.com/results?search_query=${query}`;
};

export default function SongsPage({ appState, apiBaseUrl }) {
  const navigate = useNavigate();
  const { selectedMood, selectedLanguage } = appState;
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [playerMessage, setPlayerMessage] = useState("");
  const [openingSongId, setOpeningSongId] = useState("");

  useEffect(() => {
    if (!selectedMood || !selectedLanguage) {
      navigate("/mood");
      return;
    }

    const loadSongs = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(
          `${apiBaseUrl}/songs/${selectedMood}/${selectedLanguage}`
        );

        if (!response.ok) {
          throw new Error("Could not fetch songs from the server.");
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Unexpected song data format from server.");
        }

        const normalizedSongs = data.map((song, index) => ({
          ...song,
          id: `${song.title}-${song.url}-${index}`,
          source: "backend"
        }));

        const trendingSongs = buildTrendingSongs(selectedMood, selectedLanguage);
        const trendingTitles = new Set(
          trendingSongs.map((song) => song.title.toLowerCase())
        );

        const backendWithoutDuplicates = normalizedSongs.filter(
          (song) => !trendingTitles.has(song.title.toLowerCase())
        );

        const paddedSongs = [...trendingSongs, ...backendWithoutDuplicates];
        while (paddedSongs.length < MIN_SONGS_TO_SHOW) {
          const nextIndex = paddedSongs.length + 1;

          paddedSongs.push({
            id: `generated-${nextIndex}`,
            title: `${toTitleCase(selectedMood)} ${toTitleCase(selectedLanguage)} Mix ${nextIndex}`,
            mood: selectedMood,
            language: selectedLanguage,
            url: "",
            search_query: `${selectedLanguage} ${selectedMood} latest trending songs ${nextIndex}`,
            source: "generated"
          });
        }

        setSongs(paddedSongs);
      } catch (fetchError) {
        const message =
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to load songs.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadSongs();
  }, [selectedMood, selectedLanguage, apiBaseUrl, navigate]);

  const handlePlaySong = async (song) => {
    const query =
      song.search_query ||
      `${song.title} ${selectedLanguage} ${selectedMood} official video`;

    setOpeningSongId(song.id);
    setPlayerMessage(`Opening: ${song.title}`);

    try {
      const response = await fetch(
        `${apiBaseUrl}/youtube-play-url?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Could not resolve playable YouTube URL.");
      }

      const data = await response.json();
      const targetUrl = data.watch_url || getYouTubeSearchUrl(song, selectedMood, selectedLanguage);

      // Open in the same tab as requested.
      window.location.assign(targetUrl);

      setPlayerMessage(`Now opened on YouTube: ${song.title}`);
    } catch {
      const fallbackUrl = getYouTubeSearchUrl(song, selectedMood, selectedLanguage);

      // Fallback also stays in the same tab.
      window.location.assign(fallbackUrl);

      setPlayerMessage("Direct video not resolved. Opened YouTube search results instead.");
    } finally {
      setOpeningSongId("");
    }
  };

  return (
    <main className="page">
      <div className="card">
        <h2 className="title">Songs for {selectedMood} + {selectedLanguage}</h2>
        {!loading && !error && songs.length > 0 && (
          <p className="status-text">Found {songs.length} songs for your selection.</p>
        )}
        {playerMessage && <p className="status-text">{playerMessage}</p>}

        {loading && <p className="status-text">Loading songs...</p>}
        {error && <p className="status-text error-text">{error}</p>}

        {!loading && !error && songs.length === 0 && (
          <p className="status-text">No songs found. Try another mood or language.</p>
        )}

        {!loading && !error && songs.length > 0 && (
          <>
            <div className="song-list">
              {songs.map((song) => (
                <div key={song.id} className="song-row">
                  <div className="song-meta">
                    <span className="song-title">{song.title}</span>
                    {song.source === "trending" && (
                      <span className="song-badge">Trending</span>
                    )}
                  </div>
                  <div className="song-actions">
                    <button
                      className="primary-btn small"
                      onClick={() => handlePlaySong(song)}
                      disabled={openingSongId === song.id}
                    >
                      {openingSongId === song.id ? "Opening..." : "Play Song"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
