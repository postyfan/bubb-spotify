# Spotify Stats Dashboard (Next.js)

A Next.js app that uses the Spotify Web API to show your personal stats: top tracks, top artists, and recently played songs. Authentication uses Spotify’s PKCE flow from the browser—no custom backend required.

## Prerequisites
- Node.js 18+
- A Spotify Developer account and registered application

## Setup
1. Install dependencies
   ```bash
   npm install
   ```
2. Configure environment
   - Duplicate `.env.example` → `.env.local`.
   - Fill in:
     ```ini
     NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id
     NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://localhost:3000
     ```
   - The redirect URI must match exactly in your Spotify app settings.
3. Run the dev server
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000`, click **Connect my account**, and approve the requested scopes.

## Available scripts
- `npm run dev` — Start Next.js in development mode
- `npm run build` — Production build
- `npm run start` — Start the production server
- `npm run lint` — Run ESLint with Next.js defaults

## How it works
- `lib/spotify.js` handles PKCE auth, token persistence/refresh, and authenticated Spotify requests.
- `app/page.jsx` is the client-side dashboard: hydrates the Spotify session, triggers stats fetches, and renders the UI.
- UI components live in `app/components/` with shared styling in `app/styles/`.
- Global styles are defined in `app/globals.css`.

All requests are made directly to Spotify from the browser; no custom server-side API layer is required.
