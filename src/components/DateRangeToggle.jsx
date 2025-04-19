import { useState } from "react";

export default function DateRangeToggle({ onChange }) {
  const [enabled, setEnabled] = useState(false);
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
    </div>
  );
}
