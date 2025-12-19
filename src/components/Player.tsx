import { Play, Pause, SkipBack, SkipForward, Repeat } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";

const formatTime = (ms: number) => {
  if (!ms || ms < 0) return "0:00";
  const sec = Math.floor(ms / 1000);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s < 10 ? "0" + s : s}`;
};

const Player = () => {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    repeat,
    togglePlay,
    playNext,
    playPrev,
    toggleRepeat,
    seek,
  } = usePlayer();

  if (!currentTrack) return null;

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-24 bg-[#181818] border-t border-white/10 text-white px-6 flex items-center">
      {/* LEFT – SONG INFO */}
      <div className="flex items-center gap-4 w-1/3">
        <img
          src={currentTrack.album.images[0]?.url}
          alt={currentTrack.name}
          className="w-14 h-14 rounded"
        />

        <div className="overflow-hidden">
          <p className="text-sm font-semibold truncate">{currentTrack.name}</p>
          <p className="text-xs text-gray-400 truncate">
            {currentTrack.artists.map((a) => a.name).join(", ")}
          </p>
        </div>
      </div>

      {/* CENTER – CONTROLS */}
      <div className="flex flex-col items-center w-1/3">
        {/* buttons */}
        <div className="flex items-center gap-5">
          {/* repeat */}
          <Repeat
            onClick={toggleRepeat}
            className={`w-5 h-5 cursor-pointer ${
              repeat === "one"
                ? "text-green-500"
                : "text-gray-400 hover:text-white"
            }`}
          />

          {/* prev */}
          <SkipBack
            onClick={playPrev}
            className="w-6 h-6 cursor-pointer text-gray-400 hover:text-white"
          />

          {/* play / pause */}
          <div
            onClick={togglePlay}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 cursor-pointer"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </div>

          {/* next */}
          <SkipForward
            onClick={playNext}
            className="w-6 h-6 cursor-pointer text-gray-400 hover:text-white"
          />
        </div>

        {/* progress bar */}
        <div className="flex items-center gap-2 w-full mt-2">
          <span className="text-xs text-gray-400 w-10 text-right">
            {formatTime(progress)}
          </span>

          <input
            type="range"
            min={0}
            max={duration || 0}
            value={progress}
            onChange={(e) => seek(Number(e.target.value))}
            className="w-full h-1 accent-green-500 cursor-pointer"
          />

          <span className="text-xs text-gray-400 w-10">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* RIGHT – empty (volume sau) */}
      <div className="w-1/3" />
    </footer>
  );
};

export default Player;
