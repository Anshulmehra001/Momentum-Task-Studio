import { ImportExportPanel } from "../components/ImportExportPanel";
import { useTaskStore } from "../store/useTaskStore";

const ImportExportPage = () => {
  const { exportData, importData } = useTaskStore();

  return (
    <div className="space-y-6">
      <ImportExportPanel data={exportData()} onImport={importData} />
      <div className="glass-panel card-border rounded-2xl p-5 text-sm text-slate-300 shadow-card">
        <div className="section-title">Format</div>
        <p>
          We export a JSON payload with projects, goals, tasks, and settings. You can edit it by hand or import from other tools that
          match the same shape. If something looks off, you can always refresh to continue from your last save.
        </p>
      </div>
    </div>
  );
};

export default ImportExportPage;
