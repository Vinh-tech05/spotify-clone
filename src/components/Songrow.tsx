import { Play, Trash2 } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import { useAuth } from "../context/AuthContext";
import { removeTrackFromPlaylist } from "../api/playlist";
import type { Track } from "../types";

interface Props {
  track: Track;
  index: number;
  tracks: Track[];
  playlistId?: string;
  onRemoved?: () => void;
}

const SongRow = ({ track, index, tracks, playlistId, onRemoved }: Props) => {
  const { playQueue, currentTrack, isPlaying } = usePlayer();
  const { token } = useAuth();

  const isCurrent = currentTrack?.uri === track.uri;

  const handlePlay = () => {
    playQueue(tracks, index);
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token || !playlistId) return;
    await removeTrackFromPlaylist(token, playlistId, track.uri);
    onRemoved?.();
  };

  return (
    <div
      onClick={handlePlay}
      className={`grid grid-cols-12 gap-4 p-2 rounded cursor-pointer
        ${isCurrent ? "bg-white/10" : "hover:bg-white/10"}`}
    >
      <div className="col-span-1 flex justify-center items-center">
        <Play
          className={`w-5 h-5 fill-white ${
            isCurrent && isPlaying ? "opacity-100" : "opacity-0"
          } group-hover:opacity-100`}
        />
      </div>

      <div className="col-span-5 flex items-center gap-3">
        <img src={track.album.images[0]?.url} className="w-10 h-10" />
        <div>
          <p className={isCurrent ? "text-green-500" : "text-white"}>
            {track.name}
          </p>
          <p className="text-sm text-gray-400">
            {track.artists.map((a) => a.name).join(", ")}
          </p>
        </div>
      </div>

      <div className="col-span-4 text-gray-400">{track.album.name}</div>

      <div className="col-span-2 flex justify-end">
        {playlistId && (
          <Trash2 onClick={handleRemove} className="w-4 h-4 text-red-400" />
        )}
      </div>
    </div>
  );
};

export default SongRow;
