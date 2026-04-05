import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/image/logo.jpg";
import {
  Home,
  Star,
  Users,
  Image,
  Bell,
  BookOpen,
  Briefcase,
  Calendar,
  HelpCircle,
  Award,
  Menu,
  X,
} from "lucide-react";
import { siteData } from "../../../data/school_info";

const Sidebar = () => {
  const location = useLocation();
  const site = siteData[0];
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: "home", label: "Home", path: "/admin/dashboard", icon: Home },
    { id: "reviews", label: "Reviews", path: "/admin/review", icon: Star },
    { id: "team", label: "Team", path: "/admin/team", icon: Users },
    { id: "gallery", label: "Gallery", path: "/admin/gallery", icon: Image },
    { id: "notice", label: "Notice", path: "/admin/notice", icon: Bell },
    { id: "blog", label: "Blog", path: "/admin/blog", icon: BookOpen },
    {
      id: "vacancy",
      label: "Vacancy",
      path: "/admin/vacancy",
      icon: Briefcase,
    },
    { id: "event", label: "Event", path: "/admin/event", icon: Calendar },
    {
      id: "question",
      label: "Question Bank",
      path: "/admin/question-bank",
      icon: HelpCircle,
    },
    { id: "faq", label: "FAQs", path: "/admin/faqs", icon: BookOpen },
    {
      id: "achievement",
      label: "Achievement",
      path: "/admin/achievement",
      icon: Award,
    },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div
        className="lg:hidden text-white p-3 flex justify-between items-center fixed top-0 w-full z-50 shadow-md "
        style={{ backgroundColor: "var(--color-secondary)" }}
      >
        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" className="w-8 h-8 rounded-full" />
          <h1 className="font-bold text-sm truncate w-32">{site.name}</h1>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded-md"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--color-secondary) 70%, black)",
          }}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed left-0 top-0 h-screen w-60 text-white shadow-2xl z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        style={{
          background:
            "linear-gradient(135deg, var(--color-secondary), var(--color-primary))",
        }}
      >
        <div
          className="flex items-center gap-3 p-4 border-b"
          style={{
            borderColor:
              "color-mix(in srgb, var(--color-secondary) 50%, transparent)",
          }}
        >
          <img
            src={logo}
            alt="Logo"
            className="w-10 h-10 rounded-full ring-2 ring-white/50"
          />
          <h1 className="text-lg font-bold leading-tight">{site.name}</h1>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-80px)] custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                style={
                  isActive
                    ? {
                        backgroundColor: "var(--color-primary)",
                        color: "#fff",
                        fontWeight: 600,
                      }
                    : { color: "rgba(255,255,255,0.8)" }
                }
                onMouseEnter={(e) => {
                  if (!isActive)
                    e.currentTarget.style.backgroundColor =
                      "color-mix(in srgb, var(--color-secondary) 40%, transparent)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
