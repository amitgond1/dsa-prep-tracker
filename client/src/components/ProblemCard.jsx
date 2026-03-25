import { formatDate } from "../utils/dateUtils";

const ProblemCard = ({ problem, onMarkSolved, onBookmark, onOpenSolve }) => {
  const difficultyColor =
    problem.difficulty === "Easy"
      ? "bg-emerald-900 text-emerald-300"
      : problem.difficulty === "Medium"
        ? "bg-amber-900 text-amber-300"
        : "bg-rose-900 text-rose-300";

  return (
    <div className="card p-4 space-y-3">
      <div className="flex justify-between gap-2">
        <h4 className="font-semibold text-white">{problem.title}</h4>
        <button type="button" className="text-xs btn-muted px-2 py-1" onClick={() => onBookmark?.(problem)}>
          {problem.isBookmarked ? "Saved" : "Save"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <span className={`badge ${difficultyColor}`}>{problem.difficulty}</span>
        <span className="badge bg-slate-800 text-slate-200">{problem.topic}</span>
        <span className="badge bg-slate-800 text-cyan">{problem.pattern}</span>
      </div>

      <p className="text-xs text-slate-400">Last solved: {formatDate(problem.lastSolvedDate)}</p>
      <p className="text-xs text-slate-400">Times solved: {problem.solveCount || 0}</p>
      <p className="text-xs text-slate-400">Next due: {formatDate(problem.nextSolveDate)}</p>

      <div className="flex gap-2 pt-1 flex-wrap">
        <a className="btn-secondary text-sm" href={problem.leetcodeLink} target="_blank" rel="noreferrer">
          LeetCode
        </a>
        <button type="button" className="btn-primary text-sm" onClick={() => onOpenSolve?.(problem)}>
          Mark Solved
        </button>
        {onMarkSolved && (
          <button type="button" className="btn-muted text-sm" onClick={() => onMarkSolved(problem)}>
            Solve Now
          </button>
        )}
      </div>
    </div>
  );
};

export default ProblemCard;
