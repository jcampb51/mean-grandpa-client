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

// Update a specific log
export async function updateLog({ logId, updatedLog }) {
  return fetchWithResponse(`logs/${logId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(updatedLog),
  });
}

// Mark workout as complete
export async function completeWorkout(workoutId) {
  return fetchWithResponse(`workouts/${workoutId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ completed: true }),
  });
}

// Get a list of incomplete workouts
export async function getIncompleteWorkouts() {
  return fetchWithResponse('workouts?completed=false', {
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`,
    },
  });
}

// Fetch details of a specific workout by ID
export function getWorkoutDetails(workoutId) {
  return fetchWithResponse(`workouts/${workoutId}`, {
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`,
    },
  });
}

// Update an existing workout by ID
export async function updateWorkout(workoutId, payload) {
  return fetchWithResponse(`workouts/${workoutId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(payload),
  });
}

// Delete a workout by ID
export async function deleteWorkout(workoutId) {
  return fetchWithResponse(`workouts/${workoutId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`,
    },
  });
}
