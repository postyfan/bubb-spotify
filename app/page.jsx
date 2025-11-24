'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProfileCard from './components/ProfileCard';
import StatRow from './components/StatRow';
import StatsList from './components/StatsList';
import MetricHighlights from './components/MetricHighlights';
import InsightsPanel from './components/InsightsPanel';
import { Heart, Sparkles, Star } from 'lucide-react';
import {
  clearSpotifySession,
  exchangeCodeForToken,
  fetchProfile,
  fetchRecentlyPlayed,
  fetchTopItems,
  hasSpotifyConfig,
  initiateSpotifyLogin,
  ensureAccessToken,
  createPlaylistWithTracks,
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

// Disable static rendering; rely on client data fetching and URL state.
export const dynamic = 'force-dynamic';

// Client component because it relies on browser storage and URL params for OAuth.
// Layout customization tip: wrap sections with your own containers or swap the header/main markup below to change spacing/structure.
export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="app">
          <main className="app__content">
            <section className="card card--center">
              <div className="loader" aria-hidden />
              <p>Loading your dashboard…</p>
            </section>
          </main>
        </div>
      }
    >
      <DashboardPage />
    </Suspense>
  );
}

function DashboardPage() {
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
  const [lastUpdated, setLastUpdated] = useState(null);
  const [playlistCreating, setPlaylistCreating] = useState(false);
  const [playlistFeedback, setPlaylistFeedback] = useState(null);
  const [stats, setStats] = useState({
    topArtists: [],
    topTracks: [],
    recentlyPlayed: [],
  });

  // On mount, exchange the OAuth code (if present) and hydrate the saved session.
  // If you change the redirect route, update `router.replace('/')` to your new path.
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
  // You can add/remove sections by editing the Promise.all list and the render blocks below.
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
        setLastUpdated(new Date());
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
  // To route elsewhere after logout, swap `router.replace('/')` for your preferred URL.
  const handleLogout = useCallback(() => {
    clearSpotifySession();
    router.replace('/');
  }, [router]);

  const selectedRangeLabel = useMemo(() => {
    return (
      TIME_RANGES.find((range) => range.id === selectedRange)?.label ||
      'Custom window'
    );
  }, [selectedRange]);

  const summaryMetrics = useMemo(() => {
    if (
      !stats.topTracks.length &&
      !stats.topArtists.length &&
      !stats.recentlyPlayed.length
    ) {
      return [];
    }

    const topTrack = stats.topTracks[0];
    const topArtist = stats.topArtists[0];
    const averagePopularity = stats.topTracks.length
      ? Math.round(
          stats.topTracks.reduce(
            (total, track) => total + (track.popularity || 0),
            0
          ) / stats.topTracks.length
        )
      : null;
    const totalRecentMinutes = stats.recentlyPlayed.length
      ? Math.round(
          stats.recentlyPlayed.reduce(
            (total, item) => total + (item.track?.duration_ms || 0),
            0
          ) / 60000
        )
      : null;

    return [
      {
        key: 'top-track',
        label: 'Top Track',
        value: topTrack?.name || 'Awaiting data',
        meta: topTrack
          ? topTrack.artists.map((artist) => artist.name).join(', ')
          : 'Connect and refresh to populate',
        icon: 'TRK',
      },
      {
        key: 'top-artist',
        label: 'Top Artist',
        value: topArtist?.name || 'Awaiting data',
        meta: topArtist
          ? `${numberFormatter.format(topArtist.followers?.total || 0)} followers`
          : 'Pulled from your Spotify profile',
        icon: 'ART',
      },
      {
        key: 'avg-popularity',
        label: 'Avg. Popularity',
        value: averagePopularity ? `${averagePopularity} / 100` : 'No data',
        meta: stats.topTracks.length
          ? `Across ${stats.topTracks.length} tracks`
          : 'Fetch a time range to calculate',
        icon: 'AVG',
      },
      {
        key: 'recent-minutes',
        label: 'Recent Minutes',
        value: totalRecentMinutes ? `${totalRecentMinutes} min` : 'Pending',
        meta: stats.recentlyPlayed.length
          ? `From last ${stats.recentlyPlayed.length} plays`
          : 'Listening history will appear here',
        icon: 'REC',
      },
    ];
  }, [stats]);

  const insights = useMemo(() => {
    if (
      !stats.topTracks.length &&
      !stats.topArtists.length &&
      !stats.recentlyPlayed.length
    ) {
      return [];
    }

    const topArtist = stats.topArtists[0];
    const recentPlay = stats.recentlyPlayed[0];
    const averagePopularity = stats.topTracks.length
      ? Math.round(
          stats.topTracks.reduce(
            (total, track) => total + (track.popularity || 0),
            0
          ) / stats.topTracks.length
        )
      : null;
    const uniqueArtists = new Set(
      stats.topTracks.flatMap((track) =>
        track.artists?.map((artist) => artist.name)
      )
    ).size;
    const coveragePercent = selectedLimit
      ? Math.min(100, Math.round((uniqueArtists / selectedLimit) * 100))
      : null;

    const genreCount = {};
    stats.topArtists.forEach((artist) => {
      (artist.genres || []).forEach((genre) => {
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      });
    });
    const topGenreEntry = Object.entries(genreCount).sort(
      (a, b) => b[1] - a[1]
    )[0];
    const topGenre = topGenreEntry
      ? capitalizeWords(topGenreEntry[0])
      : null;
    const rangeLabel = selectedRangeLabel || 'Custom window';

    return [
      {
        title: 'Engagement cadence',
        description: recentPlay
          ? `Last played ${formatRelativeTime(recentPlay.played_at)} — ${
              recentPlay.track?.name
            }`
          : 'No recent playback captured in this window.',
      },
      {
        title: 'Audience reach',
        description: topArtist
          ? `${topArtist.name} anchors your audience with ${numberFormatter.format(
              topArtist.followers?.total || 0
            )} followers.`
          : 'Connect to surface your leading artists.',
      },
      {
        title: 'Genre gravity',
        description: topGenre
          ? `Current listening leans toward ${topGenre}.`
          : 'Listening genres will populate as your artists load.',
        progress: coveragePercent ?? 0,
        meta: `${uniqueArtists} unique artists across your ${rangeLabel.toLowerCase()}`,
      },
      {
        title: 'Energy profile',
        description: averagePopularity
          ? `Average popularity sits at ${averagePopularity}/100. Keep exploring to move the needle.`
          : 'Fetch a time range to compute popularity.',
      },
    ];
  }, [selectedLimit, selectedRangeLabel, stats]);

  const handleRefresh = useCallback(() => {
    loadStats(selectedRange, selectedLimit);
  }, [loadStats, selectedLimit, selectedRange]);

  const handleCreatePlaylist = useCallback(async () => {
    if (!profile?.id || !stats.topTracks.length || playlistCreating) return;
    setPlaylistCreating(true);
    setPlaylistFeedback(null);
    try {
      const trackUris = stats.topTracks
        .map((track) => track.uri)
        .filter(Boolean);

      if (!trackUris.length) {
        throw new Error('No Spotify track URIs available for playlist.');
      }

      const rangeLabel = selectedRangeLabel || 'Custom window';
      const playlistName = `Statify • ${rangeLabel}`;
      const playlistDescription = `Auto-generated via Statify for your ${rangeLabel.toLowerCase()}.`;

      const playlist = await createPlaylistWithTracks(profile.id, {
        name: playlistName,
        description: playlistDescription,
        trackUris,
      });

      setPlaylistFeedback({
        status: 'success',
        message: 'Playlist synced to Spotify.',
        url: playlist?.external_urls?.spotify,
        name: playlist?.name,
      });
    } catch (error) {
      setPlaylistFeedback({
        status: 'error',
        message: error.message || 'Playlist creation failed.',
      });
    } finally {
      setPlaylistCreating(false);
    }
  }, [
    playlistCreating,
    profile?.id,
    selectedRangeLabel,
    stats.topTracks,
  ]);

  const headerStatus = useMemo(() => {
    switch (status) {
      case 'ready':
        return {
          label: 'Spotify Connected',
          tone: 'is-online',
          subline: profile?.email
            ? `Signed in as ${profile.email}`
            : 'Secure OAuth session active',
        };
      case 'checking-session':
        return {
          label: 'Validating Session',
          tone: 'is-syncing',
          subline: 'Ensuring access token freshness',
        };
      case 'missing-config':
        return {
          label: 'Configuration Required',
          tone: 'is-alert',
          subline: 'Add your Spotify client credentials',
        };
      case 'needs-login':
      default:
        return {
          label: 'Sign In Required',
          tone: 'is-alert',
          subline: 'Connect Spotify to unlock analytics',
        };
    }
  }, [profile?.email, status]);

  const loginErrorMessage = authError || '';

  const heroContent = useMemo(() => {
    if (!configReady) {
      return {
        title: 'Add your Spotify App credentials',
        description:
          'Drop your client ID and redirect URI into .env.local so Statify can finish the PKCE handshake.',
        badges: ['Configuration pending', 'Follow the steps below'],
        footnote: 'Once saved, reload to continue.',
        showLoginButton: false,
      };
    }

    if (status === 'checking-session') {
      return {
        title: 'Validating your Spotify session',
        description: 'Hang tight while we refresh your access token.',
        badges: ['Secure OAuth in progress'],
        showLoginButton: false,
      };
    }

    if (status === 'needs-login') {
      return {
        title: 'Plug into Spotify',
        description:
          'Authorize Statify to spin up your personal listening zine with playlists, stats, and recent spins.',
        badges: ['Scopes: playlists + stats', 'Tokens live in your browser'],
        footnote: 'No backend storage — everything stays local.',
        errorMessage: loginErrorMessage,
        showLoginButton: true,
      };
    }

    if (status === 'ready') {
      return {
        title: `Welcome back, ${profile?.display_name || 'listener'}!`,
        description: `Curating ${selectedRangeLabel} of your listening history with fresh syncs on demand.`,
        badges: [
          `Window: ${selectedRangeLabel}`,
          lastUpdated ? `Synced: ${formatTimestamp(lastUpdated)}` : 'Sync pending',
        ],
        footnote: 'Scroll for dashboards, playlist export, and recent spins.',
        showLoginButton: false,
      };
    }

      return {
        title: 'Statify is warming up',
        description: 'Fetching your account context.',
        badges: ['Please wait…'],
        showLoginButton: false,
      };
  }, [configReady, lastUpdated, loginErrorMessage, profile?.display_name, selectedRangeLabel, status]);

  const heroBadges = heroContent.badges?.length ? (
    <div className="y2k-hero__badges">
      {heroContent.badges.map((badge) => (
        <span key={badge} className="pixel-pill">
          {badge}
        </span>
      ))}
    </div>
  ) : null;

  const heroFootnote = heroContent.footnote ? (
    <p className="y2k-hero__footnote muted">{heroContent.footnote}</p>
  ) : null;

  const heroAction = heroContent.showLoginButton ? (
    <button className="button y2k-hero__cta" onClick={initiateSpotifyLogin}>
      Connect Spotify
    </button>
  ) : null;

  const heroError = heroContent.errorMessage ? (
    <p className="y2k-hero__error error">{heroContent.errorMessage}</p>
  ) : null;

  const renderContent = useMemo(() => {
    // The UI below is grouped by auth state. Rearrange or add sections to change the layout for each state.
    if (!configReady) {
      return (
        <section className="card">
          {/* Change this panel to adjust the pre-auth instructions layout. Swap the <pre> for your own component if desired. */}
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
      return null;
    }

    if (status === 'ready') {
      return (
        <>
          {/* Profile header. To move it elsewhere, lift this component or swap the surrounding fragment order. */}
          <ProfileCard
            profile={profile}
            followerLabel={numberFormatter.format(profile?.followers?.total || 0)}
            onLogout={handleLogout}
          />

          <section className="card command-center">
            {/* Filter bar. Add new toggles or controls here to change data queries or layout behavior. */}
            <div className="command-center__intro">
              <div>
                <p className="muted">Engagement window</p>
                <h3>Controls</h3>
              </div>
            </div>
            <div className="command-center__filters">
              <div>
                <p className="muted">Time range</p>
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
              <div>
                <p className="muted">Result depth</p>
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
            </div>
            <div className="command-center__status">
              <span
                className={`status-chip ${
                  loadingStats ? 'is-syncing' : 'is-online'
                }`}
              >
                {loadingStats ? 'Refreshing data' : 'Data up to date'}
              </span>
              <p className="muted">
                {lastUpdated
                  ? `Last sync ${formatTimestamp(lastUpdated)}`
                  : 'Waiting for first sync'}
              </p>
              <button
                className="button button--ghost command-center__refresh"
                onClick={handleRefresh}
                disabled={loadingStats}
              >
                Refresh insights
              </button>
              <button
                className="button command-center__playlist"
                onClick={handleCreatePlaylist}
                disabled={playlistCreating || !stats.topTracks.length}
              >
                {playlistCreating ? 'Syncing…' : 'Save as playlist'}
              </button>
            </div>
            {loadingStats && (
              <p className="muted muted--inline">Fetching fresh insights…</p>
            )}
            {statsError && <p className="error">{statsError}</p>}
            {playlistFeedback && (
              <p
                className={`playlist-feedback ${
                  playlistFeedback.status === 'error' ? 'is-error' : 'is-success'
                }`}
              >
                {playlistFeedback.message}
                {playlistFeedback.name && ` — ${playlistFeedback.name}`}
                {playlistFeedback.url && (
                  <>
                    {' '}
                    <a
                      href={playlistFeedback.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open on Spotify
                    </a>
                  </>
                )}
              </p>
            )}
          </section>

          {!!summaryMetrics.length && (
            <MetricHighlights metrics={summaryMetrics} />
          )}

          <section className="mosaic">
            <div className="mosaic__primary">
              <div className="mosaic__row">
                {/* Stats columns. Add/remove <StatsList> blocks to change the columns shown, or reorder them. */}
                <StatsList
                  title="Top Tracks"
                  iconLabel="TRK"
                  items={stats.topTracks}
                  renderItem={(track, index) => (
                    <StatRow
                      key={track.id}
                      rank={index + 1}
                      image={track.album?.images?.[2]?.url}
                      title={track.name}
                      subtitle={`${track.artists
                        .map((artist) => artist.name)
                        .join(', ')} • ${track.album?.name}`}
                      metricLabel="Popularity"
                      metricValue={
                        typeof track.popularity === 'number'
                          ? `${track.popularity}/100`
                          : null
                      }
                      externalUrl={track.external_urls?.spotify}
                    />
                  )}
                />
                <StatsList
                  title="Top Artists"
                  iconLabel="ART"
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
              </div>
              <StatsList
                title="Recently Played"
                iconLabel="REC"
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
            </div>
            <InsightsPanel insights={insights} loading={loadingStats} />
          </section>
        </>
      );
    }

    return null;
  }, [
    configReady,
    handleLogout,
    handleRefresh,
    insights,
    lastUpdated,
    profile,
    selectedRange,
    selectedLimit,
    stats,
    statsError,
    summaryMetrics,
    status,
    loadingStats,
    playlistCreating,
    playlistFeedback,
    handleCreatePlaylist,
  ]);

  return (
    <div className="app y2k-shell">
      <div className="y2k-floating y2k-floating--1" aria-hidden>
        <Heart className="y2k-floating__icon" />
      </div>
      <div className="y2k-floating y2k-floating--2" aria-hidden>
        <Star className="y2k-floating__icon" />
      </div>
      <div className="y2k-floating y2k-floating--3" aria-hidden>
        <Sparkles className="y2k-floating__icon" />
      </div>
      <div className="y2k-floating y2k-floating--4" aria-hidden>
        <Heart className="y2k-floating__icon" />
      </div>

      <section className="card y2k-hero pink-gingham scanlines crt-noise">
        <div className="myspace-title-bar y2k-hero__bar">
          <div className="y2k-hero__label">
            <Sparkles className="y2k-hero__label-icon" />
            <span>My Listening Profile</span>
          </div>
          <div className="y2k-hero__window">
            <span>_</span>
            <span>□</span>
            <span>×</span>
          </div>
        </div>
        <div className="y2k-hero__body">
          <div className="y2k-hero__hearts">
            <Heart className="y2k-hero__heart" />
            <Heart className="y2k-hero__heart" />
            <Heart className="y2k-hero__heart" />
          </div>
          <h1 className="y2k-hero__title">{heroContent.title}</h1>
          <p className="y2k-hero__desc">{heroContent.description}</p>
          {heroBadges}
          {heroAction}
          <div className="y2k-hero__status">
            <span className={`status-chip ${headerStatus.tone}`}>
              {headerStatus.label}
            </span>
            <p className="muted">{headerStatus.subline}</p>
          </div>
          {heroError}
          {heroFootnote}
        </div>
      </section>

      <div className="y2k-marquee">
        <div className="y2k-marquee__track">
          ★ Spotify data stories ★ Export playlists ★ Explore top artists ★ Monitor recently played ★
          Spotify data stories ★ Export playlists ★ Explore top artists ★ Monitor recently played ★
        </div>
      </div>

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

function formatTimestamp(date) {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

function capitalizeWords(value = '') {
  return value
    .split(' ')
    .map((word) =>
      word ? word.charAt(0).toUpperCase() + word.slice(1) : word
    )
    .join(' ');
}
