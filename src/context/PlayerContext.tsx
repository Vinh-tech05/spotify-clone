import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { RepeatMode, Track } from "../types";
import { useAuth } from "./AuthContext";

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  repeat: RepeatMode;

  playQueue: (tracks: Track[], index?: number) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrev: () => void;
  toggleRepeat: () => void;
  seek: (ms: number) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();

  const playerRef = useRef<any>(null);
  const deviceIdRef = useRef<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  const [queue, setQueue] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeat, setRepeat] = useState<RepeatMode>("off");

  useEffect(() => {
    void queue;
  }, [queue]);

  /* ------------ INIT PLAYER ------------ */
  useEffect(() => {
    if (!token) return;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Spotify Clone",
        getOAuthToken: (cb: any) => cb(token),
        volume: 0.5,
      });

      playerRef.current = player;

      player.addListener("ready", ({ device_id }: any) => {
        deviceIdRef.current = device_id;
      });

      player.addListener("player_state_changed", (state: any) => {
        if (!state) return;
        setIsPlaying(!state.paused);
        setProgress(state.position);
        setDuration(state.duration);
        setCurrentTrack(state.track_window.current_track);
      });

      player.connect();
    };
  }, [token]);

  /* ------------ PROGRESS TICK ------------ */
  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setProgress((p) => (p + 1000 < duration ? p + 1000 : p));
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, duration]);

  /* ------------ ACTIONS ------------ */

  const playQueue = async (tracks: Track[], index = 0) => {
    if (!deviceIdRef.current) return;

    setQueue(tracks);
    setCurrentTrack(tracks[index]);

    await fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${deviceIdRef.current}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uris: tracks.map((t) => t.uri),
          offset: { position: index },
        }),
      }
    );
  };

  const togglePlay = async () => {
    await fetch(
      `https://api.spotify.com/v1/me/player/${isPlaying ? "pause" : "play"}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  };

  const playNext = async () => {
    await fetch(`https://api.spotify.com/v1/me/player/next`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const playPrev = async () => {
    await fetch(`https://api.spotify.com/v1/me/player/previous`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const seek = async (ms: number) => {
    setProgress(ms);
    await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${ms}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const toggleRepeat = async () => {
    const next = repeat === "off" ? "track" : "off";
    setRepeat(next === "track" ? "one" : "off");

    await fetch(
      `https://api.spotify.com/v1/me/player/repeat?state=${next}&device_id=${deviceIdRef.current}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        duration,
        repeat,
        playQueue,
        togglePlay,
        playNext,
        playPrev,
        toggleRepeat,
        seek,
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
