export interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[]; name: string };
  duration_ms: number;
  preview_url: string | null;
  uri: string;
}

export interface User {
  id: string;
  display_name: string;
  email: string;
  images: { url: string }[];
}

export interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  seek: (ms: number) => void;
  deviceId: string | null;
}

export interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
}

export interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
}
