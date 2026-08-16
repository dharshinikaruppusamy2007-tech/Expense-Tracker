# Trackify — Smart Expense Tracker & AI Finance Assistant

A React + Vite (Tailwind CSS) frontend application that helps you track expenses, manage budgets and goals, schedule reminders, and receive AI-powered financial insights. The app currently runs on a local in-browser data layer (localStorage via `src/mockApi.js`) and is designed to be wired to a REST backend later.

## Features

- **Authentication** — register / login (mock JWT, persisted in localStorage)
- **Smart Expense Management** — add, view, sort, export (CSV), and auto-categorize expenses via text/voice input
- **Voice Input** — say "Spent 500 on Pizza" and it adds the record
- **Goals & Budgets** — set milestones, deposit savings with streak tracking and progress rings
- **Reminders** — schedule upcoming bill notifications
- **AI Insights** — smart alerts at 80% budget usage, spending suggestions, and month-end predictions
- **Dark/Adaptive UI** — fully responsive dashboard built with Tailwind CSS

## Tech Stack

- [Vite](https://vitejs.dev/) 8 + [React](https://react.dev/) 19
- [Tailwind CSS](https://tailwindcss.com/) 4 (via `@tailwindcss/vite`)
- [React Router](https://reactrouter.com/) 7
- [lucide-react](https://lucide.dev/) icons, [date-fns](https://date-fns.org/) dates, [chart.js](https://www.chartjs.org/) charts (optional)

## Getting Started

Prerequisites: Node.js 18+.

```bash
npm install        # install dependencies
npm run dev        # start Vite dev server -> http://localhost:5173
```

Other scripts:

```bash
npm run build      # production build (outputs to dist/)
npm run preview    # preview the production build
npm run lint       # run ESLint
```

## Usage

1. Open `http://localhost:5173/` and click **Create one** to register.
2. Log in with your credentials.
3. Try adding expenses (including Voice Input), set a budget, create goals, and view dashboard insights.

## Project Structure

```
tracker/
├── public/                # static assets (favicon, background images)
├── src/
│   ├── assets/            # bundled assets
│   ├── components/        # shared UI (Sidebar)
│   ├── pages/             # route pages (Login, Dashboard, Expenses, ...)
│   ├── api.js             # API abstraction layer
│   ├── mockApi.js         # localStorage-backed mock backend
│   ├── App.jsx            # app shell + routes
│   ├── main.jsx           # React entry point
│   └── index.css          # Tailwind + global styles
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── vite.config.js
└── README.md
```
