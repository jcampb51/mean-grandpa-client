import { useState, useEffect, useRef } from "react";
import { Input, Select } from "../components/form-elements";
import { getCategories, getExercisesByCategory, createWorkout } from "../data/workouts";
import Navbar from "@/components/Navbar";

export default function Workshop() {
  // State management for form inputs and selections
  const [targetDate, setTargetDate] = useState("");
  const [workoutCategory, setWorkoutCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);

  const categoryRef = useRef();
  const exerciseRef = useRef();

  // Fetch the categories on load
  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  // Fetch exercises when a category is selected
  useEffect(() => {
    if (workoutCategory) {
      getExercisesByCategory(workoutCategory).then(setExercises);
    }
  }, [workoutCategory]);

  // Add selected exercise to the current workout
  const handleAddExercise = () => {
    const selectedExerciseId = parseInt(exerciseRef.current.value);
    const selectedExercise = exercises.find(ex => ex.id === selectedExerciseId);

    if (selectedExercise && !selectedExercises.includes(selectedExercise)) {
      setSelectedExercises([...selectedExercises, selectedExercise]);
    }
  };

  // Handle form submission and send workout to the API
  const handleSubmitWorkout = async () => {
    if (!targetDate || !workoutCategory || selectedExercises.length === 0) {
      alert("Please complete all fields before saving the workout.");
      return;
    }

    const payload = {
      target_date: targetDate,
      category: workoutCategory,
      exercises: selectedExercises.map(ex => ex.id),
    };

    try {
      await createWorkout(payload);  // API call to create the workout
      alert("Workout created successfully!");
      resetForm(); // Clear form after successful submission
    } catch (error) {
      console.error("Failed to create workout:", error);
      alert("Failed to create workout.");
    }
  };

  // Reset form to allow for new workout creation
  const resetForm = () => {
    setTargetDate("");
    setWorkoutCategory(null);
    setSelectedExercises([]);
    setExercises([]);
    categoryRef.current.value = "0"; // Reset category dropdown
  };

  return (
    <>
    <Navbar />
    <div className="workshop-container">
      {/* Left side: Workout Builder Form */}
      <div className="workout-form card">
        <h1>Workout Builder</h1>
        
        {/* Date Picker */}
        <Input
          id="target-date"
          type="date"
          label="Target Date"
          value={targetDate}
          onChangeEvent={(e) => setTargetDate(e.target.value)}
        />

        {/* Category Dropdown */}
        <Select
          id="workout-category"
          refEl={categoryRef}
          options={categories.map((category) => ({
            id: category.id,
            name: category.label, // Display the category label correctly
          }))}
          title="Select Category"
          label="Workout Category"
          onChangeEvent={(e) => setWorkoutCategory(parseInt(e.target.value))}
        />

        {/* Add Exercise Button */}
        {workoutCategory && (
          <>
            <Select
              id="exercise"
              refEl={exerciseRef}
              options={exercises}
              title="Select Exercise"
              label="Exercise"
            />
            <button onClick={handleAddExercise} className="button is-link">
              Add Exercise
            </button>
          </>
        )}
      </div>

      {/* Right side: Current Workout Card */}
      <div className="current-workout card">
        <h2>Current Workout</h2>
        <p><strong>Target Date:</strong> {targetDate || "Not selected"}</p>
        <p><strong>Category:</strong> {workoutCategory ? categories.find(cat => cat.id === workoutCategory)?.label : "Not selected"}</p>

        <ul>
          {selectedExercises.length === 0 ? (
            <li>No exercises added yet.</li>
          ) : (
            selectedExercises.map((exercise) => (
              <li key={exercise.id}>
                <strong>{exercise.name}</strong>: {exercise.description}
              </li>
            ))
          )}
        </ul>

        {selectedExercises.length > 0 && (
          <button onClick={handleSubmitWorkout} className="button is-success mt-4">
            Save Workout
          </button>
        )}
      </div>
    </div></>
  );
}
