export const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
export const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

const SCOPES = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "playlist-read-private",
  "user-library-read",
].join(" ");

function generateCodeVerifier(length = 128) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let str = "";
  for (let i = 0; i < length; i++)
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  return str;
}

function base64urlencode(str: any) {
  return btoa(String.fromCharCode(...new Uint8Array(str)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function generateCodeChallenge(verifier: any) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64urlencode(digest);
}

export const getLoginUrl = async () => {
  const verifier = generateCodeVerifier();
  localStorage.setItem("spotify_code_verifier", verifier);

  const challenge = await generateCodeChallenge(verifier);

  return `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}&show_dialog=true&code_challenge_method=S256&code_challenge=${challenge}`;
};

export const getCodeFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("code");
};

export const fetchToken = async (code: any) => {
  const verifier = localStorage.getItem("spotify_code_verifier") || "";

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    code_verifier: verifier,
  });

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) throw new Error("Cannot fetch token");

  const data = await res.json();

  //* lưu token
  localStorage.setItem("spotify_token", data.access_token);

  return data.access_token;
};

export const spotifyApi = async (endpoint: any, token: any) => {
  const res = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Spotify API error");

  return res.json();
};
