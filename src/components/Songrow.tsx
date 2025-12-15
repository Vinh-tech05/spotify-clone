import { Play, Trash2 } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import { useAuth } from "../context/AuthContext";
import { removeTrackFromPlaylist } from "../api/playlist";
import type { Track } from "../types";

interface Props {
  track: Track;
  index: number;
  playlistId?: string;
  onRemoved?: () => void;
  hidePlayIcon?: boolean;
}

const SongRow = ({
  track,
  index,
  playlistId,
  onRemoved,
  hidePlayIcon = false,
}: Props) => {
  const { playTrack } = usePlayer();
  const { token } = useAuth();

  const handlePlay = () => {
    playTrack(track);
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token || !playlistId) return;

    try {
      await removeTrackFromPlaylist(token, playlistId, track.uri);
      onRemoved?.();
    } catch (error) {
      console.error("Failed to remove track", error);
    }
  };

  return (
    <div
      onClick={handlePlay}
      className="grid grid-cols-12 gap-4 p-2 rounded hover:bg-white/10 group cursor-pointer"
    >
      {/* index */}
      <div className="col-span-1 text-gray-400 text-sm flex items-center justify-center">
        {index + 1}
      </div>

      {/* image + name */}
      <div className="col-span-5 flex items-center gap-3">
        <img
          src={track.album.images[0]?.url}
          alt="album"
          className="w-10 h-10"
        />
        <div>
          <p className="text-white">{track.name}</p>
          <p className="text-sm text-gray-400">
            {track.artists.map((a) => a.name).join(", ")}
          </p>
        </div>
      </div>

      {/* album */}
      <div className="col-span-4 text-gray-400 text-sm flex items-center">
        {track.album.name}
      </div>

      {/* actions */}
      <div className="col-span-2 flex items-center justify-end gap-4">
        {playlistId && (
          <Trash2
            onClick={handleRemove}
            className="w-4 h-4 text-red-400 opacity-0 group-hover:opacity-100 transition"
          />
        )}

        {!hidePlayIcon && (
          <Play
            onClick={(e) => {
              e.stopPropagation();
              handlePlay();
            }}
            className="w-8 h-8 opacity-0 group-hover:opacity-100 fill-white"
          />
        )}
      </div>
    </div>
  );
};

export default SongRow;
