# Task Manager

A small full-stack task manager built with React and Express. Users can add tasks, mark them complete, and delete them. Task data persists between refreshes through a lightweight JSON file on the backend.

## Status

Project scaffolded with separate `client` and `server` apps. The API and UI are implemented in follow-up commits to keep the history small and descriptive.

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

## Trade-offs

- A JSON file keeps the assignment simple and makes persistence easy to inspect locally.
- The project is split into `client` and `server` folders to keep frontend and backend responsibilities clear.
