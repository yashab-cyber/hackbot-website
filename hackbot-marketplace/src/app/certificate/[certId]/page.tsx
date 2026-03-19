"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Download, ShieldCheck, Calendar, Award } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";

export default function CertificateValidationPage() {
  const params = useParams();
  const certId = params.certId as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const supabase = createClient();
  const qrRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    async function fetchCertificate() {
      const { data: certData, error } = await supabase
        .from("certificates")
        .select("*, courses(*)")
        .eq("id", certId)
        .single();
        
      if (!error && certData) {
        setData(certData);
      }
      setLoading(false);
    }
    
    if (certId) {
      fetchCertificate();
    }
  }, [supabase, certId]);

  const handleDownload = async () => {
    if (!data) return;
    setDownloading(true);
    
    try {
      // 1. Initialize jsPDF
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // A4 Landscape dimensions: 297 x 210 mm
      const width = doc.internal.pageSize.getWidth();
      const height = doc.internal.pageSize.getHeight();

      // 2. Draw Background & Borders
      doc.setFillColor(15, 23, 42); // slate-900 like dark background
      doc.rect(0, 0, width, height, "F");
      
      // Outer border
      doc.setDrawColor(56, 189, 248); // hb-accent (light blue)
      doc.setLineWidth(2);
      doc.rect(10, 10, width - 20, height - 20, "S");
      
      // Inner border
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.5);
      doc.rect(12, 12, width - 24, height - 24, "S");

      // 3. Load Logo (Async)
      const loadImage = (url: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new window.Image();
          img.crossOrigin = "Anonymous";
          img.src = url;
          img.onload = () => resolve(img);
          img.onerror = (e) => reject(e);
        });
      };

      try {
        const logoImg = await loadImage("/images/logo.png");
        // Canvas to get Data URL
        const canvas = document.createElement("canvas");
        canvas.width = logoImg.width;
        canvas.height = logoImg.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(logoImg, 0, 0);
          const ext = logoImg.src.split('.').pop()?.toUpperCase() || 'PNG';
          doc.addImage(canvas.toDataURL(`image/png`), "PNG", width / 2 - 15, 25, 30, 30);
        }
      } catch (err) {
        console.error("Failed to load logo for PDF", err);
      }

      // 4. Texts
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);
      doc.text("CERTIFICATE OF COMPLETION", width / 2, 70, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(14);
      doc.setTextColor(156, 163, 175); // gray-400
      doc.text("This is to certify that", width / 2, 90, { align: "center" });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(36);
      doc.setTextColor(56, 189, 248); // hb-accent
      doc.text(data.student_name, width / 2, 110, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(14);
      doc.setTextColor(156, 163, 175);
      doc.text("has successfully completed the exam for the program:", width / 2, 130, { align: "center" });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255);
      doc.text(data.courses.title, width / 2, 150, { align: "center" });

      // Issue date
      const dateStr = new Date(data.issued_at).toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric'
      });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(200, 200, 200);
      doc.text(`Issued on: ${dateStr}`, width / 2, 170, { align: "center" });

      // 5. QR Code
      if (qrRef.current) {
        const qrDataUrl = qrRef.current.toDataURL("image/png");
        // Place QR Bottom Right
        doc.addImage(qrDataUrl, "PNG", width - 40, height - 40, 25, 25);
        
        doc.setFontSize(8);
        doc.text("Scan to Validate", width - 27.5, height - 12, { align: "center" });
      }

      // Left Signature/Stamp text
      doc.setFont("helvetica", "italic");
      doc.setFontSize(12);
      doc.setTextColor(56, 189, 248);
      doc.text("HackBot Academy", 30, height - 25);
      doc.setDrawColor(56, 189, 248);
      doc.setLineWidth(0.5);
      doc.line(30, height - 23, 80, height - 23);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(156, 163, 175);
      doc.text("Official Issuance", 30, height - 17);

      // 6. Save
      doc.save(`HackBot_Certificate_${data.student_name.replace(/\\s+/g, '_')}.pdf`);
      toast.success("Certificate downloaded!");
    } catch (err) {
      console.error(err);
      toast.error("Error generating PDF.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-24 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-hb-accent animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen pt-32 pb-24 px-4 text-center">
        <div className="w-24 h-24 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck size={40} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Invalid Certificate</h1>
        <p className="text-gray-400 mb-8">This certificate could not be found or has been revoked.</p>
        <Link 
          href="/academy"
          className="px-6 py-3 bg-hb-accent hover:bg-hb-accent-hover text-white rounded-xl font-medium transition-colors"
        >
          Browse Academy
        </Link>
      </div>
    );
  }

  const validationUrl = typeof window !== 'undefined' ? window.location.href : `https://hackbot.com/certificate/${certId}`;

  return (
    <div className="min-h-screen pt-24 pb-24 relative overflow-hidden bg-hb-bg">
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-hb-accent/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full text-sm font-medium mb-6">
            <ShieldCheck size={16} /> Verified Authentic Certificate
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Certificate of Completion
          </h1>
          <p className="text-gray-400">
            Issued by HackBot Academy
          </p>
        </div>

        {/* Certificate Display Card */}
        <div className="bg-hb-card/80 backdrop-blur-xl border border-hb-accent/30 rounded-3xl p-8 md:p-12 mb-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-hb-accent to-transparent opacity-50" />
          
          <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="flex-1 text-center md:text-left">
              <p className="text-gray-400 uppercase tracking-widest text-sm font-semibold mb-2">Student</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-hb-accent">
                {data.student_name}
              </h2>
              
              <p className="text-gray-400 uppercase tracking-widest text-sm font-semibold mb-2">Program</p>
              <h3 className="text-xl md:text-2xl font-bold text-gray-200 mb-6">
                {data.courses?.title}
              </h3>
              
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 text-sm">
                <Calendar size={16} /> 
                Issued on {new Date(data.issued_at).toLocaleDateString()}
              </div>
            </div>

            <div className="shrink-0 flex flex-col items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl">
              <QRCodeCanvas 
                value={validationUrl} 
                size={120}
                bgColor="transparent"
                fgColor="#38bdf8" // hb-accent
                level="Q"
                ref={qrRef}
                includeMargin={false}
              />
              <p className="text-xs text-gray-400 text-center uppercase tracking-widest">Scan to verify</p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-hb-border/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src="/images/logo.png" alt="HackBot" width={40} height={40} className="rounded-xl" />
              <div>
                <p className="font-bold text-white">HackBot</p>
                <p className="text-xs text-gray-500">Academy</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="w-24 h-px bg-hb-accent/50 ml-auto mb-2" />
              <p className="text-xs text-gray-400 uppercase tracking-widest">Official Issue</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-hb-accent hover:bg-hb-accent-hover text-white rounded-xl font-bold transition-all shadow-lg shadow-hb-accent/20"
          >
            {downloading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Download size={20} />
            )}
            Download PDF
          </button>
          
          <Link
            href="/academy"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors border border-white/10"
          >
            <Award size={20} />
            View More Courses
          </Link>
        </div>
      </div>
    </div>
  );
}
