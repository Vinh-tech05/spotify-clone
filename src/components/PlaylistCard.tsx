import { useNavigate } from "react-router-dom";

function PlaylistCard({ playlist }: any) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/playlist/${playlist.id}`)}
      className="bg-white/10 hover:bg-white/20 transition p-4 rounded-lg cursor-pointer"
    >
      <img
        src={playlist.images?.[0]?.url || "/playlist-placeholder.png"}
        className="rounded mb-3"
      />
      <p className="font-semibold text-[rgb(255,255,255)] truncate">
        {playlist.name}
      </p>
    </div>
  );
}

export default PlaylistCard;
