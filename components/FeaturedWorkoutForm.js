// components/FeaturedWorkoutForm.js
import { useState } from "react";

export default function FeaturedWorkoutForm({ onDataChange }) {
  const [isFeatured, setIsFeatured] = useState(false);
  const [weekday, setWeekday] = useState("");
  const [split, setSplit] = useState(false);
  const [current, setCurrent] = useState(false);

  const handleIsFeaturedChange = (e) => {
    const featured = e.target.checked;
    setIsFeatured(featured);
    if (!featured) {
      // Reset featured data if unchecked
      setWeekday("");
      setSplit(false);
      setCurrent(false);
      onDataChange(null); // Clear featured workout data
    }
  };

  const handleDataChange = () => {
    onDataChange(isFeatured ? { weekday, split, current } : null);
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={isFeatured}
          onChange={handleIsFeaturedChange}
        />
        Feature this Workout?
      </label>

      {isFeatured && (
        <div className="featured-workout-form">
          <div>
            <label>Weekday:</label>
            <select
              value={weekday}
              onChange={(e) => {
                setWeekday(e.target.value);
                handleDataChange();
              }}
              required
            >
              <option value="">Select Weekday</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>

          <div>
            <label>Split:</label>
            <select
              value={split}
              onChange={(e) => {
                setSplit(e.target.value === "true");
                handleDataChange();
              }}
            >
              <option value="false">3-Day Split</option>
              <option value="true">5-Day Split</option>
            </select>
          </div>

          <div>
            <label>Current or Forthcoming:</label>
            <select
              value={current}
              onChange={(e) => {
                setCurrent(e.target.value === "true");
                handleDataChange();
              }}
            >
              <option value="false">Forthcoming</option>
              <option value="true">Current</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
