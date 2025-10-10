// src/data/playlist.ts
export type Track = {
  id: string;
  title: string;
  artist: string;
  src: string;
  cover?: string;
};

export const initialPlaylist: Track[] = [
  {
    id: "1",
    title: "Noise Attack",
    artist: "Kevin MacLeod",
    src: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Kevin_MacLeod/Metal_Madness/Kevin_MacLeod_-_Noise_Attack.mp3",
    cover: "https://picsum.photos/id/1011/300/300",
  },
  {
    id: "2",
    title: "Gearhead",
    artist: "Kevin MacLeod",
    src: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Kevin_MacLeod/Metal_Madness/Kevin_MacLeod_-_Gearhead.mp3",
    cover: "https://picsum.photos/id/1025/300/300",
  },
  {
    id: "3",
    title: "The Whip (Extended)",
    artist: "Kevin MacLeod",
    src: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Kevin_MacLeod/Rock_Classic/Kevin_MacLeod_-_The_Whip_Extended_Version.mp3",
    cover: "https://picsum.photos/id/1039/300/300",
  },
  {
    id: "4",
    title: "Hot Rock",
    artist: "Kevin MacLeod",
    src: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Kevin_MacLeod/Metal_Madness/Kevin_MacLeod_-_Hot_Rock.mp3",
    cover: "https://picsum.photos/id/1043/300/300",
  },
  {
    id: "5",
    title: "Rock Hybrid",
    artist: "Kevin MacLeod",
    src: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Kevin_MacLeod/Metal_Madness/Kevin_MacLeod_-_Rock_Hybrid.mp3",
    cover: "https://picsum.photos/id/1056/300/300",
  },
  {
    id: "6",
    title: "What You Want",
    artist: "Kevin MacLeod",
    src: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Kevin_MacLeod/Metal_Madness/Kevin_MacLeod_-_What_You_Want.mp3",
    cover: "https://picsum.photos/id/1062/300/300",
  },
];
