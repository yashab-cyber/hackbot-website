"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Exam, ExamQuestion } from "@/types";
import { Loader2, ArrowLeft, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const supabase = createClient();
  const courseId = params.courseId as string;

  // Answers map: Question index -> selected option index
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);

  useEffect(() => {
    async function fetchExam() {
      const { data, error } = await supabase
        .from("exams")
        .select("*")
        .eq("course_id", courseId)
        .single();
        
      if (!error && data) {
        setExam(data);
      }
      setLoading(false);
    }
    
    if (courseId) {
      fetchExam();
    }
  }, [supabase, courseId]);

  const handleOptionSelect = (qIndex: number, oIndex: number) => {
    if (result) return; // Disallow changes after submission
    setAnswers((prev) => ({
      ...prev,
      [qIndex]: oIndex
    }));
  };

  const handleSubmit = async () => {
    if (!exam) return;
    
    // Check if all questions are answered
    if (Object.keys(answers).length < exam.questions.length) {
      toast.error("Please answer all questions before submitting.");
      return;
    }

    setSubmitting(true);
    let correctCount = 0;
    
    exam.questions.forEach((q, index) => {
      if (answers[index] === q.correct_option) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / exam.questions.length) * 100);
    const passed = scorePercentage >= exam.passing_score;

    setResult({
      score: scorePercentage,
      passed
    });
    setSubmitting(false);

    if (passed) {
      toast.success(`Congratulations! You passed with ${scorePercentage}%.`);
    } else {
      toast.error(`You scored ${scorePercentage}%. You need ${exam.passing_score}% to pass. Keep trying!`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-24 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-hb-accent animate-spin" />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen pt-32 pb-24 px-4 text-center">
        <div className="w-24 h-24 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={40} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">No Exam Found</h1>
        <p className="text-gray-400 mb-8">This course does not have an exam configured yet.</p>
        <button 
          onClick={() => router.push(`/academy/${courseId}`)}
          className="px-6 py-3 bg-hb-accent hover:bg-hb-accent-hover text-white rounded-xl font-medium transition-colors"
        >
          Back to Course
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-24">
      {/* Header bar */}
      <div className="border-b border-hb-border bg-hb-bg/50 backdrop-blur-md sticky top-16 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <Link 
            href={`/academy/${courseId}`}
            className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors flex shrink-0"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex flex-col">
            <span className="text-xs text-hb-accent font-semibold uppercase tracking-wider">Exam</span>
            <h1 className="text-xl font-bold text-white truncate">{exam.title}</h1>
          </div>
          <div className="ml-auto text-sm text-gray-400 font-mono bg-white/5 px-3 py-1 rounded-lg">
            Passing Score: {exam.passing_score}%
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="space-y-8">
          {exam.questions.map((q, qIndex) => (
            <div key={qIndex} className="bg-hb-card border border-hb-border rounded-2xl p-6 md:p-8">
              <h3 className="text-lg font-medium text-white mb-6 flex gap-3">
                <span className="text-hb-accent font-mono shrink-0">{qIndex + 1}.</span>
                {q.question}
              </h3>
              
              <div className="space-y-3 pl-7">
                {q.options.map((option, oIndex) => {
                  const isSelected = answers[qIndex] === oIndex;
                  const showResult = result !== null;
                  const isCorrect = showResult && q.correct_option === oIndex;
                  const isWrongSelection = showResult && isSelected && !isCorrect;

                  let optionClass = "border-hb-border bg-white/5 hover:border-hb-accent/50 hover:bg-white/10 text-gray-300";
                  
                  if (isSelected && !showResult) {
                    optionClass = "border-hb-accent bg-hb-accent/10 text-white";
                  } else if (showResult) {
                    if (isCorrect) {
                      optionClass = "border-green-500/50 bg-green-500/10 text-green-400";
                    } else if (isWrongSelection) {
                      optionClass = "border-red-500/50 bg-red-500/10 text-red-400";
                    } else {
                      optionClass = "border-hb-border/50 bg-white/[0.02] text-gray-500 opacity-50 cursor-not-allowed";
                    }
                  }

                  return (
                    <button
                      key={oIndex}
                      onClick={() => handleOptionSelect(qIndex, oIndex)}
                      disabled={showResult}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${optionClass}`}
                    >
                      <span className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected && !showResult ? "border-hb-accent" : "border-gray-600"
                        } ${isCorrect ? "border-green-400" : ""} ${isWrongSelection ? "border-red-400" : ""}`}>
                          {isSelected && !showResult && <div className="w-2.5 h-2.5 rounded-full bg-hb-accent" />}
                          {isCorrect && <CheckCircle2 size={16} className="text-green-400" />}
                          {isWrongSelection && <XCircle size={16} className="text-red-400" />}
                        </div>
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Action Bottom Bar */}
        <div className="mt-8 bg-hb-card/80 backdrop-blur-xl border border-hb-border rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 sticky bottom-6 z-40 shadow-2xl">
          {!result ? (
            <>
              <div className="text-gray-400 text-sm">
                Answered {Object.keys(answers).length} of {exam.questions.length} questions
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting || Object.keys(answers).length < exam.questions.length}
                className="w-full sm:w-auto px-8 py-3 bg-hb-accent hover:bg-hb-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 size={18} className="animate-spin" />}
                Submit Exam
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold ${
                  result.passed ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                }`}>
                  {result.score}%
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${result.passed ? "text-green-400" : "text-red-400"}`}>
                    {result.passed ? "Exam Passed!" : "Exam Failed"}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {result.passed 
                      ? "You can now claim your certificate." 
                      : `You needed ${exam.passing_score}% to pass.`}
                  </p>
                </div>
              </div>
              
              {result.passed ? (
                <Link
                  href={`/academy/certificate/claim/${courseId}`}
                  className="w-full sm:w-auto px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-colors shadow-[0_0_15px_rgba(34,197,94,0.3)] text-center"
                >
                  Claim Certificate
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setResult(null);
                    setAnswers({});
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-hb-border rounded-xl font-medium transition-colors"
                >
                  Retrieve Exam
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
