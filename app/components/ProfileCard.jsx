'use client';

// Shows the signed-in Spotify user's avatar and quick metadata with a sign-out button.
// Layout tweaks: wrap the section in your own container, swap the avatar/title stack, or move the logout button.
export default function ProfileCard({ profile, onLogout, followerLabel }) {
  return (
    <section className="card profile-card">
      <div className="profile">
        <ProfileAvatar profile={profile} />
        <div>
          <p className="muted">Logged in as</p>
          <h2>{profile?.display_name}</h2>
          <p className="muted">
            Followers: {followerLabel}
          </p>
        </div>
      </div>
      <button className="button button--ghost" onClick={onLogout}>
        Sign out
      </button>
    </section>
  );
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
