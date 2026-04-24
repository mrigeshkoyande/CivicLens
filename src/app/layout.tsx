import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { ToastProvider } from "@/components/ui/toast";
import { AuthProvider } from "@/context/auth-context";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  weight: ["400", "500", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "CivicLens — Your Smart Civic Assistant",
  description: "Empowering citizens with AI-driven insights, verifiable news, and transparent political tracking.",
  keywords: ["India elections", "voter guide", "fact check", "civic AI", "democracy"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${publicSans.variable} font-sans bg-background text-on-background antialiased h-screen overflow-hidden flex selection:bg-primary-container selection:text-on-primary-container`}
      >
        <AuthProvider>
          <ToastProvider>
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 md:ml-64 h-full overflow-hidden">
              <Topbar />
              <main className="flex-1 overflow-y-auto w-full pb-16 md:pb-0">
                {children}
              </main>
            </div>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
