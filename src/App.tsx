import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Shuffle, Repeat, Heart, Search, Music, Clock, List } from 'lucide-react';

const freePlaylist = [
  {
    id: 1,
    title: "Acoustic Breeze",
    artist: "Benjamin Tissot",
    url: "https://www.bensound.com/bensound-music/bensound-acousticbreeze.mp3",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop",
    duration: 158,
    genre: "Acoustic"
  },
  {
    id: 2,
    title: "Summer",
    artist: "Benjamin Tissot",
    url: "https://www.bensound.com/bensound-music/bensound-summer.mp3",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    duration: 143,
    genre: "Pop"
  },
  {
    id: 3,
    title: "Creative Minds",
    artist: "Benjamin Tissot",
    url: "https://www.bensound.com/bensound-music/bensound-creativeminds.mp3",
    cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop",
    duration: 145,
    genre: "Electronic"
  },
  {
    id: 4,
    title: "Sunny",
    artist: "Benjamin Tissot",
    url: "https://www.bensound.com/bensound-music/bensound-sunny.mp3",
    cover: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&h=400&fit=crop",
    duration: 133,
    genre: "Jazz"
  },
  {
    id: 5,
    title: "Energy",
    artist: "Benjamin Tissot",
    url: "https://www.bensound.com/bensound-music/bensound-energy.mp3",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop",
    duration: 169,
    genre: "Rock"
  }
];

export default function MusicPlayer() {
  const [playlist] = useState(freePlaylist);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [visualizer, setVisualizer] = useState<number[]>(new Array(40).fill(0));
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleNext = () => {
    if (repeatMode === 2) {
      audioRef.current?.play();
      return;
    }
    
    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      nextIndex = (currentTrack + 1) % playlist.length;
    }
    
    setCurrentTrack(nextIndex);
    setIsPlaying(true);
    setTimeout(() => audioRef.current?.play(), 100);
  };

  const handlePrev = () => {
    if (currentTime > 3) {
      audioRef.current!.currentTime = 0;
    } else {
      const prevIndex = (currentTrack - 1 + playlist.length) % playlist.length;
      setCurrentTrack(prevIndex);
      setIsPlaying(true);
      setTimeout(() => audioRef.current?.play(), 100);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnd = () => handleNext();

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnd);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnd);
    };
  }, [currentTrack, repeatMode, isShuffle, playlist.length]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setVisualizer(prev => prev.map(() => Math.random() * 100));
      }, 80);
      return () => clearInterval(interval);
    } else {
      setVisualizer(new Array(40).fill(20));
    }
  }, [isPlaying]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const cycleRepeat = () => {
    setRepeatMode((repeatMode + 1) % 3);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredPlaylist = playlist.filter(track =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentSong = playlist[currentTrack];
  const progress = (currentTime / duration) * 100 || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-[1600px]">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-pink-500/30">
              <Music size={32} className="text-white" />
            </div>
            <h1 className="text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">
              SoundWave Pro
            </h1>
          </div>
          <p className="text-gray-300 text-xl">Tu música, tu espacio, tu momento</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* LEFT: Playlist */}
          <div className="xl:order-1">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl h-full">
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <List size={20} className="text-purple-400" />
                  Playlist
                </h3>
                <span className="text-sm text-gray-400 bg-white/10 px-3 py-1 rounded-full">
                  {filteredPlaylist.length}
                </span>
              </div>

              <div className="space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto custom-scrollbar pr-2">
                {filteredPlaylist.map((track) => (
                  <div
                    key={track.id}
                    onClick={() => {
                      setCurrentTrack(playlist.indexOf(track));
                      setIsPlaying(true);
                      setTimeout(() => audioRef.current?.play(), 100);
                    }}
                    className={`group p-3 rounded-xl cursor-pointer transition-all ${
                      playlist[currentTrack].id === track.id
                        ? 'bg-gradient-to-r from-pink-500/30 to-purple-500/30 border border-purple-500/50'
                        : 'bg-white/5 hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <img 
                          src={track.cover} 
                          alt={track.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        {playlist[currentTrack].id === track.id && isPlaying && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate text-sm">{track.title}</p>
                        <p className="text-xs text-gray-400 truncate">{track.artist}</p>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(track.id);
                        }}
                        className="flex-shrink-0"
                      >
                        <Heart 
                          size={16}
                          className={favorites.includes(track.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'} 
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER: Main Player */}
          <div className="xl:order-2 xl:col-span-1">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
              
              {/* Album Cover */}
              <div className="relative mb-6 group">
                <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative">
                  <img 
                    src={currentSong.cover} 
                    alt={currentSong.title}
                    className="w-full aspect-square object-cover rounded-2xl shadow-2xl"
                  />
                  <button
                    onClick={() => toggleFavorite(currentSong.id)}
                    className="absolute top-4 right-4 p-3 bg-black/50 backdrop-blur-md rounded-full hover:bg-black/70 transition-all"
                  >
                    <Heart 
                      className={favorites.includes(currentSong.id) ? 'fill-red-500 text-red-500' : 'text-white'}
                      size={20} 
                    />
                  </button>
                </div>
              </div>

              {/* Song Info */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-1 truncate">{currentSong.title}</h2>
                <p className="text-gray-400 truncate">{currentSong.artist}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="px-2 py-1 bg-purple-500/30 rounded-full text-xs">
                    {currentSong.genre}
                  </span>
                  <span className="px-2 py-1 bg-white/10 rounded-full text-xs flex items-center gap-1">
                    <Clock size={10} />
                    {formatTime(duration)}
                  </span>
                </div>
              </div>

              {/* Visualizer */}
              <div className="mb-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
                <div className="flex items-end justify-center gap-0.5 h-20">
                  {visualizer.map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-pink-500 via-purple-500 to-blue-500 rounded-full transition-all duration-100"
                      style={{ 
                        height: `${height}%`,
                        opacity: isPlaying ? 1 : 0.3
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer progress-bar"
                  style={{
                    background: `linear-gradient(to right, #ec4899 0%, #a855f7 ${progress}%, rgba(255,255,255,0.1) ${progress}%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Main Controls */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <button
                  onClick={handlePrev}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                >
                  <SkipBack size={24} />
                </button>

                <button
                  onClick={togglePlay}
                  className="p-5 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-2xl transition-all shadow-xl shadow-purple-500/50"
                >
                  {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-0.5" />}
                </button>

                <button
                  onClick={handleNext}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                >
                  <SkipForward size={24} />
                </button>
              </div>

              {/* Secondary Controls */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsShuffle(!isShuffle)}
                    className={`p-2.5 rounded-lg transition-all ${
                      isShuffle ? 'bg-purple-500 text-white' : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <Shuffle size={18} />
                  </button>

                  <button
                    onClick={cycleRepeat}
                    className={`p-2.5 rounded-lg transition-all relative ${
                      repeatMode > 0 ? 'bg-purple-500 text-white' : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <Repeat size={18} />
                    {repeatMode === 2 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full text-[10px] flex items-center justify-center font-bold">
                        1
                      </span>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                  <button onClick={toggleMute}>
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer volume-bar"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Queue Info */}
          <div className="xl:order-3">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl h-full">
              <h3 className="text-lg font-bold mb-4">Siguiente en la cola</h3>
              <div className="space-y-3">
                {playlist.slice(currentTrack + 1, currentTrack + 6).map((track, index) => (
                  <div
                    key={track.id}
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
                    onClick={() => {
                      setCurrentTrack(playlist.indexOf(track));
                      setIsPlaying(true);
                      setTimeout(() => audioRef.current?.play(), 100);
                    }}
                  >
                    <span className="text-gray-500 text-sm w-6">{index + 1}</span>
                    <img 
                      src={track.cover} 
                      alt={track.title}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{track.title}</p>
                      <p className="text-xs text-gray-400 truncate">{track.artist}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
                <h4 className="font-bold mb-2 text-sm">📊 Estadísticas</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total canciones:</span>
                    <span className="font-semibold">{playlist.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Favoritos:</span>
                    <span className="font-semibold">{favorites.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Reproduciendo:</span>
                    <span className="font-semibold">{currentTrack + 1}/{playlist.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <audio ref={audioRef} src={currentSong.url} />

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .progress-bar::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ec4899, #a855f7);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(236, 72, 153, 0.6);
        }
        
        .progress-bar::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ec4899, #a855f7);
          cursor: pointer;
          border: none;
        }

        .volume-bar::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
        }
        
        .volume-bar::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #ec4899, #a855f7);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}