import Navbar from '../components/Navbar';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getNextScheduledWorkout, getWorkoutLogs } from '../data/workouts';
import { useUserQuery } from "../context/userQueries";

export default function HomePage() {
  const [nextWorkout, setNextWorkout] = useState(null);
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isStaff } = useUserQuery();

  useEffect(() => {
    async function fetchWorkoutData() {
      try {
        const workoutData = await getNextScheduledWorkout();
        setNextWorkout(workoutData);
        
        if (workoutData) {
          const logsData = await getWorkoutLogs(workoutData.id);
          setWorkoutLogs(logsData);
        }
      } catch (error) {
        console.error('Error fetching workout data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchWorkoutData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <Navbar />
      <div className="workout-container">
        <h2>Your Next Workout</h2>
        {nextWorkout ? (
          <>
            <ul>
              {nextWorkout.exercises.map((exercise) => (
                <li key={exercise.id}>
                  <strong>{exercise.name}</strong>
                  <p>{exercise.description}</p>
                </li>
              ))}
            </ul>
            <Link href={`/workout`}>
              <button className="button">View in Tracker</button>
            </Link>
          </>
        ) : (
          <div>No upcoming workouts scheduled.</div>
        )}
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
