# Spotify Stats Dashboard

A small React + Vite app that uses the Spotify Web API to show your personal stats: top tracks, top artists, and recently played songs. Authentication is handled entirely on the client with Spotify’s PKCE flow, so no server is required.

## Features

- Secure PKCE authorization against Spotify (read-only scopes only)
- Switchable time ranges (4 weeks, 6 months, all time) for your top tracks/artists
- Recently played section with relative timestamps
- Responsive layout geared toward desktop and tablet widths

## Prerequisites

- Node.js 18+
- A Spotify Developer account (free) and a registered application

## Getting Started

1. **Clone & install**
   ```bash
   npm install
   ```
2. **Create a Spotify app**
   - Visit [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard/).
   - Create an application and add `http://localhost:5173` to the Redirect URIs list.
   - Copy the Client ID.
3. **Configure environment variables**
   - Duplicate `.env.example` → `.env.local`.
   - Fill in:
     ```ini
     VITE_SPOTIFY_CLIENT_ID=your_client_id
     VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173
     ```
     The redirect URI must match the Spotify dashboard entry exactly.
4. **Run the dev server**
   ```bash
   npm run dev
   ```
5. Open the printed URL (typically `http://localhost:5173`), click **Connect my account**, and approve the requested scopes. The dashboard will populate once the token exchange completes.

## Available Scripts

| Command        | Description                                  |
| -------------- | -------------------------------------------- |
| `npm run dev`  | Start Vite dev server with hot reloading     |
| `npm run build`| Production build                              |
| `npm run preview` | Preview the production bundle locally    |

## How it works

- `src/lib/spotify.js` wraps the PKCE flow (code verifier/challenge creation, token exchange, refresh, and authenticated fetch helper).
- `src/App.jsx` orchestrates auth state, loads profile + stats, and renders the dashboard.
- Styling lives in `src/App.css` / `src/index.css` with a simple glassmorphism-inspired UI.

No backend services are needed; all requests go straight to Spotify’s Web API from the browser.
