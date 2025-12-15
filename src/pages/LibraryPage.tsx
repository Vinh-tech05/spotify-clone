import { Plus, Heart, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { spotifyApi } from "../api/sportify";
import { useAuth } from "../context/AuthContext";
import { createPlaylist } from "../api/playlist";
import { message } from "antd";

const LibraryPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [playlists, setPlaylists] = useState<any[]>([]);
  const [likedSongsCount, setLikedSongsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const userPlaylists = await spotifyApi("/me/playlists?limit=50", token);
        setPlaylists(userPlaylists.items);

        const liked = await spotifyApi("/me/tracks?limit=1", token);
        setLikedSongsCount(liked.total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleCreatePlaylist = async () => {
    if (!token) return;

    try {
      const newPlaylist = await createPlaylist(token, "New Playlist");

      message.success("Đã tạo playlist mới!");
      navigate(`/playlist/${newPlaylist.id}`);
    } catch (err) {
      message.error("Không thể tạo playlist");
    }
  };

  if (loading) {
    return <div className="p-8 text-white">Loading...</div>;
  }

  return (
    <div className="p-8 text-white min-h-screen bg-[#121212]">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Thư viện của bạn</h1>

        <button
          onClick={handleCreatePlaylist}
          className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full transition"
        >
          <Plus className="w-6 h-6" />
          <span className="font-semibold">Tạo playlist mới</span>
        </button>
      </div>

      <Link to="/liked" className="block mb-8">
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-6 flex items-end gap-6 hover:bg-white/10 transition group">
          <Heart className="w-20 h-20 fill-white" />
          <div>
            <h2 className="text-4xl font-bold">Bài hát đã thích</h2>
            <p className="text-white/70 mt-2">{likedSongsCount} bài hát</p>
          </div>
        </div>
      </Link>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {playlists.map((playlist: any) => (
          <Link
            key={playlist.id}
            to={`/playlist/${playlist.id}`}
            className="bg-white/5 hover:bg-white/10 rounded-lg p-4 transition group"
          >
            <div className="relative mb-4">
              {playlist.images &&
              playlist.images.length > 0 &&
              playlist.images[0]?.url ? (
                <img
                  src={playlist.images[0].url}
                  alt={playlist.name}
                  className="w-full aspect-square object-cover rounded shadow-lg"
                />
              ) : (
                <div className="w-full aspect-square bg-gray-800 rounded flex items-center justify-center text-4xl">
                  ♫
                </div>
              )}
              {/* Nút play khi hover - giống Spotify */}
              <div className="absolute inset-0 flex items-end justify-end p-4 opacity-0 group-hover:opacity-100 transition">
                <button className="bg-green-500 hover:scale-105 rounded-full p-4 shadow-2xl transition">
                  <Play className="w-6 h-6 fill-black text-black" />
                </button>
              </div>
            </div>

            <h3 className="font-bold truncate">{playlist.name}</h3>
            <p className="text-gray-400 text-sm">
              {playlist.tracks.total} bài hát
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LibraryPage;
