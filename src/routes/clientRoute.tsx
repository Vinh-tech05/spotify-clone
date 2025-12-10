import LayoutClient from "../layout/LayoutClient";
import HomePage from "../pages/HomePage";
import LikeSongsPage from "../pages/LikeSongsPage.tsx";
import LoginPage from "../pages/LoginPage.tsx";
import PlaylistPage from "../pages/PlayListPage.tsx";
import SearhPage from "../pages/SearhPage.tsx";
import ProtectedRoute from "./Protected/ProtectedRoute.tsx";

const clientRoute = [
  { path: "/login", Component: LoginPage },

  {
    path: "/",
    element: (
      <ProtectedRoute>
        <LayoutClient />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: HomePage },
      { path: "search", Component: SearhPage },
      { path: "liked", Component: LikeSongsPage },
      { path: "playlist/:id", Component: PlaylistPage },
    ],
  },
];

export default clientRoute;
