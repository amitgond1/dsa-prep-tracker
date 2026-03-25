import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    targetCompany: user?.targetCompany || "",
    targetDate: user?.targetDate ? String(user.targetDate).slice(0, 10) : "",
    level: user?.level || "Beginner",
    dailyGoal: user?.dailyGoal || 2,
    isPublic: user?.isPublic ?? true
  });

  useEffect(() => {
    setForm({
      name: user?.name || "",
      targetCompany: user?.targetCompany || "",
      targetDate: user?.targetDate ? String(user.targetDate).slice(0, 10) : "",
      level: user?.level || "Beginner",
      dailyGoal: user?.dailyGoal || 2,
      isPublic: user?.isPublic ?? true
    });
  }, [user]);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const { data } = await api.put("/auth/me", form);
      updateUser(data.user);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Profile Settings</h1>

      <form className="card p-5 space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="text-sm">Name</label>
          <input className="input mt-1" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
        </div>

        <div>
          <label className="text-sm">Target Company</label>
          <input className="input mt-1" value={form.targetCompany} onChange={(e) => setForm((p) => ({ ...p, targetCompany: e.target.value }))} />
        </div>

        <div>
          <label className="text-sm">Target Date</label>
          <input
            className="input mt-1"
            type="date"
            value={form.targetDate}
            onChange={(e) => setForm((p) => ({ ...p, targetDate: e.target.value }))}
          />
        </div>

        <div>
          <label className="text-sm">Level</label>
          <select className="input mt-1" value={form.level} onChange={(e) => setForm((p) => ({ ...p, level: e.target.value }))}>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>

        <div>
          <label className="text-sm">Daily Goal</label>
          <input
            className="input mt-1"
            type="number"
            min="1"
            max="20"
            value={form.dailyGoal}
            onChange={(e) => setForm((p) => ({ ...p, dailyGoal: Number(e.target.value) }))}
          />
        </div>

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isPublic}
            onChange={(e) => setForm((p) => ({ ...p, isPublic: e.target.checked }))}
          />
          <span className="text-sm">Show profile on public leaderboard</span>
        </label>

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
