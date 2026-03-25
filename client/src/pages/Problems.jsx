import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import FilterBar from "../components/FilterBar";
import ProblemTable from "../components/ProblemTable";
import SolveModal from "../components/SolveModal";
import api from "../utils/api";

const Problems = () => {
  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    topic: "",
    difficulty: "",
    status: "All",
    pattern: "",
    company: "",
    sortBy: "number"
  });

  const [selectedProblem, setSelectedProblem] = useState(null);
  const [savingSolve, setSavingSolve] = useState(false);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const params = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value && !(key === "status" && value === "All")) {
          params[key] = value;
        }
      });

      const { data } = await api.get("/problems", { params });
      setProblems(data.problems || []);
    } catch (error) {
      toast.error("Failed to load problems");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyOptions = async () => {
    try {
      const { data } = await api.get("/problems/companies");
      setCompanyOptions((data.companies || []).map((item) => item.name));
    } catch (error) {
      setCompanyOptions([]);
    }
  };

  useEffect(() => {
    fetchCompanyOptions();
  }, []);

  useEffect(() => {
    fetchProblems();
  }, [filters.search, filters.topic, filters.difficulty, filters.status, filters.pattern, filters.company, filters.sortBy]);

  const options = useMemo(() => {
    const topics = [...new Set(problems.map((item) => item.topic))].sort();
    const patterns = [...new Set(problems.map((item) => item.pattern))].sort();
    return { topics, patterns, companies: companyOptions };
  }, [problems, companyOptions]);

  const onBookmark = async (problem) => {
    try {
      await api.patch(`/user-problems/${problem._id}/bookmark`);
      setProblems((prev) =>
        prev.map((item) =>
          item._id === problem._id ? { ...item, isBookmarked: !item.isBookmarked } : item
        )
      );
    } catch (error) {
      toast.error("Could not update bookmark");
    }
  };

  const submitSolve = async (payload) => {
    if (!selectedProblem) return;
    try {
      setSavingSolve(true);
      const { data } = await api.post(`/user-problems/${selectedProblem._id}/solve`, payload);
      toast.success(data.message || "Solved updated");
      setSelectedProblem(null);
      fetchProblems();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save solve");
    } finally {
      setSavingSolve(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Problems</h1>
        <p className="text-slate-400 text-sm mt-1">
          Track all 150 pre-seeded problems with topic, difficulty, pattern, and company filters.
        </p>
      </div>

      <FilterBar filters={filters} options={options} onChange={(name, value) => setFilters((p) => ({ ...p, [name]: value }))} />

      {loading ? (
        <div className="card p-4 space-y-2">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="h-10 bg-slate-900 rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <ProblemTable
          problems={problems}
          onOpenSolve={(problem) => setSelectedProblem(problem)}
          onBookmark={onBookmark}
        />
      )}

      <SolveModal
        open={Boolean(selectedProblem)}
        onClose={() => setSelectedProblem(null)}
        onSubmit={submitSolve}
        loading={savingSolve}
      />
    </div>
  );
};

export default Problems;
