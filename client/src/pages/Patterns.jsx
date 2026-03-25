import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PatternCard from "../components/PatternCard";
import api from "../utils/api";

const Patterns = () => {
  const [patterns, setPatterns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/patterns");
        setPatterns(data.patterns || []);
      } catch (error) {
        toast.error("Failed to load patterns");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">DSA Pattern Notes Library</h1>
      <p className="text-sm text-slate-400">20 core patterns with detection clues, templates, and linked practice.</p>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, idx) => (
            <div key={idx} className="card h-28 animate-pulse bg-slate-900" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {patterns.map((pattern) => (
            <PatternCard key={pattern._id} pattern={pattern} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Patterns;
