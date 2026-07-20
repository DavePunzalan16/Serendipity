import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wander - Discover Walks Together",
  description:
    "AI-curated walking routes with a social layer. Generate walks, share discoveries, and explore with friends.",
  icons: {
    icon: "/img/WandererIcon.png",
    apple: "/img/WandererIcon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang="en">
      <head>
        {/* Load fonts via CDN link tags — avoids build-time fetch issues */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@200..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
