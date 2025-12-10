import { Home, Search, Library, PlusCircle, Heart } from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-4 font-semibold ${
      isActive ? "text-white" : "text-gray-400 hover:text-white"
    }`;

  return (
    <div className="w-64 bg-[#121212] p-6 flex flex-col gap-8">
      {/* Logo */}
      <div className="text-2xl font-bold text-white">Spotify</div>

      {/* Main nav */}
      <nav className="space-y-4">
        <NavLink to="/" className={navClass}>
          <Home className="w-6 h-6" /> Trang chủ
        </NavLink>

        <NavLink to="/search" className={navClass}>
          <Search className="w-6 h-6" /> Tìm kiếm
        </NavLink>

        <NavLink to="/library" className={navClass}>
          <Library className="w-6 h-6" /> Thư viện
        </NavLink>
      </nav>

      {/* Extra */}
      <div className="space-y-4 mt-6">
        <button className="flex items-center gap-4 text-gray-400 hover:text-white">
          <PlusCircle className="w-6 h-6" /> Tạo Playlist
        </button>

        <NavLink
          to="/liked"
          className="flex items-center gap-4 text-gray-400 hover:text-white"
        >
          <Heart className="w-6 h-6" /> Bài hát đã thích
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
