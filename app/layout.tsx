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

const siteUrl = "https://www.rideright.ke";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RideRight | Premium Cars for Sale in Kenya",
    template: "%s | RideRight",
  },
  description:
    "RideRight Autos Ltd - Your trusted partner for premium vehicles in Kenya. We offer end-to-end vehicle import services, locally used cars, and expert consultation. Import on behalf, foreign used cars, and ready stock available.",
  keywords: [
    "cars for sale Kenya",
    "import cars Kenya",
    "Toyota Kenya",
    "used cars Nairobi",
    "car dealers Kenya",
    "vehicle importation Kenya",
    "RideRight Autos",
    "buy car Kenya",
    "foreign used cars",
    "locally used cars",
  ],
  authors: [{ name: "RideRight Autos Ltd" }],
  creator: "RideRight Autos Ltd",
  publisher: "RideRight Autos Ltd",
  icons: {
    icon: "/loggo.png",
    apple: "/loggo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: siteUrl,
    siteName: "RideRight",
    title: "RideRight | Premium Cars for Sale in Kenya",
    description:
      "Your trusted partner for premium vehicles in Kenya. End-to-end vehicle import services, locally used cars, and expert consultation.",
    images: [
      {
        url: "/loggo.png",
        width: 1280,
        height: 872,
        alt: "RideRight Autos - Premium Cars in Kenya",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RideRight | Premium Cars for Sale in Kenya",
    description:
      "Your trusted partner for premium vehicles in Kenya. End-to-end vehicle import services and ready stock available.",
    images: ["/loggo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code here when you have it
    // google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
