import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { Track } from "../types/index.js";
import { useAuth } from "./AuthContext";

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  seek: (ms: number) => void;
  deviceId: string | null;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();

  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const playerRef = useRef<any>(null);
  const progressRef = useRef(0);
  const draggingRef = useRef(false);

  useEffect(() => {
    if (!token) return;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const _player = new window.Spotify.Player({
        name: "Spotify Clone Player",
        getOAuthToken: (cb) => cb(token),
        volume: 0.5,
      });

      playerRef.current = _player;

      _player.addListener("ready", ({ device_id }) => {
        setDeviceId(device_id);
      });

      _player.addListener("player_state_changed", (state) => {
        if (!state) return;

        setIsPlaying(!state.paused);
        setDuration(state.duration);
        setProgress(state.position);

        progressRef.current = state.position;
      });

      _player.connect();
    };
  }, [token]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (!draggingRef.current) {
        progressRef.current += 1000;
        setProgress(progressRef.current);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  //* phát nhạc
  const playTrack = async (track: Track) => {
    if (!deviceId) return alert("Player chưa sẵn sàng!");

    setCurrentTrack(track);

    await fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris: [track.uri] }),
      }
    );

    setIsPlaying(true);
  };

  //* phát/ ngưng
  const togglePlay = async () => {
    if (!deviceId) return;

    await fetch(
      `https://api.spotify.com/v1/me/player/${
        isPlaying ? "pause" : "play"
      }?device_id=${deviceId}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setIsPlaying(!isPlaying);
  };

  //* tua
  const seek = async (ms: number) => {
    if (!deviceId) return;

    draggingRef.current = false;
    progressRef.current = ms;
    setProgress(ms);

    await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${ms}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        duration,
        playTrack,
        togglePlay,
        seek,
        deviceId,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used in PlayerProvider");
  return ctx;
};
