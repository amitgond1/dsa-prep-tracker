const Timer = ({ seconds }) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");

  return (
    <div className="card p-4 flex items-center justify-between border-cyan/35 bg-gradient-to-r from-violet-500/15 to-cyan/15">
      <p className="text-sm text-slate-200">Solve Timer</p>
      <p className="text-3xl font-bold tracking-wide bg-gradient-to-r from-cyan to-accent bg-clip-text text-transparent">
        {mins}:{secs}
      </p>
    </div>
  );
};

export default Timer;
