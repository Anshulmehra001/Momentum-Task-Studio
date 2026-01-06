import { CheckCircle2, Circle, Trash2, Calendar, Edit3, Target } from "lucide-react";
import { formatDate } from "../utils/time";
import { Goal } from "../types";
import { useTaskStore } from "../store/useTaskStore";

type Props = {
  goal: Goal;
  onEdit?: () => void;
};

export const GoalCard = ({ goal, onEdit }: Props) => {
  const { updateGoal, removeGoal } = useTaskStore();
  const isCompleted = goal.status === "completed";
  const isOverdue = goal.targetDate && new Date(goal.targetDate) < new Date() && !isCompleted;

  const handleStatusToggle = () => {
    const newStatus = isCompleted ? "planned" : "completed";
    updateGoal(goal.id, { status: newStatus });
  };

  const handleDelete = () => {
    if (window.confirm("Delete this goal?")) {
      removeGoal(goal.id);
    }
  };

  return (
    <div className={`card-hover group ${isOverdue ? "border-red-400/80 dark:border-red-600/80 bg-gradient-to-r from-red-50/80 to-red-100/40 dark:from-red-900/20 dark:to-red-800/10" : ""}`}>
      <div className="flex items-start gap-4">
        <button
          onClick={handleStatusToggle}
          className={`checkbox flex-shrink-0 ${
            isCompleted ? "checkbox-completed" : "checkbox-uncompleted"
          }`}
        >
          {isCompleted && <CheckCircle2 size={14} className="sm:w-4 sm:h-4" />}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold mb-2 text-base sm:text-lg ${
            isCompleted 
              ? "text-gray-500 dark:text-gray-400 line-through" 
              : "text-gray-900 dark:text-gray-100"
          }`}>
            {goal.title}
          </h3>

          {goal.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
              {goal.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
              <Target size={14} />
              <span className="font-medium">Goal</span>
            </div>
            
            {goal.targetDate && (
              <div className={`flex items-center gap-1 ${isOverdue ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"}`}>
                <Calendar size={14} />
                <span className="font-medium">Due {formatDate(goal.targetDate)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20"
              title="Edit goal"
            >
              <Edit3 size={16} />
            </button>
          )}
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20"
            title="Delete goal"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};