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

// Fetch categories
export async function getCategories() {
  const categories = await fetchWithResponse("categories", {
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  });
  return categories;
}

// Fetch exercises by category id
export async function getExercisesByCategory(categoryId) {
  const exercises = await fetchWithResponse(`exercises?category=${categoryId}`, {
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  });
  return exercises;
}

// Create a new workout
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
