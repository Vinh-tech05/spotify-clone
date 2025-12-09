import { Home, Search, Library, PlusCircle, Heart } from "lucide-react";

function Sidebar() {
  return (
    <div className="w-64 bg-black p-6 flex flex-col gap-8">
      <div className="text-2xl font-bold text-white">
        Sportify
        <i className="fa-brands fa-spotify"></i>
      </div>

      <nav className="space-y-4">
        <a
          href="#"
          className="flex items-center gap-4 text-white font-semibold"
        >
          <Home className="w-6 h-6" /> Trang chủ
        </a>
        <a
          href="#"
          className="flex items-center gap-4 text-gray-400 hover:text-white"
        >
          <Search className="w-6 h-6" /> Tìm kiếm
        </a>
        <a
          href="#"
          className="flex items-center gap-4 text-gray-400 hover:text-white"
        >
          <Library className="w-6 h-6" /> Thư viện
        </a>
      </nav>

      <div className="space-y-4">
        <button className="flex items-center gap-4 text-gray-400 hover:text-white">
          <PlusCircle className="w-6 h-6" /> Tạo Playlist
        </button>
        <button className="flex items-center gap-4 text-gray-400 hover:text-white">
          <Heart className="w-6 h-6" /> Bài hát đã thích
        </button>
      </div>
    </div>
  );
}
export default Sidebar;
