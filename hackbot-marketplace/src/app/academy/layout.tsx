import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Academy - Learn Ethical Hacking",
  description: "Learn how to hack ethically, master penetration testing tools, and earn verifiable certificates in cybersecurity.",
};

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
