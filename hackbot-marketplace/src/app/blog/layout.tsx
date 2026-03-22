import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Hacker Tutorials",
  description: "Read the latest tutorials on how to hack ethically, penetration testing tools, and ethical hacking tools curated by HackBot.",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
