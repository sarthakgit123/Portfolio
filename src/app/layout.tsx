import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { AmbientBackground } from "@/components/ui/ambient-background";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SocialRail } from "@/components/layout/SocialRail";
import { GreetingIntro } from "@/components/layout/GreetingIntro";
import { personal } from "@/data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${personal.name} — ${personal.role}`,
  description: personal.tagline,
  openGraph: {
    title: `${personal.name} — ${personal.role}`,
    description: personal.tagline,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">
        <a
          href="#about"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:text-black"
        >
          Skip to content
        </a>

        <AmbientBackground />

        <SmoothScroll>
          <GreetingIntro />
          <Header />
          <SocialRail />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
