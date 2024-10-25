import { useState, useEffect } from 'react';
import { Input } from '../../components/form-elements';
import Navbar from '@/components/Navbar';
import EditWorkoutButton from '@/components/EditWorkoutButton';
import { useRouter } from 'next/router';
import { 
  getNextScheduledWorkout, 
  getWorkoutLogs, 
  updateLog, 
  completeWorkout, 
  getIncompleteWorkouts 
} from '../../data/workouts';
import DeleteWorkoutButton from '@/components/DeleteWorkoutButton';

export default function WorkoutPage() {
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);
  const [nextWorkout, setNextWorkout] = useState(null);
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [workoutsList, setWorkoutsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch next workout and incomplete workouts on initial load
  useEffect(() => {
    const fetchWorkoutsData = async () => {
      try {
        const nextWorkoutData = await getNextScheduledWorkout();
        setNextWorkout(nextWorkoutData);
        setSelectedWorkoutId(nextWorkoutData.id);

        const incompleteWorkoutsData = await getIncompleteWorkouts();
        setWorkoutsList(incompleteWorkoutsData);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutsData();
  }, []);

  // Fetch logs when the selected workout ID changes
  useEffect(() => {
    if (selectedWorkoutId) {
      const fetchWorkoutLogs = async () => {
        try {
          const logsData = await getWorkoutLogs(selectedWorkoutId);
          setWorkoutLogs(logsData);
        } catch (error) {
          console.error('Error fetching workout logs:', error);
        }
      };

      fetchWorkoutLogs();
    }
  }, [selectedWorkoutId]);

  // Function to update a log
  const handleSaveLog = async (logId, updatedLog) => {
    try {
      await updateLog({ logId, updatedLog });
      // Refresh logs to reflect any changes
      const logsData = await getWorkoutLogs(selectedWorkoutId);
      setWorkoutLogs(logsData);
    } catch (error) {
      console.error('Error updating log:', error);
    }
  };

  // Function to mark workout as complete
  const handleCompleteWorkout = async () => {
    try {
      await completeWorkout(selectedWorkoutId);
      router.push('/'); // Redirect to home after marking workout complete
    } catch (error) {
      console.error('Error completing workout:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="workout-page-container">
        {/* Left: Workout Selector */}
        <div className="workout-selector">
          <h2>Select a Different Workout</h2>
          <select
            value={selectedWorkoutId || ''}
            onChange={(e) => setSelectedWorkoutId(e.target.value)}
          >
            <option value="">Select Workout</option>
            {workoutsList.map((workout) => (
              <option key={workout.id} value={workout.id}>
                {workout.target_date} - {workout.categories?.[0]?.label || 'No Category'}
              </option>
            ))}
          </select>
        </div>

        {/* Right: Workout Display */}
        <div className="workout-display">
          {nextWorkout && nextWorkout.categories?.length > 0 ? (
            <>
              <h2>Selected Workout</h2>
              <p><strong>Target Date:</strong> {nextWorkout.target_date}</p>
              <div className="workout-logs">
                <h3>Workout Logs</h3>
                {workoutLogs.map((log) => (
                  <div key={log.id} className="log-item">
                    <h4>{log.exercise.name}</h4>
                    <Input
                      id={`weight-${log.id}`}
                      label="Weight (lbs)"
                      type="number"
                      placeholder="Enter weight"
                      value={log.weight}
                      onChangeEvent={(e) =>
                        setWorkoutLogs(
                          workoutLogs.map(l =>
                            l.id === log.id ? { ...l, weight: e.target.value } : l
                          )
                        )
                      }
                    />
                    <Input
                      id={`reps-${log.id}`}
                      label="Reps"
                      type="number"
                      placeholder="Enter reps"
                      value={log.reps}
                      onChangeEvent={(e) =>
                        setWorkoutLogs(
                          workoutLogs.map(l =>
                            l.id === log.id ? { ...l, reps: e.target.value } : l
                          )
                        )
                      }
                    />
                    <Input
                      id={`sets-${log.id}`}
                      label="Sets"
                      type="number"
                      placeholder="Enter sets"
                      value={log.sets}
                      onChangeEvent={(e) =>
                        setWorkoutLogs(
                          workoutLogs.map(l =>
                            l.id === log.id ? { ...l, sets: e.target.value } : l
                          )
                        )
                      }
                    />
                    <Input
                      id={`interval-${log.id}`}
                      label="Interval (sec)"
                      type="number"
                      placeholder="Enter interval"
                      value={log.interval}
                      onChangeEvent={(e) =>
                        setWorkoutLogs(
                          workoutLogs.map(l =>
                            l.id === log.id ? { ...l, interval: e.target.value } : l
                          )
                        )
                      }
                    />
                    <button
                      className="button is-link mt-2"
                      onClick={() => handleSaveLog(log.id, log)}
                    >
                      Save Log
                    </button>
                  </div>
                ))}
              </div>

              <button className="button is-success mt-4" onClick={handleCompleteWorkout}>
                Complete Workout
              </button>

              {/* Use EditWorkoutButton component */}
              <EditWorkoutButton workoutId={selectedWorkoutId} />
              <DeleteWorkoutButton workoutId={selectedWorkoutId} />
            </>
          ) : (
            <p>No workout data available.</p>
          )}
        </div>
      </div>
    </>
  );
}
