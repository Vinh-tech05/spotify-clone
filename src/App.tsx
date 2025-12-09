import Player from "./components/Player";
import { useAuth } from "./context/AuthContext";
import HomePage from "./pages/HomePage";

function App() {
  const { token, login } = useAuth();

  if (!token) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-black">
        <button
          onClick={login}
          className="bg-[#1DB954] hover:bg-green-400 text-black font-bold text-2xl py-6 px-16 rounded-full shadow-2xl transition transform hover:scale-105"
        >
          ĐĂNG NHẬP VỚI SPOTIFY
        </button>
      </div>
    );
  }

  return (
    <>
      <HomePage />
      <Player />
    </>
  );
}

export default App;
