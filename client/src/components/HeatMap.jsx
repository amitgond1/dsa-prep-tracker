const intensityClass = (count) => {
  if (count === 0) return "bg-slate-800";
  if (count <= 1) return "bg-violet-900";
  if (count <= 3) return "bg-violet-700";
  if (count <= 5) return "bg-cyan";
  return "bg-cyan-300";
};

const HeatMap = ({ data }) => {
  return (
    <div className="card p-4">
      <h3 className="font-semibold mb-3">Activity Heatmap (6 months)</h3>
      <div className="grid grid-cols-14 gap-1">
        {(data || []).map((cell) => (
          <div
            key={cell.date}
            className={`h-3 w-3 rounded-sm ${intensityClass(cell.count)}`}
            title={`${cell.date}: ${cell.count} solves`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeatMap;
