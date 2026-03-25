const StreakBadge = ({ streak, bestStreak }) => {
  return (
    <div className="card p-4">
      <p className="text-sm text-slate-400">Streak</p>
      <p className="text-2xl font-bold text-cyan mt-1">{streak} days</p>
      <p className="text-xs text-slate-400 mt-1">Best: {bestStreak} days</p>
    </div>
  );
};

export default StreakBadge;
