import { RouterProvider } from "react-router-dom";
import { router } from "./Router/Index_Router";

// import { ToastContainer } from "react-toastify";

export const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
      {/* <ToastContainer /> */}
    </div>
  );
};
