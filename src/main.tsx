import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LayoutShell } from "./components/LayoutShell";
import TasksPage from "./pages/TasksPage";
import GoalsPage from "./pages/GoalsPage";
import SettingsPage from "./pages/SettingsPage";
import ImportExportPage from "./pages/ImportExportPage";
import DashboardPage from "./pages/DashboardPage";
import ProjectsPage from "./pages/ProjectsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "projects", element: <ProjectsPage /> },
      { path: "tasks", element: <TasksPage /> },
      { path: "goals", element: <GoalsPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "import-export", element: <ImportExportPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
