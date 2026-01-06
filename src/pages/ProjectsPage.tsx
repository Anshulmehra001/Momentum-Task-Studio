import { useState, useMemo } from "react";
import { useTaskStore } from "../store/useTaskStore";
import { ProjectComposer } from "../components/ProjectComposer";
import { 
  Plus, 
  Search, 
  Calendar, 
  Clock,
  Edit3,
  Trash2,
  X,
  FolderOpen
} from "lucide-react";
import type { ProjectDuration } from "../types";
import { formatDate } from "../utils/time";

type FilterType = "all" | "planned" | "in-progress" | "completed";
type SortType = "created" | "deadline" | "priority" | "title" | "progress";

const ProjectsPage = () => {
  const { projects, tasks, goals, removeProject } = useTaskStore();
  const [showComposer, setShowComposer] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("created");

  const filters = [
    { key: "all" as FilterType, label: "All Projects", count: projects.length },
    { key: "planned" as FilterType, label: "Planning", count: projects.filter(p => p.status === "planned").length },
    { key: "in-progress" as FilterType, label: "In Progress", count: projects.filter(p => p.status === "in-progress").length },
    { key: "completed" as FilterType, label: "Completed", count: projects.filter(p => p.status === "completed").length },
  ];

  const projectsWithStats = useMemo(() => {
    return projects.map(project => {
      const projectTasks = tasks.filter(t => t.projectId === project.id);
      const projectGoals = goals.filter(g => g.projectId === project.id);
      const completedTasks = projectTasks.filter(t => t.status === "completed").length;
      const progress = projectTasks.length > 0 ? Math.round((completedTasks / projectTasks.length) * 100) : 0;
      
      const overdueTasks = projectTasks.filter(t => {
        if (!t.deadline || t.status === "completed") return false;
        return new Date(t.deadline) < new Date();
      }).length;

      const daysRemaining = project.endDate ? Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;
      
      return {
        ...project,
        taskCount: projectTasks.length,
        goalCount: projectGoals.length,
        completedTasks,
        progress,
        overdueTasks,
        daysRemaining,
      };
    });
  }, [projects, tasks, goals]);

  const filteredProjects = useMemo(() => {
    let filtered = projectsWithStats;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (activeFilter !== "all") {
      filtered = filtered.filter(p => p.status === activeFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "deadline":
          if (!a.endDate && !b.endDate) return 0;
          if (!a.endDate) return 1;
          if (!b.endDate) return -1;
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "title":
          return a.title.localeCompare(b.title);
        case "progress":
          return b.progress - a.progress;
        case "created":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  }, [projectsWithStats, searchQuery, activeFilter, sortBy]);

  const handleDelete = (project: any) => {
    if (window.confirm(`Delete "${project.title}" and all its tasks and goals?`)) {
      removeProject(project.id);
    }
  };

  const getDurationLabel = (duration: ProjectDuration, customDuration?: string) => {
    if (duration === "custom" && customDuration) return customDuration;
    
    const labels = {
      "1-week": "1 Week",
      "2-weeks": "2 Weeks", 
      "1-month": "1 Month",
      "2-months": "2 Months",
      "3-months": "3 Months",
      "6-months": "6 Months",
      "1-year": "1 Year",
      "custom": "Custom"
    };
    
    return labels[duration];
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-10">
        <div>
          <h1 className="page-title text-left mb-3">Project Management</h1>
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
            {filteredProjects.length} {activeFilter === "all" ? "total" : activeFilter} 
            {filteredProjects.length === 1 ? " project" : " projects"}
          </p>
        </div>
        <button
          onClick={() => setShowComposer(true)}
          className="btn btn-primary w-full sm:w-auto focus-ring"
        >
          <Plus size={20} />
          Create New Project
        </button>
      </div>

      {/* Premium Search and Filters */}
      <div className="space-y-8">
        {/* Enhanced Search Bar */}
        <div className="relative max-w-md mx-auto sm:max-w-lg md:max-w-xl">
          <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search projects by name or description..."
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
              <span>{filter.label}</span>
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

        {/* Sort Options */}
        <div className="flex justify-center">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortType)}
            className="input w-auto min-w-[200px] focus-ring"
          >
            <option value="created">🕒 Latest First</option>
            <option value="deadline">📅 By Deadline</option>
            <option value="priority">⭐ By Priority</option>
            <option value="progress">📊 By Progress</option>
            <option value="title">🔤 Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Premium Projects Grid */}
      <div className="space-y-8">
        {filteredProjects.length === 0 ? (
          <div className="card text-center py-16 sm:py-20 border-dashed border-gray-300/60 dark:border-gray-600/60 bg-gradient-to-br from-gray-50/50 to-transparent dark:from-gray-800/50">
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <FolderOpen size={36} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {searchQuery ? "No matching projects found" : `No ${activeFilter === "all" ? "" : activeFilter + " "}projects available`}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-base sm:text-lg max-w-md mx-auto">
              {searchQuery 
                ? "Try adjusting your search terms to find what you're looking for"
                : activeFilter === "all" 
                  ? "Ready to start your first project? Create one to organize your goals and tasks!"
                  : `No projects match the current filter criteria`
              }
            </p>
            {!searchQuery && activeFilter === "all" && (
              <button
                onClick={() => setShowComposer(true)}
                className="btn btn-primary focus-ring"
              >
                <Plus size={20} />
                Create Your First Project
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <div key={project.id} className="card-hover animate-fade-in-up group" style={{ animationDelay: `${index * 0.1}s` }}>
                {/* Project Header */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: project.color }}
                    />
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 line-clamp-1">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`badge badge-${project.priority}`}>
                          {project.priority}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {getDurationLabel(project.duration, project.customDuration)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingProject(project)}
                      className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      title="Edit project"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(project)}
                      className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Delete project"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Project Description */}
                {project.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-5 line-clamp-2">
                    {project.description}
                  </p>
                )}

                {/* Project Stats */}
                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{project.taskCount}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Tasks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{project.goalCount}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Goals</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${project.progress}%`,
                        backgroundColor: project.color
                      }}
                    />
                  </div>
                </div>

                {/* Project Timeline */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {project.endDate ? (
                      <span>
                        Due {formatDate(project.endDate)}
                        {project.daysRemaining !== null && (
                          <span className={`ml-1 ${project.daysRemaining < 0 ? "text-red-600 dark:text-red-400" : project.daysRemaining <= 7 ? "text-amber-600 dark:text-amber-400" : ""}`}>
                            ({project.daysRemaining < 0 ? `${Math.abs(project.daysRemaining)} days overdue` : `${project.daysRemaining} days left`})
                          </span>
                        )}
                      </span>
                    ) : (
                      <span>No deadline set</span>
                    )}
                  </div>
                  
                  {project.overdueTasks > 0 && (
                    <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                      <Clock size={14} />
                      <span>{project.overdueTasks} overdue</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Project Composer Modal */}
      {(showComposer || editingProject) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <ProjectComposer 
              onClose={() => {
                setShowComposer(false);
                setEditingProject(null);
              }}
              initial={editingProject}
              mode={editingProject ? "edit" : "create"}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;