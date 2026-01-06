import { FormEvent, useState, useEffect } from "react";
import { X, CheckCircle2, Clock, Palette } from "lucide-react";
import { Project, ProjectDuration, ProjectStatus, TaskPriority } from "../types";
import { useTaskStore } from "../store/useTaskStore";

export type ProjectComposerInput = {
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  duration: ProjectDuration;
  customDuration?: string;
  status: ProjectStatus;
  priority: TaskPriority;
  color?: string;
};

type Props = {
  onClose: () => void;
  initial?: Project;
  mode?: "create" | "edit";
};

const durationOptions: { value: ProjectDuration; label: string; description: string }[] = [
  { value: "1-week", label: "1 Week", description: "Quick sprint or short task" },
  { value: "2-weeks", label: "2 Weeks", description: "Small project or feature" },
  { value: "1-month", label: "1 Month", description: "Medium-sized project" },
  { value: "2-months", label: "2 Months", description: "Substantial project" },
  { value: "3-months", label: "3 Months", description: "Major project or quarter goal" },
  { value: "6-months", label: "6 Months", description: "Long-term initiative" },
  { value: "1-year", label: "1 Year", description: "Annual goal or major milestone" },
  { value: "custom", label: "Custom", description: "Set your own timeline" },
];

const colorOptions = [
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#F97316", // Orange
  "#EC4899", // Pink
  "#6B7280", // Gray
];

export const ProjectComposer = ({ onClose, initial, mode = "create" }: Props) => {
  const { addProject, updateProject } = useTaskStore();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<ProjectComposerInput>({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    startDate: initial?.startDate ? new Date(initial.startDate).toISOString().slice(0, 10) : "",
    endDate: initial?.endDate ? new Date(initial.endDate).toISOString().slice(0, 10) : "",
    duration: initial?.duration ?? "1-month",
    customDuration: initial?.customDuration ?? "",
    status: initial?.status ?? "planned",
    priority: initial?.priority ?? "medium",
    color: initial?.color ?? colorOptions[0],
  });

  // Auto-calculate end date based on duration and start date
  useEffect(() => {
    if (!form.startDate || form.duration === "custom") return;
    
    const startDate = new Date(form.startDate);
    let endDate = new Date(startDate);
    
    switch (form.duration) {
      case "1-week":
        endDate.setDate(startDate.getDate() + 7);
        break;
      case "2-weeks":
        endDate.setDate(startDate.getDate() + 14);
        break;
      case "1-month":
        endDate.setMonth(startDate.getMonth() + 1);
        break;
      case "2-months":
        endDate.setMonth(startDate.getMonth() + 2);
        break;
      case "3-months":
        endDate.setMonth(startDate.getMonth() + 3);
        break;
      case "6-months":
        endDate.setMonth(startDate.getMonth() + 6);
        break;
      case "1-year":
        endDate.setFullYear(startDate.getFullYear() + 1);
        break;
    }
    
    setForm(prev => ({ ...prev, endDate: endDate.toISOString().slice(0, 10) }));
  }, [form.startDate, form.duration]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.title.trim()) return;
    
    setSubmitting(true);
    
    const projectData = {
      ...form,
      title: form.title.trim(),
      description: form.description?.trim(),
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
    };

    try {
      if (mode === "edit" && initial) {
        updateProject(initial.id, projectData);
      } else {
        addProject(projectData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedDuration = durationOptions.find(d => d.value === form.duration);

  return (
    <div className="glass-effect rounded-2xl shadow-2xl border max-h-[90vh] overflow-y-auto animate-fade-in-up">
      <div className="sticky top-0 glass-effect border-b border-white/20 dark:border-gray-700/30 px-6 sm:px-8 py-5 sm:py-6 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              {mode === "edit" ? "Edit Project" : "Create New Project"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-2">
              {mode === "edit" ? "Update project details and timeline" : "Start a new project with clear goals and timeline"}
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

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 sm:space-y-8">
        {/* Title */}
        <div>
          <label className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Project Title *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="What's the name of your project?"
            className="input focus-ring"
            required
            autoFocus
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe the project goals, scope, and key deliverables..."
            className="input min-h-[100px] focus-ring"
            rows={4}
          />
        </div>

        {/* Duration Selection */}
        <div>
          <label className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Project Duration
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {durationOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setForm({ ...form, duration: option.value })}
                className={`p-3 rounded-xl border-2 transition-all duration-300 text-left ${
                  form.duration === option.value
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300"
                }`}
              >
                <div className="font-semibold text-sm">{option.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{option.description}</div>
              </button>
            ))}
          </div>
          
          {selectedDuration && (
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <Clock size={16} />
                <span className="font-medium">Selected: {selectedDuration.label}</span>
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">{selectedDuration.description}</p>
            </div>
          )}
        </div>

        {/* Custom Duration Input */}
        {form.duration === "custom" && (
          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Custom Duration Description
            </label>
            <input
              type="text"
              value={form.customDuration}
              onChange={(e) => setForm({ ...form, customDuration: e.target.value })}
              placeholder="e.g., 5 weeks, 4 months, until Q2 2024..."
              className="input focus-ring"
            />
          </div>
        )}

        {/* Date Range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Start Date
            </label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="input focus-ring"
            />
          </div>

          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Target End Date
            </label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="input focus-ring"
              disabled={form.duration !== "custom"}
            />
            {form.duration !== "custom" && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Auto-calculated based on duration
              </p>
            )}
          </div>
        </div>

        {/* Priority and Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Priority Level
            </label>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPriority })}
              className="input focus-ring"
            >
              <option value="low">🟢 Low Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="high">🔴 High Priority</option>
            </select>
          </div>

          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Current Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as ProjectStatus })}
              className="input focus-ring"
            >
              <option value="planned">📋 Planning</option>
              <option value="in-progress">⚡ In Progress</option>
              <option value="completed">✅ Completed</option>
            </select>
          </div>
        </div>

        {/* Color Selection */}
        <div>
          <label className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Project Color
          </label>
          <div className="flex items-center gap-3">
            <Palette size={20} className="text-gray-500 dark:text-gray-400" />
            <div className="flex gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm({ ...form, color })}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                    form.color === color
                      ? "border-gray-400 dark:border-gray-500 scale-110"
                      : "border-gray-200 dark:border-gray-700 hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
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
                {mode === "edit" ? "Update Project" : "Create Project"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};