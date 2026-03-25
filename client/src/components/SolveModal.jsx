import { useState } from "react";

const SolveModal = ({ open, onClose, onSubmit, loading }) => {
  const [form, setForm] = useState({ timeTaken: "", selfRating: "Medium", notes: "" });

  if (!open) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      timeTaken: form.timeTaken ? Number(form.timeTaken) : undefined,
      selfRating: form.selfRating,
      notes: form.notes
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
      <form className="card w-full max-w-md p-5 space-y-4" onSubmit={handleSubmit}>
        <h3 className="text-lg font-semibold">Mark As Solved</h3>

        <div>
          <label className="text-sm text-slate-300">Time Taken (minutes)</label>
          <input
            type="number"
            className="input mt-1"
            min="1"
            max="600"
            value={form.timeTaken}
            onChange={(e) => setForm((p) => ({ ...p, timeTaken: e.target.value }))}
            placeholder="e.g. 35"
          />
        </div>

        <div>
          <label className="text-sm text-slate-300">Self Rating</label>
          <select
            className="input mt-1"
            value={form.selfRating}
            onChange={(e) => setForm((p) => ({ ...p, selfRating: e.target.value }))}
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-slate-300">Short Notes</label>
          <textarea
            className="input mt-1 min-h-24"
            value={form.notes}
            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            placeholder="What did you learn?"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" className="btn-muted" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save Solve"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SolveModal;
