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

export const metadata: Metadata = {
  title: "HackBot — AI Cybersecurity Assistant & Plugin Marketplace",
  description:
    "Production-ready AI-powered pentesting assistant with autonomous Agent Mode, 10 AI providers, 30+ tool integrations, and a community plugin marketplace.",
  keywords: [
    "hackbot",
    "cybersecurity",
    "penetration testing",
    "AI",
    "plugins",
    "marketplace",
    "security tools",
  ],
  authors: [{ name: "Yashab Alam" }],
  openGraph: {
    title: "HackBot — AI Cybersecurity Assistant & Plugin Marketplace",
    description:
      "Production-ready AI-powered pentesting assistant with a community-driven plugin marketplace.",
    type: "website",
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
