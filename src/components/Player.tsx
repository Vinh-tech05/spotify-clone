import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";

const Player = () => {
  const { currentTrack, isPlaying, togglePlay, playNext, playPrev } =
    usePlayer();

  if (!currentTrack) return null;

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-24 bg-[#181818] border-t border-white/10 text-white px-6 flex items-center justify-between">
      {/* Left: track info */}
      <div className="flex items-center gap-4 w-1/3">
        <img
          src={currentTrack.album.images[0]?.url}
          className="w-14 h-14 rounded"
        />
        <div>
          <p className="font-semibold text-sm">{currentTrack.name}</p>
          <p className="text-xs text-gray-400">
            {currentTrack.artists.map((a) => a.name).join(", ")}
          </p>
        </div>
      </div>

      {/* Center: controls */}
      <div className="flex flex-col items-center w-1/3">
        <div className="flex items-center gap-5">
          <SkipBack
            className="w-6 h-6 hover:scale-110 cursor-pointer"
            onClick={playPrev}
          />
          {isPlaying ? (
            <div
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 cursor-pointer"
              onClick={togglePlay}
            >
              <Pause />
            </div>
          ) : (
            <div
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 cursor-pointer"
              onClick={togglePlay}
            >
              <Play />
            </div>
          )}
          <SkipForward
            className="w-6 h-6 hover:scale-110 cursor-pointer"
            onClick={playNext}
          />
        </div>
      </div>

      {/* Right: volume / placeholder */}
      <div className="w-1/3"></div>
    </footer>
  );
};

export default Player;
