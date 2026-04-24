# Task Manager

A small full-stack task manager built with React and Express. Users can add tasks, mark them complete, and delete them. Task data persists between refreshes through a lightweight JSON file on the backend.

## Status

The backend API now supports task creation, listing, completion updates, and deletion with JSON-file persistence. The React UI is wired up and lands in a follow-up commit to keep the history small and descriptive.

## Planned Stack

- React + TypeScript + Vite for the frontend
- Node.js + Express for the backend
- JSON file persistence for lightweight local storage

## Local Development

Install dependencies from the repo root, then run the client and server together:

```bash
npm install
npm run install:all
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend API runs on `http://localhost:3001`.

## API Endpoints

- `GET /api/tasks` returns all tasks
- `POST /api/tasks` creates a task from `{ "title": "..." }`
- `PATCH /api/tasks/:taskId` updates a task completion state from `{ "completed": true }`
- `DELETE /api/tasks/:taskId` removes a task

## Testing

Run the backend API tests from the repo root:

```bash
npm test
```

## Trade-offs

- A JSON file keeps the assignment simple and makes persistence easy to inspect locally.
- The project is split into `client` and `server` folders to keep frontend and backend responsibilities clear.
- The API uses a file-backed store instead of a database so setup stays minimal for a take-home assignment.
