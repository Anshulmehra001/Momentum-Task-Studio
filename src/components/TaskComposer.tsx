import { FormEvent, useEffect, useMemo, useState } from "react";
import { Calendar, Flag, Hash, Plus, GitBranch, CheckCircle2, X } from "lucide-react";
import { Goal, Project, Task, TaskPriority, TaskStatus } from "../types";
import { useTaskStore } from "../store/useTaskStore";

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
  onClose: () => void;
  initial?: Task;
  mode?: "create" | "edit";
};

export const TaskComposer = ({ onClose, initial, mode = "create" }: Props) => {
  const { projects, goals, addTask, updateTask } = useTaskStore();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<TaskComposerInput>({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    deadline: initial?.deadline ? new Date(initial.deadline).toISOString().slice(0, 16) : "",
    priority: initial?.priority ?? "medium",
    status: initial?.status ?? "planned",
    projectId: initial?.projectId ?? projects[0]?.id,
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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.title.trim()) return;
    
    setSubmitting(true);
    
    const deadlineIso = form.deadline ? new Date(form.deadline).toISOString() : undefined;
    const taskData = {
      ...form,
      title: form.title.trim(),
      description: form.description?.trim(),
      deadline: deadlineIso,
    };

    try {
      if (mode === "edit" && initial) {
        updateTask(initial.id, taskData);
      } else {
        addTask(taskData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving task:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-effect rounded-2xl shadow-2xl border max-h-[90vh] overflow-y-auto animate-fade-in-up">
      <div className="sticky top-0 glass-effect border-b border-white/20 dark:border-gray-700/30 px-6 sm:px-8 py-5 sm:py-6 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              {mode === "edit" ? "Edit Task" : "Create New Task"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-2">
              {mode === "edit" ? "Update task details and settings" : "Add a new task to your productivity workflow"}
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
            Task Title *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="What needs to be accomplished?"
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
            placeholder="Add detailed information about this task..."
            className="input min-h-[100px] focus-ring"
            rows={4}
          />
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
              onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })}
              className="input focus-ring"
            >
              <option value="planned">📋 Planned</option>
              <option value="in-progress">⚡ In Progress</option>
              <option value="completed">✅ Completed</option>
            </select>
          </div>
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Deadline (Optional)
          </label>
          <input
            type="datetime-local"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            className="input focus-ring"
          />
        </div>

        {/* Project and Goal */}
        {projects.length > 0 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Project Assignment
              </label>
              <select
                value={form.projectId ?? ""}
                onChange={(e) => setForm({ ...form, projectId: e.target.value || undefined })}
                className="input focus-ring"
              >
                <option value="">📁 No Project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    📂 {project.title}
                  </option>
                ))}
              </select>
            </div>

            {projectGoals.length > 0 && (
              <div>
                <label className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Goal Connection
                </label>
                <select
                  value={form.goalId || ""}
                  onChange={(e) => setForm({ ...form, goalId: e.target.value || undefined })}
                  className="input focus-ring"
                >
                  <option value="">🎯 No Goal</option>
                  {projectGoals.map((goal) => (
                    <option key={goal.id} value={goal.id}>
                      🎯 {goal.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

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
                {mode === "edit" ? "Update Task" : "Create Task"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
