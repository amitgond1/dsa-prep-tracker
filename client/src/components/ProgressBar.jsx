const ProgressBar = ({ value }) => {
  const normalized = Math.min(100, Math.max(0, Number(value) || 0));

  return (
    <div className="w-full h-3 bg-slate-900/80 rounded-full overflow-hidden border border-violet-500/30">
      <div
        className="h-full rounded-full bg-gradient-to-r from-accent to-cyan shadow-[0_0_16px_rgba(124,58,237,0.6)] transition-all duration-500"
        style={{ width: `${normalized}%` }}
      />
    </div>
  );
};

export default ProgressBar;
