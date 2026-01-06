export type TaskStatus = "planned" | "in-progress" | "completed";
export type TaskPriority = "high" | "medium" | "low";
export type ThemeMode = "light" | "dark";
export type ProjectDuration = "1-week" | "2-weeks" | "1-month" | "2-months" | "3-months" | "6-months" | "1-year" | "custom";

export type Task = {
  id: string;
  title: string;
  description?: string;
  deadline?: string; // ISO date string
  goalId?: string;
  projectId?: string; // null means individual task
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
};

export type Goal = {
  id: string;
  projectId?: string; // null means individual goal
  title: string;
  description?: string;
  targetDate?: string; // ISO date
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
};

export type ProjectStatus = "planned" | "in-progress" | "completed";

export type Project = {
  id: string;
  title: string;
  description?: string;
  startDate?: string; // ISO date
  endDate?: string; // ISO date
  duration: ProjectDuration;
  customDuration?: string; // for custom duration type
  status: ProjectStatus;
  priority: TaskPriority;
  color?: string; // hex color for visual organization
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
};

export type Settings = {
  showMotivation: boolean;
  theme: ThemeMode;
  defaultProjectDuration: ProjectDuration;
};

export type ImportExportPayload = {
  projects: Project[];
  tasks: Task[];
  goals: Goal[];
  settings: Settings;
};
