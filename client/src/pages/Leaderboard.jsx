import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";

const Leaderboard = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/leaderboard");
        setRows(data.leaderboard || []);
        setMessage(data.message || "");
      } catch (error) {
        toast.error("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Leaderboard</h1>
      {message && <p className="text-cyan text-sm">{message}</p>}

      {loading ? (
        <div className="card h-56 animate-pulse bg-slate-900" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-800 text-slate-400">
              <tr>
                <th className="p-3 text-left">Rank</th>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Target</th>
                <th className="p-3 text-left">Total Solved</th>
                <th className="p-3 text-left">Current Streak</th>
                <th className="p-3 text-left">Solved This Week</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.userId} className="border-b border-slate-900">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{row.name}</td>
                  <td className="p-3">{row.targetCompany || "-"}</td>
                  <td className="p-3">{row.totalSolved}</td>
                  <td className="p-3">{row.currentStreak}</td>
                  <td className="p-3">{row.solvedThisWeek}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
