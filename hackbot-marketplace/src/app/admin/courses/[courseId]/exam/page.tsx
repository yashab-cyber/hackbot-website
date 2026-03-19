"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, ShieldCheck, Plus, Trash2, HelpCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isAdmin, getAdminUsername } from "@/lib/admin";
import toast from "react-hot-toast";
import { ExamQuestion } from "@/types";

export default function AdminExamBuilder() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const supabase = createClient();

  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Exam State
  const [examId, setExamId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [passingScore, setPassingScore] = useState(70);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);

  useEffect(() => {
    async function checkAdminAndFetch() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !isAdmin(getAdminUsername(user))) {
        router.replace("/");
        return;
      }
      setAuthorized(true);

      // Fetch existing exam if there is one
      const { data, error } = await supabase
        .from("exams")
        .select("*")
        .eq("course_id", courseId)
        .single();

      if (data) {
        setExamId(data.id);
        setTitle(data.title);
        setPassingScore(data.passing_score);
        setQuestions(data.questions || []);
      }

      setLoading(false);
    }
    
    checkAdminAndFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correct_option: 0 }
    ]);
  };

  const removeQuestion = (qIndex: number) => {
    if (confirm("Remove this question?")) {
      setQuestions(questions.filter((_, i) => i !== qIndex));
    }
  };

  const updateQuestionText = (qIndex: number, text: string) => {
    const newQ = [...questions];
    newQ[qIndex].question = text;
    setQuestions(newQ);
  };

  const updateOptionText = (qIndex: number, oIndex: number, text: string) => {
    const newQ = [...questions];
    newQ[qIndex].options[oIndex] = text;
    setQuestions(newQ);
  };

  const setCorrectOption = (qIndex: number, oIndex: number) => {
    const newQ = [...questions];
    newQ[qIndex].correct_option = oIndex;
    setQuestions(newQ);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Please enter an exam title");
      return;
    }
    if (questions.length === 0) {
      toast.error("Please add at least one question");
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question.trim()) {
        toast.error(`Question ${i + 1} is missing text`);
        return;
      }
      for (let j = 0; j < questions[i].options.length; j++) {
        if (!questions[i].options[j].trim()) {
          toast.error(`Question ${i + 1} has empty options`);
          return;
        }
      }
    }

    setSubmitting(true);

    const payload = {
      course_id: courseId,
      title,
      passing_score: passingScore,
      questions
    };

    let error;

    if (examId) {
      // Update
      const res = await supabase.from("exams").update(payload).eq("id", examId);
      error = res.error;
    } else {
      // Insert
      const res = await supabase.from("exams").insert(payload).select().single();
      error = res.error;
      if (res.data) setExamId(res.data.id);
    }

    setSubmitting(false);

    if (error) {
      console.error(error);
      toast.error("Failed to save exam");
    } else {
      toast.success("Exam saved successfully!");
      router.push("/admin/courses");
    }
  };

  if (loading && !authorized) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-hb-accent animate-spin" />
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/courses"
              className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors flex shrink-0"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="text-hb-accent" /> Manage Exam Configuration
              </h1>
              <p className="text-sm text-gray-500">Configure quiz questions for course ID: {courseId}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Main Config */}
          <div className="bg-hb-card border border-hb-border rounded-xl p-6 sm:p-8 shadow-xl">
            <h2 className="text-lg font-semibold text-white mb-6">Exam Settings</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Exam Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Final Certification Exam"
                  className="w-full px-4 py-3 bg-hb-bg border border-hb-border focus:border-hb-accent focus:ring-1 focus:ring-hb-accent rounded-xl text-white outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Passing Score (%)
                </label>
                <input
                  type="number"
                  value={passingScore}
                  onChange={(e) => setPassingScore(Number(e.target.value))}
                  min={1}
                  max={100}
                  className="w-full px-4 py-3 bg-hb-bg border border-hb-border focus:border-hb-accent focus:ring-1 focus:ring-hb-accent rounded-xl text-white outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Questions Builder */}
          <div className="bg-hb-card border border-hb-border rounded-xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <HelpCircle size={20} className="text-hb-accent" /> Questions Pipeline
              </h2>
              <button
                onClick={addQuestion}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors flex items-center gap-2 text-sm border border-white/10"
              >
                <Plus size={16} /> Add Question
              </button>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-hb-border rounded-xl">
                <p className="text-gray-500 mb-4">No questions added yet.</p>
                <button
                  onClick={addQuestion}
                  className="px-6 py-2 bg-hb-accent hover:bg-hb-accent-hover text-white rounded-lg font-medium transition-colors"
                >
                  Create First Question
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {questions.map((q, qIndex) => (
                  <div key={qIndex} className="p-6 bg-hb-bg border border-hb-border rounded-xl relative group">
                    <button
                      onClick={() => removeQuestion(qIndex)}
                      className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove Question"
                    >
                      <Trash2 size={18} />
                    </button>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-hb-accent mb-2">
                        Question {qIndex + 1}
                      </label>
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                        placeholder="Enter the question text..."
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-hb-accent focus:ring-1 focus:ring-hb-accent rounded-xl text-white outline-none transition-all pr-12"
                      />
                    </div>

                    <div className="space-y-3 pl-2 sm:pl-6 border-l-2 border-hb-border">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                        Options (Select the correct one)
                      </label>
                      {q.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-3">
                          <input
                            type="radio"
                            name={`q-${qIndex}-correct`}
                            checked={q.correct_option === oIndex}
                            onChange={() => setCorrectOption(qIndex, oIndex)}
                            className="w-4 h-4 text-hb-accent bg-hb-bg border-hb-border focus:ring-hb-accent cursor-pointer"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOptionText(qIndex, oIndex, e.target.value)}
                            placeholder={`Option ${oIndex + 1}`}
                            className={`w-full px-3 py-2 bg-white/5 border rounded-lg outline-none transition-all text-sm ${
                              q.correct_option === oIndex 
                                ? "border-hb-accent/50 text-white" 
                                : "border-white/10 text-gray-300 focus:border-hb-accent"
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pb-8">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-3 bg-hb-accent hover:bg-hb-accent-hover disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(var(--hb-accent-rgb),0.3)] flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Save Exam Config
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
