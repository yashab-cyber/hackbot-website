import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Academy",
  description: "Learn cybersecurity concepts, test your skills, and earn verifiable certificates.",
};

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
