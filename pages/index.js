import { useQuery } from '@tanstack/react-query';
import { getNextScheduledWorkout, getWorkoutLogs } from '../data/workouts';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [isClient, setIsClient] = useState(false);

  // Ensure the code only runs on the client side
  useEffect(() => {
    setIsClient(true); // Marks that we're now on the client side
  }, []);
  
  // Fetch the next scheduled workout
  const { data: nextWorkout, isLoading: isWorkoutLoading } = useQuery({
    queryKey: ['nextWorkout'],
    queryFn: getNextScheduledWorkout,
    enabled: isClient, // Only fetch on the client side
  });

  // Fetch workout logs for the next workout
  const { data: logs, isLoading: isLogsLoading } = useQuery({
    queryKey: ['workoutLogs', nextWorkout?.id],
    queryFn: () => getWorkoutLogs(nextWorkout?.id),
    enabled: isClient && !!nextWorkout, // Only fetch logs if we're on the client side and workout exists
  });

  useEffect(() => {
    if (logs) {
      setWorkoutLogs(logs);
    }
  }, [logs]);

  // Handle loading state
  if (isWorkoutLoading || isLogsLoading) {
    return <div>Loading...</div>;
  }

  // Handle case when no upcoming workout is scheduled
  if (!nextWorkout) {
    return <>
      <Navbar />
      <div>No upcoming workouts scheduled.</div>
    </>;
  }

  return (
    <div className="container">
      <Navbar />
      
      <div className="workout-container">
        <h2>{nextWorkout?.category?.label} Workout</h2>
        <ul>
          {nextWorkout.exercises.map((exercise) => (
            <li key={exercise.id}>
              <strong>{exercise.name}</strong>
              <p>{exercise.description}</p>
            </li>
          ))}
        </ul>
        <Link href={`/workout-tracker/${nextWorkout.id}`}>
          <button className="button">View in Tracker</button>
        </Link>
      </div>

      <div className="logs-container">
        <h3>Workout Logs</h3>
        <ul>
          {workoutLogs.map((log) => (
            <li key={log.id}>
              <strong>{log.exercise.name}</strong>
              <ul>
                <li>Weight: {log.weight} lbs</li>
                <li>Reps: {log.reps}</li>
                <li>Sets: {log.sets}</li>
                <li>Interval: {log.interval} sec</li>
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
