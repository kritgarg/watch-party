import './globals.css';

export const metadata = {
  title: 'Watch Party',
  description: 'Phase 1 - Watch Party System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
