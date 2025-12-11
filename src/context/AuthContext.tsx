import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  getCodeFromUrl,
  fetchToken,
  spotifyApi,
  getLoginUrl,
} from "../api/sportify";

interface User {
  display_name: string;
  email: string;
  id: string;
  images: { url: string }[];
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("spotify_token");
  };

  const login = async () => {
    const url = await getLoginUrl();
    window.location.href = url;
  };

  useEffect(() => {
    const init = async () => {
      try {
        const code = getCodeFromUrl();
        const savedToken = localStorage.getItem("spotify_token");

        let accessToken = savedToken;

        if (!accessToken && code) {
          accessToken = await fetchToken(code);
          localStorage.setItem("spotify_token", accessToken);
        }

        if (accessToken) {
          setToken(accessToken);
          const profile = await spotifyApi("/me", accessToken);
          setUser(profile);
        }

        //* XÓA CODE TRONG URL
        if (code) {
          window.history.replaceState({}, document.title, "/");
        }
      } catch (err) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
