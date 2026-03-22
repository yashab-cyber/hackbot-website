import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hackbot.yashab-cyber.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: "%s | HackBot",
    default: "HackBot — AI Cybersecurity Assistant & Plugin Marketplace",
  },
  description:
    "Discover the best cybersecurity tools and penetration testing tools with HackBot. An AI-powered assistant for ethical hacking, featuring a community marketplace with a comprehensive kali linux tools list to learn how to hack ethically.",
  keywords: [
    "ethical hacking tools",
    "best cybersecurity tools",
    "kali linux tools list",
    "how to hack ethically",
    "penetration testing tools",
    "OSINT tools",
    "vulnerability scanner",
    "bug bounty tools",
    "AI pentesting",
    "cybersecurity assistant",
    "hackbot",
    "hackbot 3.0",
    "hack bot ai",
  ],
  authors: [{ name: "Yashab Alam" }],
  openGraph: {
    title: "HackBot — AI Cybersecurity Assistant",
    description:
      "Discover the best cybersecurity tools and penetration testing tools with HackBot. An AI-powered assistant for ethical hacking, featuring a community marketplace with a comprehensive kali linux tools list to learn how to hack ethically.",
    url: siteUrl,
    siteName: "HackBot",
    images: [
      {
        url: "/images/logo.png",
        width: 800,
        height: 600,
        alt: "HackBot Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HackBot — AI Cybersecurity Assistant",
    description: "Discover the best cybersecurity tools and penetration testing tools with HackBot. An AI-powered assistant for ethical hacking, featuring a community marketplace with a comprehensive kali linux tools list to learn how to hack ethically.",
    images: ["/images/logo.png"],
    creator: "@yashab_cyber",
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans bg-hb-bg text-gray-200 antialiased">
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#131b2b",
              color: "#e0e6f0",
              border: "1px solid #1a2640",
              borderRadius: "12px",
              fontSize: "14px",
            },
          }}
        />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
