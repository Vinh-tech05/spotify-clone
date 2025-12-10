import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Track } from "../types/index.js";
import { useAuth } from "./AuthContext";

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrev: () => void;
  deviceId: string | null;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [player, setPlayer] = useState<any>(null);

  // Khởi tạo Web Playback SDK
  useEffect(() => {
    if (!token) return;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const _player = new window.Spotify.Player({
        name: "Spotify Clone Player",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      setPlayer(_player);

      _player.addListener("ready", ({ device_id }) => {
        setDeviceId(device_id);
      });

      _player.addListener("player_state_changed", (state) => {
        if (!state) return;
        setIsPlaying(!state.paused);
      });

      _player.connect();
    };
  }, [token]);

  // Play track
  const playTrack = async (track: Track) => {
    if (!deviceId) {
      alert("Device chưa sẵn sàng, thử lại sau!");
      return;
    }

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

  const togglePlay = async () => {
    if (!deviceId) return;
    if (!player) return;

    if (isPlaying) {
      await fetch(
        `https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } else {
      await fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }
    setIsPlaying((prev) => !prev);
  };

  const playNext = async () => {
    if (!deviceId) return;
    await fetch(
      `https://api.spotify.com/v1/me/player/next?device_id=${deviceId}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  };

  const playPrev = async () => {
    if (!deviceId) return;
    await fetch(
      `https://api.spotify.com/v1/me/player/previous?device_id=${deviceId}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
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
        deviceId,
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
