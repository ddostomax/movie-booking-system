export function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-white/10 text-zinc-200 border-white/10",
    success: "bg-emerald-500/15 text-emerald-200 border-emerald-500/20",
    danger: "bg-rose-500/15 text-rose-200 border-rose-500/20",
    info: "bg-indigo-500/15 text-indigo-200 border-indigo-500/20"
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
        tones[tone] || tones.neutral
      }`}
    >
      {children}
    </span>
  );
}

