import { useMemo, useState } from "react";
import { GoalComposer } from "../components/GoalComposer";
import { GoalCard } from "../components/GoalCard";
import { useTaskStore } from "../store/useTaskStore";

const GoalsPage = () => {
  const { goals, projects, addGoal, updateGoal, removeGoal } = useTaskStore();
  const [editingId, setEditingId] = useState<string | undefined>();
  const projectMap = useMemo(() => Object.fromEntries(projects.map((p) => [p.id, p.title])), [projects]);
  const editingGoal = goals.find((g) => g.id === editingId);

  const handleSave = (input: Parameters<typeof addGoal>[0]) => {
    if (editingGoal) {
      updateGoal(editingGoal.id, input);
      setEditingId(undefined);
    } else {
      addGoal(input);
    }
  };

  return (
    <div className="space-y-6">
      <GoalComposer
        formId="goal-composer"
        projects={projects}
        initial={editingGoal}
        mode={editingGoal ? "edit" : "create"}
        onCancel={() => setEditingId(undefined)}
        onSubmit={(input) => handleSave(input)}
      />

      <div className="glass-panel card-border rounded-2xl p-4 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="section-title">Goals</div>
          <div className="rounded-full bg-white/5 px-2 py-1 text-xs text-slate-300">{goals.length}</div>
          <button
            type="submit"
            form="goal-composer"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-aurora-pink to-aurora-blue px-3 py-1.5 text-xs font-semibold text-night-900 shadow-glow"
          >
            {editingGoal ? "Save goal" : "Add goal"}
          </button>
        </div>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          {goals.length === 0 && <p className="text-sm text-slate-300">No goals yet. Create one above.</p>}
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              projectName={goal.projectId ? projectMap[goal.projectId] : undefined}
              onRemove={() => removeGoal(goal.id)}
              onEdit={() => setEditingId(goal.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;
