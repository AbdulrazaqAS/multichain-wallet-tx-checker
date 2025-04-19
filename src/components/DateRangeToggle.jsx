import { useState, useEffect } from "react";

export default function DateRangeToggle({ onChange }) {
  const [enabled, setEnabled] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleToggle = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    if (!newEnabled) {
      setStartDate("");
      setEndDate("");
      onChange(null); // clear dates
    }
  };

  const handleDateChange = (type, value) => {
    const updated = type === "start" ? [value, endDate] : [startDate, value];
    setStartDate(updated[0]);
    setEndDate(updated[1]);
    onChange({ start: updated[0], end: updated[1] });
  };

  useEffect(() => {
    if (!enabled) return;
    
    const end = new Date(Date.now()).toISOString().split("T")[0];
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    const start = new Date(Date.now() - oneWeek).toISOString().split("T")[0];
    setStartDate(start);
    setEndDate(end);
    onChange({ start, end });
  }, [enabled]);

  return (
    <div className="my-4">
      <label className="inline-flex items-center gap-2 mb-2">
        <input
          type="checkbox"
          checked={enabled}
          onChange={handleToggle}
          className="form-checkbox"
        />
        <span>Use Date Range</span>
      </label>

      {enabled && (
        <div className="mt-2 flex gap-4">
          <div>
            <label className="block text-sm">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleDateChange("start", e.target.value)}
              className="border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="block text-sm">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => handleDateChange("end", e.target.value)}
              className="border px-2 py-1 rounded"
            />
          </div>
        </div>
      )}
      {!enabled && <p className="text-orange-500">If fetching txs, please add date range to avoid reaching max API capacity</p>}
    </div>
  );
}
