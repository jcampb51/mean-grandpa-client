// mean-grandpa/pages/workout/edit.js
import { useState, useEffect, useRef } from "react";
import { Input, Select } from "../../components/form-elements";
import { getCategories, getExercisesByCategory, getWorkoutDetails, updateWorkout } from "../../data/workouts";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/router";
import DeleteWorkoutButton from "@/components/DeleteWorkoutButton";

export default function WorkoutEdit() {
  const [targetDate, setTargetDate] = useState("");
  const [workoutCategory, setWorkoutCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [workoutId, setWorkoutId] = useState(null);

  const categoryRef = useRef();
  const exerciseRef = useRef();
  const router = useRouter();

  useEffect(() => {
    const { id } = router.query; // Get workout ID from the query parameter
    if (id) {
      setWorkoutId(id);
      loadWorkoutDetails(id); // Fetch the workout details
    }
  }, [router.query]);

  // Load workout details for editing
  const loadWorkoutDetails = async (id) => {
    try {
      const workout = await getWorkoutDetails(id);
      setTargetDate(workout.target_date);
      setWorkoutCategory(workout.categories[0]?.id || null);
      setSelectedExercises(workout.exercises);
    } catch (error) {
      console.error("Failed to load workout:", error);
      alert("Failed to load workout data.");
    }
  };

  // Fetch categories and exercises
  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (workoutCategory) {
      getExercisesByCategory(workoutCategory).then(setExercises);
    }
  }, [workoutCategory]);

  // Handle exercise addition
  const handleAddExercise = () => {
    const selectedExerciseId = parseInt(exerciseRef.current.value);
    const selectedExercise = exercises.find((ex) => ex.id === selectedExerciseId);

    if (selectedExercise && !selectedExercises.some((ex) => ex.id === selectedExerciseId)) {
      setSelectedExercises([...selectedExercises, selectedExercise]);
    }
  };

  // Handle exercise removal
  const handleRemoveExercise = (exerciseId) => {
    setSelectedExercises(selectedExercises.filter((exercise) => exercise.id !== exerciseId));
  };

  // Submit updates to the workout
  const handleSaveChanges = async () => {
    if (!targetDate || !workoutCategory || selectedExercises.length === 0) {
      alert("Please complete all fields before saving the changes.");
      return;
    }

    const payload = {
      target_date: targetDate,
      category: workoutCategory,
      exercises: selectedExercises.map((ex) => ex.id),
    };

    try {
      await updateWorkout(workoutId, payload); // Update workout in the database
      alert("Workout updated successfully!");
      router.push("/workout"); // Redirect to the main workout page after saving
    } catch (error) {
      console.error("Failed to update workout:", error);
      alert("Failed to update workout.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="workshop-container">
        {/* Left side: Workout Edit Form */}
        <div className="workout-form card">
          <h1>Edit Workout</h1>
          
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
              name: category.label,
            }))}
            title="Select Category"
            label="Workout Category"
            value={workoutCategory || ""}
            onChangeEvent={(e) => setWorkoutCategory(parseInt(e.target.value))}
          />

          {/* Add Exercise Section */}
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
                  <button
                    className="button is-small is-danger ml-2"
                    onClick={() => handleRemoveExercise(exercise.id)}
                  >
                    Remove
                  </button>
                </li>
              ))
            )}
          </ul>

          <button onClick={handleSaveChanges} className="button is-success mt-4">
            Save Changes
          </button>
          <DeleteWorkoutButton workoutId={workoutId} />
        </div>
      </div>
    </>
  );
}
