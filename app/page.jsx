'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProfileCard from './components/ProfileCard';
import StatRow from './components/StatRow';
import StatsList from './components/StatsList';
import {
  clearSpotifySession,
  exchangeCodeForToken,
  fetchProfile,
  fetchRecentlyPlayed,
  fetchTopItems,
  hasSpotifyConfig,
  initiateSpotifyLogin,
  ensureAccessToken,
} from '../lib/spotify';

const TIME_RANGES = [
  { id: 'short_term', label: 'Last 4 Weeks' },
  { id: 'medium_term', label: 'Last 6 Months' },
  { id: 'long_term', label: 'Last 12 Months' },
];

const ITEM_LIMITS = [
  { id: 10, label: 'Top 10' },
  { id: 30, label: 'Top 30' },
];

const numberFormatter = new Intl.NumberFormat();

// Client component because it relies on browser storage and URL params for OAuth.
export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const configReady = hasSpotifyConfig();
  const [status, setStatus] = useState(
    configReady ? 'checking-session' : 'missing-config'
  );
  const [authError, setAuthError] = useState('');
  const [profile, setProfile] = useState(null);
  const [selectedRange, setSelectedRange] = useState('medium_term');
  const [selectedLimit, setSelectedLimit] = useState(10);
  const [statsError, setStatsError] = useState('');
  const [loadingStats, setLoadingStats] = useState(false);
  const [stats, setStats] = useState({
    topArtists: [],
    topTracks: [],
    recentlyPlayed: [],
  });

  // On mount, exchange the OAuth code (if present) and hydrate the saved session.
  useEffect(() => {
    if (!configReady) return;

    const code = searchParams.get('code');
    const oauthError = searchParams.get('error');

    if (oauthError) {
      setAuthError(`Spotify authentication failed: ${oauthError}`);
      setStatus('needs-login');
      router.replace('/');
      return;
    }

    const hydrateSession = async () => {
      setStatus('checking-session');
      try {
        if (code) {
          await exchangeCodeForToken(code);
          router.replace('/');
        }

        const token = await ensureAccessToken();
        if (!token) {
          setStatus('needs-login');
          return;
        }

        const user = await fetchProfile();
        setProfile(user);
        setStatus('ready');
      } catch (error) {
        setAuthError(error.message);
        setStatus('needs-login');
      }
    };

    hydrateSession();
  }, [configReady, router, searchParams]);

  // Fetch top artists/tracks/recent plays in parallel whenever filters change.
  const loadStats = useCallback(
    async (range, limit) => {
      if (status !== 'ready') return;
      setLoadingStats(true);
      setStatsError('');

      try {
        const [artists, tracks, recent] = await Promise.all([
          fetchTopItems('artists', range, limit),
          fetchTopItems('tracks', range, limit),
          fetchRecentlyPlayed(limit),
        ]);

        setStats({
          topArtists: artists.items,
          topTracks: tracks.items,
          recentlyPlayed: recent.items,
        });
      } catch (error) {
        setStatsError(error.message);
      } finally {
        setLoadingStats(false);
      }
    },
    [status]
  );

  useEffect(() => {
    if (status === 'ready') {
      loadStats(selectedRange, selectedLimit);
    }
  }, [status, selectedRange, selectedLimit, loadStats]);

  // Clears stored tokens and sends the user back to the landing state.
  const handleLogout = useCallback(() => {
    clearSpotifySession();
    router.replace('/');
  }, [router]);

  const renderContent = useMemo(() => {
    if (!configReady) {
      return (
        <section className="card">
          <h2>Finish the setup</h2>
          <p>
            Add your Spotify App credentials to a <code>.env.local</code> file:
          </p>
          <pre className="code-block">
            {`NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://localhost:3000`}
          </pre>
          <p className="muted">
            Use the same redirect URI here and in your Spotify dashboard.
          </p>
        </section>
      );
    }

    if (status === 'checking-session') {
      return (
        <section className="card card--center">
          <div className="loader" aria-hidden />
          <p>Validating your Spotify session…</p>
        </section>
      );
    }

    if (status === 'needs-login') {
      return (
        <section className="card card--center">
          <h2>Connect Spotify</h2>
          <p className="muted">Log in to your Spotify account.</p>
          {authError && <p className="error">{authError}</p>}
          <button className="button" onClick={initiateSpotifyLogin}>
            Connect my account
          </button>
        </section>
      );
    }

    if (status === 'ready') {
      return (
        <>
          <ProfileCard
            profile={profile}
            followerLabel={numberFormatter.format(profile?.followers?.total || 0)}
            onLogout={handleLogout}
          />

          <section className="card">
            <div className="section-header">
              <div>
                <p className="muted">Time range</p>
                <h3>Stats</h3>
              </div>
              <div className="range-toggle">
                {TIME_RANGES.map((range) => (
                  <button
                    key={range.id}
                    className={
                      range.id === selectedRange
                        ? 'range-toggle__button is-active'
                        : 'range-toggle__button'
                    }
                    onClick={() => setSelectedRange(range.id)}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
              <div className="limit-toggle">
                {ITEM_LIMITS.map((limit) => (
                  <button
                    key={limit.id}
                    className={
                      limit.id === selectedLimit
                        ? 'limit-toggle__button is-active'
                        : 'limit-toggle__button'
                    }
                    onClick={() => setSelectedLimit(limit.id)}
                  >
                    {limit.label}
                  </button>
                ))}
              </div>
            </div>
            {loadingStats && (
              <p className="muted">Fetching fresh insights…</p>
            )}
            {statsError && <p className="error">{statsError}</p>}
          </section>

          <section className="grid">
            <StatsList
              title="Top Tracks"
              items={stats.topTracks}
              renderItem={(track, index) => (
                <StatRow
                  key={track.id}
                  rank={index + 1}
                  image={track.album?.images?.[2]?.url}
                  title={track.name}
                  subtitle={`${track.artists.map((artist) => artist.name).join(', ')} • ${
                    track.album?.name
                  }`}
                  externalUrl={track.external_urls?.spotify}
                />
              )}
            />
            <StatsList
              title="Top Artists"
              items={stats.topArtists}
              renderItem={(artist, index) => (
                <StatRow
                  key={artist.id}
                  rank={index + 1}
                  image={artist.images?.[2]?.url}
                  title={artist.name}
                  metricLabel="Followers"
                  metricValue={numberFormatter.format(
                    artist.followers?.total || 0
                  )}
                  externalUrl={artist.external_urls?.spotify}
                />
              )}
            />
            <StatsList
              title="Recently Played"
              items={stats.recentlyPlayed}
              renderItem={(item, index) => (
                <StatRow
                  key={`${item.played_at}-${item.track.id}`}
                  rank={index + 1}
                  image={item.track.album?.images?.[2]?.url}
                  title={item.track.name}
                  subtitle={`${item.track.artists
                    .map((artist) => artist.name)
                    .join(', ')} • ${item.track.album?.name}`}
                  metricLabel="Played"
                  metricValue={formatRelativeTime(item.played_at)}
                  externalUrl={item.track.external_urls?.spotify}
                />
              )}
            />
          </section>
        </>
      );
    }

    return null;
  }, [
    authError,
    configReady,
    handleLogout,
    profile,
    selectedRange,
    selectedLimit,
    stats,
    statsError,
    status,
    loadingStats,
  ]);

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <p className="muted">Spotify Data Results</p>
          <h1>Personal Stats</h1>
        </div>
      </header>
      <main className="app__content">{renderContent}</main>
    </div>
  );
}

function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.max(1, Math.floor(diffMs / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
