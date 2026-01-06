import { useState, useMemo } from "react";
import { useTaskStore } from "../store/useTaskStore";
import { TaskCard } from "../components/TaskCard";
import { TaskComposer } from "../components/TaskComposer";
import { 
  Plus, 
  Search, 
  CheckCircle2, 
  Circle, 
  Clock,
  AlertTriangle,
  Star,
  X
} from "lucide-react";
import type { TaskStatus, TaskPriority } from "../types";

type FilterType = "all" | "planned" | "in-progress" | "completed" | "overdue" | "today" | "high-priority";
type SortType = "created" | "deadline" | "priority" | "title";

const TasksPage = () => {
  const { tasks, projects, goals } = useTaskStore();
  const [showComposer, setShowComposer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("created");
  const [selectedProject, setSelectedProject] = useState<string>("");

  const filters = [
    { key: "all" as FilterType, label: "All", icon: Circle, count: tasks.length },
    { key: "planned" as FilterType, label: "Planned", icon: Circle, count: tasks.filter(t => t.status === "planned").length },
    { key: "in-progress" as FilterType, label: "In Progress", icon: Clock, count: tasks.filter(t => t.status === "in-progress").length },
    { key: "completed" as FilterType, label: "Completed", icon: CheckCircle2, count: tasks.filter(t => t.status === "completed").length },
    { key: "overdue" as FilterType, label: "Overdue", icon: AlertTriangle, count: tasks.filter(t => t.deadline && new Date(t.deadline) < new Date() && t.status !== "completed").length },
    { key: "high-priority" as FilterType, label: "High Priority", icon: Star, count: tasks.filter(t => t.priority === "high" && t.status !== "completed").length },
  ];

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
      );
    }

    // Apply status/type filter
    switch (activeFilter) {
      case "planned":
        filtered = filtered.filter(t => t.status === "planned");
        break;
      case "in-progress":
        filtered = filtered.filter(t => t.status === "in-progress");
        break;
      case "completed":
        filtered = filtered.filter(t => t.status === "completed");
        break;
      case "overdue":
        filtered = filtered.filter(t => 
          t.deadline && 
          new Date(t.deadline) < new Date() && 
          t.status !== "completed"
        );
        break;
      case "today":
        const today = new Date().toDateString();
        filtered = filtered.filter(t => 
          t.deadline && 
          new Date(t.deadline).toDateString() === today
        );
        break;
      case "high-priority":
        filtered = filtered.filter(t => t.priority === "high" && t.status !== "completed");
        break;
    }

    // Apply project filter
    if (selectedProject) {
      filtered = filtered.filter(t => t.projectId === selectedProject);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "deadline":
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "title":
          return a.title.localeCompare(b.title);
        case "created":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  }, [tasks, searchQuery, activeFilter, selectedProject, sortBy]);

  const activeFilterData = filters.find(f => f.key === activeFilter);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-10">
        <div>
          <h1 className="page-title text-left mb-3">Task Management</h1>
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
            {filteredTasks.length} {activeFilter === "all" ? "total" : activeFilterData?.label.toLowerCase()} 
            {filteredTasks.length === 1 ? " task" : " tasks"}
          </p>
        </div>
        <button
          onClick={() => setShowComposer(true)}
          className="btn btn-primary w-full sm:w-auto focus-ring"
        >
          <Plus size={20} />
          Create New Task
        </button>
      </div>

      {/* Premium Search and Filters */}
      <div className="space-y-8">
        {/* Enhanced Search Bar */}
        <div className="relative max-w-md mx-auto sm:max-w-lg md:max-w-xl">
          <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-12 pr-12 focus-ring"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Premium Filter Tabs */}
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`flex items-center gap-4 px-5 py-4 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap transform hover:scale-105 ${
                activeFilter === filter.key
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-500/30 hover:shadow-blue-500/50"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/80 border border-gray-200/60 dark:border-gray-700/60 hover:border-gray-300/80 dark:hover:border-gray-600/80 shadow-sm hover:shadow-md"
              }`}
            >
              <filter.icon size={18} />
              <span className="hidden sm:inline">{filter.label}</span>
              <span className="sm:hidden">{filter.label.split(' ')[0]}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                activeFilter === filter.key
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              }`}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>

        {/* Premium Secondary Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8">
          {/* Project Filter */}
          {projects.length > 0 && (
            <div className="flex-1 sm:flex-none sm:min-w-[200px]">
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="input focus-ring"
              >
                <option value="">📁 All Projects</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    📂 {project.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sort Options */}
          <div className="flex-1 sm:flex-none sm:min-w-[160px]">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className="input focus-ring"
            >
              <option value="created">🕒 Latest First</option>
              <option value="deadline">📅 By Deadline</option>
              <option value="priority">⭐ By Priority</option>
              <option value="title">🔤 Alphabetical</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(searchQuery || selectedProject || activeFilter !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedProject("");
                setActiveFilter("all");
              }}
              className="btn btn-ghost focus-ring w-full sm:w-auto"
            >
              <X size={18} />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Premium Tasks List */}
      <div className="space-y-6 sm:space-y-8">
        {filteredTasks.length === 0 ? (
          <div className="card text-center py-16 sm:py-20 border-dashed border-gray-300/60 dark:border-gray-600/60 bg-gradient-to-br from-gray-50/50 to-transparent dark:from-gray-800/50">
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-8">
              {activeFilterData?.icon && <activeFilterData.icon size={36} className="text-gray-400 dark:text-gray-500" />}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {searchQuery ? "No matching tasks found" : `No ${activeFilterData?.label.toLowerCase() || "tasks"} available`}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-base sm:text-lg max-w-md mx-auto">
              {searchQuery 
                ? "Try adjusting your search terms or filters to find what you're looking for"
                : activeFilter === "all" 
                  ? "Ready to boost your productivity? Create your first task and start achieving your goals!"
                  : `No tasks match the current filter criteria`
              }
            </p>
            {!searchQuery && activeFilter === "all" && (
              <button
                onClick={() => setShowComposer(true)}
                className="btn btn-primary focus-ring"
              >
                <Plus size={20} />
                Create Your First Task
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-7">
            {filteredTasks.map((task, index) => (
              <div key={task.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <TaskCard task={task} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Premium Task Composer Modal */}
      {showComposer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <TaskComposer onClose={() => setShowComposer(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;