import { usePlayer } from "../context/PlayerContext";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
function Player() {
  const { currentTrack, isPlaying, togglePlay } = usePlayer();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-900 h-24 flex items-center px-4 z-50">
      {/* Left */}
      <div className="flex items-center gap-4 flex-1">
        <img
          src={currentTrack.album.images[0]?.url || "/placeholder.jpg"}
          alt=""
          className="w-14 h-14 rounded"
        />
        <div>
          <p className="font-medium text-sm">{currentTrack.name}</p>
          <p className="text-xs text-gray-400">
            {currentTrack.artists.map((a) => a.name).join(", ")}
          </p>
        </div>
      </div>

      {/* Center */}
      <div className="flex items-center gap-8">
        <SkipBack className="w-5 h-5 cursor-pointer hover:text-white text-gray-400" />
        {isPlaying ? (
          <Pause
            onClick={togglePlay}
            className="w-10 h-10 cursor-pointer fill-white"
          />
        ) : (
          <Play
            onClick={togglePlay}
            className="w-10 h-10 cursor-pointer fill-white"
          />
        )}
        <SkipForward className="w-5 h-5 cursor-pointer hover:text-white text-gray-400" />
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 flex-1 justify-end">
        <Volume2 className="w-5 h-5" />
        <input
          type="range"
          className="w-28 accent-green-500"
          defaultValue="70"
        />
      </div>
    </div>
  );
}
export default Player;
