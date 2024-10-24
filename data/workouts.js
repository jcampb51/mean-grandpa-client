// data/workouts.js
import { fetchWithResponse } from './fetcher';

// Fetch the next workout for the user (soonest target_date, not completed)
export function getNextScheduledWorkout() {
  return fetchWithResponse('workouts/next', {
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`,
    },
  });
}

// Fetch logs for the next scheduled workout
export function getWorkoutLogs(workoutId) {
  return fetchWithResponse(`workouts/${workoutId}/logs`, {
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`,
    },
  });
}

export async function getExerciseCategories() {
  const categories = await fetchWithResponse("exercise-categories", {
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  });
  return categories;
}

export async function getExercisesByCategory(categoryId) {
  const exerciseCategories = await fetchWithResponse(`exercise-categories?category=${categoryId}`, {
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  });
  return exerciseCategories.map(exerciseCategory => exerciseCategory.exercise);
}

export async function createWorkout(payload) {
  return fetchWithResponse("workouts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(payload),
  });
}
