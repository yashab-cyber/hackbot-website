"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to HackBot to view your dashboard, plugins, and academy courses.",
};

function LoginContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  
  useEffect(() => {
    if (searchParams.get("from") === "academy") {
      toast.error("want to go in academy login or sign up first", {
        duration: 4000,
        position: 'top-center',
      });
    }
  }, [searchParams]);

  const signIn = async () => {
    setLoading(true);
    const nextUrl = searchParams.get("next") || "/";
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextUrl)}`,
      },
    });
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 flex items-center justify-center">
      <div className="bg-hb-card border border-hb-border rounded-2xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-hb-accent/10 blur-[50px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 blur-[50px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 w-full flex flex-col items-center">
          <Image src="/images/logo.png" alt="HackBot logo" width={64} height={64} className="rounded-2xl mb-6 shadow-lg" />
          
          <h1 className="text-2xl font-bold text-white mb-2">Sign in to HackBot</h1>
          <p className="text-gray-400 mb-8 max-w-sm">
            Sign in to access your dashboard, discover plugins, and learn at HackBot Academy.
          </p>

          <button
            onClick={signIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white/5 border border-hb-border hover:border-hb-accent/50 hover:bg-white/10 rounded-xl text-white font-medium transition-all group disabled:opacity-50"
          >
            <svg className="w-5 h-5 group-hover:text-hb-accent transition-colors" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            {loading ? "Signing in..." : "Sign in with GitHub"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-hb-accent border-t-transparent animate-spin"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
