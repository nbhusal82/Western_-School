import React from "react";
import { Link } from "react-router-dom";

export const Notfound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black from-gray-900 via-gray-800 to-black px-4">
      <div className="text-center text-white max-w-md">
        <h1 className="text-[120px] font-extrabold text-red-500 drop-shadow-lg animate-pulse">
          404
        </h1>

        <h2 className="text-3xl font-bold mb-2">Page Not Found</h2>

        <p className="text-gray-300 mb-6">
          Sorry, the page you are looking for doesn’t exist or has been moved.
        </p>

        <Link
          to="/admin/dashboard"
          className="inline-block bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-full font-semibold shadow-lg"
        >
          ⬅ Back to Home
        </Link>
      </div>
    </div>
  );
};
export default Notfound;
