import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Sidebar, MobileNav } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export const metadata: Metadata = {
  title: {
    default: "CivicLens — JanVote AI: Smart Civic Assistant for India",
    template: "%s | CivicLens",
  },
  description:
    "India's most trusted AI-powered election guide. Understand candidates, find your polling booth, detect fake news, and vote with confidence.",
  keywords: [
    "India elections",
    "voter guide",
    "Lok Sabha",
    "AI civic assistant",
    "fact check",
    "polling booth",
    "JanVote",
  ],
  authors: [{ name: "CivicLens" }],
  openGraph: {
    title: "CivicLens — JanVote AI",
    description: "Your Smart Civic Assistant for India's Elections",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans bg-[#09090b] text-[#fafafa] antialiased`}
      >
        {/* Sidebar */}
        <Sidebar />

        {/* Topbar */}
        <Topbar civicScore={850} />

        {/* Main content */}
        <main className="md:ml-[200px] mt-14 min-h-[calc(100vh-3.5rem)] pb-20 md:pb-0">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <MobileNav />
      </body>
    </html>
  );
}
