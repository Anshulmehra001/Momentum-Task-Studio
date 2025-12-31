import { CalendarClock, Edit3, Flag, Trash2 } from "lucide-react";
import { Project } from "../types";
import { formatDate } from "../utils/time";

export const ProjectCard = ({
  project,
  progress = 0,
  taskCounts,
  onRemove,
  onEdit,
  onSelect,
  isActive,
}: {
  project: Project;
  progress?: number;
  taskCounts?: { total: number; completed: number };
  onRemove: () => void;
  onEdit?: () => void;
  onSelect?: () => void;
  isActive?: boolean;
}) => {
  const badgeTone =
    project.priority === "high"
      ? "bg-aurora-pink/15 text-aurora-pink"
      : project.priority === "medium"
      ? "bg-aurora-blue/15 text-aurora-blue"
      : "bg-white/10 text-slate-200";
  const statusTone =
    project.status === "completed"
      ? "bg-aurora-green/15 text-aurora-green"
      : project.status === "in-progress"
      ? "bg-aurora-blue/15 text-aurora-blue"
      : "bg-white/10 text-slate-200";

  return (
    <div
      className={`glass-panel card-border rounded-2xl p-4 shadow-card transition ${isActive ? "border-aurora-blue/50" : ""}`}
      onClick={onSelect}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : -1}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className={`rounded-full px-3 py-1 font-semibold capitalize ${statusTone}`}>{project.status}</span>
            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-semibold capitalize ${badgeTone}`}>
              <Flag size={14} /> {project.priority}
            </span>
            {taskCounts && (
              <span className="rounded-full bg-white/5 px-2 py-1 text-slate-200">
                {taskCounts.completed}/{taskCounts.total || 1} tasks
              </span>
            )}
          </div>
          <h3 className="font-display text-xl font-semibold text-white">{project.title}</h3>
          {project.description && <p className="text-sm text-slate-300">{project.description}</p>}
          <div className="flex flex-wrap gap-2 text-xs text-slate-300">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-1">
              <CalendarClock size={12} /> {formatDate(project.deadline, "No deadline")}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
            <span>Created {formatDate(project.createdAt)}</span>
            <span>Updated {formatDate(project.updatedAt)}</span>
            {project.completedAt && <span className="text-aurora-green">Done {formatDate(project.completedAt)}</span>}
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <span
              className="block h-full rounded-full bg-gradient-to-r from-aurora-green to-aurora-blue"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-1">
            {onEdit && (
              <button
                type="button"
                className="rounded-full bg-white/5 p-2 text-slate-200 transition hover:bg-white/10"
                aria-label="Edit project"
                onClick={(event) => {
                  event.stopPropagation();
                  onEdit();
                }}
              >
                <Edit3 size={18} />
              </button>
            )}
            <button
              type="button"
              className="rounded-full bg-white/5 p-2 text-slate-200 transition hover:bg-white/10"
              aria-label="Delete project"
              onClick={(event) => {
                event.stopPropagation();
                onRemove();
              }}
            >
              <Trash2 size={18} />
            </button>
          </div>
          <div className="text-xs text-slate-300">Progress {progress}%</div>
        </div>
      </div>
    </div>
  );
};
