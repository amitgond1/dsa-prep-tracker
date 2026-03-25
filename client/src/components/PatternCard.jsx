import { Link } from "react-router-dom";

const PatternCard = ({ pattern }) => {
  return (
    <Link
      to={`/patterns/${encodeURIComponent(pattern.name)}`}
      className="card p-4 hover:border-accent transition block"
    >
      <h3 className="font-semibold text-white">{pattern.name}</h3>
      <p className="text-sm text-slate-400 mt-2 line-clamp-3">{pattern.explanation}</p>
      <p className="text-xs text-cyan mt-3">{pattern.relatedProblems.length} linked problems</p>
    </Link>
  );
};

export default PatternCard;
