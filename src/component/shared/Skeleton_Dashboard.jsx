import React from "react";

const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-10">
        <div className="h-8 bg-gray-300 rounded w-48 mb-2"></div>
        <div className="h-1 w-20 bg-gray-300 rounded-full"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="w-10 h-10 bg-gray-300 rounded-xl mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="h-8 bg-gray-300 rounded w-12"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Skeleton */}
        <div className="lg:col-span-2 bg-white rounded-4xl shadow-sm border border-slate-100 p-8">
          <div className="h-6 bg-gray-300 rounded w-32 mb-8"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Skeleton */}
        <div className="bg-slate-900 rounded-4xl p-8">
          <div className="h-6 bg-slate-700 rounded w-24 mb-6"></div>
          <div className="grid grid-cols-1 gap-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                <div className="h-4 bg-slate-700 rounded w-32"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
