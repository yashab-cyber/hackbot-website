export interface Plugin {
  id: string;
  name: string;
  slug: string;
  description: string;
  long_description: string | null;
  version: string;
  category: PluginCategory;
  author_id: string;
  author_username: string;
  author_avatar_url: string | null;
  download_url: string | null;
  file_path: string | null;
  file_size: number | null;
  source_url: string | null;
  tags: string[];
  downloads: number;
  stars: number;
  is_verified: boolean;
  is_featured: boolean;
  is_approved: boolean;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export type PluginCategory =
  | "scanner"
  | "exploit"
  | "recon"
  | "reporting"
  | "osint"
  | "network"
  | "web"
  | "crypto"
  | "forensics"
  | "misc";

export interface PluginUploadForm {
  name: string;
  description: string;
  long_description: string;
  version: string;
  category: PluginCategory;
  tags: string[];
  source_url: string;
  file: File | null;
}

export interface UserProfile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  github_url: string | null;
  plugins_count: number;
  total_downloads: number;
  created_at: string;
}

export interface PluginReview {
  id: string;
  plugin_id: string;
  user_id: string;
  username: string;
  avatar_url: string | null;
  rating: number;
  comment: string;
  created_at: string;
}

export const PLUGIN_CATEGORIES: { value: PluginCategory; label: string; icon: string }[] = [
  { value: "scanner", label: "Scanner", icon: "🔍" },
  { value: "exploit", label: "Exploit", icon: "💥" },
  { value: "recon", label: "Reconnaissance", icon: "🌐" },
  { value: "reporting", label: "Reporting", icon: "📊" },
  { value: "osint", label: "OSINT", icon: "🕵️" },
  { value: "network", label: "Network", icon: "🗺️" },
  { value: "web", label: "Web Security", icon: "🌍" },
  { value: "crypto", label: "Cryptography", icon: "🔐" },
  { value: "forensics", label: "Forensics", icon: "🔬" },
  { value: "misc", label: "Miscellaneous", icon: "🧩" },
];

export interface Course {
  id: string;
  title: string;
  description: string;
  content: string;
  created_at: string;
}

export interface ExamQuestion {
  question: string;
  options: string[];
  correct_option: number;
}

export interface Exam {
  id: string;
  course_id: string;
  title: string;
  passing_score: number;
  questions: ExamQuestion[];
  created_at: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  student_name: string;
  issued_at: string;
}
