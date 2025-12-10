import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { spotifyApi } from "../api/sportify";
import SongRow from "../components/SongRow";
import { useAuth } from "../context/AuthContext";

const PlaylistPage = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    if (!token || !id) return;

    spotifyApi(`/playlists/${id}/tracks?limit=50`, token).then((data) =>
      setTracks(data.items.map((i: any) => i.track).filter(Boolean))
    );
  }, [id, token]);

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Danh sách bài hát</h1>

      <div className="bg-white/5 rounded-lg p-4">
        {tracks.map((track: any, i) => (
          <SongRow key={track.id} track={track} index={i} />
        ))}
      </div>
    </div>
  );
};

export default PlaylistPage;
