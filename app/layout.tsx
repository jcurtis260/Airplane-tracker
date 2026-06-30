import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Airplane Tracker - Real-Time Flight Tracking",
    template: "%s | Airplane Tracker",
  },
  description: "Track airplanes flying overhead in real-time. View detailed flight information with interactive 2D and 3D maps powered by live ADS-B data.",
  keywords: ["airplane tracking", "flight tracker", "ADS-B", "live flights", "aircraft", "aviation"],
  authors: [{ name: "Airplane Tracker" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Airplane Tracker",
    title: "Airplane Tracker - Real-Time Flight Tracking",
    description: "Track airplanes flying overhead in real-time with interactive 2D and 3D maps.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
