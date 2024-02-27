import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import TopBar from "@/components/shared/TopBar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";
import BottomBar from "@/components/shared/BottomMobileBar";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ScrollToTopIndicator from "@/components/shared/ScrollToTopIndicator";

const inter = Inter({ subsets: ["latin"] });

// SEO optimization
export const metadata = {
  title: "Threadsy",
  description: "A Next.js Meta Threads web application clone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      {/**
       <SpeedInsights />
       */}
      <html lang="en">
        <body className={inter.className}>
          <div className="gradient-line"></div>
          <TopBar />
          <main className="flex flex-row">
            <LeftSidebar />
            <section className="main-container">
              <div className="w-full max-w-4xl">{children}</div>
            </section>
            <RightSidebar />
          </main>
          <BottomBar />
          <div className="max-xl:hidden">
            <ScrollToTopIndicator />
          </div>
          {/* Gradient background */}
          <div className="gradient-background__wrapper">
            <div className="gradient-background">
              <div className="gradient-background__shape gradient-background__shape--1"></div>
              <div className="gradient-background__shape gradient-background__shape--2"></div>
            </div>
            <div className="gradient-background__noise"></div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
