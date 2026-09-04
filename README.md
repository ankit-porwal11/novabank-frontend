# NovaBank Frontend — Phase 1 (Authentication + Profile)

Production-grade React frontend for the Authentication + Profile module,
built against the existing Express/MongoDB backend in `Backend/`.

## Stack

- React 18 + Vite
- React Router v6
- Axios (cookie-based auth, automatic refresh-token interceptor)
- TanStack Query (server state)
- Zustand (client auth/user state)
- react-hot-toast (notifications)

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

The dev server runs on `http://localhost:5173` and proxies `/api` requests
to `http://localhost:8000` (see `vite.config.js`), so the backend must be
running locally on port 8000 for auth to work in development.

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build locally

## Phase 1 scope

Register, Login, Logout, Refresh Token, Get Current User, Change Password,
Update Account Details, Update Avatar, Update Cover Image — and the pages
that surface them (Login, Register, Dashboard, Profile, Settings, Change
Password). Banking/account/transaction modules are intentionally out of
scope and will land in a later phase.

## Auth model

Access and refresh tokens are httpOnly cookies set by the backend — the
frontend never reads or stores them directly. Every request goes through
`src/api/axiosClient.js` with `withCredentials: true`; a response
interceptor retries once via `POST /users/refresh-token` on a 401, and
logs the session out locally if that also fails.

> **Note:** the backend's CORS config in `Backend/src/app.js` sets a
> capitalized `Credentials: true` option, which the `cors` package does not
> recognize (the correct key is lowercase `credentials`). This doesn't
> affect local dev, since Vite's proxy makes requests same-origin, but it
> will block cookie auth in a true cross-origin production deployment
> until corrected on the backend.
