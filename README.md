# BloodLink — Community Blood Donation Platform

BloodLink is a modern, responsive front-end application built with Vite + React + TypeScript and Tailwind CSS. The UI is composed of shadcn-style components and focuses on connecting donors with recipients, posting and responding to blood requests, and an intuitive search/filter experience for donors.

This repository contains the client-side frontend for the BloodLink application.

---

## ⚡ Quick overview

- Vite + React + TypeScript
- Tailwind CSS + shadcn-style UI components
- React Router for client-side routing
- React Query for data fetching & caching
- Pages: Home, Find Donors, Blood Requests, Auth (Login/Register), Profile, Report

This frontend expects a backend API (sample calls in the code point to `http://localhost:3000/api/v1`).

---

## 🚀 Getting started (local development)

Prerequisites:

- Node.js (v18+ recommended)

From the project root:

PowerShell (Windows):

```powershell
# install dependencies
npm install

# start the dev server (Vite)
npm run dev

# build for production
npm run build

# preview build locally
npm run preview

# lint the codebase
npm run lint
```

By default Vite runs at http://localhost:5173 — open that in a browser after starting the dev server.

Note: The client fetches data from the API endpoints such as `http://localhost:3000/api/v1/donor` and `http://localhost:3000/api/v1/blood-requests` in several pages. Make sure you run a compatible backend (or update the fetch URLs to match your API).

---

## 🧭 Project structure (important folders)

- src/
  - assets/ — static files and images
  - components/ — reusable UI components (shadcn style)
  - data/ — mockData and test data used in UI
  - hooks/ — small hooks (mobile, toast, etc.)
  - lib/ — utilities and helpers
  - pages/ — top-level route pages (Home, Donors, Requests, Profile, etc.)
  - App.tsx — app routes & providers
  - main.tsx — app entry point

---

## ✨ Key features

- Responsive, modern UI built with shadcn-style components
- Donor discovery with search, filtering and sorting (distance, availability)
- Post and manage blood requests (including urgency levels and sharing)
- Profile/login/register flows (authentication scaffolding present in UI)
- Uses React Query for caching/API interaction and client state

---

## 🛠️ Tech stack

- Vite
- React 18+ (TypeScript)
- Tailwind CSS
- shadcn-style component collection (under src/components/ui)
- React Router (v6)
- @tanstack/react-query
- Lucide icons, Sonner notifications

---

## 🧪 Notes for contributors / improvement ideas

- Externalize API base URL into an environment variable (e.g. VITE_API_URL) instead of hardcoding `http://localhost:3000`.
- Add unit/integration tests + CI (Vitest / Playwright / GitHub Actions).
- Add backend repository link or sample server to provide data endpoints used by the UI.

---

_**- Created By Ayaj Uddin Tanif (Full Stack Web Developer)**_
