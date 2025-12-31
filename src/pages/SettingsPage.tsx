import { SettingsPanel } from "../components/SettingsPanel";
import { useTaskStore } from "../store/useTaskStore";

const SettingsPage = () => {
  const { settings, updateSettings } = useTaskStore();

  return (
    <div className="space-y-4">
      <SettingsPanel settings={settings} onChange={updateSettings} />
      <div className="glass-panel card-border rounded-2xl p-5 text-slate-200 shadow-card">
        <div className="section-title">How it works</div>
        <ul className="mt-2 space-y-2 text-sm">
          <li>• Add tasks with a simple title, duration, and optional deadline.</li>
          <li>• Group tasks under a goal if you want a lightweight bucket.</li>
          <li>• Everything saves in your browser. Use Import/Export to back up.</li>
          <li>• No timers to manage—just durations and dates.</li>
        </ul>
      </div>
      <div className="glass-panel card-border rounded-2xl p-5 text-sm text-slate-300 shadow-card">
        <div className="section-title">Tips</div>
        <p className="text-slate-200">Keep durations realistic, set deadlines only when they matter, and review the Dashboard to stay ahead.</p>
      </div>
    </div>
  );
};

export default SettingsPage;
