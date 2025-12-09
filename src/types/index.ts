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
