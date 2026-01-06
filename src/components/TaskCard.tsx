import { CheckCircle2, Trash2, Calendar, FolderOpen, Target, AlertCircle } from "lucide-react";
import { formatDate } from "../utils/time";
import { Task } from "../types";
import { useTaskStore } from "../store/useTaskStore";

export const TaskCard = ({ task }: { task: Task }) => {
  const { updateTask, removeTask, projects, goals } = useTaskStore();
  
  const project = projects.find(p => p.id === task.projectId);
  const goal = goals.find(g => g.id === task.goalId);
  const isCompleted = task.status === "completed";
  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && !isCompleted;

  const handleStatusToggle = () => {
    const newStatus = isCompleted ? "planned" : "completed";
    updateTask(task.id, { status: newStatus });
  };

  const handleDelete = () => {
    if (window.confirm("Delete this task?")) {
      removeTask(task.id);
    }
  };

  return (
    <div className={`card-hover animate-fade-in-up group ${isOverdue ? "border-red-400/80 dark:border-red-600/80 bg-gradient-to-r from-red-50/80 to-red-100/40 dark:from-red-900/20 dark:to-red-800/10" : ""}`}>
      <div className="flex items-start gap-4 sm:gap-5">
        {/* Premium Checkbox */}
        <button
          onClick={handleStatusToggle}
          className={`checkbox flex-shrink-0 ${
            isCompleted ? "checkbox-completed" : "checkbox-uncompleted"
          }`}
        >
          {isCompleted && <CheckCircle2 size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className={`font-semibold mb-3 text-base sm:text-lg md:text-xl leading-tight ${
            isCompleted 
              ? "text-gray-500 dark:text-gray-400 line-through" 
              : "text-gray-900 dark:text-gray-100"
          }`}>
            {task.title}
          </h3>

          {/* Description */}
          {task.description && (
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm sm:text-base">
            {/* Priority */}
            <span className={`badge badge-${task.priority}`}>
              {task.priority}
            </span>

            {/* Deadline */}
            {task.deadline && (
              <div className={`flex items-center gap-2 ${isOverdue ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"}`}>
                {isOverdue ? <AlertCircle size={14} className="sm:w-4 sm:h-4" /> : <Calendar size={14} className="sm:w-4 sm:h-4" />}
                <span className="font-medium">{formatDate(task.deadline)}</span>
              </div>
            )}
            
            {/* Project */}
            {project && (
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <FolderOpen size={14} className="sm:w-4 sm:h-4" />
                <span className="font-medium">{project.title}</span>
              </div>
            )}
            
            {/* Goal */}
            {goal && (
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Target size={14} className="sm:w-4 sm:h-4" />
                <span className="font-medium">{goal.title}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 animate-slide-in-right">
          <button
            onClick={handleDelete}
            className="p-2 sm:p-3 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:shadow-md transform hover:scale-105 focus-ring"
            title="Delete task"
          >
            <Trash2 size={16} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};