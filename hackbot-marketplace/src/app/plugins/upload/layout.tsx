import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload Plugin",
  robots: { index: false, follow: false },
};

export default function UploadPluginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
