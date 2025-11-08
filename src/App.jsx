import { useCallback, useEffect, useMemo, useState } from 'react';
import './App.css';
import {
  clearSpotifySession,
  exchangeCodeForToken,
  fetchProfile,
  fetchRecentlyPlayed,
  fetchTopItems,
  hasSpotifyConfig,
  initiateSpotifyLogin,
  ensureAccessToken,
} from './lib/spotify';

const TIME_RANGES = [
  { id: 'short_term', label: 'Last 4 Weeks' },
  { id: 'medium_term', label: 'Last 6 Months' },
  { id: 'long_term', label: 'All Time' },
];

const numberFormatter = new Intl.NumberFormat();

function App() {
  const configReady = hasSpotifyConfig();
  const [status, setStatus] = useState(
    configReady ? 'checking-session' : 'missing-config'
  );
  const [authError, setAuthError] = useState('');
  const [profile, setProfile] = useState(null);
  const [selectedRange, setSelectedRange] = useState('medium_term');
  const [statsError, setStatsError] = useState('');
  const [loadingStats, setLoadingStats] = useState(false);
  const [stats, setStats] = useState({
    topArtists: [],
    topTracks: [],
    recentlyPlayed: [],
  });

  useEffect(() => {
    if (!configReady) return;

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const oauthError = params.get('error');

    if (oauthError) {
      setAuthError(`Spotify authentication failed: ${oauthError}`);
      setStatus('needs-login');
      params.delete('error');
      params.delete('state');
      window.history.replaceState({}, '', window.location.pathname);
      return;
    }

    const hydrateSession = async () => {
      setStatus('checking-session');
      try {
        if (code) {
          await exchangeCodeForToken(code);
          params.delete('code');
          params.delete('state');
          window.history.replaceState({}, '', window.location.pathname);
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
  }, [configReady]);

  const loadStats = useCallback(
    async (range) => {
      if (status !== 'ready') return;
      setLoadingStats(true);
      setStatsError('');

      try {
        const [artists, tracks, recent] = await Promise.all([
          fetchTopItems('artists', range),
          fetchTopItems('tracks', range),
          fetchRecentlyPlayed(),
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
      loadStats(selectedRange);
    }
  }, [status, selectedRange, loadStats]);

  const handleLogout = useCallback(() => {
    clearSpotifySession();
    window.location.replace(window.location.origin);
  }, []);

  const renderContent = useMemo(() => {
    if (!configReady) {
      return (
        <section className="card">
          <h2>Finish the setup</h2>
          <p>
            Add your Spotify App credentials to a <code>.env.local</code>{' '}
            file:
          </p>
          <pre className="code-block">
            {`VITE_SPOTIFY_CLIENT_ID=your_client_id
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173`}
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
          <p className="muted">
            We use Spotify’s secure PKCE flow and only request read-only scopes.
          </p>
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
          <section className="card profile-card">
            <div className="profile">
              <ProfileAvatar profile={profile} />
              <div>
                <p className="muted">Logged in as</p>
                <h2>{profile?.display_name}</h2>
                <p className="muted">
                  Followers: {numberFormatter.format(profile?.followers?.total || 0)}
                </p>
              </div>
            </div>
            <button className="button button--ghost" onClick={handleLogout}>
              Sign out
            </button>
          </section>

          <section className="card">
            <div className="section-header">
              <div>
                <p className="muted">Time range</p>
                <h3>Customize your stats</h3>
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
                  metricLabel="Popularity"
                  metricValue={track.popularity}
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
                  subtitle={
                    artist.genres?.length
                      ? artist.genres.slice(0, 2).join(' • ')
                      : 'No genre data'
                  }
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
    stats,
    statsError,
    status,
    loadingStats,
  ]);

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <p className="muted">Spotify data companion</p>
          <h1>Personal Stats</h1>
        </div>
        <div className="badge">PKCE Auth</div>
      </header>
      <main className="app__content">{renderContent}</main>
    </div>
  );
}

function StatsList({ title, items, renderItem }) {
  return (
    <article className="card">
      <div className="section-header">
        <div>
          <p className="muted">Insights</p>
          <h3>{title}</h3>
        </div>
      </div>
      <ul className="entity-list">
        {items?.length ? (
          items.map((item, index) => renderItem(item, index))
        ) : (
          <li className="muted">No data available.</li>
        )}
      </ul>
    </article>
  );
}

function StatRow({
  rank,
  image,
  title,
  subtitle,
  metricLabel,
  metricValue,
  externalUrl,
}) {
  return (
    <li className="entity">
      <span className="entity__rank">{rank}</span>
      {image && <img src={image} alt="" className="entity__thumb" />}
      <div className="entity__meta">
        <a
          href={externalUrl || '#'}
          target={externalUrl ? '_blank' : undefined}
          rel={externalUrl ? 'noreferrer' : undefined}
          className="entity__title"
          aria-disabled={!externalUrl}
        >
          {title}
        </a>
        <p className="entity__subtitle">{subtitle}</p>
      </div>
      <div className="entity__metric">
        <span>{metricLabel}</span>
        <strong>{metricValue}</strong>
      </div>
    </li>
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

function ProfileAvatar({ profile }) {
  const image = profile?.images?.[0]?.url;
  if (image) {
    return (
      <img
        src={image}
        alt={profile?.display_name || 'Spotify user'}
        className="profile__avatar"
      />
    );
  }

  const initial = profile?.display_name?.[0] || '?';
  return (
    <div className="profile__avatar profile__avatar--fallback">
      {initial.toUpperCase()}
    </div>
  );
}

export default App;
