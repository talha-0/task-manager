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
        setTasks(await fetchTasks());
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

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">Task Manager</p>
        <h1>Small, clean, and persistent.</h1>
        <p className="intro">
          A simple React and Express task app with a minimal workspace, comfortable spacing, and
          task data saved on the backend.
        </p>
      </header>

      <section className="workspace" aria-label="Task workspace">
        <form className="composer" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="task-title">
            Task title
          </label>
          <input
            id="task-title"
            className="input"
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Add a task"
            value={title}
          />
          <button className="button button-primary" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Adding...' : 'Add'}
          </button>
        </form>

        <div className="meta">
          <span>{tasks.length} total</span>
          <span>{completedCount} completed</span>
        </div>

        {error ? <p className="notice notice-error">{error}</p> : null}

        {isLoading ? <p className="notice">Loading tasks...</p> : null}

        {!isLoading && tasks.length === 0 ? (
          <div className="empty">
            <p>No tasks yet.</p>
            <p>Use the field above to create your first item.</p>
          </div>
        ) : null}

        {!isLoading && tasks.length > 0 ? (
          <ul className="list">
            {tasks.map((task) => {
              const isActive = activeTaskIds.includes(task.id);

              return (
                <li className="item" key={task.id}>
                  <label className="item-main">
                    <input
                      checked={task.completed}
                      className="checkbox"
                      disabled={isActive}
                      onChange={() => handleToggle(task)}
                      type="checkbox"
                    />
                    <span className={task.completed ? 'title title-complete' : 'title'}>{task.title}</span>
                  </label>
                  <button
                    aria-label={`Delete ${task.title}`}
                    className="button button-muted"
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
        ) : null}
      </section>
    </main>
  );
}

export default App;
