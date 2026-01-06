import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LayoutShell } from "./components/LayoutShell";
import TasksPage from "./pages/TasksPage";
import GoalsPage from "./pages/GoalsPage";
import DashboardPage from "./pages/DashboardPage";
import ProjectsPage from "./pages/ProjectsPage";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <LayoutShell />,
      children: [
        { index: true, element: <DashboardPage /> },
        { path: "projects", element: <ProjectsPage /> },
        { path: "goals", element: <GoalsPage /> },
        { path: "tasks", element: <TasksPage /> },
        { path: "*", element: <DashboardPage /> },
      ],
    },
  ],
  {
    basename: "/Momentum-Task-Studio",
  }
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
