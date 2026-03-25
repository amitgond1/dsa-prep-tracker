import ProblemCard from "./ProblemCard";

const RevisionCard = ({ title, badgeClass, problems, onOpenSolve, onBookmark, onSolveNow }) => {
  return (
    <section className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">{title}</h3>
        <span className={`badge ${badgeClass}`}>{problems.length}</span>
      </div>

      <div className="space-y-3">
        {problems.length === 0 && <p className="text-sm text-slate-400">No problems in this section.</p>}
        {problems.map((item) => {
          const merged = {
            ...item.problem,
            lastSolvedDate: item.lastSolvedDate,
            nextSolveDate: item.nextSolveDate,
            solveCount: item.solveCount
          };
          return (
            <ProblemCard
              key={item._id}
              problem={merged}
              onOpenSolve={onOpenSolve}
              onBookmark={onBookmark}
              onMarkSolved={onSolveNow}
            />
          );
        })}
      </div>
    </section>
  );
};

export default RevisionCard;
