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
  durationText?: string;
  projectId?: string;
};

type ProjectInput = {
  title: string;
  description?: string;
  deadline?: string;
  status?: ProjectStatus;
  priority?: TaskPriority;
};

type Stats = {
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
};

const seedProjects: Project[] = [
  {
    id: nanoid(10),
    title: "Pulseflow OS",
    description: "Animated productivity stack for teams.",
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21).toISOString(),
    status: "in-progress",
    priority: "high",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: nanoid(10),
    title: "Atlas Research",
    description: "Insight library and validation sprints.",
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(),
    status: "planned",
    priority: "medium",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
];

const seedGoals: Goal[] = [
  {
    id: nanoid(10),
    projectId: seedProjects[0].id,
    title: "Ship animated dashboard",
    description: "Progress rings, filters, and upcoming feed.",
    targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
    durationText: "This month",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: nanoid(10),
    projectId: seedProjects[1].id,
    title: "Validation sprint",
    description: "Test assumptions and refine rollouts.",
    targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 18).toISOString(),
    durationText: "This quarter",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
];

const seedTasks: Task[] = [
  {
    id: nanoid(10),
    projectId: seedProjects[0].id,
    goalId: seedGoals[0].id,
    title: "Progress rings",
    description: "Animate KPI stack and bind to state.",
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4).toISOString(),
    status: "in-progress",
    priority: "high",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: nanoid(10),
    projectId: seedProjects[0].id,
    goalId: seedGoals[0].id,
    title: "Timeline grid",
    description: "Weekly view with density bars.",
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    status: "planned",
    priority: "medium",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: nanoid(10),
    projectId: seedProjects[1].id,
    goalId: seedGoals[1].id,
    title: "Stakeholder map",
    description: "Plot influence vs impact and draft invites.",
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6).toISOString(),
    status: "planned",
    priority: "high",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
];

const clampStatus = (status?: string): TaskStatus => {
  if (status === "completed" || status === "in-progress" || status === "planned") return status;
  if (status === "done") return "completed";
  return "planned";
};

const clampPriority = (priority?: string): TaskPriority => {
  if (priority === "high" || priority === "medium" || priority === "low") return priority;
  return "medium";
};

const sanitizeTasks = (tasks: Partial<Task>[] | undefined, fallbackProject?: string): Task[] => {
  if (!tasks) return [];
  return tasks.map((task) => ({
    id: task.id || nanoid(10),
    title: (task.title || "Untitled").trim(),
    description: task.description?.trim(),
    deadline: task.deadline,
    goalId: task.goalId,
    projectId: task.projectId || fallbackProject,
    status: clampStatus(task.status),
    priority: clampPriority(task.priority),
    createdAt: task.createdAt || nowIso(),
    updatedAt: task.updatedAt || nowIso(),
    completedAt: task.completedAt && clampStatus(task.status) === "completed" ? task.completedAt : undefined,
  }));
};

const sanitizeGoals = (goals: Partial<Goal>[] | undefined, fallbackProject?: string): Goal[] => {
  if (!goals) return [];
  return goals.map((goal) => ({
    id: goal.id || nanoid(10),
    projectId: goal.projectId || fallbackProject,
    title: (goal.title || "New Goal").trim(),
    description: goal.description?.trim(),
    targetDate: goal.targetDate,
    durationText: goal.durationText?.trim() || "This month",
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
    deadline: project.deadline,
    status: ((): ProjectStatus => {
      if (project.status === "in-progress" || project.status === "completed" || project.status === "planned") return project.status;
      return "planned";
    })(),
    priority: clampPriority(project.priority),
    createdAt: project.createdAt || nowIso(),
    updatedAt: project.updatedAt || nowIso(),
    completedAt: project.completedAt && project.status === "completed" ? project.completedAt : undefined,
  }));
};

const storeCreator: StateCreator<TaskStore> = (set, get) => ({
  projects: seedProjects,
  tasks: seedTasks,
  goals: seedGoals,
  settings: defaultSettings,

  addProject: (input: ProjectInput) => {
    const timestamp = nowIso();
    const project: Project = {
      id: nanoid(10),
      title: input.title.trim() || "New Project",
      description: input.description?.trim(),
      deadline: input.deadline,
      status: input.status ? clampStatus(input.status) : "planned",
      priority: input.priority ?? "medium",
      createdAt: timestamp,
      updatedAt: timestamp,
      completedAt: (input.status ? clampStatus(input.status) : "planned") === "completed" ? timestamp : undefined,
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
              priority: updates.priority ? clampPriority(updates.priority) : project.priority,
              status: updates.status ?? project.status,
              completedAt:
                (updates.status ?? project.status) === "completed"
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
      durationText: input.durationText?.trim() || "This month",
      createdAt: timestamp,
      updatedAt: timestamp,
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
    const projects = sanitizeProjects(payload.projects) || seedProjects;
    const fallbackProject = projects[0]?.id;
    const goals = sanitizeGoals(payload.goals, fallbackProject);
    const tasks = sanitizeTasks(payload.tasks, fallbackProject);
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
    const { projects, tasks } = get();
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

    const overdue = tasks.filter((t) => t.deadline && isBefore(parseISO(t.deadline), now));
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
      totals: { projects: projects.length, goals: get().goals.length, tasks: totalTasks },
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
    version: 5,
    migrate: (state: any, version) => {
      if (!state) return state;
      // migrate from v1 shape without projects/priorities
      if (version < 2) {
        const projects = state.projects ?? seedProjects;
        const fallbackProject = projects[0]?.id;
        return {
          ...state,
          projects,
          goals: sanitizeGoals(state.goals, fallbackProject),
          tasks: sanitizeTasks(state.tasks, fallbackProject),
          settings: { ...defaultSettings, ...(state.settings ?? {}) },
        };
      }
      if (version < 3) {
        const projects = sanitizeProjects(state.projects);
        const fallbackProject = projects[0]?.id;
        const goals = sanitizeGoals(state.goals, fallbackProject);
        const tasks = sanitizeTasks(state.tasks, fallbackProject).map((task) => {
          if (task.status === "completed" && !task.completedAt) {
            return { ...task, completedAt: task.updatedAt || nowIso() };
          }
          return task;
        });
        return {
          ...state,
          projects,
          goals,
          tasks,
          settings: { ...defaultSettings, ...(state.settings ?? {}) },
        };
      }
      if (version < 4) {
        const projects = sanitizeProjects(state.projects);
        const fallbackProject = projects[0]?.id;
        const goals = sanitizeGoals(state.goals, fallbackProject);
        const tasks = sanitizeTasks(state.tasks, fallbackProject);
        return {
          ...state,
          projects,
          goals,
          tasks,
          settings: { ...defaultSettings, ...(state.settings ?? {}) },
        };
      }
      if (version < 5) {
        const projects = sanitizeProjects(state.projects).map((p: any) => {
          const { durationWeeks, durationText, ...rest } = p || {};
          return rest;
        });
        const fallbackProject = projects[0]?.id;
        const goals = sanitizeGoals(state.goals, fallbackProject);
        const tasks = sanitizeTasks(state.tasks, fallbackProject).map((t: any) => {
          const { durationWeeks, durationText, ...rest } = t || {};
          return rest;
        });
        return {
          ...state,
          projects,
          goals,
          tasks,
          settings: { ...defaultSettings, ...(state.settings ?? {}) },
        };
      }
      return state as TaskStore;
    },
  })
);
