import { ChangeEvent } from "react";
import { Download, UploadCloud } from "lucide-react";
import { ImportExportPayload } from "../types";

export const ImportExportPanel = ({
  data,
  onImport,
}: {
  data: ImportExportPayload;
  onImport: (payload: ImportExportPayload) => void;
}) => {
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `momentum-tasks-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as ImportExportPayload;
        onImport(parsed);
      } catch (error) {
        alert("Import failed: invalid JSON");
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="glass-panel card-border rounded-2xl p-6 shadow-card">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="section-title">Portability</div>
          <h3 className="font-display text-2xl font-semibold text-white">Import or export your workspace</h3>
          <p className="mt-1 text-sm text-slate-300">
            Data stays in your browser until you export. Use JSON to backup or move devices.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 shadow-card transition hover:bg-white/10">
            <UploadCloud size={16} className="text-aurora-blue" />
            Import JSON
            <input type="file" accept="application/json" className="hidden" onChange={handleImport} />
          </label>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-aurora-green to-aurora-blue px-4 py-2 text-sm font-semibold text-night-900 shadow-glow"
          >
            <Download size={16} /> Export JSON
          </button>
        </div>
      </div>
    </div>
  );
};
