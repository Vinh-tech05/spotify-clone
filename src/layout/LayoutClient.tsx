import { Outlet } from "react-router-dom";
import Sidebar from "../components/SideBar";
import TopBar from "../components/TopBar";
import Player from "../components/Player";
import Footer from "../components/Footer";

const LayoutClient = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <div className="flex flex-1 h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-black-900 to-black">
            <Outlet />
          </div>
          <Footer />
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0">
        <Player />
      </div>
    </div>
  );
};

export default LayoutClient;
