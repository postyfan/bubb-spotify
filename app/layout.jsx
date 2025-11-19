import './globals.css';
import './styles/dashboard.css';

export const metadata = {
  title: 'Spotify Stats',
  description:
    'Personal top tracks, artists, and listening stats powered by the Spotify Web API.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
