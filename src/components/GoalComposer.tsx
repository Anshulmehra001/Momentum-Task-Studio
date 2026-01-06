import { FormEvent, useState } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { Goal, TaskStatus } from "../types";
import { useTaskStore } from "../store/useTaskStore";

type Props = {
  onClose: () => void;
  initial?: Goal;
  mode?: "create" | "edit";
  projectId?: string;
};

export const GoalComposer = ({ onClose, initial, mode = "create", projectId }: Props) => {
  const { addGoal, updateGoal } = useTaskStore();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    targetDate: initial?.targetDate ? new Date(initial.targetDate).toISOString().slice(0, 10) : "",
    status: initial?.status ?? "planned" as TaskStatus,
    projectId: initial?.projectId ?? projectId,
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.title.trim()) return;
    
    setSubmitting(true);
    
    try {
      if (mode === "edit" && initial) {
        updateGoal(initial.id, {
          ...form,
          title: form.title.trim(),
          description: form.description?.trim(),
          targetDate: form.targetDate || undefined,
        });
      } else {
        addGoal({
          ...form,
          title: form.title.trim(),
          description: form.description?.trim(),
          targetDate: form.targetDate || undefined,
        });
      }
      onClose();
    } catch (error) {
      console.error("Error saving goal:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-effect rounded-2xl shadow-2xl border max-h-[90vh] overflow-y-auto animate-fade-in-up">
      <div className="sticky top-0 glass-effect border-b border-white/20 dark:border-gray-700/30 px-6 py-5 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              {mode === "edit" ? "Edit Goal" : "Create New Goal"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
              {mode === "edit" ? "Update goal details" : "Set a new goal to achieve"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-300 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-700/80 hover:shadow-md transform hover:scale-105 focus-ring"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Goal Title *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="What do you want to achieve?"
            className="input focus-ring"
            required
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe your goal in detail..."
            className="input min-h-[100px] focus-ring"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Target Date
            </label>
            <input
              type="date"
              value={form.targetDate}
              onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
              className="input focus-ring"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })}
              className="input focus-ring"
            >
              <option value="planned">📋 Planned</option>
              <option value="in-progress">⚡ In Progress</option>
              <option value="completed">✅ Completed</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200/60 dark:border-gray-700/60">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary w-full sm:w-auto focus-ring"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary w-full sm:w-auto focus-ring"
            disabled={submitting || !form.title.trim()}
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle2 size={20} />
                {mode === "edit" ? "Update Goal" : "Create Goal"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};