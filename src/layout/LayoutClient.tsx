import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";

const LayoutClient = () => {
  return (
    <div>
      <SideBar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutClient;
