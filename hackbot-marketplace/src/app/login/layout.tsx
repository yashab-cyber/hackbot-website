import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to HackBot to view your dashboard, plugins, and academy courses.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
