import { useEffect, useState, type FormEvent } from 'react';
import { createTask, deleteTask, fetchTasks, updateTask } from './api';
import type { Task } from './types';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTaskIds, setActiveTaskIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTasks() {
      try {
        const nextTasks = await fetchTasks();
        setTasks(nextTasks);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load tasks.');
      } finally {
        setIsLoading(false);
      }
    }

    loadTasks();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Enter a task title before adding it.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const nextTask = await createTask(trimmedTitle);
      setTasks((currentTasks) => [nextTask, ...currentTasks]);
      setTitle('');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to add task.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleToggle(task: Task) {
    setActiveTaskIds((currentIds) => [...currentIds, task.id]);
    setError(null);

    try {
      const updatedTask = await updateTask(task.id, !task.completed);
      setTasks((currentTasks) =>
        currentTasks.map((currentTask) => (currentTask.id === task.id ? updatedTask : currentTask)),
      );
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : 'Unable to update task.');
    } finally {
      setActiveTaskIds((currentIds) => currentIds.filter((currentId) => currentId !== task.id));
    }
  }

  async function handleDelete(taskId: string) {
    setActiveTaskIds((currentIds) => [...currentIds, taskId]);
    setError(null);

    try {
      await deleteTask(taskId);
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete task.');
    } finally {
      setActiveTaskIds((currentIds) => currentIds.filter((currentId) => currentId !== taskId));
    }
  }

  return (
    <main className="app-shell">
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Client Project Assignment</p>
            <h1>Task Manager</h1>
          </div>
          <p className="summary">
            Add, complete, and remove tasks with data persisted through the Express API.
          </p>
        </div>

        <form className="task-form" onSubmit={handleSubmit}>
          <label className="task-input-group">
            <span className="sr-only">Task title</span>
            <input
              aria-label="Task title"
              className="task-input"
              onChange={(event) => setTitle(event.target.value)}
              placeholder="What needs to get done?"
              value={title}
            />
          </label>
          <button className="primary-button" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Adding...' : 'Add task'}
          </button>
        </form>

        <div className="status-row">
          <p>
            {tasks.length} task{tasks.length === 1 ? '' : 's'} total
          </p>
          <p>{tasks.filter((task) => task.completed).length} completed</p>
        </div>

        {error ? <p className="feedback error-message">{error}</p> : null}

        {isLoading ? (
          <p className="feedback">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <p className="empty-title">No tasks yet.</p>
            <p className="empty-copy">Create your first task to see it persisted across refreshes.</p>
          </div>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => {
              const isActive = activeTaskIds.includes(task.id);

              return (
                <li className={`task-card ${task.completed ? 'task-card-complete' : ''}`} key={task.id}>
                  <label className="task-toggle">
                    <input
                      checked={task.completed}
                      className="task-checkbox"
                      disabled={isActive}
                      onChange={() => handleToggle(task)}
                      type="checkbox"
                    />
                    <span className="task-title">{task.title}</span>
                  </label>
                  <button
                    aria-label={`Delete ${task.title}`}
                    className="delete-button"
                    disabled={isActive}
                    onClick={() => handleDelete(task.id)}
                    type="button"
                  >
                    Delete
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
