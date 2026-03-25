import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import SolveModal from "../components/SolveModal";
import Timer from "../components/Timer";
import api from "../utils/api";
import { formatDate } from "../utils/dateUtils";

const ProblemDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [problem, setProblem] = useState(null);
  const [progress, setProgress] = useState(null);
  const [editor, setEditor] = useState({ notes: "", code: "" });
  const [saving, setSaving] = useState(false);
  const [solveModal, setSolveModal] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  const fetchProblem = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/problems/${id}`);
      setProblem(data.problem);
      setProgress(data.progress);
      setEditor({ notes: data.progress?.notes || "", code: data.progress?.code || "" });
    } catch (error) {
      toast.error("Problem not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblem();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [id]);

  const toggleTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }

    timerRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  const saveContent = async () => {
    try {
      setSaving(true);
      const { data } = await api.patch(`/user-problems/${id}/content`, editor);
      setProgress(data.progress);
      toast.success("Notes and code saved");
    } catch (error) {
      toast.error("Failed to save notes/code");
    } finally {
      setSaving(false);
    }
  };

  const submitSolve = async (payload) => {
    try {
      const { data } = await api.post(`/user-problems/${id}/solve`, payload);
      toast.success(data.message || "Solve saved");
      setSolveModal(false);
      fetchProblem();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark solved");
    }
  };

  if (loading) {
    return <div className="card h-40 animate-pulse bg-slate-900" />;
  }

  if (!problem) return <p className="text-slate-400">Problem not found.</p>;

  return (
    <div className="space-y-4">
      <div className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{problem.title}</h1>
            <p className="text-sm text-slate-400 mt-1">
              {problem.topic} | {problem.pattern} | {problem.difficulty}
            </p>
          </div>
          <div className="flex gap-2">
            <a href={problem.leetcodeLink} target="_blank" rel="noreferrer" className="btn-secondary">
              Open LeetCode
            </a>
            <button className="btn-primary" type="button" onClick={() => setSolveModal(true)}>
              Mark Solved
            </button>
          </div>
        </div>
      </div>

      <Timer seconds={seconds} />
      <button className="btn-muted" type="button" onClick={toggleTimer}>
        {timerRef.current ? "Stop Timer" : "Start Timer"}
      </button>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="font-semibold mb-2">Personal Notes (Markdown)</h3>
          <textarea
            className="input min-h-48"
            value={editor.notes}
            onChange={(e) => setEditor((p) => ({ ...p, notes: e.target.value }))}
            placeholder="Write your notes, tricks, and mistakes..."
          />
        </div>

        <div className="card p-4">
          <h3 className="font-semibold mb-2">Markdown Preview</h3>
          <article className="prose prose-invert max-w-none text-slate-200">
            <ReactMarkdown>{editor.notes || "No notes yet."}</ReactMarkdown>
          </article>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold mb-2">Code Editor (Stored)</h3>
        <textarea
          className="input min-h-56 font-mono text-sm"
          value={editor.code}
          onChange={(e) => setEditor((p) => ({ ...p, code: e.target.value }))}
          placeholder="Paste your accepted solution here..."
        />
        <div className="mt-3 flex justify-end">
          <button className="btn-primary" type="button" onClick={saveContent} disabled={saving}>
            {saving ? "Saving..." : "Save Notes & Code"}
          </button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold mb-3">Solve History Timeline</h3>
        <div className="space-y-2">
          {(progress?.solveHistory || []).map((attempt) => (
            <div key={`${attempt.attemptNumber}-${attempt.date}`} className="rounded-lg p-3 bg-slate-900 text-sm">
              <p>
                Solved on {formatDate(attempt.date)} | Attempt #{attempt.attemptNumber} | Self rating: {attempt.selfRating || "-"}
              </p>
              <p className="text-slate-400 text-xs mt-1">
                Time taken: {attempt.timeTaken || "-"} min | Notes: {attempt.notes || "-"}
              </p>
            </div>
          ))}
          {(!progress?.solveHistory || progress.solveHistory.length === 0) && (
            <p className="text-sm text-slate-400">No attempts yet.</p>
          )}
          {progress?.nextSolveDate && (
            <p className="text-sm text-cyan pt-2">Next due: {formatDate(progress.nextSolveDate)}</p>
          )}
        </div>
      </div>

      <SolveModal open={solveModal} onClose={() => setSolveModal(false)} onSubmit={submitSolve} loading={false} />
    </div>
  );
};

export default ProblemDetail;
