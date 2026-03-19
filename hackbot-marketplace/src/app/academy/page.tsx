"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Shield, Award, Clock, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Course } from "@/types";
import dynamic from "next/dynamic";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Academy",
  description: "Learn cybersecurity concepts, test your skills, and earn verifiable certificates.",
};

const MarketplaceScene = dynamic(() => import("@/components/three/MarketplaceScene"), {
  ssr: false,
});

export default function AcademyPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchCourses() {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (!error && data) {
        setCourses(data);
      }
      setLoading(false);
    }
    
    fetchCourses();
  }, [supabase]);

  return (
    <div className="min-h-screen pt-24 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-30">
        <MarketplaceScene />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-hb-accent/10 border border-hb-accent/30 rounded-full flex items-center justify-center">
              <Shield className="w-10 h-10 text-hb-accent" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            HackBot <span className="text-hb-accent">Academy</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Learn cybersecurity concepts, test your skills with hands-on exams, and earn 
            verifiable certificates to showcase your expertise.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-hb-accent animate-spin" />
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-hb-card/80 backdrop-blur-xl border border-hb-border rounded-xl p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Courses Available</h3>
            <p className="text-gray-400">We are currently preparing our curriculum. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div 
                key={course.id} 
                className="bg-hb-card/80 backdrop-blur-xl border border-hb-border hover:border-hb-accent/50 rounded-2xl overflow-hidden transition-all group"
              >
                <div className="p-6">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-hb-accent/20 transition-all duration-300">
                    <BookOpen className="text-hb-accent" size={24} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-hb-accent transition-colors">
                    {course.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-6 line-clamp-3">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-6">
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> 2 Hours
                    </span>
                    <span className="flex items-center gap-1">
                      <Award size={14} /> Certificate
                    </span>
                  </div>
                  
                  <Link 
                    href={`/academy/${course.id}`}
                    className="flex items-center justify-between w-full px-4 py-3 bg-white/5 hover:bg-hb-accent text-white rounded-xl transition-colors font-medium text-sm group/btn"
                  >
                    <span>Start Learning</span>
                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
