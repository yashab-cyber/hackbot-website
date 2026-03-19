"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Award, Loader2, User, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function ClaimCertificatePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to claim a certificate.");
        router.push("/");
        return;
      }
      setUser(user);
      
      // Auto-fill name if available in metadata
      const defaultName = user.user_metadata?.full_name || user.user_metadata?.name || "";
      if (defaultName) setName(defaultName);
      
      setLoading(false);
    }
    init();
  }, [supabase, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter the name to appear on the certificate.");
      return;
    }

    setSubmitting(true);
    
    // Create certificate record
    const { data, error } = await supabase
      .from("certificates")
      .insert({
        user_id: user.id,
        course_id: courseId,
        student_name: name.trim()
      })
      .select()
      .single();

    setSubmitting(false);

    if (error) {
      toast.error("Failed to generate certificate. Please try again.");
      console.error(error);
    } else if (data) {
      toast.success("Certificate generated successfully!");
      router.push(`/certificate/${data.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-24 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-hb-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 flex items-center justify-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-hb-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        <div className="bg-hb-card/80 backdrop-blur-xl border border-hb-accent/30 rounded-3xl p-8 shadow-[0_0_40px_rgba(var(--hb-accent-rgb),0.1)]">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-hb-accent/20 border border-hb-accent/40 rounded-full flex items-center justify-center text-hb-accent shadow-[0_0_15px_rgba(var(--hb-accent-rgb),0.3)]">
              <Award size={40} />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            Claim Your Certificate
          </h1>
          <p className="text-gray-400 text-center text-sm mb-8">
            You&apos;ve successfully passed the exam! Enter the name you want displayed on your verified certificate.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name for Certificate
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <User size={18} />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full pl-11 pr-4 py-3 bg-hb-bg border border-hb-border focus:border-hb-accent focus:ring-1 focus:ring-hb-accent rounded-xl text-white outline-none transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-hb-accent hover:bg-hb-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(var(--hb-accent-rgb),0.2)]"
            >
              {submitting ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  Generate Verified Certificate
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
