import { useState, useEffect, useRef } from "react";
import { Input, Select } from "../components/form-elements";
import { getExerciseCategories, getExercisesByCategory, createWorkout } from "../data/workouts";
import Navbar from "@/components/Navbar";

export default function Workshop() {
  const [targetDate, setTargetDate] = useState("");
  const [workoutCategory, setWorkoutCategory] = useState(null);
  const [exerciseCategories, setExerciseCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [showAddExercise, setShowAddExercise] = useState(false);

  const categoryRef = useRef();
  const exerciseRef = useRef();

  // Fetch exercise categories on load
  useEffect(() => {
    getExerciseCategories().then(setExerciseCategories);
  }, []);

  // Fetch exercises when a category is selected
  useEffect(() => {
    if (currentCategory) {
      getExercisesByCategory(currentCategory).then(setExercises);
    }
  }, [currentCategory]);

  const handleAddExercise = () => {
    const selectedExerciseId = parseInt(exerciseRef.current.value);
    const selectedExercise = exercises.find(ex => ex.id === selectedExerciseId);
    
    if (selectedExercise && !selectedExercises.includes(selectedExercise)) {
      setSelectedExercises([...selectedExercises, selectedExercise]);
    }
  };

  const handleSubmitWorkout = async () => {
    const payload = {
      target_date: targetDate,
      category: workoutCategory,  // category id for WorkoutCategory
      exercises: selectedExercises.map(ex => ex.id),  // exercise ids for the Workout
    };
  
    try {
      await createWorkout(payload);  // This API will handle creating both the workout and workout_category
      alert("Workout created successfully!");
      // Reset form or redirect as needed
    } catch (error) {
      console.error("Failed to create workout:", error);
      alert("Failed to create workout.");
    }
  };

  return (
    <><Navbar />
    <div className="workshop-container">
      <h1>Workout Builder</h1>

      {/* Select target date */}
      <Input
        id="target-date"
        type="date"
        label="Target Date"
        onChangeEvent={(e) => {
          setTargetDate(e.target.value);
          setShowAddExercise(true);
        }}
      />

      {/* Add Exercise Button */}
      {showAddExercise && (
        <>
          <button onClick={() => setShowAddExercise(true)} className="button is-primary">Add Exercise</button>

          {/* Category Dropdown */}
          <Select
            id="category"
            refEl={categoryRef}
            options={exerciseCategories}
            title="Select Category"
            label="Exercise Category"
            onChangeEvent={(e) => setCurrentCategory(parseInt(e.target.value))}
          />

          {/* Exercise Dropdown */}
          {currentCategory && (
            <Select
              id="exercise"
              refEl={exerciseRef}
              options={exercises}
              title="Select Exercise"
              label="Exercise"
            />
          )}

          <button onClick={handleAddExercise} className="button is-link">
            Add to Workout
          </button>
        </>
      )}

      {/* Current Workout */}
      {selectedExercises.length > 0 && (
        <div className="current-workout">
          <h2>Current Workout</h2>
          <p>Target Date: {targetDate}</p>

          <ul>
            {selectedExercises.map((exercise) => (
              <li key={exercise.id}>
                <strong>{exercise.name}</strong>: {exercise.description}
              </li>
            ))}
          </ul>

          {/* Select Category for Workout */}
          <Select
            id="workout-category"
            refEl={categoryRef}
            options={exerciseCategories}
            title="Select Workout Category"
            label="Workout Category"
            onChangeEvent={(e) => setWorkoutCategory(parseInt(e.target.value))}
          />

          <button onClick={handleSubmitWorkout} className="button is-success">
            Save Workout
          </button>
        </div>
      )}
    </div></>
  );
}
