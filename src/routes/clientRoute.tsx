import LayoutClient from "../layout/LayoutClient";
import HomePage from "../pages/HomePage";
import Login from "../components/Player.tsx";

const clientRoute = [
  {
    path: "/",
    element: <LayoutClient />,
    children: [
      { path: "/", Component: HomePage },
      { path: "/login", Component: Login },
    ],
  },
];

export default clientRoute;
