import { createBrowserRouter, RouterProvider } from "react-router-dom";
import clientRoute from "./clientRoute";

let router = createBrowserRouter([...clientRoute]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
