import { CheckCircle2, Clock3, Edit3, Flag, MoreHorizontal, TimerReset } from "lucide-react";
import { formatDate } from "../utils/time";
import { Task } from "../types";

const statusTone: Record<Task["status"], string> = {
  planned: "bg-white/5 text-slate-200",
  "in-progress": "bg-aurora-blue/15 text-aurora-blue",
  completed: "bg-aurora-green/15 text-aurora-green",
};

const priorityTone: Record<Task["priority"], string> = {
  high: "bg-aurora-pink/15 text-aurora-pink",
  medium: "bg-aurora-blue/15 text-aurora-blue",
  low: "bg-white/10 text-slate-200",
};

export const TaskCard = ({
  task,
  projectName,
  goalName,
  onStatus,
  onRemove,
  onEdit,
}: {
  task: Task;
  projectName?: string;
  goalName?: string;
  onStatus: (nextStatus: Task["status"]) => void;
  onRemove: () => void;
  onEdit?: () => void;
}) => {
  return (
    <div className="glass-panel card-border rounded-2xl p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="rounded-lg bg-white/5 px-2 py-1 text-slate-300">{formatDate(task.deadline)}</div>
            <div className={`rounded-full px-3 py-1 font-semibold capitalize ${statusTone[task.status]}`}>{task.status}</div>
            <div className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-semibold capitalize ${priorityTone[task.priority]}`}>
              <Flag size={14} /> {task.priority}
            </div>
          </div>
          <h3 className="font-display text-xl font-semibold text-white">{task.title}</h3>
          {task.description && <p className="text-sm text-slate-300">{task.description}</p>}
          <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
            {projectName && <span className="rounded-full bg-white/5 px-2 py-1 text-xs">Project: {projectName}</span>}
            {goalName && <span className="rounded-full bg-white/5 px-2 py-1 text-xs">Goal: {goalName}</span>}
            <span>Created {formatDate(task.createdAt)}</span>
            <span>Updated {formatDate(task.updatedAt)}</span>
            {task.completedAt && <span className="text-aurora-green">Done {formatDate(task.completedAt)}</span>}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-2">
            {onEdit && (
              <button
                type="button"
                className="rounded-full bg-white/5 p-2 text-slate-200 transition hover:bg-white/10"
                aria-label="Edit task"
                onClick={onEdit}
              >
                <Edit3 size={18} />
              </button>
            )}
            <button
              type="button"
              className="rounded-full bg-white/5 p-2 text-slate-200 transition hover:bg-white/10"
              aria-label="Delete task"
              onClick={onRemove}
            >
              <MoreHorizontal size={18} />
            </button>
          </div>
          <StatusButtons status={task.status} onStatus={onStatus} />
        </div>
      </div>
    </div>
  );
};

const StatusButtons = ({
  status,
  onStatus,
}: {
  status: Task["status"];
  onStatus: (next: Task["status"]) => void;
}) => {
  return (
    <div className="flex gap-2">
      <button
        className="inline-flex items-center gap-1 rounded-full bg-aurora-green/15 px-3 py-1 text-xs font-semibold text-aurora-green"
        onClick={() => onStatus(status === "completed" ? "planned" : "completed")}
      >
        <CheckCircle2 size={14} /> {status === "completed" ? "Mark open" : "Mark done"}
      </button>
      {status !== "in-progress" && (
        <button
          className="inline-flex items-center gap-1 rounded-full bg-aurora-blue/15 px-3 py-1 text-xs font-semibold text-aurora-blue"
          onClick={() => onStatus("in-progress")}
        >
          <Clock3 size={14} /> In progress
        </button>
      )}
      {status !== "planned" && (
        <button
          className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200"
          onClick={() => onStatus("planned")}
        >
          <TimerReset size={14} /> Reset
        </button>
      )}
    </div>
  );
};
