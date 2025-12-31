export type TaskStatus = "planned" | "in-progress" | "completed";
export type TaskPriority = "high" | "medium" | "low";
export type ThemeMode = "light" | "dark";

export type Task = {
  id: string;
  title: string;
  description?: string;
  deadline?: string; // ISO date string
  goalId?: string;
  projectId?: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
};

export type Goal = {
  id: string;
  projectId?: string;
  title: string;
  description?: string;
  targetDate?: string; // ISO date
  durationText?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
};

export type ProjectStatus = "planned" | "in-progress" | "completed";

export type Project = {
  id: string;
  title: string;
  description?: string;
  deadline?: string;
  status: ProjectStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
};

export type Settings = {
  showMotivation: boolean;
  theme: ThemeMode;
};

export type ImportExportPayload = {
  projects: Project[];
  tasks: Task[];
  goals: Goal[];
  settings: Settings;
};
