import type { Metadata } from "next";
import { Shield, Eye, Lock, FileText, Globe, UserCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read our Privacy Policy to understand how HackBot collects, uses, and protects your data.",
};

export default function PrivacyPolicyPage() {
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
              <Shield className="w-6 h-6 text-hb-accent" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Privacy <span className="text-hb-accent">Policy</span>
              </h1>
              <p className="text-xs text-gray-500 mt-1">Last Updated: June 30, 2026</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none text-gray-300 space-y-8 text-sm md:text-base leading-relaxed">
            <p>
              At <strong>HackBot</strong>, accessible from <a href="https://hackbot.yashab-cyber.com" className="text-hb-accent hover:underline">https://hackbot.yashab-cyber.com</a>, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by HackBot and how we use it.
            </p>

            <p>
              If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <a href="mailto:yashabalam707@gmail.com" className="text-hb-accent hover:underline">yashabalam707@gmail.com</a>.
            </p>

            <hr className="border-hb-border my-6" />

            {/* Section 1 */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-hb-accent" /> Log Files
              </h2>
              <p>
                HackBot follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services&apos; analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users&apos; movement on the website, and gathering demographic information.
              </p>
            </div>

            {/* Section 2 */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-hb-accent" /> Cookies and Web Beacons
              </h2>
              <p>
                Like any other website, HackBot uses &quot;cookies&quot;. These cookies are used to store information including visitors&apos; preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users&apos; experience by customizing our web page content based on visitors&apos; browser type and/or other information.
              </p>
            </div>

            {/* Section 3 */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-hb-accent" /> Google DoubleClick DART Cookie
              </h2>
              <p>
                Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-hb-accent hover:underline">https://policies.google.com/technologies/ads</a>.
              </p>
            </div>

            {/* Section 4 */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-hb-accent" /> Our Advertising Partners
              </h2>
              <p>
                Some of advertisers on our site may use cookies and web beacons. Our advertising partners include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Google AdSense:</strong> Their Privacy Policy can be found at <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-hb-accent hover:underline">https://policies.google.com/technologies/ads</a>.
                </li>
              </ul>
              <p>
                These third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on HackBot, which are sent directly to users&apos; browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
              </p>
              <p>
                Note that HackBot has no access to or control over these cookies that are used by third-party advertisers.
              </p>
            </div>

            {/* Section 5 */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-hb-accent" /> Third Party Privacy Policies
              </h2>
              <p>
                HackBot&apos;s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
              </p>
              <p>
                You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers&apos; respective websites.
              </p>
            </div>

            {/* Section 6 */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-hb-accent" /> CCPA Privacy Rights (Do Not Sell My Personal Information)
              </h2>
              <p>
                Under the CCPA, among other rights, California consumers have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Request that a business that collects a consumer&apos;s personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.</li>
                <li>Request that a business delete any personal data about the consumer that a business has collected.</li>
                <li>Request that a business that sells a consumer&apos;s personal data, not sell the consumer&apos;s personal data.</li>
              </ul>
              <p>
                If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.
              </p>
            </div>

            {/* Section 7 */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-hb-accent" /> GDPR Data Protection Rights
              </h2>
              <p>
                We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>The right to access</strong> – You have the right to request copies of your personal data. We may charge you a small fee for this service.</li>
                <li><strong>The right to rectification</strong> – You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete.</li>
                <li><strong>The right to erasure</strong> – You have the right to request that we erase your personal data, under certain conditions.</li>
                <li><strong>The right to restrict processing</strong> – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
                <li><strong>The right to object to processing</strong> – You have the right to object to our processing of your personal data, under certain conditions.</li>
                <li><strong>The right to data portability</strong> – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
              </ul>
              <p>
                If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.
              </p>
            </div>

            {/* Section 8 */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-hb-accent" /> Children&apos;s Information
              </h2>
              <p>
                Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
              </p>
              <p>
                HackBot does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
