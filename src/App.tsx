import React, { useState, useRef } from "react";
import "./index.css";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  PlusCircle,
  Trash2,
  Search,
} from "lucide-react";
import Background from "./Background";

interface Song {
  id: number;
  title: string;
  artist: string;
  cover: string;
  src: string;
}

const App: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([
    {
      id: 1,
      title: "Dreaming Lights",
      artist: "Noir Sky",
      cover:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    },
    {
      id: 2,
      title: "Electric Waves",
      artist: "Nova Pulse",
      cover:
        "https://images.unsplash.com/photo-1507878866276-a947ef722fee?auto=format&fit=crop&w=800&q=80",
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [newSong, setNewSong] = useState({
    title: "",
    artist: "",
    cover: "",
    src: "",
  });
  const [search, setSearch] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);

  // 🎧 Controladores
  const togglePlay = () => {
    if (isPlaying) audioRef.current?.pause();
    else audioRef.current?.play();
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    setCurrentIndex((prev) => (prev + 1) % songs.length);
    setIsPlaying(true);
    setTimeout(() => audioRef.current?.play(), 200);
  };

  const playPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + songs.length) % songs.length);
    setIsPlaying(true);
    setTimeout(() => audioRef.current?.play(), 200);
  };

  // ➕ Agregar canción
  const addSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSong.title || !newSong.artist || !newSong.src) return;
    const song: Song = {
      id: Date.now(),
      ...newSong,
      cover:
        newSong.cover ||
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    };
    setSongs([...songs, song]);
    setNewSong({ title: "", artist: "", cover: "", src: "" });
  };

  // 🗑️ Eliminar canción
  const deleteSong = (id: number) => {
    setSongs(songs.filter((s) => s.id !== id));
    if (songs[currentIndex]?.id === id) {
      setIsPlaying(false);
      audioRef.current?.pause();
      setCurrentIndex(0);
    }
  };

  // 🔍 Filtro búsqueda
  const filteredSongs = songs.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.artist.toLowerCase().includes(search.toLowerCase())
  );

  const currentSong = songs[currentIndex];

  return (
    <>
      {/* 🌌 Fondo visual profesional */}
      <Background />

      {/* 🎶 Contenedor principal */}
      <div className="full-app">
        {/* 🧭 Sidebar */}
        <aside className="sidebar glass">
          <div className="brand">
            <span className="logo">🎧</span>
            <div>
              <span className="brand-title">Laboralink Music</span>
              <div className="brand-sub">Play, Discover & Relax</div>
            </div>
          </div>

          <div className="search">
            <Search size={18} style={{ marginRight: "6px" }} />
            <input
              placeholder="Buscar canción..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="playlist-scroll">
            <div className="pl-header">🎵 Tu lista</div>
            {filteredSongs.map((song, i) => (
              <div
                key={song.id}
                className={`pl-row ${i === currentIndex ? "active" : ""}`}
              >
                <img
                  src={song.cover}
                  className="pl-cover"
                  onClick={() => setCurrentIndex(i)}
                />
                <div
                  className="pl-meta"
                  onClick={() => setCurrentIndex(i)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="pl-title">{song.title}</div>
                  <div className="pl-artist">{song.artist}</div>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => deleteSong(song.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Formulario de agregar */}
          <form className="add-form" onSubmit={addSong}>
            <input
              placeholder="Título"
              value={newSong.title}
              onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
            />
            <input
              placeholder="Artista"
              value={newSong.artist}
              onChange={(e) =>
                setNewSong({ ...newSong, artist: e.target.value })
              }
            />
            <input
              placeholder="URL de carátula"
              value={newSong.cover}
              onChange={(e) =>
                setNewSong({ ...newSong, cover: e.target.value })
              }
            />
            <input
              placeholder="URL de audio (mp3)"
              value={newSong.src}
              onChange={(e) => setNewSong({ ...newSong, src: e.target.value })}
            />
            <button className="btn">
              <PlusCircle size={18} style={{ marginRight: "4px" }} /> Agregar
            </button>
          </form>
        </aside>

        {/* 🖥️ Panel principal */}
        <main className="main glass">
          <div className="now">
            <img src={currentSong.cover} alt="cover" className="now-cover" />
            <div className="now-info">
              <h2 className="now-title">{currentSong.title}</h2>
              <p className="now-artist">{currentSong.artist}</p>

              <div className="controls-row">
                <button className="icon" onClick={playPrev}>
                  <SkipBack />
                </button>

                <button className="playbtn" onClick={togglePlay}>
                  {isPlaying ? <Pause /> : <Play />}
                </button>

                <button className="icon" onClick={playNext}>
                  <SkipForward />
                </button>
              </div>

              <div className="volume">
                <Volume2 />
                <input
                  type="range"
                  className="vol"
                  onChange={(e) => {
                    if (audioRef.current)
                      audioRef.current.volume = Number(e.target.value) / 100;
                  }}
                />
              </div>
            </div>
          </div>

          <audio ref={audioRef} src={currentSong.src} onEnded={playNext} />
        </main>
      </div>
    </>
  );
};

export default App;
