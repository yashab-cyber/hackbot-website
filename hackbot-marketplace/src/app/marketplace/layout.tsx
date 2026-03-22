import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plugin Marketplace - Security Tools",
  description: "Discover, download, and share the best cybersecurity tools and penetration testing tools built by the community.",
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
