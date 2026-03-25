import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import api from "../utils/api";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const { data } = await api.post("/auth/login", form);
      login(data);
      toast.success("Logged in successfully");
      navigate(location.state?.from || "/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <button
        type="button"
        className="btn-muted fixed top-4 right-4 z-10 text-xs px-3 py-2"
        onClick={toggleTheme}
      >
        {isDark ? "Light" : "Dark"}
      </button>

      <form className="card w-full max-w-md p-6 space-y-4" onSubmit={onSubmit}>
        <h1 className="text-2xl font-bold">Sign In</h1>
        <p className="text-sm text-slate-400">Continue your DSA preparation.</p>

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

        <button className="btn-primary w-full" disabled={loading} type="submit">
          {loading ? "Signing in..." : "Login"}
        </button>

        <p className="text-sm text-slate-400 text-center">
          New user? <Link to="/register">Create account</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
