import { Play, Heart } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import type { Track } from "../types";

interface Props {
  track: Track;
  index: number;
}

const SongRow = ({ track, index }: Props) => {
  const { playTrack } = usePlayer();

  const handlePlay = () => {
    playTrack(track);
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

      {/* image + name + artist */}
      <div className="col-span-5 flex items-center gap-3">
        <img src={track.album.images[0]?.url} alt="" className="w-10 h-10" />
        <div>
          <p className="text-white font-medium">{track.name}</p>
          <p className="text-sm text-gray-400">
            {track.artists.map((a) => a.name).join(", ")}
          </p>
        </div>
      </div>

      {/* album */}
      <div className="col-span-4 flex items-center text-gray-400 text-sm">
        {track.album.name}
      </div>

      {/* duration + heart + play */}
      <div className="col-span-2 flex items-center justify-end gap-4">
        <Heart className="w-4 h-4 opacity-0 group-hover:opacity-100" />

        <span className="text-sm text-gray-400">
          {Math.floor(track.duration_ms / 60000)}:
          {((track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, "0")}
        </span>

        <Play
          onClick={(e) => {
            e.stopPropagation();
            handlePlay();
          }}
          className="w-8 h-8 opacity-0 group-hover:opacity-100 fill-white"
        />
      </div>
    </div>
  );
};

export default SongRow;
