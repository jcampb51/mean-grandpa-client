// components/DeleteWorkoutButton.js
import { useRouter } from 'next/router';
import { deleteWorkout } from '../data/workouts';

export default function DeleteWorkoutButton({ workoutId }) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this workout?');
    if (!confirmed) return;

    try {
      await deleteWorkout(workoutId);
      alert('Workout deleted successfully!');
      router.push('/'); // Redirect after deletion
    } catch (error) {
      console.error('Failed to delete workout:', error);
      alert('Failed to delete workout.');
    }
  };

  return (
    <button onClick={handleDelete} className="button is-danger">
      Delete Workout
    </button>
  );
}
