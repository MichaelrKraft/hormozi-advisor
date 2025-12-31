import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import PlausibleProvider from "next-plausible";
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
