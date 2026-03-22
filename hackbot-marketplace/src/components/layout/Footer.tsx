import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-hb-border bg-hb-bg">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Image src="/images/logo.png" alt="HackBot" width={28} height={28} className="rounded-lg" />
              <span className="font-bold text-white">
                Hack<span className="text-hb-accent">Bot</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              AI-powered cybersecurity assistant with a plugin marketplace for
              the security community.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <div className="flex flex-col gap-2">
              <FooterLink href="/academy">HackBot Academy</FooterLink>
              <FooterLink href="/blog">HackBot Blog</FooterLink>
              <FooterLink href="/marketplace">Plugin Marketplace</FooterLink>
              <FooterLink href="/marketplace?category=scanner">Scanners</FooterLink>
              <FooterLink href="/marketplace?category=recon">Recon Tools</FooterLink>
              <FooterLink href="/marketplace?category=exploit">Exploits</FooterLink>
            </div>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Community</h4>
            <div className="flex flex-col gap-2">
              <FooterLink href="https://github.com/yashab-cyber/hackbot" external>
                GitHub
              </FooterLink>
              <FooterLink href="https://discord.gg/X2tgYHXYq" external>
                Discord
              </FooterLink>
              <FooterLink href="/donate">Donate</FooterLink>
              <FooterLink href="https://github.com/yashab-cyber/hackbot/issues" external>
                Report Bug
              </FooterLink>
              <FooterLink href="/plugins/upload">Upload Plugin</FooterLink>
            </div>
          </div>

          {/* About */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">About</h4>
            <div className="flex flex-col gap-2">
              <FooterLink href="https://github.com/yashab-cyber" external>
                Yashab Alam
              </FooterLink>
              <FooterLink href="mailto:yashabalam707@gmail.com" external>
                Contact
              </FooterLink>
              <FooterLink href="https://github.com/yashab-cyber/hackbot/blob/main/LICENSE" external>
                MIT License
              </FooterLink>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-hb-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Yashab Alam. Built for ethical
            hackers, by ethical hackers.
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <span>Powered by</span>
            <span className="text-hb-accent font-medium">Next.js</span>
            <span>+</span>
            <span className="text-hb-accent font-medium">Three.js</span>
            <span>+</span>
            <span className="text-hb-accent font-medium">Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-gray-500 hover:text-hb-accent transition-colors"
      >
        {children}
      </a>
    );
  }
  return (
    <Link
      href={href}
      className="text-sm text-gray-500 hover:text-hb-accent transition-colors"
    >
      {children}
    </Link>
  );
}
