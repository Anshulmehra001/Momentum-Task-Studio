import { ReactNode, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { ListChecks, Sparkles, Upload, BookOpen, LayoutDashboard, KanbanSquare, SunMedium, Moon } from "lucide-react";
import { Target } from "lucide-react";
import { useTaskStore } from "../store/useTaskStore";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: KanbanSquare },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/import-export", label: "Import / Export", icon: Upload },
  { to: "/settings", label: "Guide", icon: BookOpen },
];

const accentRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aurora-blue";

export const LayoutShell = ({ children }: { children?: ReactNode }) => {
  const location = useLocation();
  const { settings, updateSettings } = useTaskStore();
  const theme = settings.theme ?? "dark";

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
  }, [theme]);

  const toggleTheme = () => {
    updateSettings({ theme: theme === "dark" ? "light" : "dark" });
  };

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-slate-50 transition-colors">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-aurora-green to-aurora-blue text-night-900 shadow-glow">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Momentum</div>
              <div className="font-display text-2xl font-semibold text-white">Workspace</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <nav className="flex gap-1 rounded-2xl bg-white/5 p-1 text-sm shadow-card">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-xl px-3 py-2 transition ${accentRing} ` +
                    (isActive
                      ? "bg-aurora-blue/20 text-white shadow-sm"
                      : "text-slate-200 hover:bg-white/10")
                  }
                >
                  <item.icon size={16} className="text-aurora-blue" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
            <button
              type="button"
              onClick={toggleTheme}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-200 transition ${accentRing} bg-white/5 hover:bg-white/10 shadow-card`}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <SunMedium size={16} /> : <Moon size={16} />}
              <span className="hidden sm:inline">{theme === "dark" ? "Light" : "Dark"} mode</span>
            </button>
          </div>
        </header>

        <main className="space-y-6">
          <Header location={location.pathname} />
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
};

const Header = ({ location }: { location: string }) => {
  const titles: Record<string, { title: string; subtitle: string }> = {
    "/": { title: "Dashboard", subtitle: "Focus on the next important thing" },
    "/tasks": { title: "Tasks", subtitle: "Durations and deadlines" },
    "/projects": { title: "Projects", subtitle: "Goals and tasks grouped" },
    "/goals": { title: "Goals", subtitle: "Lightweight time frames" },
    "/settings": { title: "Guide", subtitle: "Tips for staying light" },
    "/import-export": { title: "Import / Export", subtitle: "Backup or move devices" },
  };

  const current = titles[location] ?? titles["/"];

  return (
    <div className="glass-panel rounded-2xl p-5 shadow-card">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="section-title">{current.subtitle}</div>
          <h1 className="font-display text-3xl font-semibold leading-tight gradient-text">{current.title}</h1>
        </div>
        <div className="flex flex-wrap gap-2 text-sm text-slate-200">
          <div className="glass-panel inline-flex items-center gap-2 rounded-xl px-3 py-2">Simple fields</div>
          <div className="glass-panel inline-flex items-center gap-2 rounded-xl px-3 py-2">Save in browser</div>
        </div>
      </div>
    </div>
  );
};
