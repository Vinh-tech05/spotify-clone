import { useEffect, useState } from "react";
import { spotifyApi } from "../api/sportify.js";
import Sidebar from "../components/SideBar";
import SongRow from "../components/Songrow";
import { useAuth } from "../context/AuthContext";
import type { Track } from "../types/index.js";

function HomePage() {
  const { token, user } = useAuth();
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    if (token) {
      spotifyApi("/me/tracks?limit=20", token).then((data) =>
        setTracks(data.items.map((i: any) => i.track))
      );
    }
  }, [token]);

  return (
    <div className="flex h-screen bg-gradient-to-b from-purple-900 to-black">
      <Sidebar />
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="p-8">
          <h1 className="text-5xl font-bold mb-8">
            Chào mừng trở lại, {user?.display_name || "bạn"}!
          </h1>
          <h2 className="text-3xl font-bold mb-6">Bài hát đã thích</h2>
          <div className="bg-white/5 rounded-lg p-4">
            {tracks.map((track, i) => (
              <SongRow key={track.id} track={track} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
