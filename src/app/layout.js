import './globals.css'; // Path to src/app/globals.css (same directory)

export const metadata = {
  title: 'Yoga Serenity',
  description: 'Find peace and balance with our yoga classes',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Roboto:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-cultured text-jet-black">{children}</body>
    </html>
  );
}