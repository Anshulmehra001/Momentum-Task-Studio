import { useState, useMemo } from "react";
import { useTaskStore } from "../store/useTaskStore";
import { GoalCard } from "../components/GoalCard";
import { GoalComposer } from "../components/GoalComposer";
import { 
  Plus, 
  Search, 
  Target,
  X,
  CheckCircle2,
  Clock,
  Circle
} from "lucide-react";
import type { TaskStatus } from "../types";

type FilterType = "all" | "planned" | "in-progress" | "completed";
type SortType = "created" | "deadline" | "title";

const GoalsPage = () => {
  const { goals, projects } = useTaskStore();
  const [showComposer, setShowComposer] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("created");
  const [selectedProject, setSelectedProject] = useState<string>("");

  const filters = [
    { key: "all" as FilterType, label: "All Goals", icon: Circle, count: goals.length },
    { key: "planned" as FilterType, label: "Planned", icon: Circle, count: goals.filter(g => g.status === "planned").length },
    { key: "in-progress" as FilterType, label: "In Progress", icon: Clock, count: goals.filter(g => g.status === "in-progress").length },
    { key: "completed" as FilterType, label: "Completed", icon: CheckCircle2, count: goals.filter(g => g.status === "completed").length },
  ];

  const filteredGoals = useMemo(() => {
    let filtered = goals;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(goal => 
        goal.title.toLowerCase().includes(query) ||
        goal.description?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (activeFilter !== "all") {
      filtered = filtered.filter(g => g.status === activeFilter);
    }

    // Apply project filter
    if (selectedProject) {
      filtered = filtered.filter(g => g.projectId === selectedProject);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "deadline":
          if (!a.targetDate && !b.targetDate) return 0;
          if (!a.targetDate) return 1;
          if (!b.targetDate) return -1;
          return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
        case "title":
          return a.title.localeCompare(b.title);
        case "created":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  }, [goals, searchQuery, activeFilter, selectedProject, sortBy]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Goals</h1>
        <p className="page-subtitle">
          {filteredGoals.length} {activeFilter === "all" ? "total" : activeFilter} 
          {filteredGoals.length === 1 ? " goal" : " goals"}
        </p>
        <div className="mt-6">
          <button
            onClick={() => setShowComposer(true)}
            className="btn btn-primary"
          >
            <Plus size={20} />
            Create New Goal
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative max-w-lg mx-auto">
          <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search goals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-12 pr-12"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-3 justify-center">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                activeFilter === filter.key
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-600 shadow-sm hover:shadow-md"
              }`}
            >
              <filter.icon size={18} />
              <span>{filter.label}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                activeFilter === filter.key
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400"
              }`}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>

        {/* Secondary Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-center">
          {/* Project Filter */}
          {projects.length > 0 && (
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="input w-full sm:w-auto sm:min-w-[200px]"
            >
              <option value="">📁 All Projects</option>
              <option value="individual">🎯 Individual Goals</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  📂 {project.title}
                </option>
              ))}
            </select>
          )}

          {/* Sort Options */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortType)}
            className="input w-full sm:w-auto sm:min-w-[160px]"
          >
            <option value="created">🕒 Latest First</option>
            <option value="deadline">📅 By Deadline</option>
            <option value="title">🔤 Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-6">
        {filteredGoals.length === 0 ? (
          <div className="card text-center py-16 border-dashed border-gray-300 dark:border-slate-600">
            <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Target size={36} className="text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {searchQuery ? "No matching goals found" : `No ${activeFilter === "all" ? "" : activeFilter + " "}goals available`}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg max-w-md mx-auto">
              {searchQuery 
                ? "Try adjusting your search terms to find what you're looking for"
                : activeFilter === "all" 
                  ? "Ready to set your first goal? Create one to start achieving your dreams!"
                  : `No goals match the current filter criteria`
              }
            </p>
            {!searchQuery && activeFilter === "all" && (
              <button
                onClick={() => setShowComposer(true)}
                className="btn btn-primary"
              >
                <Plus size={20} />
                Create Your First Goal
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredGoals.map((goal, index) => (
              <div key={goal.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <GoalCard 
                  goal={goal} 
                  onEdit={() => setEditingGoal(goal)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Goal Composer Modal */}
      {(showComposer || editingGoal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <GoalComposer 
              onClose={() => {
                setShowComposer(false);
                setEditingGoal(null);
              }}
              initial={editingGoal}
              mode={editingGoal ? "edit" : "create"}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsPage;