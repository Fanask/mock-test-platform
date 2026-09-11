import './globals.css';

export const metadata = {
  title: 'Online Mock Test Platform',
  description: 'WBP, Upper Primary, Police and competitive examination mock tests.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
