import { Outlet } from "react-router-dom";
import Sidebar from "../component/shared/Sidebar";

export const Adminlayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col transition-all duration-300 lg:ml-52">
        {/* Mobile header spacer */}
        <div className="h-14 lg:hidden" />

        {/* Main Content - Remove extra container for Dashboard */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
