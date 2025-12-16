import { SearchOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Dropdown, Input, message, Modal } from "antd";
import { MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addTrackToPlaylist,
  deletePlaylist,
  searchTracks,
  updatePlaylistDetails,
} from "../api/playlist";
import { spotifyApi } from "../api/sportify";
import SongRow from "../components/Songrow";
import { useAuth } from "../context/AuthContext";
const { Search } = Input;

const PlaylistPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [playlistInfo, setPlaylistInfo] = useState<any>(null);
  const [tracks, setTracks] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");

  // Load playlist info + tracks
  useEffect(() => {
    if (!token || !id) return;

    spotifyApi(`/playlists/${id}/tracks?limit=50`, token)
      .then((data) => {
        setTracks(data.items.map((i: any) => i.track).filter(Boolean));
      })
      .catch((err) => console.error(err));

    spotifyApi(`/playlists/${id}`, token)
      .then((data) => {
        setPlaylistInfo(data);
        setNewName(data.name);
      })
      .catch((err) => console.error(err));
  }, [id, token]);

  // Search debounce
  useEffect(() => {
    if (!isSearching || !query.trim() || !token) {
      setSearchResults([]);
      return;
    }

    setLoadingSearch(true);
    const timer = setTimeout(() => {
      searchTracks(token, query)
        .then((results) => {
          const existingUris = new Set(tracks.map((t) => t.uri));
          const filtered = results.filter((t: any) => !existingUris.has(t.uri));
          setSearchResults(filtered);
        })
        .catch(() => message.error("Tìm kiếm thất bại"))
        .finally(() => setLoadingSearch(false));
    }, 500);

    return () => clearTimeout(timer);
  }, [query, token, tracks, isSearching]);

  // Add track
  const handleAddTrack = async (track: any) => {
    if (!token || !id) return;

    try {
      await addTrackToPlaylist(token, id, track.uri);
      message.success(`Đã thêm: ${track.name}`);
      setTracks((prev) => [...prev, track]);
      setSearchResults((prev) => prev.filter((t) => t.uri !== track.uri));
    } catch {
      message.error("Không thể thêm bài hát");
    }
  };

  // Update playlist name
  const handleUpdateName = async () => {
    if (
      !token ||
      !id ||
      !newName.trim() ||
      newName.trim() === playlistInfo?.name
    ) {
      setIsEditingName(false);
      return;
    }

    try {
      await updatePlaylistDetails(token, id, newName.trim());
      message.success("Đã cập nhật tên playlist!");

      const updatedData = await spotifyApi(`/playlists/${id}`, token);
      setPlaylistInfo(updatedData);
      setNewName(updatedData.name);
    } catch {
      message.error("Không thể cập nhật tên playlist");
    } finally {
      setIsEditingName(false);
    }
  };

  // Delete playlist
  const handleDeletePlaylist = () => {
    Modal.confirm({
      title: "Xóa playlist?",
      content: "Playlist này sẽ bị xóa vĩnh viễn và không thể khôi phục.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deletePlaylist(token!, id!);
          message.success("Playlist đã được xóa");
          navigate("/");
        } catch {
          message.error("Không thể xóa playlist");
        }
      },
    });
  };
  const menuItems: MenuProps["items"] = [
    {
      key: "delete",
      label: "Xóa playlist",
      danger: true,
      onClick: handleDeletePlaylist,
    },
  ];

  if (!playlistInfo) {
    return <div className="p-8 text-white">Loading...</div>;
  }

  return (
    <div className="p-8 text-white min-h-screen bg-[#121212]">
      {/* HEADER */}
      <div className="flex items-end gap-8 mb-12">
        {playlistInfo.images &&
        playlistInfo.images.length > 0 &&
        playlistInfo.images[0].url ? (
          <img
            src={playlistInfo.images[0].url}
            alt="playlist cover"
            className="w-56 h-56 shadow-2xl rounded"
          />
        ) : (
          <div className="w-56 h-56 bg-gray-800 flex items-center justify-center rounded text-8xl">
            ♫
          </div>
        )}

        <div className="flex-1 flex items-end justify-between">
          <div>
            <p className="text-sm uppercase text-gray-300">Playlist</p>

            {isEditingName ? (
              <Input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onPressEnter={handleUpdateName}
                onBlur={handleUpdateName}
                className="text-6xl font-black bg-transparent border-b-2 border-white/50 mt-4 pb-2 focus:border-green-500"
                style={{ fontSize: "4rem", fontWeight: 900 }}
              />
            ) : (
              <h1
                onClick={() => setIsEditingName(true)}
                className="text-6xl font-black mt-4 cursor-pointer hover:underline"
                style={{ fontSize: "4rem", fontWeight: 900 }}
              >
                {playlistInfo.name}
              </h1>
            )}

            {playlistInfo.description && (
              <p className="text-gray-400 text-lg mt-6 max-w-3xl">
                {playlistInfo.description}
              </p>
            )}

            <p className="text-gray-400 mt-4">{tracks.length} bài hát</p>
          </div>

          {/* ICON BA CHẤM */}
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <Button
              type="text"
              size="large"
              icon={<MoreVertical className="w-8 h-8" />}
              className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
            />
          </Dropdown>
        </div>
      </div>

      {/* DANH SÁCH BÀI HÁT */}
      <div className="bg-white/5 rounded-lg p-4">
        {tracks.map((track: any, index: number) => (
          <SongRow
            key={track.id}
            track={track}
            index={index}
            playlistId={id}
            hidePlayIcon
            onRemoved={() =>
              setTracks((prev) => prev.filter((t) => t.uri !== track.uri))
            }
          />
        ))}
      </div>

      {/* TÌM KIẾM */}
      {!isSearching && (
        <div className="mb-8 flex justify-end">
          <p
            className="text-white font-semibold px-8 py-4 rounded-full cursor-pointer"
            onClick={() => setIsSearching(true)}
          >
            Tìm thêm
          </p>
        </div>
      )}

      {isSearching && (
        <div className="mb-8 bg-white/5 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              Hãy cùng tìm nội dung cho danh sách phát của bạn
            </h2>
            <p
              className="cursor-pointer"
              onClick={() => {
                setIsSearching(false);
                setQuery("");
                setSearchResults([]);
              }}
            >
              Đóng
            </p>
          </div>

          <Search
            placeholder="Tìm bài hát, nghệ sĩ, album..."
            prefix={<SearchOutlined className="text-gray-400 text-xl" />}
            allowClear
            size="large"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            loading={loadingSearch}
            className="mb-6 bg-[#282828] border-none rounded-full"
            autoFocus
          />

          {searchResults.map((track: any, index: number) => (
            <div key={track.id} className="relative group py-1">
              <SongRow track={track} index={index} hidePlayIcon />
              <Button
                type="primary"
                size="small"
                onClick={() => handleAddTrack(track)}
                className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"
              >
                Thêm
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaylistPage;
