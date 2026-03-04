-- =============================================================
-- HackBot Plugin Marketplace — Supabase Database Schema
-- =============================================================
-- Run this in your Supabase SQL Editor to set up the database.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Profiles Table ─────────────────────────────────────────
-- Automatically created when a user signs up via GitHub OAuth
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  github_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Plugins Table ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.plugins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  version TEXT NOT NULL DEFAULT '1.0.0',
  category TEXT NOT NULL DEFAULT 'misc',
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  author_username TEXT NOT NULL,
  author_avatar_url TEXT,
  download_url TEXT,
  file_path TEXT,
  file_size BIGINT,
  source_url TEXT,
  tags TEXT[] DEFAULT '{}',
  downloads INTEGER DEFAULT 0,
  stars INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Plugin Reviews Table ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.plugin_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  plugin_id UUID REFERENCES public.plugins(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  username TEXT NOT NULL,
  avatar_url TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Plugin Stars (user bookmarks) ─────────────────────────
CREATE TABLE IF NOT EXISTS public.plugin_stars (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  plugin_id UUID REFERENCES public.plugins(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(plugin_id, user_id)
);

-- ─── Plugin Downloads Log ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.plugin_downloads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  plugin_id UUID REFERENCES public.plugins(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Indexes ────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_plugins_category ON public.plugins(category);
CREATE INDEX IF NOT EXISTS idx_plugins_author ON public.plugins(author_id);
CREATE INDEX IF NOT EXISTS idx_plugins_slug ON public.plugins(slug);
CREATE INDEX IF NOT EXISTS idx_plugins_downloads ON public.plugins(downloads DESC);
CREATE INDEX IF NOT EXISTS idx_plugins_stars ON public.plugins(stars DESC);
CREATE INDEX IF NOT EXISTS idx_plugins_featured ON public.plugins(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_plugins_tags ON public.plugins USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_reviews_plugin ON public.plugin_reviews(plugin_id);
CREATE INDEX IF NOT EXISTS idx_stars_plugin ON public.plugin_stars(plugin_id);
CREATE INDEX IF NOT EXISTS idx_stars_user ON public.plugin_stars(user_id);

-- ─── Row Level Security ─────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plugins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plugin_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plugin_stars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plugin_downloads ENABLE ROW LEVEL SECURITY;

-- Profiles: public read, self update
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Plugins: public read, author CRUD
CREATE POLICY "Plugins are viewable by everyone" ON public.plugins
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create plugins" ON public.plugins
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own plugins" ON public.plugins
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own plugins" ON public.plugins
  FOR DELETE USING (auth.uid() = author_id);

-- Reviews: public read, authenticated create, own delete
CREATE POLICY "Reviews are viewable by everyone" ON public.plugin_reviews
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews" ON public.plugin_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON public.plugin_reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Stars: public read, authenticated toggle
CREATE POLICY "Stars are viewable by everyone" ON public.plugin_stars
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can star plugins" ON public.plugin_stars
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own stars" ON public.plugin_stars
  FOR DELETE USING (auth.uid() = user_id);

-- Downloads: insertable by anyone, viewable by plugin author
CREATE POLICY "Anyone can log downloads" ON public.plugin_downloads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Download logs viewable by plugin authors" ON public.plugin_downloads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.plugins
      WHERE plugins.id = plugin_downloads.plugin_id
        AND plugins.author_id = auth.uid()
    )
  );

-- ─── Functions ──────────────────────────────────────────────

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url, github_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'user_name', NEW.raw_user_meta_data->>'preferred_username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url',
    CONCAT('https://github.com/', NEW.raw_user_meta_data->>'user_name')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Increment download count
CREATE OR REPLACE FUNCTION public.increment_downloads(plugin_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.plugins SET downloads = downloads + 1 WHERE id = plugin_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Toggle star (returns new star count)
CREATE OR REPLACE FUNCTION public.toggle_star(p_plugin_id UUID, p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  star_exists BOOLEAN;
  new_count INTEGER;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM public.plugin_stars WHERE plugin_id = p_plugin_id AND user_id = p_user_id
  ) INTO star_exists;

  IF star_exists THEN
    DELETE FROM public.plugin_stars WHERE plugin_id = p_plugin_id AND user_id = p_user_id;
    UPDATE public.plugins SET stars = stars - 1 WHERE id = p_plugin_id;
  ELSE
    INSERT INTO public.plugin_stars (plugin_id, user_id) VALUES (p_plugin_id, p_user_id);
    UPDATE public.plugins SET stars = stars + 1 WHERE id = p_plugin_id;
  END IF;

  SELECT stars INTO new_count FROM public.plugins WHERE id = p_plugin_id;
  RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── Storage Bucket ─────────────────────────────────────────
-- Create a storage bucket for plugin files (run in Dashboard > Storage)
-- Bucket name: "plugins"
-- Public: false
-- File size limit: 50MB
-- Allowed MIME types: application/zip, application/x-tar, application/gzip, application/x-python-code, text/x-python
