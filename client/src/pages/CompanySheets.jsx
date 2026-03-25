import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import ProblemTable from "../components/ProblemTable";
import SolveModal from "../components/SolveModal";
import api from "../utils/api";

const CompanySheets = () => {
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [sheetLoading, setSheetLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [faangCompanies, setFaangCompanies] = useState([]);

  const [mode, setMode] = useState("faang");
  const [selectedCompany, setSelectedCompany] = useState("Google");
  const [importantOnly, setImportantOnly] = useState(true);
  const [limit, setLimit] = useState(100);

  const [sheetTitle, setSheetTitle] = useState("FAANG Top Sheet");
  const [problems, setProblems] = useState([]);

  const [selectedProblem, setSelectedProblem] = useState(null);
  const [savingSolve, setSavingSolve] = useState(false);

  const topCompanies = useMemo(() => companies.slice(0, 18), [companies]);

  const loadCatalog = async () => {
    try {
      setCatalogLoading(true);
      const { data } = await api.get("/problems/companies");
      setCompanies(data.companies || []);
      setFaangCompanies(data.faangCompanies || []);

      if (!selectedCompany && data.companies?.length) {
        setSelectedCompany(data.companies[0].name);
      }
    } catch (error) {
      toast.error("Failed to load company catalog");
    } finally {
      setCatalogLoading(false);
    }
  };

  const loadSheet = async () => {
    try {
      setSheetLoading(true);

      if (mode === "faang") {
        const { data } = await api.get("/problems/faang-top", { params: { limit } });
        setSheetTitle(`FAANG Top ${limit} Important Questions`);
        setProblems(data.problems || []);
        return;
      }

      const { data } = await api.get(`/problems/company/${encodeURIComponent(selectedCompany)}`, {
        params: {
          importantOnly,
          limit
        }
      });

      setSheetTitle(`${data.company} ${importantOnly ? "Important" : "All"} Questions`);
      setProblems(data.problems || []);
    } catch (error) {
      toast.error("Failed to load company sheet");
    } finally {
      setSheetLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  useEffect(() => {
    if (mode === "company" && !selectedCompany) return;
    loadSheet();
  }, [mode, selectedCompany, importantOnly, limit]);

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
      toast.success(data.message || "Solve saved");
      setSelectedProblem(null);
      loadSheet();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save solve");
    } finally {
      setSavingSolve(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold leading-tight">Company Wise Sheets</h1>
        <p className="text-slate-400 text-sm sm:text-base mt-1">
          FAANG + all company-wise important LeetCode sheets (Google-sheet style top questions).
        </p>
      </div>

      <section className="card p-3 sm:p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            className={`btn w-full ${mode === "faang" ? "btn-primary" : "btn-muted"}`}
            onClick={() => setMode("faang")}
          >
            FAANG Top Sheet
          </button>
          <button
            type="button"
            className={`btn w-full ${mode === "company" ? "btn-primary" : "btn-muted"}`}
            onClick={() => setMode("company")}
          >
            Company Wise Sheet
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="text-sm">Sheet Size</label>
            <select className="input mt-1" value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
              <option value={50}>Top 50</option>
              <option value={75}>Top 75</option>
              <option value={100}>Top 100</option>
              <option value={150}>Top 150</option>
            </select>
          </div>

          {mode === "company" && (
            <>
              <div>
                <label className="text-sm">Company</label>
                <select
                  className="input mt-1"
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                >
                  {companies.map((company) => (
                    <option key={company.name} value={company.name}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 flex items-center md:items-end">
                <label className="flex items-start gap-2 text-sm leading-5">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={importantOnly}
                    onChange={(e) => setImportantOnly(e.target.checked)}
                  />
                  <span>Important only (Google-sheet style short list)</span>
                </label>
              </div>
            </>
          )}

          {mode === "faang" && (
            <div className="md:col-span-3 flex flex-wrap items-start gap-2 text-xs text-slate-400">
              {faangCompanies.map((company) => (
                <span key={company} className="badge bg-slate-800 text-cyan">
                  {company}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="card p-3 sm:p-4">
        <h3 className="font-semibold mb-3 text-lg">Popular Companies</h3>
        {catalogLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div key={idx} className="h-12 rounded bg-slate-900 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2">
            {topCompanies.map((company) => (
              <button
                key={company.name}
                type="button"
                onClick={() => {
                  setMode("company");
                  setSelectedCompany(company.name);
                }}
                className={`company-tile text-left rounded-lg p-2 border ${
                  selectedCompany === company.name && mode === "company"
                    ? "company-tile-active"
                    : "company-tile-default"
                }`}
              >
                <p className="text-sm font-medium">{company.name}</p>
                <p className="text-xs text-slate-400">
                  {company.importantCount} important | {company.total} total
                </p>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-xl font-semibold leading-tight">{sheetTitle}</h2>
          <span className="badge bg-slate-800 text-cyan w-fit">{problems.length} problems</span>
        </div>

        {sheetLoading ? (
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
      </section>

      <SolveModal
        open={Boolean(selectedProblem)}
        onClose={() => setSelectedProblem(null)}
        onSubmit={submitSolve}
        loading={savingSolve}
      />
    </div>
  );
};

export default CompanySheets;
