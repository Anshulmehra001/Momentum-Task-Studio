import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import { isBefore, parseISO } from "date-fns";
import type {
  Goal,
  ImportExportPayload,
  Project,
  ProjectStatus,
  Settings,
  Task,
  TaskPriority,
  TaskStatus,
  ProjectDuration,
} from "../types";

type TaskInput = {
  title: string;
  description?: string;
  deadline?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  goalId?: string;
  projectId?: string;
};

type GoalInput = {
  title: string;
  description?: string;
  targetDate?: string;
  status?: TaskStatus;
  projectId?: string;
};

type ProjectInput = {
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  duration: ProjectDuration;
  customDuration?: string;
  status?: ProjectStatus;
  priority?: TaskPriority;
  color?: string;
};

export type Stats = {
  totals: { projects: number; goals: number; tasks: number };
  completionRate: number;
  remaining: number;
  completed: number;
  dueSoon: Task[];
  overdue: Task[];
  highPriority: Task[];
  projectsProgress: { projectId: string; title: string; progress: number }[];
};

type TaskStore = {
  projects: Project[];
  tasks: Task[];
  goals: Goal[];
  settings: Settings;
  addProject: (input: ProjectInput) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  removeProject: (id: string) => void;
  addGoal: (input: GoalInput) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  removeGoal: (id: string) => void;
  addTask: (input: TaskInput) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  removeTask: (id: string) => void;
  importData: (payload: ImportExportPayload) => void;
  exportData: () => ImportExportPayload;
  stats: () => Stats;
  updateSettings: (updates: Partial<Settings>) => void;
};

const nowIso = () => new Date().toISOString();

const defaultSettings: Settings = {
  showMotivation: true,
  theme: "dark",
  defaultProjectDuration: "1-month",
};

const clampStatus = (status?: string): TaskStatus => {
  if (status === "completed" || status === "in-progress" || status === "planned") return status;
  if (status === "done") return "completed";
  return "planned";
};

const clampPriority = (priority?: string): TaskPriority => {
  if (priority === "high" || priority === "medium" || priority === "low") return priority;
  return "medium";
};

const clampProjectStatus = (status?: string): ProjectStatus => {
  if (status === "completed" || status === "in-progress" || status === "planned") return status;
  return "planned";
};

const clampProjectDuration = (duration?: string): ProjectDuration => {
  const validDurations: ProjectDuration[] = ["1-week", "2-weeks", "1-month", "2-months", "3-months", "6-months", "1-year", "custom"];
  if (validDurations.includes(duration as ProjectDuration)) return duration as ProjectDuration;
  return "1-month";
};

const sanitizeTasks = (tasks: Partial<Task>[] | undefined): Task[] => {
  if (!tasks) return [];
  return tasks.map((task) => ({
    id: task.id || nanoid(10),
    title: (task.title || "Untitled").trim(),
    description: task.description?.trim(),
    deadline: task.deadline,
    goalId: task.goalId,
    projectId: task.projectId,
    status: clampStatus(task.status),
    priority: clampPriority(task.priority),
    createdAt: task.createdAt || nowIso(),
    updatedAt: task.updatedAt || nowIso(),
    completedAt: task.completedAt && clampStatus(task.status) === "completed" ? task.completedAt : undefined,
  }));
};

const sanitizeGoals = (goals: Partial<Goal>[] | undefined): Goal[] => {
  if (!goals) return [];
  return goals.map((goal) => ({
    id: goal.id || nanoid(10),
    projectId: goal.projectId,
    title: (goal.title || "New Goal").trim(),
    description: goal.description?.trim(),
    targetDate: goal.targetDate,
    status: clampStatus(goal.status),
    createdAt: goal.createdAt || nowIso(),
    updatedAt: goal.updatedAt || nowIso(),
    completedAt: goal.completedAt,
  }));
};

const sanitizeProjects = (projects: Partial<Project>[] | undefined): Project[] => {
  if (!projects) return [];
  return projects.map((project) => ({
    id: project.id || nanoid(10),
    title: (project.title || "New Project").trim(),
    description: project.description?.trim(),
    startDate: project.startDate,
    endDate: project.endDate,
    duration: clampProjectDuration(project.duration),
    customDuration: project.customDuration?.trim(),
    status: clampProjectStatus(project.status),
    priority: clampPriority(project.priority),
    color: project.color || "#3B82F6",
    createdAt: project.createdAt || nowIso(),
    updatedAt: project.updatedAt || nowIso(),
    completedAt: project.completedAt && clampProjectStatus(project.status) === "completed" ? project.completedAt : undefined,
  }));
};

const storeCreator: StateCreator<TaskStore> = (set, get) => ({
  projects: [],
  tasks: [],
  goals: [],
  settings: defaultSettings,

  addProject: (input: ProjectInput) => {
    const timestamp = nowIso();
    const project: Project = {
      id: nanoid(10),
      title: input.title.trim() || "New Project",
      description: input.description?.trim(),
      startDate: input.startDate,
      endDate: input.endDate,
      duration: input.duration,
      customDuration: input.customDuration?.trim(),
      status: input.status ? clampProjectStatus(input.status) : "planned",
      priority: input.priority ?? "medium",
      color: input.color || "#3B82F6",
      createdAt: timestamp,
      updatedAt: timestamp,
      completedAt: (input.status ? clampProjectStatus(input.status) : "planned") === "completed" ? timestamp : undefined,
    };
    set((state) => ({ projects: [project, ...state.projects] }));
  },

  updateProject: (id: string, updates: Partial<Project>) => {
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id
          ? {
              ...project,
              ...updates,
              title: updates.title?.trim() ?? project.title,
              description: updates.description?.trim() ?? project.description,
              customDuration: updates.customDuration?.trim() ?? project.customDuration,
              priority: updates.priority ? clampPriority(updates.priority) : project.priority,
              status: updates.status ? clampProjectStatus(updates.status) : project.status,
              duration: updates.duration ? clampProjectDuration(updates.duration) : project.duration,
              completedAt:
                (updates.status ? clampProjectStatus(updates.status) : project.status) === "completed"
                  ? project.completedAt || nowIso()
                  : undefined,
              updatedAt: nowIso(),
            }
          : project
      ),
    }));
  },

  removeProject: (id: string) => {
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      goals: state.goals.filter((g) => g.projectId !== id),
      tasks: state.tasks.filter((t) => t.projectId !== id),
    }));
  },

  addGoal: (input: GoalInput) => {
    const timestamp = nowIso();
    const goal: Goal = {
      id: nanoid(10),
      projectId: input.projectId,
      title: input.title.trim() || "New Goal",
      description: input.description?.trim(),
      targetDate: input.targetDate,
      status: input.status ? clampStatus(input.status) : "planned",
      createdAt: timestamp,
      updatedAt: timestamp,
      completedAt: (input.status ? clampStatus(input.status) : "planned") === "completed" ? timestamp : undefined,
    };
    set((state) => ({ goals: [goal, ...state.goals] }));
  },

  updateGoal: (id: string, updates: Partial<Goal>) => {
    set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              ...updates,
              title: updates.title?.trim() ?? goal.title,
              description: updates.description?.trim() ?? goal.description,
              status: updates.status ? clampStatus(updates.status) : goal.status,
              completedAt:
                (updates.status ? clampStatus(updates.status) : goal.status) === "completed"
                  ? goal.completedAt || nowIso()
                  : undefined,
              updatedAt: nowIso(),
            }
          : goal
      ),
    }));
  },

  removeGoal: (id: string) => {
    set((state) => ({
      goals: state.goals.filter((goal) => goal.id !== id),
      tasks: state.tasks.filter((task) => task.goalId !== id),
    }));
  },

  addTask: (input: TaskInput) => {
    const timestamp = nowIso();
    const task: Task = {
      id: nanoid(10),
      projectId: input.projectId,
      goalId: input.goalId,
      title: input.title.trim() || "Untitled",
      description: input.description?.trim(),
      deadline: input.deadline,
      status: input.status ? clampStatus(input.status) : "planned",
      priority: input.priority ?? "medium",
      createdAt: timestamp,
      updatedAt: timestamp,
      completedAt: (input.status ? clampStatus(input.status) : "planned") === "completed" ? timestamp : undefined,
    };
    set((state) => ({ tasks: [task, ...state.tasks] }));
  },

  updateTask: (id: string, updates: Partial<Task>) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              ...updates,
              title: updates.title?.trim() ?? task.title,
              description: updates.description?.trim() ?? task.description,
              priority: updates.priority ? clampPriority(updates.priority) : task.priority,
              status: updates.status ? clampStatus(updates.status) : task.status,
              completedAt:
                (updates.status ? clampStatus(updates.status) : task.status) === "completed"
                  ? task.completedAt || nowIso()
                  : undefined,
              updatedAt: nowIso(),
            }
          : task
      ),
    }));
  },

  removeTask: (id: string) => {
    set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) }));
  },

  importData: (payload: ImportExportPayload) => {
    if (!payload) return;
    const projects = sanitizeProjects(payload.projects);
    const goals = sanitizeGoals(payload.goals);
    const tasks = sanitizeTasks(payload.tasks);
    set({
      projects,
      goals,
      tasks,
      settings: { ...defaultSettings, ...(payload.settings ?? {}) },
    });
  },

  exportData: (): ImportExportPayload => ({
    projects: get().projects,
    tasks: get().tasks,
    goals: get().goals,
    settings: get().settings,
  }),

  updateSettings: (updates: Partial<Settings>) => {
    set((state) => ({ settings: { ...state.settings, ...updates } }));
  },

  stats: () => {
    const { projects, tasks, goals } = get();
    const now = new Date();
    const totalTasks = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed");
    const remaining = totalTasks - completed.length;

    const dueSoon = tasks
      .filter((t) => t.deadline)
      .filter((t) => {
        const date = t.deadline ? parseISO(t.deadline) : undefined;
        if (!date) return false;
        const diffDays = (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays <= 7;
      })
      .sort((a, b) => (a.deadline && b.deadline ? a.deadline.localeCompare(b.deadline) : 0))
      .slice(0, 6);

    const overdue = tasks.filter((t) => t.deadline && isBefore(parseISO(t.deadline), now) && t.status !== "completed");
    const highPriority = tasks.filter((t) => t.priority === "high" && t.status !== "completed");

    const projectsProgress = projects.map((project) => {
      const projectTasks = tasks.filter((t) => t.projectId === project.id);
      if (projectTasks.length === 0) return { projectId: project.id, title: project.title, progress: 0 };
      const done = projectTasks.filter((t) => t.status === "completed").length;
      return {
        projectId: project.id,
        title: project.title,
        progress: Math.round((done / projectTasks.length) * 100),
      };
    });

    return {
      totals: { projects: projects.length, goals: goals.length, tasks: totalTasks },
      completionRate: totalTasks === 0 ? 0 : Math.round((completed.length / totalTasks) * 100),
      remaining,
      completed: completed.length,
      dueSoon,
      overdue,
      highPriority,
      projectsProgress,
    };
  },
});

export const useTaskStore = create<TaskStore>()(
  persist(storeCreator, {
    name: "momentum-task-store",
    version: 8,
    migrate: (state: any, version) => {
      if (!state) return state;
      
      // Fresh migration for new simplified structure
      if (version < 8) {
        const projects = sanitizeProjects(state.projects);
        const goals = sanitizeGoals(state.goals);
        const tasks = sanitizeTasks(state.tasks);
        
        return {
          projects,
          goals,
          tasks,
          settings: { ...defaultSettings, ...(state.settings ?? {}) },
        } as TaskStore;
      }
      
      return state as TaskStore;
    },
  })
);
