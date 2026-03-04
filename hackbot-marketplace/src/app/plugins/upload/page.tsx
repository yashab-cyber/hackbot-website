"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PLUGIN_CATEGORIES, type PluginCategory } from "@/types";
import toast from "react-hot-toast";

export default function UploadPluginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    long_description: "",
    version: "1.0.0",
    category: "misc" as PluginCategory,
    tags: "",
    source_url: "",
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setAuthenticated(true);
        setUserId(user.id);
        setUsername(user.user_metadata?.user_name || user.email?.split("@")[0] || "");
        setAvatarUrl(user.user_metadata?.avatar_url || null);
      }
    }
    checkAuth();
  }, []);

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/plugins/upload`,
      },
    });
  };

  const slugify = (str: string) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authenticated) return;

    // Validation
    if (!form.name.trim()) return toast.error("Plugin name is required");
    if (!form.description.trim()) return toast.error("Description is required");
    if (form.name.length < 3) return toast.error("Name must be at least 3 characters");
    if (form.description.length < 10) return toast.error("Description must be at least 10 characters");

    setLoading(true);

    try {
      const slug = slugify(form.name);
      const tags = form.tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      let filePath: string | null = null;
      let fileSize: number | null = null;

      // Upload file if provided
      if (file) {
        const ext = file.name.split(".").pop();
        const path = `${userId}/${slug}/${slug}-v${form.version}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("plugins")
          .upload(path, file, {
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) {
          toast.error(`File upload failed: ${uploadError.message}`);
          setLoading(false);
          return;
        }

        filePath = path;
        fileSize = file.size;
      }

      // Insert plugin record
      const { error: insertError } = await supabase.from("plugins").insert({
        name: form.name.trim(),
        slug,
        description: form.description.trim(),
        long_description: form.long_description.trim() || null,
        version: form.version.trim(),
        category: form.category,
        author_id: userId,
        author_username: username,
        author_avatar_url: avatarUrl,
        source_url: form.source_url.trim() || null,
        tags,
        file_path: filePath,
        file_size: fileSize,
      });

      if (insertError) {
        if (insertError.code === "23505") {
          toast.error("A plugin with this name already exists");
        } else {
          toast.error(`Failed to create plugin: ${insertError.message}`);
        }
        setLoading(false);
        return;
      }

      toast.success("Plugin published successfully!");
      router.push(`/plugins/${slug}`);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-xl bg-hb-accent/10 border border-hb-accent/20 flex items-center justify-center">
            <Upload className="w-8 h-8 text-hb-accent" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">
            Sign in to Upload
          </h1>
          <p className="text-gray-400 mb-6">
            You need a GitHub account to publish plugins to the HackBot
            marketplace.
          </p>
          <button
            onClick={signIn}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-white/5 border border-hb-border rounded-xl text-white font-medium hover:border-hb-accent/50 hover:text-hb-accent transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Sign in with GitHub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-hb-accent/10 border border-hb-accent/20 flex items-center justify-center">
            <Upload className="w-6 h-6 text-hb-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Upload Plugin</h1>
            <p className="text-sm text-gray-500">
              Share your HackBot plugin with the community
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <FormField label="Plugin Name" required>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="My Awesome Scanner"
              className="form-input"
              maxLength={80}
            />
            {form.name && (
              <p className="text-xs text-gray-500 mt-1">
                Slug: {slugify(form.name)}
              </p>
            )}
          </FormField>

          {/* Short Description */}
          <FormField label="Short Description" required>
            <input
              type="text"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="A brief description of what your plugin does"
              className="form-input"
              maxLength={200}
            />
          </FormField>

          {/* Long Description */}
          <FormField label="Detailed Description" hint="Supports Markdown">
            <textarea
              value={form.long_description}
              onChange={(e) =>
                setForm({ ...form, long_description: e.target.value })
              }
              placeholder="## Overview&#10;&#10;Describe your plugin in detail...&#10;&#10;## Features&#10;&#10;- Feature 1&#10;- Feature 2&#10;&#10;## Usage&#10;&#10;```bash&#10;hackbot my-plugin target.com&#10;```"
              className="form-input min-h-[200px] resize-y"
              rows={8}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Category */}
            <FormField label="Category" required>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as PluginCategory })
                }
                className="form-input"
              >
                {PLUGIN_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </FormField>

            {/* Version */}
            <FormField label="Version" required>
              <input
                type="text"
                value={form.version}
                onChange={(e) => setForm({ ...form, version: e.target.value })}
                placeholder="1.0.0"
                className="form-input"
                pattern="^\d+\.\d+\.\d+.*$"
              />
            </FormField>
          </div>

          {/* Tags */}
          <FormField label="Tags" hint="Comma-separated">
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="nmap, scanner, recon, automation"
              className="form-input"
            />
          </FormField>

          {/* Source URL */}
          <FormField label="Source Code URL" hint="GitHub repository link">
            <input
              type="url"
              value={form.source_url}
              onChange={(e) => setForm({ ...form, source_url: e.target.value })}
              placeholder="https://github.com/username/my-plugin"
              className="form-input"
            />
          </FormField>

          {/* File Upload */}
          <FormField label="Plugin File" hint=".py, .zip, .tar.gz (max 50MB)">
            <div className="relative">
              <input
                type="file"
                accept=".py,.zip,.tar.gz,.tgz"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border file:border-hb-border file:bg-hb-card file:text-sm file:font-medium file:text-gray-300 hover:file:bg-hb-card-hover file:cursor-pointer file:transition-all"
              />
              {file && (
                <div className="mt-2 flex items-center gap-2 text-sm text-hb-accent">
                  <CheckCircle size={14} />
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </div>
              )}
            </div>
          </FormField>

          {/* Info */}
          <div className="flex items-start gap-3 p-4 bg-hb-accent/5 border border-hb-accent/15 rounded-xl">
            <AlertCircle size={18} className="text-hb-accent shrink-0 mt-0.5" />
            <div className="text-sm text-gray-400">
              <p className="font-medium text-hb-accent mb-1">Publishing Guidelines</p>
              <ul className="space-y-1">
                <li>- Plugins must be for legitimate, authorized security testing only</li>
                <li>- Include documentation and usage examples</li>
                <li>- Follow HackBot plugin API conventions</li>
                <li>- Malicious plugins will be removed and the author banned</li>
              </ul>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-hb-accent text-hb-bg font-bold rounded-xl hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Publishing...
              </>
            ) : (
              <>
                <Upload size={18} /> Publish Plugin
              </>
            )}
          </button>
        </form>
      </div>

      <style jsx global>{`
        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: #131b2b;
          border: 1px solid #1a2640;
          border-radius: 0.75rem;
          color: white;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.2s;
        }
        .form-input:focus {
          border-color: rgba(0, 255, 136, 0.5);
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.1);
        }
        .form-input::placeholder {
          color: #556078;
        }
        select.form-input {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23556078' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
        }
        select.form-input option {
          background: #131b2b;
          color: white;
        }
      `}</style>
    </div>
  );
}

function FormField({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
        {required && <span className="text-hb-agent ml-1">*</span>}
        {hint && (
          <span className="text-xs text-gray-500 font-normal ml-2">({hint})</span>
        )}
      </label>
      {children}
    </div>
  );
}
