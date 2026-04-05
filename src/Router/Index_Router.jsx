import { createBrowserRouter } from "react-router-dom";
import Notfound from "../component/shared/Notfound";
import { adminRoutes } from "./Admin_Router";
import { Adminlayout } from "../Layout/Admin_Layout";
import AdminLogin from "../component/shared/Login";
import { Guard } from "./Guard";

export const router = createBrowserRouter([
  {
    path: "/admin",
    element: (
      <Guard>
        <Adminlayout />
      </Guard>
    ),
    children: adminRoutes,
  },
  {
    path: "",
    element: <AdminLogin />,
  },

  {
    path: "*",
    element: <Notfound />,
  },
]);
