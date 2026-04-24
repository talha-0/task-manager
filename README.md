# Task Manager

A small full-stack task manager built with React and Express. Users can add tasks, mark them complete, and delete them. Task data persists between refreshes through a lightweight JSON file on the backend.

## Status

The app is complete end to end. The React frontend talks to the Express API for task creation, completion updates, deletion, and initial loading. Tasks persist in `server/data/tasks.json`, so a browser refresh keeps the current list intact.

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

## Project Structure

- `client/` contains the React + TypeScript UI built with Vite
- `server/` contains the Express API, file-backed task store, and backend tests
- `server/data/tasks.json` is the lightweight persistence layer used for the assignment

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
- The file-backed store serializes mutations so rapid clicks do not create overlapping read/write races.
- Backend tests focus on the API contract and persistence behavior; that gives coverage on the core business logic without adding a full frontend test harness for a small assignment.
- The frontend styling stays deliberately small and plain so the UI is easy to adjust without maintaining a large CSS file.
