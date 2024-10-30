// pages/featured.js
import { useState, useEffect } from "react";
import { getFeaturedWorkouts, addWorkoutCopy } from "../data/workouts";
import Navbar from "@/components/Navbar";

export default function FeaturedWorkoutsPage() {
  const [workouts, setWorkouts] = useState([]);
  const [split, setSplit] = useState(true); // true for 5-day split, false for 3-day split
  const [current, setCurrent] = useState(true); // true for current, false for forthcoming

  // Fetch workouts based on current and split selectors
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await getFeaturedWorkouts({ split, current });
        setWorkouts(response); // Ensure workouts data is set correctly
      } catch (error) {
        console.error("Failed to load featured workouts:", error);
      }
    };
    fetchWorkouts();
  }, [split, current]);

  // Function to handle adding a workout copy for the user
  const handleAddWorkout = async (workoutId) => {
    try {
      await addWorkoutCopy(workoutId);
      alert("Workout added successfully!");
    } catch (error) {
      console.error("Failed to add workout:", error);
      alert("Could not add workout.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="featured-workouts-container">
        <div className="selectors">
          <label>
            Current/Forthcoming:
            <select value={current} onChange={(e) => setCurrent(e.target.value === "true")}>
              <option value="true">Current</option>
              <option value="false">Forthcoming</option>
            </select>
          </label>
          <label>
            Split Type:
            <select value={split} onChange={(e) => setSplit(e.target.value === "true")}>
              <option value="true">5-Day Split</option>
              <option value="false">3-Day Split</option>
            </select>
          </label>
        </div>

        <h1>{current ? "Current" : "Forthcoming"} {split ? "Five" : "Three"} Day Split Workouts</h1>

        <div className="workout-cards">
          {workouts.map((workout) => (
            <article key={workout.id} className="workout-card">
              <h2>{workout.target_date}</h2>
              <ul>
                {workout.exercises.map((exercise) => (
                  <li key={exercise.id}>{exercise.name}</li>
                ))}
              </ul>
              <button onClick={() => handleAddWorkout(workout.id)} className="button is-link">
                Add Workout
              </button>
            </article>
          ))}
        </div>
      </div>

      <style jsx>{`
        .featured-workouts-container {
          padding: 20px;
        }
        .selectors {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        .workout-cards {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }
        .workout-card {
          border: 1px solid #ddd;
          padding: 15px;
          width: 200px;
          background-color: #f9f9f9;
        }
      `}</style>
    </>
  );
}
