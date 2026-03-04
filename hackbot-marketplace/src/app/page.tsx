"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRef } from "react";
import {
  Bot, MessageSquare, ClipboardList, Monitor, Shield, Globe,
  Map, FileCheck, GitCompare, Target, Puzzle, Wrench, Plug,
  Brain, Earth, BarChart3, ShieldCheck, Settings,
  Download, Star, ArrowRight, Zap, Terminal, ChevronRight,
  Sparkles, Cpu, Lock, Code2, Layers, Eye, Copy,
} from "lucide-react";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-hb-bg" />,
});

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: "easeOut" },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const slideLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const slideRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const features = [
  { icon: Bot, title: "Agent Mode", desc: "Autonomous pentesting — runs real security tools, analyzes results, adapts strategy in real-time.", color: "from-green-500/20 to-emerald-500/20" },
  { icon: MessageSquare, title: "Chat Mode", desc: "Interactive cybersecurity Q&A with streaming responses and conversation memory.", color: "from-cyan-500/20 to-blue-500/20" },
  { icon: ClipboardList, title: "Planning Mode", desc: "Generates structured pentest plans, checklists, and attack methodologies with 8 templates.", color: "from-yellow-500/20 to-amber-500/20" },
  { icon: Monitor, title: "Native Desktop GUI", desc: "Full-featured graphical interface with dark theme, powered by Flask + pywebview.", color: "from-purple-500/20 to-violet-500/20" },
  { icon: Shield, title: "CVE / Exploit Lookup", desc: "Real-time CVE search against NVD, exploit PoC discovery via GitHub, nmap→CVE auto-mapping.", color: "from-red-500/20 to-rose-500/20" },
  { icon: Globe, title: "OSINT Module", desc: "Subdomain enumeration, DNS recon, WHOIS, email harvesting, tech stack fingerprinting.", color: "from-sky-500/20 to-cyan-500/20" },
  { icon: Map, title: "Network Topology", desc: "Interactive D3.js force-directed graph from nmap/masscan output with subnet grouping.", color: "from-teal-500/20 to-emerald-500/20" },
  { icon: FileCheck, title: "Compliance Mapping", desc: "Auto-map findings to PCI DSS v4.0, NIST 800-53, OWASP Top 10, ISO 27001.", color: "from-indigo-500/20 to-blue-500/20" },
  { icon: GitCompare, title: "Diff Reports", desc: "Compare assessments — see new, fixed, and persistent vulnerabilities at a glance.", color: "from-orange-500/20 to-amber-500/20" },
  { icon: Target, title: "Multi-Target Campaigns", desc: "Coordinated assessments across multiple hosts with cross-target intelligence sharing.", color: "from-red-500/20 to-pink-500/20" },
  { icon: Puzzle, title: "Custom Plugins", desc: "Python plugin system — register your own scripts as agent-callable tools.", color: "from-fuchsia-500/20 to-purple-500/20" },
  { icon: Wrench, title: "AI Remediation", desc: "Auto-generate fix commands, config patches, and code snippets for each finding.", color: "from-lime-500/20 to-green-500/20" },
  { icon: Plug, title: "HTTP Proxy", desc: "Built-in intercepting proxy for capturing, inspecting, replaying, and flagging web traffic.", color: "from-blue-500/20 to-indigo-500/20" },
  { icon: Brain, title: "Memory & Sessions", desc: "Auto-save conversations, session history, continue truncated responses, conversation summarization.", color: "from-violet-500/20 to-fuchsia-500/20" },
  { icon: Earth, title: "10 AI Providers", desc: "OpenAI, Anthropic, Gemini, Groq, Mistral, DeepSeek, Together AI, OpenRouter, Ollama, Local.", color: "from-emerald-500/20 to-teal-500/20" },
  { icon: BarChart3, title: "Auto Reporting", desc: "HTML, Markdown, JSON, and professional PDF reports with executive summary and charts.", color: "from-pink-500/20 to-rose-500/20" },
  { icon: ShieldCheck, title: "Safe Mode", desc: "Command validation, blocked dangerous commands, risky-command confirmation prompts.", color: "from-amber-500/20 to-yellow-500/20" },
  { icon: Settings, title: "30+ Tool Integrations", desc: "nmap, nikto, sqlmap, nuclei, ffuf, subfinder, hydra, gobuster, and many more.", color: "from-slate-400/20 to-gray-500/20" },
];

const modes = [
  {
    icon: "🤖",
    title: "Agent Mode",
    tag: "Autonomous",
    color: "border-hb-agent bg-hb-agent/5",
    tagColor: "bg-hb-agent/15 text-hb-agent",
    glowColor: "hover:shadow-[0_0_40px_rgba(255,107,107,0.15)]",
    desc: "Autonomously plans assessments, executes real security tools, analyzes output, adapts strategy, tracks findings, and generates reports.",
    items: ["Plans structured methodology", "Executes nmap, nikto, nuclei, etc.", "Analyzes output & determines next steps", "Tracks findings with severity ratings", "Generates PDF reports automatically"],
    cmd: "hackbot agent scanme.nmap.org",
  },
  {
    icon: "💬",
    title: "Chat Mode",
    tag: "Interactive",
    color: "border-hb-chat bg-hb-chat/5",
    tagColor: "bg-hb-chat/15 text-hb-chat",
    glowColor: "hover:shadow-[0_0_40px_rgba(78,205,196,0.15)]",
    desc: "Interactive AI chat with deep cybersecurity knowledge, streaming responses, and conversation memory.",
    items: ["Streaming AI responses", "Auto-save conversations", "Continue truncated responses", "SQL injection, XSS, reverse shells", "CTF challenges & bug bounty tips"],
    cmd: "hackbot",
  },
  {
    icon: "📋",
    title: "Planning Mode",
    tag: "Strategic",
    color: "border-hb-plan bg-hb-plan/5",
    tagColor: "bg-hb-plan/15 text-hb-plan",
    glowColor: "hover:shadow-[0_0_40px_rgba(255,230,109,0.15)]",
    desc: "Generate structured pentest plans with methodology, tools, and timelines. 8 built-in templates.",
    items: ["Web Application Pentest", "Network Penetration Test", "API Security Assessment", "Cloud Security Audit", "Red Team Engagement"],
    cmd: 'hackbot plan example.com --type web_pentest',
  },
];

const providers = [
  { name: "OpenAI", desc: "GPT-5.2, GPT-4o, o3-mini", icon: "🧠" },
  { name: "Anthropic", desc: "Claude Opus 4.6, Sonnet 4", icon: "🔮" },
  { name: "Google Gemini", desc: "Gemini 3 Pro, 2.5 Pro", icon: "💎" },
  { name: "Groq", desc: "LLaMA 3.3 70B, ultra-fast", icon: "⚡" },
  { name: "Mistral AI", desc: "Mistral Large 2, Codestral", icon: "🌬️" },
  { name: "DeepSeek", desc: "DeepSeek V3, R1 reasoning", icon: "🔍" },
  { name: "Together AI", desc: "LLaMA 3.1 405B, Qwen 2.5", icon: "🤝" },
  { name: "OpenRouter", desc: "All models, one API key", icon: "🔀" },
  { name: "Ollama", desc: "100% local, no API key", icon: "🏠", highlight: true },
  { name: "Local / Custom", desc: "Any OpenAI-compatible server", icon: "🖥️" },
];

const stats = [
  { value: "30+", label: "Security Tools", icon: Wrench },
  { value: "10", label: "AI Providers", icon: Cpu },
  { value: "384", label: "Tests Passing", icon: ShieldCheck },
  { value: "MIT", label: "Open Source", icon: Lock },
];

export default function HomePage() {
  return (
    <>
      {/* ═══ Hero ═══ */}
      <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden">
        <HeroScene />
        <div className="bg-grid absolute inset-0 opacity-30 pointer-events-none" style={{ maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, #000 20%, transparent 100%)" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-hb-bg pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          {/* Logo */}
          <motion.div initial={{ opacity: 0, scale: 0.5, rotate: -10 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.7, type: "spring", stiffness: 100 }}>
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="absolute inset-0 bg-hb-accent/20 rounded-2xl blur-2xl animate-glow-pulse" />
              <div className="relative w-32 h-32 rounded-2xl bg-hb-accent/10 border border-hb-accent/30 flex items-center justify-center shadow-[0_0_80px_rgba(0,255,136,0.2)] animate-float overflow-hidden">
                <Image
                  src="/images/logo.png"
                  alt="HackBot Logo"
                  width={96}
                  height={96}
                  className="drop-shadow-[0_0_15px_rgba(0,255,136,0.5)]"
                  priority
                />
              </div>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="text-6xl sm:text-8xl font-black tracking-tighter mb-3">
            <span className="glitch-text">Hack</span><span className="text-hb-accent neon-text">Bot</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }} className="text-xl sm:text-2xl font-light mb-5">
            <span className="gradient-text font-semibold">AI Cybersecurity Assistant</span>
          </motion.p>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="max-w-2xl mx-auto text-gray-400 text-lg leading-relaxed mb-8">
            Production-ready AI-powered pentesting assistant with autonomous Agent Mode, native desktop GUI, 10 AI providers, 30+ security tool integrations, and a community plugin marketplace.
          </motion.p>

          {/* Stats bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.5 }} className="flex justify-center flex-wrap gap-4 sm:gap-6 mb-8">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-2 px-4 py-2 bg-hb-card/80 border border-hb-border rounded-xl backdrop-blur-sm">
                <s.icon size={16} className="text-hb-accent" />
                <span className="text-white font-bold text-sm">{s.value}</span>
                <span className="text-gray-500 text-xs">{s.label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.5 }} className="flex justify-center flex-wrap gap-3 mb-8">
            {["Python 3.9+", "MIT License", "Cross-Platform", "Plugin System"].map((b) => (
              <span key={b} className="px-4 py-1.5 bg-hb-card/60 border border-hb-border/60 rounded-full text-xs text-gray-400 font-medium backdrop-blur-sm hover:border-hb-accent/30 hover:text-hb-accent transition-all cursor-default">{b}</span>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }} className="flex justify-center flex-wrap gap-4 mb-14">
            <Link href="/marketplace" className="group px-8 py-4 bg-hb-accent text-hb-bg font-bold rounded-xl hover:shadow-[0_0_50px_rgba(0,255,136,0.35)] transition-all text-sm flex items-center gap-2 relative overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                <Puzzle size={18} /> Plugin Marketplace <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <a href="https://github.com/yashab-cyber/hackbot" target="_blank" rel="noopener" className="px-8 py-4 border border-hb-accent/50 text-hb-accent font-semibold rounded-xl hover:bg-hb-accent/10 hover:border-hb-accent transition-all text-sm flex items-center gap-2">
              <Star size={18} /> View on GitHub
            </a>
            <a href="https://discord.gg/X2tgYHXYq" target="_blank" rel="noopener" className="px-8 py-4 bg-hb-discord/90 text-white font-semibold rounded-xl hover:bg-hb-discord hover:shadow-[0_0_30px_rgba(88,101,242,0.35)] transition-all text-sm">
              Join Discord
            </a>
          </motion.div>

          {/* Terminal */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }} className="max-w-2xl mx-auto rounded-xl overflow-hidden border border-hb-border shadow-[0_20px_60px_rgba(0,0,0,0.5)] text-left animate-border-glow">
            <div className="flex items-center gap-2 px-4 py-3 bg-[#1a2030] border-b border-hb-border/50">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-[0_0_8px_rgba(255,95,86,0.5)]" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-[0_0_8px_rgba(255,189,46,0.5)]" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f] shadow-[0_0_8px_rgba(39,201,63,0.5)]" />
              <span className="ml-3 font-mono text-[11px] text-gray-500 flex items-center gap-1.5">
                <Terminal size={12} /> hackbot — bash
              </span>
            </div>
            <div className="p-5 bg-hb-terminal font-mono text-sm leading-7 overflow-x-auto">
              <p><span className="text-hb-accent font-bold">$</span> hackbot agent scanme.nmap.org</p>
              <p className="text-hb-chat">⚡ HackBot v1.0.1 | AI Cybersecurity Assistant</p>
              <p className="text-hb-chat">🤖 Agent Mode — Autonomous security testing</p>
              <p className="mt-2"><span className="text-hb-accent font-semibold">Phase 1: Reconnaissance</span></p>
              <p className="text-gray-500">▶ Executing: nmap -sV -sC scanme.nmap.org</p>
              <p className="mt-2 text-[#27c93f] font-semibold">◀ nmap SUCCESS <span className="text-gray-500 font-normal">(exit=0, 32.1s)</span></p>
              <p className="text-gray-500">PORT     STATE SERVICE VERSION</p>
              <p className="text-gray-400">22/tcp   open  ssh     OpenSSH 6.6</p>
              <p className="text-gray-400">80/tcp   open  http    Apache 2.4.7</p>
              <p className="mt-2"><span className="text-hb-plan">🔍 [Info] Open SSH Service Detected</span></p>
              <p className="text-hb-accent font-semibold mt-2">Phase 2: Web Application Scanning<span className="cursor-blink" /></p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ Screenshot Showcase ═══ */}
      <section className="py-24 bg-hb-bg relative overflow-hidden">
        <div className="bg-dots absolute inset-0 opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
            <motion.h2 variants={fadeUp} custom={0} className="text-4xl sm:text-5xl font-bold text-center mb-3">
              See HackBot in <span className="text-hb-accent neon-text">Action</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-center text-gray-400 max-w-xl mx-auto mb-16">
              Native desktop GUI, terminal CLI, and comprehensive settings — built for security professionals.
            </motion.p>
          </motion.div>

          {/* GUI Screenshot - Large */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-16">
            <motion.div variants={scaleIn} className="relative max-w-4xl mx-auto">
              <div className="absolute -inset-4 bg-gradient-to-r from-hb-accent/20 via-blue-500/20 to-purple-500/20 rounded-2xl blur-2xl opacity-50" />
              <div className="screenshot-frame relative">
                <div className="flex items-center gap-2 px-4 py-3 bg-[#1a2030] border-b border-hb-border/50">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  <span className="ml-3 text-xs text-gray-500 flex items-center gap-1.5">
                    <Monitor size={12} /> HackBot — Desktop GUI
                  </span>
                </div>
                <Image
                  src="/images/screenshots/hackbot-gui-view.png"
                  alt="HackBot GUI Interface"
                  width={1200}
                  height={700}
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-5 py-2 bg-hb-card border border-hb-accent/30 rounded-full text-xs text-hb-accent font-medium shadow-lg">
                <Monitor size={14} className="inline mr-1.5" />
                Native Desktop GUI — Dark cybersecurity theme
              </div>
            </motion.div>
          </motion.div>

          {/* CLI + Settings side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.div variants={slideLeft} className="relative">
                <div className="absolute -inset-3 bg-gradient-to-r from-hb-accent/15 to-cyan-500/15 rounded-2xl blur-xl opacity-40" />
                <div className="screenshot-frame relative">
                  <div className="flex items-center gap-2 px-4 py-3 bg-[#1a2030] border-b border-hb-border/50">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                    <span className="ml-3 text-xs text-gray-500 flex items-center gap-1.5">
                      <Terminal size={12} /> HackBot — CLI Mode
                    </span>
                  </div>
                  <Image
                    src="/images/screenshots/hackbot-cli-view.png"
                    alt="HackBot CLI Interface"
                    width={700}
                    height={450}
                    className="w-full h-auto"
                  />
                </div>
                <p className="text-center text-sm text-gray-500 mt-4 flex items-center justify-center gap-2">
                  <Terminal size={14} className="text-hb-accent" /> Terminal CLI with rich formatting
                </p>
              </motion.div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.div variants={slideRight} className="relative">
                <div className="absolute -inset-3 bg-gradient-to-r from-purple-500/15 to-hb-accent/15 rounded-2xl blur-xl opacity-40" />
                <div className="screenshot-frame relative">
                  <div className="flex items-center gap-2 px-4 py-3 bg-[#1a2030] border-b border-hb-border/50">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                    <span className="ml-3 text-xs text-gray-500 flex items-center gap-1.5">
                      <Settings size={12} /> HackBot — Settings
                    </span>
                  </div>
                  <Image
                    src="/images/screenshots/hackbot-settings.png"
                    alt="HackBot Settings Panel"
                    width={700}
                    height={450}
                    className="w-full h-auto"
                  />
                </div>
                <p className="text-center text-sm text-gray-500 mt-4 flex items-center justify-center gap-2">
                  <Settings size={14} className="text-purple-400" /> Comprehensive configuration panel
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ Plugin Marketplace CTA ═══ */}
      <section className="py-24 bg-hb-bg-secondary border-y border-hb-border relative overflow-hidden">
        <div className="bg-hex absolute inset-0 opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <motion.div variants={scaleIn} className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-hb-accent/20 via-blue-500/10 to-purple-500/20 rounded-3xl blur-xl" />
              <div className="relative bg-gradient-to-br from-hb-accent/5 via-hb-card to-hb-accent/10 border border-hb-accent/20 rounded-2xl p-8 sm:p-12 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-hb-accent/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl" />

                <div className="relative flex flex-col lg:flex-row items-center gap-10">
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-hb-accent/10 border border-hb-accent/25 rounded-full text-xs text-hb-accent font-medium mb-5">
                      <Sparkles size={12} /> Community Powered
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
                      Plugin <span className="gradient-text">Marketplace</span>
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed mb-8">
                      Discover, share, and download community-built HackBot plugins. Extend your security toolkit with scanners, exploit modules, OSINT tools, and more.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Link href="/marketplace" className="group flex items-center gap-2 px-7 py-3.5 bg-hb-accent text-hb-bg font-bold rounded-xl hover:shadow-[0_0_40px_rgba(0,255,136,0.3)] transition-all text-sm">
                        Browse Plugins <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Link href="/plugins/upload" className="flex items-center gap-2 px-7 py-3.5 border border-hb-accent/40 text-hb-accent font-semibold rounded-xl hover:bg-hb-accent/10 hover:border-hb-accent transition-all text-sm">
                        Upload Your Plugin
                      </Link>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6 text-center">
                    {[
                      { v: "500+", l: "Plugins", icon: Puzzle, color: "text-hb-accent" },
                      { v: "10k+", l: "Downloads", icon: Download, color: "text-blue-400" },
                      { v: "200+", l: "Contributors", icon: Code2, color: "text-purple-400" },
                    ].map((s) => (
                      <div key={s.l} className="group">
                        <s.icon size={24} className={`mx-auto mb-2 ${s.color} group-hover:scale-110 transition-transform`} />
                        <div className="text-3xl font-black text-white">{s.v}</div>
                        <div className="text-xs text-gray-500 mt-1">{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══ Features ═══ */}
      <section className="py-24 relative overflow-hidden" id="features">
        <div className="bg-grid absolute inset-0 opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
            <motion.div variants={fadeUp} custom={0} className="text-center mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-hb-accent/10 border border-hb-accent/25 rounded-full text-xs text-hb-accent font-medium mb-4">
                <Layers size={12} /> 18 Core Features
              </span>
            </motion.div>
            <motion.h2 variants={fadeUp} custom={0} className="text-4xl sm:text-5xl font-bold text-center mb-3">
              Everything You <span className="text-hb-accent">Need</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-center text-gray-400 max-w-xl mx-auto mb-14">
              Professional cybersecurity assessments powered by AI.
            </motion.p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  variants={fadeUp}
                  custom={i + 2}
                  className="group bg-hb-card border border-hb-border rounded-xl p-6 card-hover-3d relative overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${f.color} rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative">
                    <div className="w-10 h-10 rounded-lg bg-hb-accent/10 border border-hb-accent/20 flex items-center justify-center mb-4 group-hover:bg-hb-accent/20 group-hover:border-hb-accent/40 transition-all">
                      <f.icon className="w-5 h-5 text-hb-accent group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="font-semibold text-white mb-2 text-sm">{f.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ Modes ═══ */}
      <section className="py-24 bg-hb-bg-secondary relative overflow-hidden" id="modes">
        <div className="bg-dots absolute inset-0 opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <motion.div variants={fadeUp} custom={0} className="text-center mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-hb-accent/10 border border-hb-accent/25 rounded-full text-xs text-hb-accent font-medium mb-4">
                <Zap size={12} /> Three Ways to Work
              </span>
            </motion.div>
            <motion.h2 variants={fadeUp} custom={0} className="text-4xl sm:text-5xl font-bold text-center mb-3">Three Powerful <span className="gradient-text">Modes</span></motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-center text-gray-400 max-w-xl mx-auto mb-14">Choose the right mode for your workflow.</motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {modes.map((m, i) => (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className={`bg-hb-card border border-hb-border rounded-xl overflow-hidden hover:-translate-y-2 ${m.glowColor} transition-all duration-500`}
              >
                <div className={`flex items-center gap-3 px-6 py-5 border-b ${m.color}`}>
                  <span className="text-3xl">{m.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-white">{m.title}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${m.tagColor}`}>{m.tag}</span>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-400 mb-5 leading-relaxed">{m.desc}</p>
                  <ul className="space-y-2.5 mb-6">
                    {m.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-400">
                        <ChevronRight size={14} className="text-hb-accent mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="bg-hb-terminal border border-hb-border rounded-lg px-4 py-3 hover:border-hb-accent/30 transition-colors">
                    <code className="text-hb-accent text-sm font-mono flex items-center gap-2">
                      <span className="text-gray-600">$</span>
                      {m.cmd}
                    </code>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Providers ═══ */}
      <section className="py-24 relative overflow-hidden" id="providers">
        <div className="bg-grid absolute inset-0 opacity-15 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <motion.div variants={fadeUp} custom={0} className="text-center mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-hb-accent/10 border border-hb-accent/25 rounded-full text-xs text-hb-accent font-medium mb-4">
                <Brain size={12} /> Any Model, Any Provider
              </span>
            </motion.div>
            <motion.h2 variants={fadeUp} custom={0} className="text-4xl sm:text-5xl font-bold text-center mb-3">10 AI <span className="text-hb-accent">Providers</span></motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-center text-gray-400 max-w-xl mx-auto mb-14">
              Switch providers instantly. Use cloud APIs or run 100% locally with Ollama.
            </motion.p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
            {providers.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className={`group bg-hb-card border rounded-xl p-5 text-center card-hover-3d ${
                  p.highlight
                    ? "border-hb-accent/40 bg-hb-accent/5 ring-1 ring-hb-accent/20"
                    : "border-hb-border hover:border-hb-accent/20"
                }`}
              >
                <span className="text-2xl block mb-2 group-hover:scale-125 transition-transform">{p.icon}</span>
                <h4 className="font-bold text-white text-sm mb-1">{p.name}</h4>
                <p className="text-xs text-gray-500">{p.desc}</p>
                {p.highlight && (
                  <span className="inline-block mt-2 px-2 py-0.5 bg-hb-accent/15 text-hb-accent text-[10px] font-semibold rounded-full">100% LOCAL</span>
                )}
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mx-auto rounded-xl overflow-hidden border border-hb-border shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
            <div className="flex items-center gap-2 px-4 py-3 bg-[#1a2030] border-b border-hb-border/50">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
              <span className="ml-3 font-mono text-[11px] text-gray-500">switch providers instantly</span>
            </div>
            <div className="p-5 bg-hb-terminal font-mono text-sm leading-7">
              <p><span className="text-gray-600">$</span> <span className="text-hb-accent">hackbot</span> <span className="text-blue-400">--provider</span> ollama <span className="text-blue-400">--model</span> llama3.2</p>
              <p><span className="text-gray-600">$</span> <span className="text-hb-accent">hackbot</span> <span className="text-blue-400">--provider</span> anthropic <span className="text-blue-400">--model</span> claude-sonnet-4-20250514</p>
              <p><span className="text-gray-600">$</span> <span className="text-hb-accent">hackbot</span> <span className="text-blue-400">--provider</span> groq <span className="text-blue-400">--model</span> llama-3.3-70b-versatile</p>
              <p className="text-gray-600 mt-1"># Zero code changes — just switch the flag</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ Installation ═══ */}
      <section className="py-24 bg-hb-bg-secondary relative overflow-hidden" id="install">
        <div className="bg-dots absolute inset-0 opacity-25 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <motion.div variants={fadeUp} custom={0} className="text-center mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-hb-accent/10 border border-hb-accent/25 rounded-full text-xs text-hb-accent font-medium mb-4">
                <Download size={12} /> Ready in Seconds
              </span>
            </motion.div>
            <motion.h2 variants={fadeUp} custom={0} className="text-4xl sm:text-5xl font-bold text-center mb-3">Get <span className="text-hb-accent">Started</span></motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-center text-gray-400 max-w-xl mx-auto mb-14">
              Install HackBot in seconds. Works on Linux, macOS, and Windows.
            </motion.p>
          </motion.div>
          <div className="max-w-2xl mx-auto space-y-4">
            <InstallBlock title="One-Line Install (Linux/macOS)" cmd="curl -sSL https://raw.githubusercontent.com/yashab-cyber/hackbot/main/install.sh | bash" icon="🚀" />
            <InstallBlock title="pip install" cmd='pip install "hackbot[all] @ git+https://github.com/yashab-cyber/hackbot.git"' icon="📦" />
            <InstallBlock title="From Source" cmd={`git clone https://github.com/yashab-cyber/hackbot.git\ncd hackbot\npip install -e ".[all,dev]"`} icon="💻" />
            <InstallBlock title="Docker" cmd="docker build -t hackbot .\ndocker run -it -e HACKBOT_API_KEY=your-key --network host hackbot" icon="🐳" />
          </div>

          <div className="mt-20 text-center">
            <h3 className="text-2xl font-bold text-white mb-10">Quick Start</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                { n: "1", title: "Set Your API Key", cmd: "export HACKBOT_API_KEY=sk-your-key", icon: "🔑" },
                { n: "2", title: "Launch HackBot", cmd: "hackbot", icon: "🚀" },
                { n: "3", title: "Start Testing", cmd: "/agent scanme.nmap.org", icon: "🎯" },
              ].map((s, i) => (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.4 }}
                  className="bg-hb-card border border-hb-border rounded-xl p-6 text-center card-hover-3d"
                >
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-hb-accent to-emerald-500 text-hb-bg font-black rounded-xl flex items-center justify-center text-lg shadow-[0_0_20px_rgba(0,255,136,0.2)]">
                    {s.n}
                  </div>
                  <span className="text-2xl block mb-2">{s.icon}</span>
                  <h4 className="font-semibold text-white mb-3">{s.title}</h4>
                  <code className="block bg-hb-terminal border border-hb-border rounded-lg px-3 py-2 text-hb-accent text-sm font-mono">{s.cmd}</code>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Disclaimer ═══ */}
      <section className="py-16 bg-hb-bg relative">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative bg-hb-card border border-hb-agent/30 rounded-2xl p-10 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-hb-agent/5 via-transparent to-hb-agent/5 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-hb-agent to-transparent" />
            <div className="relative z-10">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-hb-agent font-bold text-xl mb-4">Security Disclaimer</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mx-auto">
                <strong className="text-gray-300">HackBot is designed for authorized security testing only.</strong> Always obtain explicit written permission before testing any system. Follow responsible disclosure practices. Comply with all applicable laws and regulations. Never use this tool against systems you don&apos;t own or have authorization to test.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

function InstallBlock({ title, cmd, icon }: { title: string; cmd: string; icon?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="rounded-xl overflow-hidden border border-hb-border hover:border-hb-accent/30 transition-all duration-300 group"
    >
      <div className="flex items-center justify-between px-4 py-3 bg-[#1a2030] border-b border-hb-border/50">
        <span className="text-xs text-gray-400 flex items-center gap-2">
          {icon && <span className="text-base">{icon}</span>}
          {title}
        </span>
        <button
          onClick={() => navigator.clipboard.writeText(cmd)}
          className="px-3 py-1 text-[11px] bg-hb-card border border-hb-border rounded text-gray-400 hover:text-hb-accent hover:border-hb-accent/30 hover:bg-hb-accent/5 transition-all flex items-center gap-1"
        >
          <Copy size={10} /> Copy
        </button>
      </div>
      <pre className="p-4 bg-hb-terminal font-mono text-sm text-hb-accent leading-7 overflow-x-auto whitespace-pre-wrap group-hover:text-hb-accent/90 transition-colors">{cmd}</pre>
    </motion.div>
  );
}
