import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import api from "../utils/api";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    targetCompany: "",
    targetDate: "",
    level: "Beginner"
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const { data } = await api.post("/auth/register", form);
      login(data);
      toast.success("Account created");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <button
        type="button"
        className="btn-muted fixed top-4 right-4 z-10 text-xs px-3 py-2"
        onClick={toggleTheme}
      >
        {isDark ? "Light" : "Dark"}
      </button>

      <form className="card w-full max-w-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={onSubmit}>
        <h1 className="text-2xl font-bold md:col-span-2">Create Account</h1>

        <div>
          <label className="text-sm">Name</label>
          <input className="input mt-1" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
        </div>

        <div>
          <label className="text-sm">Email</label>
          <input
            className="input mt-1"
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            required
          />
        </div>

        <div>
          <label className="text-sm">Password</label>
          <input
            className="input mt-1"
            type="password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            required
          />
        </div>

        <div>
          <label className="text-sm">Target Company</label>
          <input
            className="input mt-1"
            value={form.targetCompany}
            onChange={(e) => setForm((p) => ({ ...p, targetCompany: e.target.value }))}
          />
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

        <button className="btn-primary md:col-span-2" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="md:col-span-2 text-sm text-slate-400 text-center">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
