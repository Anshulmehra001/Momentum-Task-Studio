import { useMemo, useState } from "react";
import { useTaskStore } from "../store/useTaskStore";
import { 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Calendar,
  ArrowRight,
  FolderOpen,
  Target,
  TrendingUp,
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/time";

const DashboardPage = () => {
  const { projects, goals, tasks, addTask } = useTaskStore();
  const [quickTaskTitle, setQuickTaskTitle] = useState("");
  
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTaskTitle.trim()) return;
    
    addTask({
      title: quickTaskTitle.trim(),
      status: "planned",
      priority: "medium",
    });
    setQuickTaskTitle("");
  };

  // Analytics
  const analytics = useMemo(() => {
    const activeProjects = projects.filter(p => p.status !== "completed");
    const completedProjects = projects.filter(p => p.status === "completed");
    const activeGoals = goals.filter(g => g.status !== "completed");
    const completedGoals = goals.filter(g => g.status === "completed");
    const activeTasks = tasks.filter(t => t.status !== "completed");
    const completedTasks = tasks.filter(t => t.status === "completed");
    
    const overdueTasks = tasks.filter(t => {
      if (!t.deadline || t.status === "completed") return false;
      return new Date(t.deadline) < new Date();
    });

    const upcomingTasks = tasks.filter(t => {
      if (!t.deadline || t.status === "completed") return false;
      const deadline = new Date(t.deadline);
      const now = new Date();
      const diffDays = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays <= 7;
    }).sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime());

    const projectProgress = projects.map(project => {
      const projectTasks = tasks.filter(t => t.projectId === project.id);
      const completedCount = projectTasks.filter(t => t.status === "completed").length;
      const progress = projectTasks.length > 0 ? Math.round((completedCount / projectTasks.length) * 100) : 0;
      
      return {
        ...project,
        taskCount: projectTasks.length,
        completedCount,
        progress
      };
    });

    return {
      projects: { active: activeProjects.length, completed: completedProjects.length, total: projects.length },
      goals: { active: activeGoals.length, completed: completedGoals.length, total: goals.length },
      tasks: { active: activeTasks.length, completed: completedTasks.length, total: tasks.length },
      overdue: overdueTasks,
      upcoming: upcomingTasks,
      projectProgress: projectProgress.filter(p => p.taskCount > 0)
    };
  }, [projects, goals, tasks]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">{greeting}</h1>
        <p className="page-subtitle">
          {analytics.projects.active > 0 ? (
            <>You have <span className="font-semibold text-blue-600 dark:text-blue-400">{analytics.projects.active}</span> active projects and <span className="font-semibold text-emerald-600 dark:text-emerald-400">{analytics.tasks.active}</span> tasks to complete.</>
          ) : (
            "Ready to start your next big project? Let's build something amazing!"
          )}
        </p>
      </div>

      {/* Quick Add Task */}
      <div className="max-w-2xl mx-auto mb-8">
        <form onSubmit={handleQuickAdd} className="flex gap-4">
          <input
            type="text"
            value={quickTaskTitle}
            onChange={(e) => setQuickTaskTitle(e.target.value)}
            placeholder="Add a quick task or idea..."
            className="input flex-1 text-base"
          />
          <button type="submit" className="btn btn-primary">
            <Plus size={20} />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </form>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <FolderOpen size={24} className="text-blue-600 dark:text-blue-400" />
            <div className="text-right">
              <div className="stat-value text-blue-600 dark:text-blue-400">{analytics.projects.active}</div>
              <div className="stat-label">Active Projects</div>
            </div>
          </div>
          {analytics.projects.total > 0 && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {analytics.projects.completed} completed
            </div>
          )}
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <Target size={24} className="text-purple-600 dark:text-purple-400" />
            <div className="text-right">
              <div className="stat-value text-purple-600 dark:text-purple-400">{analytics.goals.active}</div>
              <div className="stat-label">Active Goals</div>
            </div>
          </div>
          {analytics.goals.total > 0 && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {analytics.goals.completed} achieved
            </div>
          )}
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle2 size={24} className="text-emerald-600 dark:text-emerald-400" />
            <div className="text-right">
              <div className="stat-value text-emerald-600 dark:text-emerald-400">{analytics.tasks.active}</div>
              <div className="stat-label">Active Tasks</div>
            </div>
          </div>
          {analytics.tasks.total > 0 && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {analytics.tasks.completed} completed
            </div>
          )}
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp size={24} className="text-amber-600 dark:text-amber-400" />
            <div className="text-right">
              <div className="stat-value text-amber-600 dark:text-amber-400">
                {analytics.tasks.total > 0 ? Math.round((analytics.tasks.completed / analytics.tasks.total) * 100) : 0}%
              </div>
              <div className="stat-label">Completion Rate</div>
            </div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Overall progress
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Projects */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
              <Activity size={24} className="text-blue-600 dark:text-blue-400" />
              Active Projects
            </h2>
            <Link to="/projects" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          
          {analytics.projectProgress.length === 0 ? (
            <div className="card text-center py-12 border-dashed border-gray-300 dark:border-slate-600">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FolderOpen size={28} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No active projects</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Start your first project to organize your work</p>
              <Link to="/projects" className="btn btn-primary">
                <Plus size={18} />
                Create Project
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {analytics.projectProgress.slice(0, 3).map((project) => (
                <div key={project.id} className="card-hover">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{project.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {project.taskCount} tasks • {project.completedCount} completed
                      </p>
                    </div>
                    <span className={`badge badge-${project.priority}`}>
                      {project.priority}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{project.progress}%</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tasks Overview */}
        <div className="space-y-6">
          {/* Overdue Tasks */}
          {analytics.overdue.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-red-600 dark:text-red-400 flex items-center gap-3">
                <AlertTriangle size={24} />
                Overdue ({analytics.overdue.length})
              </h2>
              
              <div className="space-y-3">
                {analytics.overdue.slice(0, 3).map((task) => (
                  <div key={task.id} className="card border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10">
                    <div className="flex items-start gap-4">
                      <div className="checkbox checkbox-uncompleted border-red-500" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{task.title}</h4>
                        <p className="text-sm text-red-600 dark:text-red-400">
                          Due {formatDate(task.deadline!)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Tasks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                <Clock size={24} className="text-amber-600 dark:text-amber-400" />
                Coming Up
              </h2>
              <Link to="/tasks" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            
            {analytics.upcoming.length === 0 ? (
              <div className="card text-center py-8 border-dashed border-gray-300 dark:border-slate-600">
                <Clock size={32} className="mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                <p className="text-gray-600 dark:text-gray-400">No upcoming deadlines</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {analytics.upcoming.slice(0, 4).map((task) => (
                  <div key={task.id} className="card-hover">
                    <div className="flex items-start gap-4">
                      <div className="checkbox checkbox-uncompleted" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{task.title}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar size={14} />
                          <span>Due {formatDate(task.deadline!)}</span>
                          <span className={`badge badge-${task.priority}`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 justify-center pt-8 border-t border-gray-200 dark:border-slate-700">
        <Link to="/projects" className="btn btn-secondary">
          <FolderOpen size={20} />
          <span className="hidden sm:inline">New Project</span>
          <span className="sm:hidden">Project</span>
        </Link>
        <Link to="/goals" className="btn btn-secondary">
          <Target size={20} />
          <span className="hidden sm:inline">New Goal</span>
          <span className="sm:hidden">Goal</span>
        </Link>
        <Link to="/tasks" className="btn btn-secondary">
          <CheckCircle2 size={20} />
          <span className="hidden sm:inline">All Tasks</span>
          <span className="sm:hidden">Tasks</span>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
