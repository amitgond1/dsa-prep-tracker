import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import NotificationDropdown from "./NotificationDropdown";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/problems", label: "Problems" },
  { to: "/company-sheets", label: "Company Sheets" },
  { to: "/revision", label: "Revision" },
  { to: "/patterns", label: "Patterns" },
  { to: "/bookmarks", label: "Bookmarks" },
  { to: "/analytics", label: "Analytics" },
  { to: "/planner", label: "Planner" },
  { to: "/leaderboard", label: "Leaderboard" }
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  const closeMenu = () => setOpen(false);

  return (
    <header className="app-header sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/dashboard"
            className="text-base sm:text-lg font-extrabold bg-gradient-to-r from-accent to-cyan bg-clip-text text-transparent whitespace-nowrap"
            onClick={closeMenu}
          >
            DSA Tracker
          </Link>

          <nav className="hidden sm:flex gap-1 overflow-x-auto no-scrollbar">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm rounded-lg transition whitespace-nowrap ${
                    isActive
                      ? `bg-gradient-to-r from-accent to-cyan shadow-lg shadow-violet-700/35 ${
                          isDark ? "text-white" : "text-slate-900"
                        }`
                      : "nav-link"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <NotificationDropdown />

          <div className="relative">
            <button
              type="button"
              className="text-sm px-3 py-1 rounded-lg border border-cyan/40 bg-cyan/10 hover:bg-cyan/20 nav-link"
              onClick={() => setProfileOpen((prev) => !prev)}
            >
              {user?.name || "Profile"}
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 card p-2 z-50">
                <Link
                  to="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="block px-3 py-2 rounded-lg nav-link hover:bg-slate-900/30"
                >
                  Profile Settings
                </Link>
                <button
                  className="w-full text-left px-3 py-2 rounded-lg nav-link hover:bg-slate-900/30"
                  type="button"
                  onClick={() => {
                    toggleTheme();
                    setProfileOpen(false);
                  }}
                >
                  {isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
                </button>
                <button
                  className="w-full text-left px-3 py-2 rounded-lg text-rose-500 hover:bg-rose-500/10"
                  type="button"
                  onClick={onLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex sm:hidden items-center gap-2">
          <button
            className="btn-muted text-xs px-3 py-2"
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen((p) => !p)}
          >
            <span className="flex items-center gap-1" aria-hidden="true">
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <section className="app-header-panel sm:hidden">
          <div className="px-3 py-3 space-y-3">
            <nav className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm rounded-lg transition text-center ${
                      isActive
                        ? `bg-gradient-to-r from-accent to-cyan ${isDark ? "text-white" : "text-slate-900"}`
                        : "nav-link border border-slate-700/70 bg-slate-900/80"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="grid grid-cols-1 gap-2">
              <button className="btn-muted" type="button" onClick={toggleTheme}>
                {isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
              </button>
              <Link
                to="/profile"
                onClick={closeMenu}
                className="px-3 py-2 text-sm rounded-lg text-center nav-link border border-slate-700/70 bg-slate-900/80"
              >
                {user?.name || "Profile"}
              </Link>
              <button className="btn-muted" type="button" onClick={onLogout}>
                Logout
              </button>
            </div>
          </div>
        </section>
      )}
    </header>
  );
};

export default Navbar;
