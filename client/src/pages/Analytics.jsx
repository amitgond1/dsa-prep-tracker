import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { toast } from "react-toastify";
import api from "../utils/api";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/user-problems/analytics");
        setData(data);
      } catch (error) {
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="card h-56 bg-slate-900 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data) return <p className="text-slate-400">No analytics available.</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <p className="text-sm text-slate-400">Best Streak Ever</p>
          <p className="text-2xl font-semibold">{data.bestStreak}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-400">Current Streak</p>
          <p className="text-2xl font-semibold">{data.currentStreak}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-400">Solved This Week</p>
          <p className="text-2xl font-semibold">{data.solvedThisWeek}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="font-semibold mb-2">Total Solved Per Month</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.monthlySolved}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="solved" fill="#7c3aed" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-4">
          <h3 className="font-semibold mb-2">Solve Speed Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data.speedSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <Tooltip />
              <Line dataKey="timeTaken" stroke="#06b6d4" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="font-semibold mb-2">Difficulty Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={data.difficultyDistribution} dataKey="value" nameKey="name" outerRadius={90} fill="#06b6d4" label />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-4">
          <h3 className="font-semibold mb-2">Problems Solved by Company Tags</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.solvedByCompany.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="font-semibold mb-2">Most Solved Topics</h3>
          <div className="space-y-2 text-sm">
            {data.mostSolvedTopics.map((row) => (
              <div key={row.topic} className="flex justify-between bg-slate-900 p-2 rounded">
                <span>{row.topic}</span>
                <span>{row.solved}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-4">
          <h3 className="font-semibold mb-2">Weakest Topics</h3>
          <div className="space-y-2 text-sm">
            {data.weakestTopics.map((row) => (
              <div key={row.topic} className="flex justify-between bg-slate-900 p-2 rounded">
                <span>{row.topic}</span>
                <span>{row.mastery}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
