# World Call Planner

Schedule international calls with confidence. A modern timezone comparison and call planning tool that displays 7 world clocks with analog dials, live time conversion, and meeting overlap visualization.

## Features

- **7 World Clocks** — Analog + digital display with searchable city dropdowns
- **Call Planning Panel** — Pick a base location, date, and time to see conversions across all selected cities
- **Meeting Overlap Bar** — Visual business-hours overlap finder with best-window suggestion
- **Business Hour Indicators** — Color-coded time-of-day labels (business / evening / night / early morning)
- **Day Change Alerts** — "Next day" / "Previous day" labels when dates differ
- **Dark / Light Mode** — Toggle with persistent preference
- **12h / 24h Format** — One-click toggle
- **Copy Summary** — Share planned call times as text
- **LocalStorage Persistence** — Selected cities and preferences saved between sessions
- **30 Cities** — Covering all major time zones with IANA accuracy (DST-aware)

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Luxon (timezone conversions via IANA database)

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Build

```bash
npm run build
npm run preview
```
