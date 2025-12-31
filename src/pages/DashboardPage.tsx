import { useMemo } from "react";
import { formatDate } from "../utils/time";
import { useTaskStore } from "../store/useTaskStore";
import { StatCard } from "../components/StatCard";

const DashboardPage = () => {
  const { stats, projects, tasks, goals, updateTask } = useTaskStore();
  const snapshot = stats();

  const upcoming = snapshot.dueSoon;
  const overdue = snapshot.overdue;
  const highPriority = snapshot.highPriority.slice(0, 5);

  const timeline = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d;
    });
    return days.map((date) => {
      const sameDay = tasks.filter((t) => t.deadline && new Date(t.deadline).toDateString() === date.toDateString());
      return { date, tasks: sameDay };
    });
  }, [tasks]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Projects" value={String(snapshot.totals.projects)} hint="Projects in workspace" />
        <StatCard label="Goals" value={String(snapshot.totals.goals)} hint="Goals tied to projects" />
        <StatCard label="Tasks" value={`${snapshot.completed}/${snapshot.totals.tasks || 1}`} hint="Completed vs total" />
        <StatCard label="Completion" value={`${snapshot.completionRate}%`} hint={`${snapshot.remaining} remaining`} />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {upcoming.length > 0 && (
          <div className="glass-panel card-border rounded-2xl p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div className="section-title">Due soon (7d)</div>
              <div className="rounded-full bg-white/5 px-2 py-1 text-xs text-slate-300">{upcoming.length}</div>
            </div>
            <div className="mt-3 space-y-2">
              {upcoming.map((task) => (
                <div key={task.id} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-sm text-slate-200">
                  <div>
                    <div className="font-semibold text-white">{task.title}</div>
                    <div className="text-xs text-slate-400">Due {formatDate(task.deadline)}</div>
                  </div>
                  <button
                    onClick={() => updateTask(task.id, { status: "completed" })}
                    className="rounded-full bg-aurora-green/15 px-3 py-1 text-xs font-semibold text-aurora-green"
                  >
                    Mark done
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {overdue.length > 0 && (
          <div className="glass-panel card-border rounded-2xl p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div className="section-title">Overdue</div>
              <div className="rounded-full bg-white/5 px-2 py-1 text-xs text-slate-300">{overdue.length}</div>
            </div>
            <div className="mt-3 space-y-2">
              {overdue.map((task) => (
                <div key={task.id} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-sm text-slate-200">
                  <div>
                    <div className="font-semibold text-white">{task.title}</div>
                    <div className="text-xs text-aurora-pink">Past due</div>
                  </div>
                  <button
                    onClick={() => updateTask(task.id, { status: "completed" })}
                    className="rounded-full bg-aurora-green/15 px-3 py-1 text-xs font-semibold text-aurora-green"
                  >
                    Clear
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="glass-panel card-border rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div className="section-title">High priority</div>
            <div className="rounded-full bg-white/5 px-2 py-1 text-xs text-slate-300">{highPriority.length}</div>
          </div>
          {highPriority.length === 0 && <p className="text-sm text-slate-300">No flagged tasks.</p>}
          <div className="mt-3 space-y-2">
            {highPriority.map((task) => (
              <div key={task.id} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-sm text-slate-200">
                <div>
                  <div className="font-semibold text-white">{task.title}</div>
                  <div className="text-xs text-slate-400">{formatDate(task.deadline)}</div>
                </div>
                <div className="rounded-full bg-aurora-pink/20 px-2 py-1 text-xs text-aurora-pink">High</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel card-border rounded-2xl p-5 shadow-card">
          <div className="section-title">Projects progress</div>
          <div className="mt-3 space-y-2">
            {snapshot.projectsProgress.map((proj) => (
              <div key={proj.projectId} className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-center justify-between text-sm text-slate-200">
                  <span>{proj.title}</span>
                  <span className="text-xs text-slate-400">{proj.progress}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <span
                    className="block h-full rounded-full bg-gradient-to-r from-aurora-green to-aurora-blue"
                    style={{ width: `${proj.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-panel card-border rounded-2xl p-5 shadow-card">
        <div className="section-title">Calendar timeline (7d)</div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-7">
          {timeline.map((entry) => (
            <div key={entry.date.toISOString()} className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{entry.date.toLocaleDateString(undefined, { weekday: "short" })}</span>
                <span>{formatDate(entry.date.toISOString())}</span>
              </div>
              <div className="mt-2 space-y-1">
                {entry.tasks.length === 0 && <div className="text-xs text-slate-500">No tasks</div>}
                {entry.tasks.map((task) => (
                  <div key={task.id} className="rounded-lg bg-white/10 px-2 py-1 text-xs text-slate-100">
                    {task.title}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
