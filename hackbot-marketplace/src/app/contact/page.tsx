"use client";

import { useState } from "react";
import { Mail, MessageSquare, MapPin, Send, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    // Simulate sending email API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Message sent successfully! We'll get back to you shortly.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1200);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 bg-hb-bg relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-hb-accent/5 rounded-full blur-[120px] pointer-events-none z-0" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Contact <span className="text-hb-accent">Us</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
            Have questions, feedback, or suggestions for HackBot? Get in touch with us using the form below or through our social channels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Info cards (1/3 width on md) */}
          <div className="space-y-6 md:col-span-1 flex flex-col justify-between">
            <div className="bg-hb-card/50 backdrop-blur-xl border border-hb-border p-6 rounded-2xl flex items-start gap-4">
              <div className="w-10 h-10 bg-hb-accent/10 border border-hb-accent/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-hb-accent" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Email Address</h3>
                <p className="text-xs text-gray-500 mt-1">General inquiries & support</p>
                <a href="mailto:yashabalam707@gmail.com" className="text-sm text-hb-accent hover:underline mt-2 inline-block">
                  yashabalam707@gmail.com
                </a>
              </div>
            </div>

            <div className="bg-hb-card/50 backdrop-blur-xl border border-hb-border p-6 rounded-2xl flex items-start gap-4">
              <div className="w-10 h-10 bg-[#5865F2]/10 border border-[#5865F2]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-[#5865F2]" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Discord Community</h3>
                <p className="text-xs text-gray-500 mt-1">Chat with developers & hackers</p>
                <a href="https://discord.gg/JwE2btCUD" target="_blank" rel="noopener noreferrer" className="text-sm text-[#5865F2] hover:underline mt-2 inline-block">
                  Join Discord Server
                </a>
              </div>
            </div>

            <div className="bg-hb-card/50 backdrop-blur-xl border border-hb-border p-6 rounded-2xl flex items-start gap-4">
              <div className="w-10 h-10 bg-hb-accent/10 border border-hb-accent/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-hb-accent" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Location</h3>
                <p className="text-xs text-gray-500 mt-1">Operating worldwide from</p>
                <span className="text-sm text-gray-300 mt-2 inline-block">
                  India / Remote
                </span>
              </div>
            </div>
          </div>

          {/* Form (2/3 width on md) */}
          <div className="bg-hb-card/50 backdrop-blur-xl border border-hb-border p-8 rounded-3xl md:col-span-2 shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-hb-accent to-transparent opacity-40" />

            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-hb-accent/10 border border-hb-accent/30 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-hb-accent" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Thank you!</h2>
                <p className="text-gray-400 max-w-sm mb-6 text-sm">
                  Your message has been successfully received. Our support team will get in touch with you at the email address provided.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 bg-hb-accent/10 hover:bg-hb-accent/20 border border-hb-accent/30 text-hb-accent rounded-xl text-sm font-medium transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                      Name <span className="text-hb-accent">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your Name"
                      className="w-full bg-hb-terminal/50 border border-hb-border focus:border-hb-accent rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                      Email Address <span className="text-hb-accent">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full bg-hb-terminal/50 border border-hb-border focus:border-hb-accent rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="How can we help?"
                    className="w-full bg-hb-terminal/50 border border-hb-border focus:border-hb-accent rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                    Message <span className="text-hb-accent">*</span>
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what you need help with..."
                    className="w-full bg-hb-terminal/50 border border-hb-border focus:border-hb-accent rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-hb-accent hover:bg-hb-accent-hover text-white rounded-xl font-medium transition-colors shadow-lg shadow-hb-accent/20 disabled:opacity-55"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
