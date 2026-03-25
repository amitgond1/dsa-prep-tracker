import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import HeatMap from "../components/HeatMap";
import ProgressBar from "../components/ProgressBar";
import StreakBadge from "../components/StreakBadge";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { formatDate } from "../utils/dateUtils";

const StatCard = ({ title, value, sub }) => (
  <div className="card p-4">
    <p className="text-sm text-slate-400">{title}</p>
    <p className="text-2xl font-semibold mt-1">{value}</p>
    {sub ? <p className="text-xs text-slate-500 mt-2">{sub}</p> : null}
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [revision, setRevision] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [dashboardRes, revisionRes] = await Promise.all([
          api.get("/user-problems/dashboard"),
          api.get("/user-problems/revision")
        ]);
        setData(dashboardRes.data);
        setRevision(revisionRes.data);
      } catch (error) {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const pieData = useMemo(() => data?.difficultyDistribution || [], [data]);
  const colors = ["#10b981", "#f59e0b", "#f43f5e"];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="card p-4 h-24 animate-pulse bg-slate-900" />
        ))}
      </div>
    );
  }

  if (!data) {
    return <p className="text-slate-400">No dashboard data available.</p>;
  }

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard title="Total Solved" value={`${data.stats.totalSolved}/${data.stats.totalProblems}`} />
        <StatCard title="Solved Today" value={data.stats.solvedToday} />
        <StreakBadge streak={data.stats.currentStreak} bestStreak={user?.bestStreak || data.stats.currentStreak} />
        <StatCard title="Problems Due Today" value={data.stats.problemsDueToday} />
        <StatCard
          title="Overdue"
          value={revision?.sections?.overdue?.length || 0}
          sub={revision?.reminders?.[0] || "Keep consistency high"}
        />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="card p-4 xl:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Today's Revision Queue</h3>
            <Link to="/revision" className="text-sm text-cyan">
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {[...(revision?.sections?.overdue || []), ...(revision?.sections?.dueToday || [])].slice(0, 6).map((item) => (
              <div key={item._id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900">
                <p className="text-sm">{item.problem.title}</p>
                <p className="text-xs text-slate-400">Last solved: {formatDate(item.lastSolvedDate)}</p>
              </div>
            ))}
            {!revision?.sections?.overdue?.length && !revision?.sections?.dueToday?.length && (
              <p className="text-sm text-slate-400">Nothing due today. Great pacing.</p>
            )}
          </div>
        </div>

        <div className="card p-4">
          <h3 className="font-semibold mb-3">Recently Solved</h3>
          <div className="space-y-2">
            {data.recentSolved.map((item) => (
              <div key={item._id} className="p-2 rounded-lg bg-slate-900">
                <p className="text-sm">{item.problemId?.title}</p>
                <p className="text-xs text-slate-400 mt-1">{formatDate(item.lastSolvedDate)}</p>
              </div>
            ))}
            {!data.recentSolved.length && <p className="text-sm text-slate-400">Start solving to populate this.</p>}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <HeatMap data={data.heatmap} />

        <div className="card p-4">
          <h3 className="font-semibold mb-3">Difficulty Distribution</h3>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="_id" cx="50%" cy="50%" outerRadius={80} label>
                {pieData.map((entry, index) => (
                  <Cell key={entry._id} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-4">
          <h3 className="font-semibold mb-3">Weekly Solve Count</h3>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={data.weeklySolveTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="week" tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#06b6d4" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="font-semibold mb-3">Topic-wise Progress</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.topicProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="topic" tick={{ fill: "#94a3b8", fontSize: 10 }} interval={0} angle={-25} textAnchor="end" height={80} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="solved" fill="#7c3aed" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-4">
          <h3 className="font-semibold mb-3">Weakest Topics</h3>
          <div className="space-y-3">
            {data.weakestTopics.map((topic) => (
              <div key={topic.topic}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{topic.topic}</span>
                  <span>{topic.solvePercent}%</span>
                </div>
                <ProgressBar value={topic.solvePercent} />
              </div>
            ))}
            {!data.weakestTopics.length && <p className="text-sm text-slate-400">No topic data yet.</p>}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
