import { FormEvent, useEffect, useState } from "react";
import { Calendar, Flag, Plus } from "lucide-react";
import { Project, ProjectStatus, TaskPriority } from "../types";

export type ProjectComposerInput = {
  title: string;
  description?: string;
  deadline?: string;
  status: ProjectStatus;
  priority: TaskPriority;
};

type Props = {
  onSubmit: (input: ProjectComposerInput) => void;
  onCancel?: () => void;
  initial?: Project;
  formId?: string;
  mode?: "create" | "edit";
};

export const ProjectComposer = ({ onSubmit, onCancel, initial, formId, mode = "create" }: Props) => {
  const [form, setForm] = useState<ProjectComposerInput>({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    deadline: initial?.deadline ? initial.deadline.slice(0, 10) : "",
    status: initial?.status ?? "planned",
    priority: initial?.priority ?? "medium",
  });

  useEffect(() => {
    setForm({
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      deadline: initial?.deadline ? initial.deadline.slice(0, 10) : "",
      status: initial?.status ?? "planned",
      priority: initial?.priority ?? "medium",
    });
  }, [initial]);

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
      setForm({ ...form, title: "", description: "" });
    }
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="glass-panel card-border rounded-2xl p-4 shadow-card">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="section-title">{mode === "edit" ? "Edit project" : "Create project"}</div>
          <div className="font-display text-xl font-semibold text-white">Define the container for goals and tasks</div>
        </div>
        <div className="flex gap-2">
          {mode === "edit" && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-aurora-blue to-aurora-green px-4 py-2 text-sm font-semibold text-night-900 shadow-glow"
          >
            <Plus size={16} /> {mode === "edit" ? "Save project" : "Add project"}
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm text-slate-300">
          <span className="text-xs uppercase tracking-wide text-slate-400">Title</span>
          <input
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-aurora-blue"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Project title"
            required
          />
        </label>
        <label className="space-y-1 text-sm text-slate-300">
          <span className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
            <Calendar size={14} /> Deadline
          </span>
          <input
            type="date"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-aurora-blue"
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
            onChange={(e) => setForm({ ...form, status: e.target.value as ProjectStatus })}
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
            className="min-h-[80px] w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-aurora-blue"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="What makes this project a win?"
          />
        </label>
      </div>
    </form>
  );
};
