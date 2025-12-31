import { Settings } from "../types";

export const SettingsPanel = ({ settings, onChange }: { settings: Settings; onChange: (updates: Partial<Settings>) => void }) => {
  return (
    <div className="glass-panel card-border rounded-2xl p-6 shadow-card">
      <div className="section-title">Preferences</div>
      <h3 className="font-display text-2xl font-semibold text-white">Keep it simple</h3>
      <div className="mt-4 flex flex-col gap-3 text-sm text-slate-200">
        <label className="flex items-center gap-3">
          <input
            id="motivation"
            type="checkbox"
            className="h-4 w-4 rounded border-white/30 bg-white/10 text-aurora-green focus:ring-aurora-green"
            checked={settings.showMotivation}
            onChange={(e) => onChange({ showMotivation: e.target.checked })}
          />
          <span>Show small tips in the guide</span>
        </label>
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-400">Theme</div>
          <div className="mt-2 flex gap-2">
            {(
              [
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
              ] as const
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange({ theme: option.value })}
                className={`flex-1 rounded-xl px-3 py-2 text-left text-sm transition ${
                  settings.theme === option.value ? "bg-aurora-blue/20 text-white" : "bg-white/5 text-slate-200 hover:bg-white/10"
                }`}
              >
                {option.label} mode
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
