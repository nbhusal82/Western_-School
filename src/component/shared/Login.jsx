import React, { useState, useEffect } from "react";
import { Lock, Mail, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useNavigate, Navigate } from "react-router-dom";
import { useLoginMutation } from "../redux/feature/authslice";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/feature/authState";
import logoImg from "../../assets/image/logo.jpg";
import backImg from "../../assets/image/school.jpeg";
import ErrorToast from "./ErrorToast";

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const isAuth = useSelector((state) => state.user.isAuth);
  if (isAuth) return <Navigate to="/admin/dashboard" replace />;

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (errorOpen) {
      const timer = setTimeout(() => setErrorOpen(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [errorOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form).unwrap();
      dispatch(setUser({ user: res.user, token: res.token }));
      navigate("/admin/dashboard");
    } catch (err) {
      setErrorMsg("Invalid email or password. Please try again.");
      setErrorOpen(true);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background Image */}
      <img
        src={backImg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ zIndex: 0 }}
      />

      {/* Blur + dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          background:
            "linear-gradient(135deg, rgba(10,20,40,0.72) 0%, rgba(0,50,100,0.60) 100%)",
        }}
      />

      {/* Card */}
      <div className="relative w-full max-w-sm" style={{ zIndex: 2 }}>
        <div
          className="rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background: "rgba(10, 22, 45, 0.82)",
            border: "1px solid rgba(203,132,74,0.25)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          {/* Top accent bar */}
          <div
            className="h-1"
            style={{
              background:
                "linear-gradient(to right, var(--color-primary), var(--color-secondary))",
            }}
          />

          <div className="px-8 py-7">
            {/* Logo */}
            <div className="flex flex-col items-center mb-6">
              <div
                className="w-16 h-16 rounded-2xl overflow-hidden mb-3"
                style={{
                  border: "2px solid var(--color-primary)",
                  boxShadow: "0 0 0 4px rgba(203,132,74,0.18)",
                }}
              >
                <img
                  src={logoImg}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>

              <h1 className="text-sm font-bold text-gray-200 text-center">
                Western E.M Secondary{" "}
                <span style={{ color: "var(--color-primary)" }}>School</span>
              </h1>

              <div className="flex items-center gap-2 mt-4 w-full">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                  Admin Portal
                </span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-[10px] text-gray-400 mb-1.5 uppercase tracking-wider">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--color-secondary)" }}
                  />
                  <input
                    type="email"
                    placeholder="admin@school.edu.np"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl outline-none transition-all"
                    style={{
                      background: "rgba(0, 111, 214, 0.12)",
                      border: "1px solid rgba(0, 111, 214, 0.25)",
                      color: "#e2eaf4",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--color-primary)";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(203,132,74,0.2)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(0,111,214,0.25)";
                      e.target.style.boxShadow = "none";
                    }}
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] text-gray-400 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--color-secondary)" }}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2.5 text-sm rounded-xl outline-none transition-all"
                    style={{
                      background: "rgba(0, 111, 214, 0.12)",
                      border: "1px solid rgba(0, 111, 214, 0.25)",
                      color: "#e2eaf4",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--color-primary)";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(203,132,74,0.2)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(0,111,214,0.25)";
                      e.target.style.boxShadow = "none";
                    }}
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60 mt-1"
                style={{
                  background:
                    "linear-gradient(to right, var(--color-primary), var(--color-secondary))",
                }}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck size={15} />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div
            className="px-6 py-3 text-center"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(0,0,0,0.3)",
            }}
          >
            <p className="text-[10px] text-gray-500">
              © 2026 Western E.M Secondary School · Authorized Only
            </p>
          </div>
        </div>
      </div>

      <ErrorToast
        isOpen={errorOpen}
        onClose={() => setErrorOpen(false)}
        message={errorMsg}
      />
    </div>
  );
};

export default AdminLogin;
