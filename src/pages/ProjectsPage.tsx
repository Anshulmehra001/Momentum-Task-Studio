import { useMemo, useState } from "react";
import { ProjectCard } from "../components/ProjectCard";
import { ProjectComposer, ProjectComposerInput } from "../components/ProjectComposer";
import { TaskCard } from "../components/TaskCard";
import { GoalCard } from "../components/GoalCard";
import { useTaskStore } from "../store/useTaskStore";
import { formatDate } from "../utils/time";

const ProjectsPage = () => {
  const { projects, tasks, goals, addProject, updateProject, removeProject, removeGoal, removeTask, updateTask } = useTaskStore();
  const [selectedId, setSelectedId] = useState<string | undefined>(projects[0]?.id);
  const [editingId, setEditingId] = useState<string | undefined>();

  const selectedProject = projects.find((p) => p.id === selectedId) ?? projects[0];
  const editingProject = projects.find((p) => p.id === editingId);

  const projectProgress = useMemo(() => {
    return projects.map((project) => {
      const projectTasks = tasks.filter((t) => t.projectId === project.id);
      const total = projectTasks.length;
      const completed = projectTasks.filter((t) => t.status === "completed").length;
      const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
      return { projectId: project.id, progress, total, completed };
    });
  }, [projects, tasks]);

  const saveProject = (input: ProjectComposerInput) => {
    if (editingProject) {
      updateProject(editingProject.id, input);
      setEditingId(undefined);
    } else {
      addProject(input);
    }
  };

  const selectedProjectStats = projectProgress.find((p) => p.projectId === selectedProject?.id);
  const selectedGoals = goals.filter((goal) => goal.projectId === selectedProject?.id);
  const selectedTasks = tasks.filter((task) => task.projectId === selectedProject?.id);

  return (
    <div className="space-y-4">
      <ProjectComposer
        formId="project-composer"
        onSubmit={saveProject}
        onCancel={() => setEditingId(undefined)}
        initial={editingProject}
        mode={editingProject ? "edit" : "create"}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass-panel card-border rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between">
            <div className="section-title">Projects</div>
            <div className="rounded-full bg-white/5 px-2 py-1 text-xs text-slate-300">{projects.length}</div>
          </div>
          <div className="mt-3 grid gap-3">
            {projects.length === 0 && <p className="text-sm text-slate-400">No projects yet. Add one above.</p>}
            {projects.map((project) => {
              const progress = projectProgress.find((p) => p.projectId === project.id);
              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  progress={progress?.progress ?? 0}
                  taskCounts={{ total: progress?.total ?? 0, completed: progress?.completed ?? 0 }}
                  onRemove={() => removeProject(project.id)}
                  onEdit={() => {
                    setEditingId(project.id);
                    setSelectedId(project.id);
                  }}
                  onSelect={() => setSelectedId(project.id)}
                  isActive={selectedProject?.id === project.id}
                />
              );
            })}
          </div>
        </div>

        <div className="glass-panel card-border rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="section-title">Project detail</div>
              <h3 className="font-display text-2xl font-semibold text-white">{selectedProject?.title ?? "Select a project"}</h3>
            </div>
            {selectedProject && (
              <div className="rounded-xl bg-white/5 px-3 py-2 text-sm text-slate-200">
                {selectedProject.deadline ? formatDate(selectedProject.deadline) : "No deadline"}
              </div>
            )}
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="section-title">Goals</div>
              <div className="mt-2 space-y-2 text-sm text-slate-200">
                {selectedGoals.length === 0 && <p className="text-slate-400">No goals yet.</p>}
                {selectedGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    projectName={selectedProject?.title}
                    onRemove={() => removeGoal(goal.id)}
                  />
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="section-title">Tasks</div>
              <div className="mt-2 space-y-2 text-sm text-slate-200">
                {selectedTasks.length === 0 && <p className="text-slate-400">No tasks yet.</p>}
                {selectedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    projectName={selectedProject?.title}
                    goalName={selectedGoals.find((g) => g.id === task.goalId)?.title}
                    onStatus={(next) => updateTask(task.id, { status: next })}
                    onRemove={() => removeTask(task.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          {selectedProjectStats && (
            <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
              <div className="section-title">Progress</div>
              <div className="mt-1">
                {selectedProjectStats.total === 0
                  ? "No tasks yet"
                  : `${selectedProjectStats.completed}/${selectedProjectStats.total} tasks · ${selectedProjectStats.progress}% complete`}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
