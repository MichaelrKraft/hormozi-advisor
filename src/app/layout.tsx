import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import PlausibleProvider from "next-plausible";
import Script from "next/script";
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
  title: "Hormozi Advisor - AI Business Advice",
  description: "Get business advice using the frameworks from $100M Offers and $100M Leads by Alex Hormozi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <PlausibleProvider
          domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || ""}
          enabled={!!process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
        />
        <link rel="stylesheet" href="http://localhost:3006/leadspot-voice-widget.css" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Script
          src="http://localhost:3006/leadspot-voice-widget.umd.js"
          data-leadspot-agent="cmjw5nkjr0001r1wvtmslef50"
          data-leadspot-api="http://localhost:3005"
          data-leadspot-glow-color="#00fbff"
          data-leadspot-button-shape="orb"
          data-leadspot-button-size="50"
          data-leadspot-glow-intensity="strong"
          data-leadspot-button-icon="chat"
          data-leadspot-brand="Test Widget Agent"
          data-leadspot-minimal-ui="true"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
