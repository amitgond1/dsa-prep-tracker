import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";

const PatternDetail = () => {
  const { patternName } = useParams();
  const [loading, setLoading] = useState(true);
  const [pattern, setPattern] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/patterns/${patternName}`);
        setPattern(data.pattern);
      } catch (error) {
        toast.error("Pattern not found");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [patternName]);

  if (loading) return <div className="card h-40 animate-pulse bg-slate-900" />;
  if (!pattern) return <p className="text-slate-400">Pattern not found.</p>;

  return (
    <div className="space-y-4">
      <div className="card p-5">
        <h1 className="text-2xl font-bold">{pattern.name}</h1>
        <p className="text-slate-300 mt-3">{pattern.explanation}</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="font-semibold mb-2">When To Identify This Pattern</h3>
          <p className="text-slate-300 text-sm leading-6">{pattern.whenToUse}</p>

          <h3 className="font-semibold mt-4 mb-2">Time/Space Complexity</h3>
          <p className="text-sm text-cyan">{pattern.complexity}</p>

          <h3 className="font-semibold mt-4 mb-2">Related Problems</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-slate-200">
            {pattern.relatedProblems.map((problem) => (
              <li key={problem}>{problem}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="font-semibold mb-2">JavaScript Template</h3>
            <pre className="bg-slate-950 p-3 rounded text-xs overflow-x-auto">
              <code>{pattern.jsTemplate}</code>
            </pre>
          </div>
          <div className="card p-4">
            <h3 className="font-semibold mb-2">Python Template</h3>
            <pre className="bg-slate-950 p-3 rounded text-xs overflow-x-auto">
              <code>{pattern.pyTemplate}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatternDetail;
