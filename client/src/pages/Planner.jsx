import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";

const weekDays = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" }
];

const Planner = () => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [suggestion, setSuggestion] = useState("");
  const [problems, setProblems] = useState([]);
  const [draft, setDraft] = useState({ day: "mon", problemId: "", title: "", topic: "" });

  const grouped = useMemo(() => {
    const map = {};
    weekDays.forEach((day) => {
      map[day.key] = tasks.filter((task) => task.day === day.key);
    });
    return map;
  }, [tasks]);

  const load = async () => {
    try {
      setLoading(true);
      const [plannerRes, problemRes] = await Promise.all([api.get("/planner"), api.get("/problems")]);
      setTasks(plannerRes.data.tasks || []);
      setSuggestion(plannerRes.data.suggestion || "");
      setProblems(problemRes.data.problems || []);
    } catch (error) {
      toast.error("Failed to load planner");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addTask = () => {
    if (!draft.title) return;
    setTasks((prev) => [...prev, { ...draft }]);
    setDraft({ day: "mon", problemId: "", title: "", topic: "" });
  };

  const removeTask = (index) => {
    setTasks((prev) => prev.filter((_, idx) => idx !== index));
  };

  const save = async () => {
    try {
      await api.put("/planner", { tasks });
      toast.success("Planner saved");
    } catch (error) {
      toast.error("Could not save planner");
    }
  };

  const onSelectProblem = (value) => {
    const selected = problems.find((problem) => problem._id === value);
    if (!selected) {
      setDraft((prev) => ({ ...prev, problemId: "", title: "", topic: "" }));
      return;
    }

    setDraft((prev) => ({
      ...prev,
      problemId: selected._id,
      title: selected.title,
      topic: selected.topic
    }));
  };

  if (loading) return <div className="card h-48 animate-pulse bg-slate-900" />;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Weekly Planner</h1>
      <p className="text-cyan text-sm">Auto-suggest: {suggestion}</p>

      <div className="card p-4 grid grid-cols-1 md:grid-cols-5 gap-3">
        <select className="input" value={draft.day} onChange={(e) => setDraft((p) => ({ ...p, day: e.target.value }))}>
          {weekDays.map((day) => (
            <option key={day.key} value={day.key}>
              {day.label}
            </option>
          ))}
        </select>

        <select className="input md:col-span-2" value={draft.problemId} onChange={(e) => onSelectProblem(e.target.value)}>
          <option value="">Select problem</option>
          {problems.map((problem) => (
            <option key={problem._id} value={problem._id}>
              {problem.number}. {problem.title}
            </option>
          ))}
        </select>

        <input className="input" placeholder="Title" value={draft.title} onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))} />
        <input className="input" placeholder="Topic" value={draft.topic} onChange={(e) => setDraft((p) => ({ ...p, topic: e.target.value }))} />

        <button type="button" className="btn-primary md:col-span-5" onClick={addTask}>
          Add To Planner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-3">
        {weekDays.map((day) => (
          <div key={day.key} className="card p-3">
            <h3 className="font-semibold mb-2">{day.label}</h3>
            <div className="space-y-2">
              {grouped[day.key].map((task) => {
                const index = tasks.indexOf(task);
                return (
                  <div key={`${task.day}-${task.title}-${index}`} className="bg-slate-900 rounded p-2 text-xs">
                    <p>{task.title}</p>
                    <p className="text-slate-400">{task.topic || "General"}</p>
                    <button className="text-rose-400 mt-1" type="button" onClick={() => removeTask(index)}>
                      Remove
                    </button>
                  </div>
                );
              })}
              {!grouped[day.key].length && <p className="text-xs text-slate-500">No tasks</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button className="btn-primary" type="button" onClick={save}>
          Save Planner
        </button>
      </div>
    </div>
  );
};

export default Planner;
