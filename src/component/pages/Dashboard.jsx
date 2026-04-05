import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Users,
  Calendar,
  TrendingUp,
  Bell,
  LogOut,
  ArrowUp,
  UserCheck,
  FileText,
  Image,
  Newspaper,
  ChevronRight,
} from "lucide-react";
import {
  useGetDashboardStatsQuery,
  useLogoutMutation,
} from "../redux/feature/authslice";
import { logout as logoutAction } from "../redux/feature/authState";
import DashboardSkeleton from "../shared/Skeleton_Dashboard";
import ConfirmDialog from "../shared/ConfirmDialog";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: statsData, isLoading } = useGetDashboardStatsQuery();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [dynamicStats, setDynamicStats] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logoutAction());
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      dispatch(logoutAction());
      navigate("/");
    }
    setConfirmOpen(false);
  };

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showLogout, setShowLogout] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowScrollTop(currentScrollY > 200);
      setShowLogout(currentScrollY < lastScrollY || currentScrollY < 50);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (statsData?.data?.stats) {
      const allowedKeys = ["teachers", "notices", "gallery", "blogs", "events"];
      const config = {
        teachers: {
          label: "Teachers",
          icon: UserCheck,
          bgVar: "var(--color-secondary)",
        },
        notices: { label: "Notices", icon: FileText, bgVar: "#e11d48" },
        gallery: {
          label: "Gallery",
          icon: Image,
          bgVar: "var(--color-primary)",
        },
        blogs: { label: "Blogs", icon: Newspaper, bgVar: "#059669" },
        events: { label: "Events", icon: Calendar, bgVar: "#4f46e5" },
      };
      const stats = allowedKeys
        .filter((key) => statsData.data.stats[key] !== undefined)
        .map((key) => ({
          label: config[key].label,
          value: statsData.data.stats[key],
          icon: config[key].icon,
          bgVar: config[key].bgVar,
        }));
      setDynamicStats(stats);
    }
  }, [statsData]);

  if (isLoading) return <DashboardSkeleton />;

  // ... (aru imports ra logic mathi ko jastai)

  return (
    <div className="min-h-screen bg-[#f8fafc] p-3 sm:p-6 lg:p-10 font-sans">
      {/* Logout Button */}
      <button
        onClick={() => setConfirmOpen(true)}
        className={`fixed top-4 sm:top-6 right-4 sm:right-6 z-50 flex items-center gap-1.5 sm:gap-2 bg-white border border-gray-100 text-gray-700 hover:text-red-600 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-md transition-all duration-500 font-bold text-xs sm:text-sm ${showLogout ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-20"}`}
      >
        {isLoggingOut ? (
          <div className="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <LogOut size={14} className="sm:w-4 sm:h-4" />
        )}
        <span>{isLoggingOut ? "Signing Out..." : "Sign Out"}</span>
      </button>

      {/* Scroll To Top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 sm:bottom-8 right-6 sm:right-8 z-50 text-white p-2.5 sm:p-3.5 rounded-full shadow-2xl transition-all hover:scale-110"
          style={{
            background:
              "linear-gradient(135deg, var(--color-secondary), var(--color-primary))",
          }}
        >
          <ArrowUp size={18} className="sm:w-5 sm:h-5" />
        </button>
      )}

      {/* Header */}
      <div className="mb-6 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
          Admin{" "}
          <span className="italic" style={{ color: "var(--color-primary)" }}>
            Panel
          </span>
        </h1>
        <div
          className="h-1.5 w-20 mt-1 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, var(--color-secondary), var(--color-primary))",
          }}
        ></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 mb-6 sm:mb-10">
        {dynamicStats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all group border-b-4 border-b-transparent"
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderBottomColor = "var(--color-primary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderBottomColor = "transparent")
            }
          >
            <div
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center text-white mb-3 sm:mb-4 shadow-lg shadow-black/5"
              style={{
                background: `linear-gradient(135deg, ${stat.bgVar}, color-mix(in srgb, ${stat.bgVar} 80%, black))`,
              }}
            >
              <stat.icon size={16} className="sm:w-5 sm:h-5" />
            </div>
            <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] sm:tracking-[0.2em]">
              {stat.label}
            </p>
            <h3 className="text-2xl sm:text-4xl font-black text-slate-800 mt-1">
              {stat.value}
            </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl sm:rounded-4xl shadow-sm border border-slate-100 p-4 sm:p-8">
          <div className="flex items-center justify-between mb-4 sm:mb-8">
            <h2
              className="text-lg sm:text-xl font-black text-slate-800 flex items-center gap-2 sm:gap-3 underline decoration-4 underline-offset-8"
              style={{
                textDecorationColor:
                  "color-mix(in srgb, var(--color-primary) 30%, transparent)",
              }}
            >
              Recent Feed
            </h2>
            <Bell size={18} className="text-slate-300 sm:w-5 sm:h-5" />
          </div>
          <div className="space-y-2 sm:space-y-3">
            {statsData?.data?.recentActivities
              ?.slice(0, 10)
              .map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-[15px] text-slate-700 font-bold transition-colors truncate group-hover:text-[var(--color-secondary)]">
                      {activity.title}
                    </p>
                    <div className="flex items-center gap-2 sm:gap-3 mt-1 sm:mt-1.5">
                      <span
                        className="text-[8px] sm:text-[9px] font-black uppercase text-white px-1.5 sm:px-2 py-0.5 rounded shadow-sm"
                        style={{
                          background:
                            "linear-gradient(90deg, var(--color-secondary), #0056a6)",
                        }}
                      >
                        {activity.category}
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-slate-400 font-bold tracking-tight truncate">
                        {new Date(activity.created_at).toDateString()}
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-slate-300 group-hover:translate-x-1 group-hover:text-[var(--color-primary)] transition-all shrink-0 sm:w-4 sm:h-4"
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Quick Actions - Updated with Sidebar Gradient */}
        <div
          className="rounded-2xl sm:rounded-4xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, var(--color-secondary), var(--color-primary))",
          }}
        >
          <div className="relative z-10">
            <h2 className="text-lg sm:text-xl font-black mb-4 sm:mb-6 tracking-wide flex items-center gap-2">
              <TrendingUp size={20} />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 gap-2 sm:gap-3">
              <QuickBtn Icon={FileText} label="Post New Notice" />
              <QuickBtn Icon={Image} label="Update Gallery" />
              <QuickBtn Icon={Newspaper} label="Blog Manager" />
              <QuickBtn Icon={Calendar} label="Schedule Event" />
            </div>
          </div>
          {/* Decorative Circle */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 bg-white"></div>
        </div>
      </div>

      {/* ... (ConfirmDialog same) */}
    </div>
  );
};

// QuickBtn styles updated for better contrast on gradient
const QuickBtn = ({ Icon, label }) => (
  <button className="w-full bg-white/10 hover:bg-white text-white hover:text-blue-900 border border-white/10 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-4 transition-all duration-300 group shadow-lg">
    <div className="bg-white/20 group-hover:bg-blue-100 p-2 rounded-lg transition-colors">
      <Icon
        size={16}
        className="group-hover:scale-110 transition-transform sm:w-4.5 sm:h-4.5 shrink-0"
        style={{ color: "white" }}
        // we use a class for hover color change if needed,
        // but keeping it simple for now
      />
    </div>
    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide sm:tracking-widest">
      {label}
    </span>
  </button>
);

export default Dashboard;
