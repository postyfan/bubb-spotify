'use client';

// Renders a card full of stat rows (tracks, artists, or recently played).
// Layout tweaks: change the wrapper className, add a header toolbar, or replace <ul> with your own grid.
export default function StatsList({ title, items, renderItem }) {
  return (
    <article className="card">
      <div className="section-header">
        <div>
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
