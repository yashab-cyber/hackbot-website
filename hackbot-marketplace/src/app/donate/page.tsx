import { Star, MessageSquare, Mail, Heart } from "lucide-react";

export const metadata = {
  title: "Donate - HackBot",
  description: "Support the development of HackBot",
};

export default function DonatePage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-6 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-hb-accent/20 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-3xl w-full relative z-10">
        <div className="bg-hb-card/80 backdrop-blur-xl border border-hb-accent/20 p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden group">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-hb-accent to-transparent opacity-50" />
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-hb-accent/10 border border-hb-accent/30 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-hb-accent" />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center mb-6">
            Support <span className="text-hb-accent">HackBot</span>
          </h1>
          
          <div className="space-y-4 text-center text-gray-300 md:text-lg max-w-2xl mx-auto mb-10">
            <p>
              HackBot is free & open-source. If it has helped you, please consider supporting its development!
            </p>
            <p>
              Donations help cover infrastructure, development, documentation, and keeping HackBot free for everyone.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://github.com/yashab-cyber/hackbot"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-hb-accent hover:bg-hb-accent-hover text-white rounded-xl font-medium transition-colors shadow-lg shadow-hb-accent/20"
            >
              <Star className="w-5 h-5" />
              Star on GitHub
            </a>
            
            <a
              href="https://discord.gg/X2tgYHXYq"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#5865F2]/10 hover:bg-[#5865F2]/20 border border-[#5865F2]/30 text-[#5865F2] hover:text-white rounded-xl font-medium transition-colors flex-shrink-0"
            >
              <MessageSquare className="w-5 h-5" />
              Join Discord
            </a>
            
            <a
              href="mailto:yashabalam707@gmail.com"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-medium transition-colors"
            >
              <Mail className="w-5 h-5" />
              Contact Form
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
