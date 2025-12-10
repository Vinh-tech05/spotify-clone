import { Outlet } from "react-router-dom";
import TopBar from "../components/TopBar";
import Sidebar from "../components/SideBar";
import Player from "../components/Player";
import Footer from "../components/Footer";

const LayoutClient = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex h-screen bg-gradient-to-b from-purple-900 to-black">
        <Sidebar />

        <div className="flex-1 overflow-y-auto pb-24">
          <TopBar />
          <Outlet />
        </div>

        <Player />
      </div>
      <Footer />
    </div>
  );
};

export default LayoutClient;
