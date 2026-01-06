import { ReactNode, useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Home,
  CheckSquare,
  FolderOpen,
  Target,
  Moon,
  Sun,
  Menu,
  X,
} from "lucide-react";
import { useTaskStore } from "../store/useTaskStore";
import { ImportExport } from "./ImportExport";

const navItems = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/projects", label: "Projects", icon: FolderOpen },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
];

export const LayoutShell = ({ children }: { children?: ReactNode }) => {
  const { settings, updateSettings } = useTaskStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const theme = settings.theme ?? "dark";

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    updateSettings({ theme: theme === "dark" ? "light" : "dark" });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Mobile Header */}
      <div className="lg:hidden bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Momentum</h1>
        </div>
        
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50">
          <div className="bg-white dark:bg-slate-800 w-72 h-full p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <nav className="space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? "nav-item-active" : "nav-item-inactive"}`
                  }
                >
                  <item.icon size={20} />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="lg:flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-gray-50 dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700">
          <div className="flex flex-col flex-1">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200 dark:border-slate-700">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <CheckSquare size={18} className="text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Momentum</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? "nav-item-active" : "nav-item-inactive"}`
                  }
                >
                  <item.icon size={20} />
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Bottom Actions */}
            <div className="px-4 py-4 border-t border-gray-200 dark:border-slate-700">
              <button
                onClick={toggleTheme}
                className="w-full p-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                <span>Toggle Theme</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:pl-64">
          <main className="container-main">
            {children ?? <Outlet />}
          </main>
        </div>
      </div>
    </div>
  );
};
