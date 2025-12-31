import { CalendarClock, Edit3, Target } from "lucide-react";
import { formatDate } from "../utils/time";
import { Goal } from "../types";

export const GoalCard = ({
  goal,
  projectName,
  onRemove,
  onEdit,
}: {
  goal: Goal;
  projectName?: string;
  onRemove: () => void;
  onEdit?: () => void;
}) => {
  return (
    <div className="glass-panel card-border flex flex-col gap-3 rounded-2xl p-4 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-aurora-blue/15 p-2 text-aurora-blue">
            <Target size={18} />
          </div>
          <div>
            <div className="section-title">{goal.targetDate ? `Due ${formatDate(goal.targetDate)}` : "Open timeline"}</div>
            <h3 className="font-display text-xl font-semibold text-white">{goal.title}</h3>
            {projectName && <div className="text-xs text-slate-300">Project: {projectName}</div>}
          </div>
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-wide text-slate-400 hover:bg-white/10"
              aria-label="Edit goal"
            >
              <Edit3 size={14} />
            </button>
          )}
          <button
            onClick={onRemove}
            className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-wide text-slate-400 hover:bg-white/10"
            aria-label="Delete goal"
          >
            Remove
          </button>
        </div>
      </div>
      {goal.description && <p className="text-sm text-slate-300">{goal.description}</p>}
      <div className="flex items-center gap-3 text-sm text-slate-200">
        <span className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-2 py-1">
          <CalendarClock size={14} className="text-aurora-amber" />
          {goal.durationText || "This month"}
        </span>
      </div>
      <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
        <span>Created {formatDate(goal.createdAt)}</span>
        <span>Updated {formatDate(goal.updatedAt)}</span>
        {goal.completedAt && <span className="text-aurora-green">Done {formatDate(goal.completedAt)}</span>}
      </div>
    </div>
  );
};
