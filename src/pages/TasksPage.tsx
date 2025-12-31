import { useMemo, useState } from "react";
import { TaskComposer } from "../components/TaskComposer";
import { TaskCard } from "../components/TaskCard";
import { useTaskStore } from "../store/useTaskStore";
import { daysUntil } from "../utils/time";

type Filter = "all" | "week" | "overdue" | "high" | "completed" | "planned";

const filters: { id: Filter; label: string; description: string }[] = [
  { id: "week", label: "Due this week", description: "Within 7 days" },
  { id: "overdue", label: "Overdue", description: "Past due" },
  { id: "high", label: "High priority", description: "Flagged" },
  { id: "planned", label: "Planned", description: "Not started" },
  { id: "completed", label: "Completed", description: "Done" },
  { id: "all", label: "All", description: "Everything" },
];

const TasksPage = () => {
  const { tasks, projects, goals, addTask, updateTask, removeTask } = useTaskStore();
  const [filter, setFilter] = useState<Filter>("week");
  const [editingId, setEditingId] = useState<string | undefined>();

  const projectMap = useMemo(() => Object.fromEntries(projects.map((p) => [p.id, p.title])), [projects]);
  const goalMap = useMemo(() => Object.fromEntries(goals.map((g) => [g.id, g.title])), [goals]);
  const editingTask = tasks.find((t) => t.id === editingId);

  const filtered = tasks
    .filter((task) => {
      switch (filter) {
        case "week":
          return daysUntil(task.deadline) <= 7 && daysUntil(task.deadline) >= 0;
        case "overdue":
          return daysUntil(task.deadline) < 0;
        case "high":
          return task.priority === "high";
        case "completed":
          return task.status === "completed";
        case "planned":
          return task.status === "planned";
        default:
          return true;
      }
    })
    .sort((a, b) => {
      const aDate = a.deadline ? new Date(a.deadline).getTime() : Number.POSITIVE_INFINITY;
      const bDate = b.deadline ? new Date(b.deadline).getTime() : Number.POSITIVE_INFINITY;
      return aDate - bDate;
    });

  const handleSave = (input: Parameters<typeof addTask>[0]) => {
    if (editingTask) {
      updateTask(editingTask.id, input);
      setEditingId(undefined);
    } else {
      addTask(input);
    }
  };

  return (
    <div className="space-y-4">
      <TaskComposer
        formId="task-composer"
        projects={projects}
        goals={goals}
        initial={editingTask}
        mode={editingTask ? "edit" : "create"}
        onCancel={() => setEditingId(undefined)}
        onSubmit={(input) => handleSave(input)}
      />

      <div className="glass-panel card-border rounded-2xl p-4 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="section-title">Tasks</div>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`rounded-xl px-3 py-1 text-xs font-semibold transition ${
                  filter === f.id ? "bg-white/15 text-white" : "bg-white/5 text-slate-200 hover:bg-white/10"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="rounded-full bg-white/5 px-2 py-1 text-xs text-slate-300">{filtered.length}</div>
        </div>
        <p className="mt-1 text-xs text-slate-400">{filters.find((f) => f.id === filter)?.description}</p>
        <div className="mt-3 space-y-3">
          {filtered.length === 0 && <p className="text-sm text-slate-400">Nothing yet. Add your first task above or change filters.</p>}
          {filtered.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              projectName={task.projectId ? projectMap[task.projectId] : undefined}
              goalName={task.goalId ? goalMap[task.goalId] : undefined}
              onStatus={(next) => updateTask(task.id, { status: next })}
              onRemove={() => removeTask(task.id)}
              onEdit={() => setEditingId(task.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
