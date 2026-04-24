import type { Task } from './types';

const tasksEndpoint = '/api/tasks';

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(payload?.message ?? 'Request failed.');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function fetchTasks() {
  const response = await fetch(tasksEndpoint);
  return parseResponse<Task[]>(response);
}

export async function createTask(title: string) {
  const response = await fetch(tasksEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });

  return parseResponse<Task>(response);
}

export async function updateTask(taskId: string, completed: boolean) {
  const response = await fetch(`${tasksEndpoint}/${taskId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ completed }),
  });

  return parseResponse<Task>(response);
}

export async function deleteTask(taskId: string) {
  const response = await fetch(`${tasksEndpoint}/${taskId}`, {
    method: 'DELETE',
  });

  return parseResponse<void>(response);
}
