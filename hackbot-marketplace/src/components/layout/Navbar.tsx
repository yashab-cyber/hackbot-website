"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Menu, X, LogOut, User, Upload, Package, Shield } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfileOpen(false);
  };

  const avatarUrl = user?.user_metadata?.avatar_url;
  const username = user?.user_metadata?.user_name || user?.email?.split("@")[0];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-hb-bg/95 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.5)]"
          : "bg-hb-bg/85 backdrop-blur-xl"
      } border-b border-hb-border`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-white hover:text-hb-accent transition-colors">
          <Image src="/images/logo.png" alt="HackBot" width={32} height={32} className="rounded-lg" />
          <span>
            Hack<span className="text-hb-accent">Bot</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/marketplace">Marketplace</NavLink>
          <NavLink href="/marketplace?featured=true">Top Starred</NavLink>
          <NavLink href="https://github.com/yashab-cyber/hackbot" external>
            GitHub
          </NavLink>
          <NavLink href="https://discord.gg/X2tgYHXYq" external>
            Discord
          </NavLink>
        </div>

        {/* Auth Section */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={username || "User"}
                    width={28}
                    height={28}
                    className="rounded-full border border-hb-border"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-hb-accent/20 border border-hb-accent/30 flex items-center justify-center text-xs text-hb-accent">
                    {username?.[0]?.toUpperCase()}
                  </div>
                )}
                <span className="text-sm text-gray-300">{username}</span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-hb-card border border-hb-border rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="p-3 border-b border-hb-border">
                    <p className="text-sm font-medium text-white">{username}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <div className="p-1">
                    <DropdownLink href="/dashboard" icon={<User size={16} />}>
                      Dashboard
                    </DropdownLink>
                    <DropdownLink href="/plugins/upload" icon={<Upload size={16} />}>
                      Upload Plugin
                    </DropdownLink>
                    <DropdownLink href="/dashboard" icon={<Package size={16} />}>
                      My Plugins
                    </DropdownLink>
                    {(username === "yashab-cyber") && (
                      <DropdownLink href="/admin" icon={<Shield size={16} />}>
                        Admin Dashboard
                      </DropdownLink>
                    )}
                  </div>
                  <div className="p-1 border-t border-hb-border">
                    <button
                      onClick={signOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={signIn}
              className="flex items-center gap-2 px-5 py-2 bg-white/5 border border-hb-border rounded-lg text-sm font-medium text-white hover:border-hb-accent/50 hover:text-hb-accent transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Sign in with GitHub
            </button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-gray-300 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-hb-bg/98 backdrop-blur-xl border-b border-hb-border">
          <div className="px-6 py-4 flex flex-col gap-2">
            <MobileLink href="/" onClick={() => setMenuOpen(false)}>Home</MobileLink>
            <MobileLink href="/marketplace" onClick={() => setMenuOpen(false)}>Marketplace</MobileLink>
            <MobileLink href="/marketplace?featured=true" onClick={() => setMenuOpen(false)}>Top Starred</MobileLink>
            {user ? (
              <>
                <MobileLink href="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</MobileLink>
                <MobileLink href="/plugins/upload" onClick={() => setMenuOpen(false)}>Upload Plugin</MobileLink>
                <button
                  onClick={() => { signOut(); setMenuOpen(false); }}
                  className="text-left px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg text-sm"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => { signIn(); setMenuOpen(false); }}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-hb-border rounded-lg text-sm text-white"
              >
                Sign in with GitHub
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const props = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  const Component = external ? "a" : Link;

  return (
    <Component
      href={href}
      className="px-3 py-2 text-sm font-medium text-gray-400 hover:text-hb-accent hover:bg-hb-accent/5 rounded-lg transition-all"
      {...props}
    >
      {children}
    </Component>
  );
}

function DropdownLink({
  href,
  children,
  icon,
}: {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 rounded-lg transition-colors"
    >
      {icon}
      {children}
    </Link>
  );
}

function MobileLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="px-4 py-2 text-sm text-gray-300 hover:text-hb-accent hover:bg-hb-accent/5 rounded-lg transition-all"
    >
      {children}
    </Link>
  );
}
