import { Play, Trash2 } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import { useAuth } from "../context/AuthContext";
import { removeTrackFromPlaylist } from "../api/playlist";
import type { Track } from "../types";

interface Props {
  track: Track;
  index: number;
  tracks: Track[];
  mode: "playlist" | "search";

  playlistId?: string;
  onRemoved?: () => void;
  hidePlayIcon?: boolean;
}

const SongRow = ({
  track,
  index,
  tracks,
  mode,
  playlistId,
  onRemoved,
  hidePlayIcon = false,
}: Props) => {
  const { playQueue, currentTrack, isPlaying } = usePlayer();
  const { token } = useAuth();

  const isCurrent = currentTrack?.uri === track.uri;

  /* ---------------- PLAY ---------------- */
  const handlePlay = () => {
    if (!tracks.length) return;
    playQueue(tracks, index);
  };

  /* ---------------- REMOVE ---------------- */
  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (mode !== "playlist" || !token || !playlistId) return;

    try {
      await removeTrackFromPlaylist(token, playlistId, track.uri);
      onRemoved?.();
    } catch (err) {
      console.error("Remove track failed", err);
    }
  };

  return (
    <div
      onClick={handlePlay}
      className={`grid grid-cols-12 gap-4 p-2 rounded cursor-pointer group
        ${isCurrent ? "bg-white/10" : "hover:bg-white/10"}
      `}
    >
      {/* INDEX / PLAY ICON */}
      <div className="col-span-1 flex items-center justify-center text-gray-400 text-sm">
        {!hidePlayIcon ? (
          <Play
            className={`w-6 h-6 
              ${isCurrent && isPlaying ? "opacity-100" : "opacity-0"}
              group-hover:opacity-100
              fill-white
            `}
          />
        ) : (
          <span>{index + 1}</span>
        )}
      </div>

      {/* SONG INFO */}
      <div className="col-span-5 flex items-center gap-3">
        <img
          src={track.album.images[0]?.url}
          alt={track.name}
          className="w-10 h-10 rounded"
        />

        <div className="overflow-hidden">
          <p
            className={`truncate ${
              isCurrent ? "text-green-500" : "text-white"
            }`}
          >
            {track.name}
          </p>
          <p className="text-sm text-gray-400 truncate">
            {track.artists.map((a) => a.name).join(", ")}
          </p>
        </div>
      </div>

      {/* ALBUM */}
      <div className="col-span-4 flex items-center text-sm text-gray-400 truncate">
        {track.album.name}
      </div>

      {/* ACTIONS */}
      <div className="col-span-2 flex items-center justify-end gap-4">
        {mode === "playlist" && playlistId && (
          <Trash2
            onClick={handleRemove}
            className="w-4 h-4 text-red-400 opacity-0 group-hover:opacity-100 transition"
          />
        )}
      </div>
    </div>
  );
};

export default SongRow;
