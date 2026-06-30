import type { Metadata } from "next";
import { AlertTriangle, ShieldCheck, Scale, ExternalLink, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Read our Disclaimer to understand the terms of educational use and system authorization for HackBot.",
};

export default function DisclaimerPage() {
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
              <AlertTriangle className="w-6 h-6 text-hb-accent" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Cybersecurity <span className="text-hb-accent">Disclaimer</span>
              </h1>
              <p className="text-xs text-gray-500 mt-1">Last Updated: June 30, 2026</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none text-gray-300 space-y-8 text-sm md:text-base leading-relaxed">
            <div className="bg-hb-accent/5 border border-hb-accent/20 p-6 rounded-2xl flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-hb-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-semibold mb-1">Educational & Security Research Only</h3>
                <p className="text-sm text-gray-300">
                  HackBot and all resources, tools, tutorials, plugins, and lists hosted or linked here are intended solely for educational purposes, security analysis, system administration, and authorized ethical penetration testing.
                </p>
              </div>
            </div>

            <hr className="border-hb-border my-6" />

            {/* Section 1 */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-hb-accent" /> 1. No Liability for Misuse
              </h2>
              <p>
                The developer (Yashab Alam) and contributors of HackBot do not condone, encourage, or support unauthorized access, cyber attacks, data theft, or any form of black-hat hacking. 
              </p>
              <p>
                Under no circumstances shall HackBot or its developers be held responsible for any damage, data loss, downtime, legal action, or criminal prosecution resulting from the misuse of the tools, code, plugins, scripts, or tutorials presented on this website. 
              </p>
            </div>

            {/* Section 2 */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-hb-accent" /> 2. Requirement for Authorization
              </h2>
              <p>
                You must possess explicit, written permission from the systems administrator or owner before testing any target using any tool, script, or plugin found on this website. Attempting to scan, probe, exploit, or bypass security controls of a network or computer system without authorization is illegal and constitutes a computer crime under various national and international laws (such as the Computer Fraud and Abuse Act in the US or similar computer misuse laws globally).
              </p>
            </div>

            {/* Section 3 */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-hb-accent" /> 3. Accuracy and &quot;As-Is&quot; Provision
              </h2>
              <p>
                Cybersecurity is a rapidly changing field. Exploit code, vulnerability scanners, and plugins may contain bugs, fail under certain environments, or become outdated. All materials on HackBot are provided &quot;as-is&quot; without warranty of any kind. We do not guarantee that the information is 100% accurate, safe, or compatible with your systems.
              </p>
            </div>

            {/* Section 4 */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-hb-accent" /> 4. External Links Disclaimer
              </h2>
              <p>
                HackBot may contain links to external third-party websites or repositories (e.g., GitHub, external downloads, external documentation) that are not provided, monitored, or maintained by HackBot. We do not guarantee the accuracy, relevance, safety, or completeness of any information or software on these external websites. Clicking on external links is done at your own risk.
              </p>
            </div>

            {/* Section 5 */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-hb-accent" /> 5. Contact & Reporting Issues
              </h2>
              <p>
                If you find a tool or plugin in our marketplace that violates ethical standards or security best practices, or if you have questions regarding this disclaimer, please contact us immediately at <a href="mailto:yashabalam707@gmail.com" className="text-hb-accent hover:underline">yashabalam707@gmail.com</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
