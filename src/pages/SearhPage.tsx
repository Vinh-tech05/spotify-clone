import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { spotifyApi } from "../api/sportify";
import SongRow from "../components/SongRow";
import { useAuth } from "../context/AuthContext";

const SearchPage = () => {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [tracks, setTracks] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    if (q.length < 2) return;

    spotifyApi(
      `/search?q=${encodeURIComponent(q)}&type=track&limit=20`,
      token
    ).then((data) => setTracks(data.tracks.items));
  }, [q]);

  if (!q) return null;

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-4">Kết quả cho "{q}"</h2>

      <div className="bg-white/5 rounded-lg p-4">
        {tracks.map((t: any, i) => (
          <SongRow key={t.id} track={t} index={i} />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
