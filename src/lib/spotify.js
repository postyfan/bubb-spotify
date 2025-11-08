const TOKEN_STORAGE_KEY = 'spotify_token';
const CODE_VERIFIER_KEY = 'spotify_code_verifier';
const TOKEN_EXPIRY_BUFFER = 60 * 1000; // refresh 1 minute before expiry
const SPOTIFY_AUTHORIZE_ENDPOINT = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

const SCOPES = [
  'user-read-email',
  'user-read-private',
  'user-top-read',
  'user-read-recently-played',
];

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const DEFAULT_REDIRECT =
  typeof window !== 'undefined' ? window.location.origin : '';
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || DEFAULT_REDIRECT;

const encoder = new TextEncoder();

function generateRandomString(length = 64) {
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values, (value) => possible[value % possible.length]).join(
    ''
  );
}

async function sha256(base) {
  const data = encoder.encode(base);
  return crypto.subtle.digest('SHA-256', data);
}

function base64UrlEncode(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function initiateSpotifyLogin() {
  if (!CLIENT_ID) {
    throw new Error(
      'Missing Spotify client id. Set VITE_SPOTIFY_CLIENT_ID in a .env.local file.'
    );
  }

  const codeVerifier = generateRandomString(64);
  sessionStorage.setItem(CODE_VERIFIER_KEY, codeVerifier);

  const codeChallenge = base64UrlEncode(await sha256(codeVerifier));
  const state = generateRandomString(16);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: SCOPES.join(' '),
    redirect_uri: REDIRECT_URI,
    state,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  });

  window.location.assign(
    `${SPOTIFY_AUTHORIZE_ENDPOINT}?${params.toString()}`
  );
}

function persistToken(tokenResponse, fallbackRefreshToken) {
  const payload = {
    accessToken: tokenResponse.access_token,
    refreshToken: tokenResponse.refresh_token || fallbackRefreshToken,
    scope: tokenResponse.scope,
    expiresAt: Date.now() + (tokenResponse.expires_in ?? 3600) * 1000,
  };
  localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(payload));
  return payload;
}

export function getStoredToken() {
  const raw = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearSpotifySession() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(CODE_VERIFIER_KEY);
}

async function requestToken(params) {
  const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params),
  });

  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    const message =
      detail?.error_description ||
      detail?.error ||
      'Spotify token endpoint error';
    throw new Error(message);
  }

  return response.json();
}

export async function exchangeCodeForToken(code) {
  const codeVerifier = sessionStorage.getItem(CODE_VERIFIER_KEY);
  if (!codeVerifier) {
    throw new Error('Missing code verifier. Start the Spotify login again.');
  }

  const tokenResponse = await requestToken({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: codeVerifier,
    client_id: CLIENT_ID,
  });

  sessionStorage.removeItem(CODE_VERIFIER_KEY);
  return persistToken(tokenResponse);
}

export async function refreshAccessToken(refreshToken) {
  if (!refreshToken) {
    throw new Error('Missing refresh token');
  }

  const tokenResponse = await requestToken({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: CLIENT_ID,
  });

  return persistToken(tokenResponse, refreshToken);
}

export async function ensureAccessToken() {
  const stored = getStoredToken();
  if (!stored) return null;

  const needsRefresh =
    !stored.expiresAt || stored.expiresAt - TOKEN_EXPIRY_BUFFER < Date.now();

  if (!needsRefresh) {
    return stored.accessToken;
  }

  if (!stored.refreshToken) {
    clearSpotifySession();
    return null;
  }

  try {
    const refreshed = await refreshAccessToken(stored.refreshToken);
    return refreshed.accessToken;
  } catch (error) {
    clearSpotifySession();
    throw error;
  }
}

async function forceRefreshAccessToken() {
  const stored = getStoredToken();
  if (!stored?.refreshToken) {
    clearSpotifySession();
    return null;
  }

  const refreshed = await refreshAccessToken(stored.refreshToken);
  return refreshed.accessToken;
}

export async function spotifyRequest(path, init = {}) {
  let accessToken = await ensureAccessToken();
  if (!accessToken) {
    throw new Error('Connect your Spotify account to continue.');
  }

  let response = await fetch(`${SPOTIFY_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(init.headers || {}),
    },
  });

  if (response.status === 401) {
    accessToken = await forceRefreshAccessToken();
    if (!accessToken) {
      throw new Error('Spotify session expired. Please sign in again.');
    }

    response = await fetch(`${SPOTIFY_API_BASE}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...(init.headers || {}),
      },
    });
  }

  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    const message =
      detail?.error?.message ||
      detail?.error_description ||
      'Spotify request failed';
    throw new Error(message);
  }

  return response.json();
}

export async function fetchProfile() {
  return spotifyRequest('/me');
}

export async function fetchTopItems(type, timeRange = 'medium_term', limit = 10) {
  return spotifyRequest(
    `/me/top/${type}?time_range=${timeRange}&limit=${limit}`
  );
}

export async function fetchRecentlyPlayed(limit = 10) {
  return spotifyRequest(`/me/player/recently-played?limit=${limit}`);
}

export function hasSpotifyConfig() {
  return Boolean(CLIENT_ID && REDIRECT_URI);
}

export { SCOPES, CLIENT_ID, REDIRECT_URI };
