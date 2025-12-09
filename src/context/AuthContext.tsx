import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  getCodeFromUrl,
  fetchToken,
  spotifyApi,
  getLoginUrl,
} from "../api/sportify.js";

interface User {
  display_name: string;
  email: string;
  id: string;
  images: { url: string }[];
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const logout = () => {
    setToken(null);
    setUser(null);
    window.localStorage.removeItem("spotify_token");
  };

  const login = async () => {
    const url = await getLoginUrl();
    window.location.href = url;
  };

  useEffect(() => {
    const code = getCodeFromUrl();
    const savedToken = window.localStorage.getItem("spotify_token");

    if (savedToken) {
      setToken(savedToken);
      spotifyApi("/me", savedToken)
        .then(setUser)
        .catch(() => logout());
    } else if (code) {
      fetchToken(code)
        .then((t) => {
          setToken(t);
          window.localStorage.setItem("spotify_token", t);
          return spotifyApi("/me", t);
        })
        .then(setUser)
        .catch(() => logout());
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
