import type { Metadata } from "next";
import { Info, Target, Eye, ShieldAlert, Award, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about HackBot, our mission, our values, and the team behind the AI cybersecurity assistant and plugin marketplace.",
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-6 bg-hb-bg relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-hb-accent/5 rounded-full blur-[120px] pointer-events-none z-0" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-hb-card/50 backdrop-blur-xl border border-hb-border p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
          {/* Top subtle glow line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-hb-accent to-transparent opacity-40" />
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-hb-accent/10 border border-hb-accent/20 rounded-xl flex items-center justify-center">
              <Info className="w-6 h-6 text-hb-accent" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                About <span className="text-hb-accent">HackBot</span>
              </h1>
              <p className="text-xs text-gray-500 mt-1">Empowering the Cybersecurity Community</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none text-gray-300 space-y-8 text-sm md:text-base leading-relaxed">
            <p className="text-lg text-gray-200">
              <strong>HackBot</strong> is an advanced, AI-powered cybersecurity assistant and community plugin marketplace built by ethical hackers, for ethical hackers.
            </p>

            <p>
              In modern cybersecurity, security analysts, bug hunters, and network administrators face a fragmented landscape. Tools are spread across thousands of GitHub repositories, command lines are complex, and documentation is often scattered. We created HackBot to unify these workflows, providing a smart assistant to guide researchers and a structured, community-vetted marketplace to discover, share, and launch pentesting plugins.
            </p>

            <hr className="border-hb-border my-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
              {/* Card 1 */}
              <div className="bg-hb-card/85 border border-hb-border p-6 rounded-2xl">
                <h3 className="text-white font-semibold text-lg mb-2 flex items-center gap-2">
                  <Target className="w-5 h-5 text-hb-accent" /> Our Mission
                </h3>
                <p className="text-sm text-gray-400">
                  To democratize access to cybersecurity knowledge and tools. We believe that by making security auditing accessible, we can help developers, administrators, and students defend their infrastructures more effectively.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-hb-card/85 border border-hb-border p-6 rounded-2xl">
                <h3 className="text-white font-semibold text-lg mb-2 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-hb-accent" /> Our Vision
                </h3>
                <p className="text-sm text-gray-400">
                  To become the primary dashboard for ethical hackers, bridging the gap between artificial intelligence guidance and raw command-line tools in a safe, community-governed environment.
                </p>
              </div>
            </div>

            {/* Principles */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Our Core Principles</h2>
              
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-hb-accent" /> 1. Ethics and Responsibility
                </h3>
                <p>
                  Security research is crucial for defending networks, but it must be done ethically. We encourage responsible disclosure, system owner authorization, and strict compliance with local laws.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-hb-accent" /> 2. Community & Open Source
                </h3>
                <p>
                  HackBot thrives on community input. From open-source contributions on GitHub to security tools listed in our marketplace, we believe collaboration is the key to building robust defense mechanisms.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-hb-accent" /> 3. Quality & Security
                </h3>
                <p>
                  We aim to maintain a high-quality list of verified plugins. We vet submissions to filter out malicious files, ensuring a secure repository of pen-testing utilities for cybersecurity researchers.
                </p>
              </div>
            </div>

            <hr className="border-hb-border my-6" />

            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white">Meet the Developer</h2>
              <p>
                HackBot is created and maintained by <strong>Yashab Alam</strong>, a cybersecurity researcher and full-stack developer dedicated to building secure, efficient, and open tools for the community.
              </p>
              <p>
                Interested in contributing or partner opportunities? Drop an email at <a href="mailto:yashabalam707@gmail.com" className="text-hb-accent hover:underline">yashabalam707@gmail.com</a> or connect on GitHub.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
