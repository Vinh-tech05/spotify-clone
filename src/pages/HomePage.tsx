import { useEffect, useState } from "react";
import { spotifyApi } from "../api/sportify";
import { useAuth } from "../context/AuthContext";
import PlaylistCard from "../components/PlaylistCard";
import type { Playlist } from "../types";

const HomePage = () => {
  const { token, user } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    if (!token) return;

    spotifyApi("/me/playlists?limit=12", token).then((data) =>
      setPlaylists(data.items)
    );
  }, [token]);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-[rgb(255,255,255)] mb-8">
        Chào mừng, {user?.display_name}
      </h1>

      <h2 className="text-2xl font-semibold text-[rgb(255,255,255)] mb-6">
        Playlist nổi bật
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {playlists.map((pl) => (
          <PlaylistCard key={pl.id} playlist={pl} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
