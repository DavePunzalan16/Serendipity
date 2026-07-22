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
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@200..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background font-body text-white antialiased">
        {children}
      </body>
    </html>
  );
}
