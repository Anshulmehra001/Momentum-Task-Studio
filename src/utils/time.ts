export const formatDate = (iso?: string, fallback = "No deadline") => {
  if (!iso) return fallback;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

export const daysUntil = (iso?: string) => {
  if (!iso) return Number.POSITIVE_INFINITY;
  const now = new Date();
  const target = new Date(iso);
  if (Number.isNaN(target.getTime())) return Number.POSITIVE_INFINITY;
  return Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

// Duration helpers removed from tasks/projects; keep placeholder for compatibility if needed later
export const formatDuration = (_weeks?: number, label?: string, fallback = "No duration") => {
  if (label && label.trim().length > 0) return label.trim();
  return fallback;
};
