# HackBot Plugin Marketplace 🤖

A dynamic 3D website and plugin marketplace for [HackBot](https://github.com/yashab-cyber/hackbot) — the AI-powered cybersecurity assistant.

Built with **Next.js 14**, **Three.js**, **Supabase**, and **Tailwind CSS**.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![Three.js](https://img.shields.io/badge/Three.js-3D-black?logo=three.js)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-green?logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)

---

## Features

- **3D Interactive Hero** — Cyber-themed Three.js scene with particles, wireframe sphere, data streams, and animated grid
- **Plugin Marketplace** — Browse, search, filter, upload, download, star, and review community plugins
- **GitHub OAuth** — One-click sign-in via Supabase + GitHub OAuth
- **User Dashboard** — Manage your uploaded plugins, view download stats and stars
- **Plugin Detail Pages** — Full plugin pages with install instructions, author info, tags, and star/download actions
- **Plugin Upload** — Authenticated users can publish plugins with file uploads to Supabase Storage
- **REST API** — `/api/plugins` endpoints for programmatic access
- **Responsive Design** — Mobile-first Tailwind CSS design matching the HackBot dark cybersecurity theme
- **Original Website Content** — All features, modes, providers, install instructions from the static site

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 14** (App Router) | SSR/SSG React framework |
| **Three.js** (@react-three/fiber) | 3D WebGL scenes |
| **Supabase** | Auth (GitHub OAuth), PostgreSQL database, file storage |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Scroll animations |
| **Lucide React** | Icons |
| **TypeScript** | Type safety |

---

## Getting Started

### 1. Clone & Install

```bash
cd hackbot-marketplace
npm install
```

### 2. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the schema in [`supabase/schema.sql`](supabase/schema.sql)
3. Go to **Authentication → Providers → GitHub** and enable it:
   - Create a GitHub OAuth App at [github.com/settings/developers](https://github.com/settings/developers)
   - Set callback URL to: `https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback`
   - Copy the Client ID and Client Secret into Supabase
4. Go to **Storage** and create a bucket called `plugins` (private, 50MB limit)
5. Copy your project URL and anon key

### 3. Configure Environment

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
hackbot-marketplace/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (Navbar + Footer)
│   │   ├── page.tsx                # Home page (3D hero + features + modes + providers + install)
│   │   ├── globals.css             # Global styles
│   │   ├── marketplace/
│   │   │   └── page.tsx            # Plugin marketplace (search, filter, sort)
│   │   ├── plugins/
│   │   │   ├── [slug]/page.tsx     # Plugin detail page
│   │   │   └── upload/page.tsx     # Upload plugin form
│   │   ├── dashboard/
│   │   │   └── page.tsx            # User dashboard
│   │   ├── auth/
│   │   │   ├── callback/route.ts   # OAuth callback handler
│   │   │   └── error/page.tsx      # Auth error page
│   │   └── api/
│   │       └── plugins/
│   │           ├── route.ts        # GET /api/plugins (list)
│   │           └── [slug]/
│   │               ├── route.ts    # GET/DELETE /api/plugins/:slug
│   │               └── download/route.ts  # POST download tracker
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx          # Navigation with auth
│   │   │   └── Footer.tsx          # Site footer
│   │   ├── marketplace/
│   │   │   ├── PluginCard.tsx      # Plugin grid card
│   │   │   └── FilterBar.tsx       # Search + filter UI
│   │   └── three/
│   │       ├── HeroScene.tsx       # 3D hero (sphere, particles, grid, streams)
│   │       └── MarketplaceScene.tsx # 3D marketplace background
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts           # Browser Supabase client
│   │       └── server.ts           # Server Supabase client
│   ├── types/
│   │   └── index.ts                # TypeScript types + categories
│   └── middleware.ts               # Supabase session middleware
├── supabase/
│   └── schema.sql                  # Full database schema + RLS policies
├── .env.local                      # Environment variables
├── tailwind.config.ts
├── next.config.mjs
├── tsconfig.json
└── package.json
```

---

## Pages

| Route | Description |
|---|---|
| `/` | Home page — 3D hero, features, modes, providers, install guides |
| `/marketplace` | Plugin marketplace — browse, search, filter, sort |
| `/marketplace?category=scanner` | Filter by category |
| `/marketplace?featured=true` | Featured plugins |
| `/plugins/:slug` | Plugin detail — info, download, star, install instructions |
| `/plugins/upload` | Upload new plugin (auth required) |
| `/dashboard` | User dashboard — manage plugins, view stats |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/plugins` | List plugins (supports `?category`, `?q`, `?sort`, `?featured`, `?limit`, `?offset`) |
| `GET` | `/api/plugins/:slug` | Get single plugin |
| `DELETE` | `/api/plugins/:slug` | Delete plugin (auth, owner only) |
| `POST` | `/api/plugins/:slug/download` | Track download + get signed URL |

---

## Database Schema

The full schema is in [`supabase/schema.sql`](supabase/schema.sql) and includes:

- **profiles** — User profiles (auto-created on signup via trigger)
- **plugins** — Plugin listings with metadata, download counts, stars
- **plugin_reviews** — User reviews with ratings
- **plugin_stars** — User bookmarks/stars
- **plugin_downloads** — Download audit log
- **Row Level Security** — Proper read/write policies
- **Functions** — `toggle_star()`, `increment_downloads()`, `handle_new_user()`

---

## Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

Set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## License

MIT — [Yashab Alam](https://github.com/yashab-cyber)
