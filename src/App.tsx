// src/App.tsx
import React, { useState, useRef } from "react";
import { playlist } from "./playlist";

const App: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playTrack = (index: number) => {
    setCurrentTrack(index);
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.play();
    }
  };

  const nextTrack = () => {
    const next = (currentTrack + 1) % playlist.length;
    playTrack(next);
  };

  const prevTrack = () => {
    const prev = (currentTrack - 1 + playlist.length) % playlist.length;
    playTrack(prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-6">🎶 Music Player - Mägo de Oz</h1>

      {/* Info de la canción actual */}
      <div className="bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold">{playlist[currentTrack].title}</h2>
        <p className="text-gray-400">{playlist[currentTrack].artist}</p>

        <audio
          ref={audioRef}
          controls
          className="mt-4 w-full"
          onEnded={nextTrack}
        >
          <source src={playlist[currentTrack].url} type="audio/mp3" />
        </audio>

        {/* Botones */}
        <div className="flex justify-around mt-4">
          <button
            onClick={prevTrack}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
          >
            ⏮️ Anterior
          </button>
          <button
            onClick={nextTrack}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
          >
            ⏭️ Siguiente
          </button>
        </div>
      </div>

      {/* Playlist */}
      <div className="mt-8 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">📀 Playlist</h3>
        <ul className="space-y-2">
          {playlist.map((track, index) => (
            <li
              key={index}
              onClick={() => playTrack(index)}
              className={`cursor-pointer p-3 rounded-lg ${
                index === currentTrack ? "bg-green-600" : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {track.title} - {track.artist}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
