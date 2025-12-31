import { FormEvent, useEffect, useMemo, useState } from "react";
import { Calendar, Flag, Hash, Plus, GitBranch } from "lucide-react";
import { Goal, Project, Task, TaskPriority, TaskStatus } from "../types";

export type TaskComposerInput = {
  title: string;
  description?: string;
  deadline?: string;
  priority: TaskPriority;
  status: TaskStatus;
  projectId?: string;
  goalId?: string;
};

type Props = {
  projects: Project[];
  goals: Goal[];
  onSubmit: (input: TaskComposerInput) => void;
  onCancel?: () => void;
  initial?: Task;
  formId?: string;
  mode?: "create" | "edit";
};

export const TaskComposer = ({ projects, goals, onSubmit, onCancel, initial, formId, mode = "create" }: Props) => {
  const firstProjectId = initial?.projectId ?? projects[0]?.id;
  const [form, setForm] = useState<TaskComposerInput>({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    deadline: initial?.deadline ? new Date(initial.deadline).toISOString().slice(0, 16) : "",
    priority: initial?.priority ?? "medium",
    status: initial?.status ?? "planned",
    projectId: firstProjectId,
    goalId: initial?.goalId,
  });

  useEffect(() => {
    setForm({
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      deadline: initial?.deadline ? new Date(initial.deadline).toISOString().slice(0, 16) : "",
      priority: initial?.priority ?? "medium",
      status: initial?.status ?? "planned",
      projectId: initial?.projectId ?? projects[0]?.id,
      goalId: initial?.goalId,
    });
  }, [initial, projects]);

  const projectGoals = useMemo(
    () => goals.filter((goal) => !form.projectId || goal.projectId === form.projectId),
    [goals, form.projectId]
  );

  useEffect(() => {
    if (form.goalId && !projectGoals.find((g) => g.id === form.goalId)) {
      setForm((prev) => ({ ...prev, goalId: undefined }));
    }
  }, [projectGoals, form.goalId]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.title.trim()) return;
    const deadlineIso = form.deadline ? new Date(form.deadline).toISOString() : undefined;
    onSubmit({
      ...form,
      title: form.title.trim(),
      description: form.description?.trim(),
      deadline: deadlineIso,
    });
    if (mode === "create") {
      setForm((prev) => ({ ...prev, title: "", description: "" }));
    }
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="glass-panel card-border rounded-2xl p-4 shadow-card">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="section-title">{mode === "edit" ? "Edit task" : "Create task"}</div>
          <div className="font-display text-xl font-semibold text-white">
            {mode === "edit" ? "Update task details" : "Add the task and an optional deadline"}
          </div>
        </div>
        <div className="flex gap-2">
          {mode === "edit" && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-aurora-green to-aurora-blue px-4 py-2 text-sm font-semibold text-night-900 shadow-glow"
          >
            <Plus size={16} /> {mode === "edit" ? "Save task" : "Add task"}
          </button>
        </div>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm text-slate-300">
          <span className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
            <Hash size={14} /> Project
          </span>
          <select
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-aurora-blue"
            value={form.projectId}
            onChange={(e) => setForm({ ...form, projectId: e.target.value })}
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id} className="bg-night-800 text-night-900">
                {project.title}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm text-slate-300">
          <span className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
            <GitBranch size={14} /> Goal (optional)
          </span>
          <select
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-aurora-blue"
            value={form.goalId || ""}
            onChange={(e) => setForm({ ...form, goalId: e.target.value || undefined })}
          >
            <option value="" className="bg-night-800 text-night-900">
              No goal
            </option>
            {projectGoals.map((goal) => (
              <option key={goal.id} value={goal.id} className="bg-night-800 text-night-900">
                {goal.title}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm text-slate-300">
          <span className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
            Title
          </span>
          <input
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-aurora-green"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Timebox a clear outcome"
            required
          />
        </label>
        <label className="space-y-1 text-sm text-slate-300">
          <span className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
            <Calendar size={14} /> Deadline
          </span>
          <input
            type="datetime-local"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-aurora-green"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          />
        </label>
        <label className="space-y-1 text-sm text-slate-300">
          <span className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
            <Flag size={14} /> Priority
          </span>
          <select
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-aurora-green"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPriority })}
          >
            <option className="bg-night-800 text-night-900" value="high">
              High
            </option>
            <option className="bg-night-800 text-night-900" value="medium">
              Medium
            </option>
            <option className="bg-night-800 text-night-900" value="low">
              Low
            </option>
          </select>
        </label>
        <label className="space-y-1 text-sm text-slate-300">
          <span className="text-xs uppercase tracking-wide text-slate-400">Status</span>
          <select
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-aurora-green"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })}
          >
            <option className="bg-night-800 text-night-900" value="planned">
              Planned
            </option>
            <option className="bg-night-800 text-night-900" value="in-progress">
              In progress
            </option>
            <option className="bg-night-800 text-night-900" value="completed">
              Completed
            </option>
          </select>
        </label>
        <label className="md:col-span-2 space-y-1 text-sm text-slate-300">
          <span className="text-xs uppercase tracking-wide text-slate-400">Description</span>
          <textarea
            className="min-h-[80px] w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-aurora-green"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="What needs to happen for this to be done?"
          />
        </label>
      </div>
    </form>
  );
};
