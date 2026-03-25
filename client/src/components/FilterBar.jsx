const FilterBar = ({ filters, options, onChange }) => {
  const companies = options.companies || [];

  return (
    <div className="card p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-3">
      <input
        className="input lg:col-span-2"
        placeholder="Search by title..."
        value={filters.search}
        onChange={(e) => onChange("search", e.target.value)}
      />

      <select className="input" value={filters.topic} onChange={(e) => onChange("topic", e.target.value)}>
        <option value="">All Topics</option>
        {options.topics.map((topic) => (
          <option key={topic} value={topic}>
            {topic}
          </option>
        ))}
      </select>

      <select className="input" value={filters.difficulty} onChange={(e) => onChange("difficulty", e.target.value)}>
        <option value="">All Difficulty</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      <select className="input" value={filters.status} onChange={(e) => onChange("status", e.target.value)}>
        <option>All</option>
        <option>Solved</option>
        <option>Unsolved</option>
        <option>Due Today</option>
        <option>Bookmarked</option>
      </select>

      <select className="input" value={filters.pattern} onChange={(e) => onChange("pattern", e.target.value)}>
        <option value="">All Patterns</option>
        {options.patterns.map((pattern) => (
          <option key={pattern} value={pattern}>
            {pattern}
          </option>
        ))}
      </select>

      <select className="input" value={filters.company} onChange={(e) => onChange("company", e.target.value)}>
        <option value="">All Companies</option>
        {companies.map((company) => (
          <option key={company} value={company}>
            {company}
          </option>
        ))}
      </select>

      <select className="input" value={filters.sortBy} onChange={(e) => onChange("sortBy", e.target.value)}>
        <option value="number">Sort: Number</option>
        <option value="difficulty">Sort: Difficulty</option>
        <option value="lastSolved">Sort: Last Solved</option>
        <option value="nextDue">Sort: Next Due</option>
        <option value="solveCount">Sort: Solve Count</option>
      </select>
    </div>
  );
};

export default FilterBar;
