import { useState, useEffect, useRef } from "react";
import { Input, Select } from "../components/form-elements";
import {
  getCategories,
  getExercisesByCategory,
  createWorkout,
  createFeaturedWorkout
} from "../data/workouts";
import Navbar from "@/components/Navbar";
import FeaturedWorkoutForm from "../components/FeaturedWorkoutForm";
import { useUserQuery } from "../context/userQueries";

export default function Workshop() {
  const { isStaff } = useUserQuery();
  const [targetDate, setTargetDate] = useState("");
  const [workoutCategory, setWorkoutCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [featuredWorkoutData, setFeaturedWorkoutData] = useState(null);

  const categoryRef = useRef();
  const exerciseRef = useRef();

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (workoutCategory) {
      getExercisesByCategory(workoutCategory).then(setExercises);
    }
  }, [workoutCategory]);

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
      category: workoutCategory,
      exercises: selectedExercises.map(ex => ex.id),
      featured: isStaff && !!featuredWorkoutData
    };

    try {
      const newWorkout = await createWorkout(payload);

      if (isStaff && featuredWorkoutData) {
        const featuredData = {
          workout: newWorkout.id,
          weekday: featuredWorkoutData.weekday,
          split: featuredWorkoutData.split,
          current: featuredWorkoutData.current,
        };
        await createFeaturedWorkout(featuredData);
      }

      alert("Workout created successfully!");
      resetForm();
    } catch (error) {
      console.error("Failed to create workout:", error);
      alert("Failed to create workout.");
    }
  };

  const resetForm = () => {
    setTargetDate("");
    setWorkoutCategory(null);
    setSelectedExercises([]);
    setExercises([]);
    setFeaturedWorkoutData(null);
    if (categoryRef.current) categoryRef.current.value = "0";
  };

  return (
    <>
      <Navbar />
      <div className="workshop-container">
        <div className="workout-form card">
          <h1>Workout Builder</h1>

          <Input
            id="target-date"
            type="date"
            label="Target Date"
            value={targetDate}
            onChangeEvent={(e) => setTargetDate(e.target.value)}
          />

          <Select
            id="workout-category"
            refEl={categoryRef}
            options={categories.map((category) => ({
              id: category.id,
              name: category.label,
            }))}
            title="Select Category"
            label="Workout Category"
            onChangeEvent={(e) => setWorkoutCategory(parseInt(e.target.value))}
          />

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

          {isStaff && (
            <FeaturedWorkoutForm
              onDataChange={setFeaturedWorkoutData}
            />
          )}
        </div>

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
      </div>
    </>
  );
}
