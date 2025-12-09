import {
  createContext,
  useContext,
  useState,
  useRef,
  type ReactNode,
} from "react";
import type { Track } from "../types/index.js";

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrev: () => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // audio element để phát nhạc
  const audioRef = useRef(new Audio());

  // Phát bài mới
  const playTrack = (track: Track) => {
    if (!track.preview_url) {
      alert("Bài này không có preview 30s!");
      return;
    }

    setCurrentTrack(track);

    // Set link audio vào element
    audioRef.current.src = track.preview_url;
    audioRef.current.play();

    setIsPlaying(true);
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (!currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying((prev) => !prev);
  };

  const playNext = () => {
    console.log("Chưa có danh sách nên chưa next được");
  };

  const playPrev = () => {
    console.log("Chưa có danh sách nên chưa prev được");
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        playTrack,
        togglePlay,
        playNext,
        playPrev,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer must be used within PlayerProvider");
  return context;
};
