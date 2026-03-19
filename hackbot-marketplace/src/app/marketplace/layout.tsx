import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plugin Marketplace",
  description: "Discover, download, and share HackBot plugins built by the security community.",
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
