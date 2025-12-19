import { useEffect, useState } from "react";
import { spotifyApi } from "../api/sportify";
import Player from "../components/Player";
import SongRow from "../components/Songrow";
import { useAuth } from "../context/AuthContext";
import type { Track } from "../types";

const LikeSongsPage = () => {
  const { token } = useAuth();
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    if (!token) return;

    spotifyApi("/me/tracks?limit=50", token).then((data) =>
      setTracks(data.items.map((i: any) => i.track))
    );
  }, [token]);

  return (
    <div className="flex h-screen bg-gradient-to-b from-black-900 to-black">
      <div className="flex-1 overflow-y-auto pb-24 p-8">
        <h1 className="text-4xl font-bold text-[rgb(255,255,255)] mb-8">
          Bài hát đã thích
        </h1>

        <div className="bg-white/5 rounded-lg p-4">
          {tracks.map((track, i) => (
            <SongRow key={track.id} track={track} index={i} tracks={tracks} />
          ))}
        </div>
      </div>

      <Player />
    </div>
  );
};

export default LikeSongsPage;
