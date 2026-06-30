import type { Metadata } from "next";
import { FileText, ShieldAlert, Award, User, Scale, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Read our Terms and Conditions of service to understand the rules and guidelines for using HackBot.",
};

export default function TermsAndConditionsPage() {
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
              <FileText className="w-6 h-6 text-hb-accent" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Terms & <span className="text-hb-accent">Conditions</span>
              </h1>
              <p className="text-xs text-gray-500 mt-1">Last Updated: June 30, 2026</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none text-gray-300 space-y-8 text-sm md:text-base leading-relaxed">
            <p>
              Welcome to <strong>HackBot</strong>!
            </p>
            <p>
              These terms and conditions outline the rules and regulations for the use of HackBot&apos;s Website, located at <a href="https://hackbot.yashab-cyber.com" className="text-hb-accent hover:underline">https://hackbot.yashab-cyber.com</a>.
            </p>
            <p>
              By accessing this website, we assume you accept these terms and conditions. Do not continue to use HackBot if you do not agree to take all of the terms and conditions stated on this page.
            </p>

            <hr className="border-hb-border my-6" />

            {/* Section 1 */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-hb-accent" /> 1. License & Intellectual Property
              </h2>
              <p>
                Unless otherwise stated, HackBot and/or its licensors own the intellectual property rights for all material on HackBot. All intellectual property rights are reserved. You may access this from HackBot for your own personal use subjected to restrictions set in these terms and conditions.
              </p>
              <p>
                You must not:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Republish material from HackBot without appropriate credit.</li>
                <li>Sell, rent, or sub-license material from HackBot.</li>
                <li>Reproduce, duplicate, or copy material from HackBot for commercial reuse without permission.</li>
                <li>Redistribute content from HackBot (unless content is specifically made for redistribution, such as open-source code/plugins under their respective licenses).</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-hb-accent" /> 2. Ethical Use & Cybersecurity Disclaimer
              </h2>
              <p>
                HackBot is an AI cybersecurity assistant and plugin marketplace designed for <strong>educational, security research, and ethical testing purposes only</strong>.
              </p>
              <p>
                By using any tools, plugins, guidebooks, or services offered by HackBot, you agree that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You will not use the tools or plugins for unauthorized penetration testing, hacking, system disruption, or any illegal activities.</li>
                <li>You have explicit, written authorization from the owner of any system, network, or application that you scan, audit, or test using tools hosted on or linked by HackBot.</li>
                <li>You assume full responsibility for your actions. HackBot, its developers, and contributors are not liable for any misuse, damage, or legal consequences resulting from your actions or the use of tools, instructions, or assistants provided on this platform.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-hb-accent" /> 3. User Accounts & Submissions
              </h2>
              <p>
                When you create an account on our platform or submit plugins to the marketplace, you warrant that the information you provide is accurate, complete, and current at all times.
              </p>
              <p>
                You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.
              </p>
              <p>
                For plugin developers: All plugins uploaded to our marketplace must be free of malware, spyware, backdoors, or obfuscated malicious payloads. Uploading malicious tools will result in an immediate and permanent ban of your account and potential reporting to cyber defense authorities.
              </p>
            </div>

            {/* Section 4 */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-hb-accent" /> 4. Disclaimer of Warranties
              </h2>
              <p>
                This website and its contents are provided &quot;as is&quot;, with all faults, and HackBot makes no express or implied representations or warranties of any kind related to this website or the materials contained on this website. 
              </p>
              <p>
                We do not warrant that the website or its tools will be uninterrupted, error-free, secure, or free of viruses or other harmful components. Use of this website is entirely at your own risk.
              </p>
            </div>

            {/* Section 5 */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-hb-accent" /> 5. Limitation of Liability
              </h2>
              <p>
                In no event shall HackBot, nor any of its officers, directors, and employees, be liable to you for anything arising out of or in any way connected with your use of this website, whether such liability is under contract, tort, or otherwise. HackBot, including its officers, directors, and employees, shall not be liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this website or the tools downloaded from it.
              </p>
            </div>

            {/* Section 6 */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-hb-accent" /> 6. Contact Information
              </h2>
              <p>
                If you have any queries regarding any of our terms, please contact us at <a href="mailto:yashabalam707@gmail.com" className="text-hb-accent hover:underline">yashabalam707@gmail.com</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
