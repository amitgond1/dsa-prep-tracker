import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SolveModal from "../components/SolveModal";
import api from "../utils/api";
import { formatDate } from "../utils/dateUtils";

const Bookmarks = () => {
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState({ problems: [], customProblems: [] });
  const [customForm, setCustomForm] = useState({ title: "", link: "", difficulty: "Medium", topic: "", notes: "" });
  const [selected, setSelected] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/user-problems/bookmarks");
      setBookmarks(data);
    } catch (error) {
      toast.error("Failed to load bookmarks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createCustom = async (event) => {
    event.preventDefault();
    try {
      await api.post("/user-problems/custom", customForm);
      setCustomForm({ title: "", link: "", difficulty: "Medium", topic: "", notes: "" });
      toast.success("Custom problem added");
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not add custom problem");
    }
  };

  const solveCustom = async (payload) => {
    try {
      await api.post(`/user-problems/custom/${selected._id}/solve`, payload);
      toast.success("Custom problem solve saved");
      setSelected(null);
      load();
    } catch (error) {
      toast.error("Could not save solve");
    }
  };

  const deleteCustom = async (id) => {
    if (!window.confirm("Delete this custom problem?")) return;
    try {
      await api.delete(`/user-problems/custom/${id}`);
      load();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const toggleBookmark = async (problemId) => {
    try {
      await api.patch(`/user-problems/${problemId}/bookmark`);
      load();
    } catch (error) {
      toast.error("Bookmark update failed");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Bookmarked Problems</h1>

      <section className="card p-4">
        <h3 className="font-semibold mb-3">Add Custom Problem</h3>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={createCustom}>
          <input className="input" placeholder="Title" value={customForm.title} onChange={(e) => setCustomForm((p) => ({ ...p, title: e.target.value }))} required />
          <input className="input" placeholder="Link" value={customForm.link} onChange={(e) => setCustomForm((p) => ({ ...p, link: e.target.value }))} required />
          <select className="input" value={customForm.difficulty} onChange={(e) => setCustomForm((p) => ({ ...p, difficulty: e.target.value }))}>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
          <input className="input" placeholder="Topic" value={customForm.topic} onChange={(e) => setCustomForm((p) => ({ ...p, topic: e.target.value }))} required />
          <textarea className="input md:col-span-2" placeholder="Notes" value={customForm.notes} onChange={(e) => setCustomForm((p) => ({ ...p, notes: e.target.value }))} />
          <button className="btn-primary md:col-span-2" type="submit">
            Add Custom Problem
          </button>
        </form>
      </section>

      <section className="card p-4">
        <h3 className="font-semibold mb-3">Seeded Problem Bookmarks</h3>
        {loading ? (
          <div className="space-y-2">{Array.from({ length: 4 }).map((_, idx) => <div key={idx} className="h-14 bg-slate-900 animate-pulse rounded" />)}</div>
        ) : (
          <div className="space-y-2">
            {bookmarks.problems.map((row) => (
              <div key={row._id} className="rounded-lg bg-slate-900 p-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p>{row.problemId?.title}</p>
                  <p className="text-xs text-slate-400">Last solved: {formatDate(row.lastSolvedDate)} | Count: {row.solveCount || 0}</p>
                </div>
                <div className="flex gap-2">
                  <a className="btn-secondary text-sm" href={row.problemId?.leetcodeLink} target="_blank" rel="noreferrer">
                    Open
                  </a>
                  <button className="btn-primary text-sm" type="button" onClick={() => setSelected({ _id: row.problemId?._id, custom: false })}>
                    Mark Solved
                  </button>
                  <button className="btn-muted text-sm" type="button" onClick={() => toggleBookmark(row.problemId?._id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
            {!bookmarks.problems.length && <p className="text-sm text-slate-400">No seeded problem bookmarks yet.</p>}
          </div>
        )}
      </section>

      <section className="card p-4">
        <h3 className="font-semibold mb-3">Custom Bookmarks</h3>
        <div className="space-y-2">
          {bookmarks.customProblems.map((problem) => (
            <div key={problem._id} className="rounded-lg bg-slate-900 p-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p>{problem.title}</p>
                <p className="text-xs text-slate-400">{problem.topic} | {problem.difficulty}</p>
              </div>
              <div className="flex gap-2">
                <a className="btn-secondary text-sm" href={problem.link} target="_blank" rel="noreferrer">
                  Open
                </a>
                <button className="btn-primary text-sm" type="button" onClick={() => setSelected({ ...problem, custom: true })}>
                  Mark Solved
                </button>
                <button className="btn-muted text-sm" type="button" onClick={() => deleteCustom(problem._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
          {!bookmarks.customProblems.length && <p className="text-sm text-slate-400">No custom bookmarks yet.</p>}
        </div>
      </section>

      <SolveModal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        onSubmit={async (payload) => {
          if (!selected) return;
          if (selected.custom) {
            await solveCustom(payload);
          } else {
            await api.post(`/user-problems/${selected._id}/solve`, payload);
            toast.success("Solve saved");
            setSelected(null);
            load();
          }
        }}
        loading={false}
      />
    </div>
  );
};

export default Bookmarks;
