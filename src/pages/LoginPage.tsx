import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-black">
      <button
        onClick={login}
        className="bg-[#1DB954] hover:bg-green-400 text-black font-bold text-2xl py-6 px-16  rounded-full"
      >
        ĐĂNG NHẬP VỚI SPOTIFY
      </button>
    </div>
  );
};

export default LoginPage;
