import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import RevisionCard from "../components/RevisionCard";
import SolveModal from "../components/SolveModal";
import api from "../utils/api";

const Revision = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ sections: { overdue: [], dueToday: [], upcoming: [] }, reminders: [] });
  const [selectedProblem, setSelectedProblem] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const { data: response } = await api.get("/user-problems/revision");
      setData(response);
    } catch (error) {
      toast.error("Failed to load revision queue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onBookmark = async (problem) => {
    try {
      await api.patch(`/user-problems/${problem._id}/bookmark`);
      load();
    } catch (error) {
      toast.error("Could not update bookmark");
    }
  };

  const onSolveNow = (problem) => {
    window.open(problem.leetcodeLink, "_blank", "noopener,noreferrer");
    setSelectedProblem(problem);
  };

  const submitSolve = async (payload) => {
    if (!selectedProblem) return;
    try {
      const { data: response } = await api.post(`/user-problems/${selectedProblem._id}/solve`, payload);
      toast.success(response.message || "Solve saved");
      setSelectedProblem(null);
      load();
    } catch (error) {
      toast.error("Failed to save solve");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="card h-40 animate-pulse bg-slate-900" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Revision Queue</h1>

      <div className="card p-4">
        <h3 className="font-semibold mb-2">Reminders</h3>
        <ul className="space-y-1 text-sm text-slate-300">
          {data.reminders.map((reminder) => (
            <li key={reminder}>- {reminder}</li>
          ))}
          {!data.reminders.length && <li>No reminders today.</li>}
        </ul>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <RevisionCard
          title="OVERDUE"
          badgeClass="bg-red-900 text-red-300"
          problems={data.sections.overdue}
          onOpenSolve={setSelectedProblem}
          onBookmark={onBookmark}
          onSolveNow={onSolveNow}
        />
        <RevisionCard
          title="DUE TODAY"
          badgeClass="bg-amber-900 text-amber-300"
          problems={data.sections.dueToday}
          onOpenSolve={setSelectedProblem}
          onBookmark={onBookmark}
          onSolveNow={onSolveNow}
        />
        <RevisionCard
          title="UPCOMING"
          badgeClass="bg-emerald-900 text-emerald-300"
          problems={data.sections.upcoming}
          onOpenSolve={setSelectedProblem}
          onBookmark={onBookmark}
          onSolveNow={onSolveNow}
        />
      </div>

      <SolveModal
        open={Boolean(selectedProblem)}
        onClose={() => setSelectedProblem(null)}
        onSubmit={submitSolve}
        loading={false}
      />
    </div>
  );
};

export default Revision;
