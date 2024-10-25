// components/EditWorkoutButton.js
import { useRouter } from 'next/router';

export default function EditWorkoutButton({ workoutId }) {
  const router = useRouter();

  const handleEditClick = () => {
    router.push(`/workout/edit?id=${workoutId}`);
  };

  return (
    <button onClick={handleEditClick} className="button is-primary">
      Edit Workout
    </button>
  );
}
