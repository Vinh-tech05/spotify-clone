import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!q) return;

    const t = setTimeout(() => {
      navigate(`/search?q=${encodeURIComponent(q)}`);
    }, 500);

    return () => clearTimeout(t);
  }, [q, navigate]);

  return (
    <div className="sticky top-0 z-40 bg-black/70 backdrop-blur px-8 py-4">
      <div className="flex items-center gap-4 bg-zinc-800 rounded-full px-4 py-3 max-w-xl">
        <Search className="text-gray-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Bạn muốn nghe gì?"
          className="bg-transparent outline-none text-white w-full"
        />
      </div>
    </div>
  );
};

export default TopBar;
