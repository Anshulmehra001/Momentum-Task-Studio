import { FormEvent, useEffect, useState } from "react";
import { Calendar, Plus, Timer, Hash } from "lucide-react";
import { Goal, Project } from "../types";

export type GoalComposerInput = {
  title: string;
  description?: string;
  targetDate?: string;
  durationText?: string;
  projectId?: string;
};

type Props = {
  projects: Project[];
  onSubmit: (input: GoalComposerInput) => void;
  onCancel?: () => void;
  initial?: Goal;
  formId?: string;
  mode?: "create" | "edit";
};

export const GoalComposer = ({ projects, onSubmit, onCancel, initial, formId, mode = "create" }: Props) => {
  const durationOptions = ["This day", "This week", "This month", "This quarter", "This year"];
  const [form, setForm] = useState<GoalComposerInput>({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    targetDate: initial?.targetDate ? initial.targetDate.slice(0, 10) : "",
    durationText: initial?.durationText ?? "This week",
    projectId: initial?.projectId ?? projects[0]?.id,
  });

  useEffect(() => {
    setForm({
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      targetDate: initial?.targetDate ? initial.targetDate.slice(0, 10) : "",
      durationText: initial?.durationText ?? "This week",
      projectId: initial?.projectId ?? projects[0]?.id,
    });
  }, [initial, projects]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.title.trim()) return;
    const targetDateIso = form.targetDate ? new Date(form.targetDate).toISOString() : undefined;
    onSubmit({
      ...form,
      title: form.title.trim(),
      description: form.description?.trim(),
      targetDate: targetDateIso,
    });
    if (mode === "create") {
      setForm({ ...form, title: "", description: "" });
    }
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="glass-panel card-border rounded-2xl p-4 shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <div className="section-title">{mode === "edit" ? "Edit goal" : "Create goal"}</div>
          <div className="font-display text-xl font-semibold text-white">Tie work to outcomes</div>
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
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-aurora-pink to-aurora-blue px-4 py-2 text-sm font-semibold text-night-900 shadow-glow"
          >
            <Plus size={16} /> {mode === "edit" ? "Save goal" : "Add goal"}
          </button>
        </div>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm text-slate-300">
          <span className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
            <Hash size={14} /> Project
          </span>
          <select
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-aurora-pink"
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
          <span className="text-xs uppercase tracking-wide text-slate-400">Title</span>
          <input
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-aurora-pink"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Outcome that matters"
            required
          />
        </label>
        <label className="space-y-1 text-sm text-slate-300">
          <span className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
            <Calendar size={14} /> Target date
          </span>
          <input
            type="date"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-aurora-pink"
            value={form.targetDate}
            onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
          />
        </label>
        <label className="space-y-1 text-sm text-slate-300">
          <span className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
            <Timer size={14} /> Duration label
          </span>
          <select
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-aurora-pink"
            value={form.durationText}
            onChange={(e) => setForm({ ...form, durationText: e.target.value })}
          >
            {durationOptions.map((option) => (
              <option key={option} value={option} className="bg-night-800 text-night-900">
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="md:col-span-2 space-y-1 text-sm text-slate-300">
          <span className="text-xs uppercase tracking-wide text-slate-400">Why this matters</span>
          <textarea
            className="min-h-[80px] w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-aurora-pink"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Define the real win and how you'll know it's done"
          />
        </label>
      </div>
    </form>
  );
};
