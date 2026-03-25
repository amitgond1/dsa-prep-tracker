import { Link } from "react-router-dom";
import { formatDate } from "../utils/dateUtils";

const DifficultyBadge = ({ difficulty }) => {
  const className =
    difficulty === "Easy"
      ? "bg-emerald-900 text-emerald-300"
      : difficulty === "Medium"
        ? "bg-amber-900 text-amber-300"
        : "bg-rose-900 text-rose-300";

  return <span className={`badge ${className}`}>{difficulty}</span>;
};

const ProblemTable = ({ problems, onOpenSolve, onBookmark }) => {
  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[980px] text-sm">
        <thead className="text-left text-slate-400 border-b border-slate-800">
          <tr>
            <th className="p-3">#</th>
            <th className="p-3">Title</th>
            <th className="p-3">Difficulty</th>
            <th className="p-3">Topic</th>
            <th className="p-3">Pattern</th>
            <th className="p-3">Companies</th>
            <th className="p-3">Status</th>
            <th className="p-3">Last Solved</th>
            <th className="p-3">Next Due</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {problems.map((problem) => (
            <tr key={problem._id} className="border-b border-slate-900 hover:bg-slate-900/60">
              <td className="p-3">{problem.number}</td>
              <td className="p-3">
                <Link className="text-cyan hover:underline" to={`/problems/${problem._id}`}>
                  {problem.title}
                </Link>
              </td>
              <td className="p-3">
                <DifficultyBadge difficulty={problem.difficulty} />
              </td>
              <td className="p-3">{problem.topic}</td>
              <td className="p-3">{problem.pattern}</td>
              <td className="p-3 text-xs text-slate-300">{problem.companies.join(", ")}</td>
              <td className="p-3">{problem.status}</td>
              <td className="p-3">{formatDate(problem.lastSolvedDate)}</td>
              <td className="p-3">{formatDate(problem.nextSolveDate)}</td>
              <td className="p-3">
                <div className="flex flex-wrap gap-2">
                  <a
                    href={problem.leetcodeLink}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md bg-cyan px-2 py-1 text-black"
                  >
                    Link
                  </a>
                  <button type="button" className="rounded-md bg-accent px-2 py-1" onClick={() => onOpenSolve(problem)}>
                    Solve
                  </button>
                  <button type="button" className="rounded-md bg-slate-700 px-2 py-1" onClick={() => onBookmark(problem)}>
                    {problem.isBookmarked ? "Saved" : "Save"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {problems.length === 0 && <p className="p-6 text-slate-400">No problems found for selected filters.</p>}
    </div>
  );
};

export default ProblemTable;
