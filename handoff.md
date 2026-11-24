# Project Handoff & Architecture Blueprint: AI Resume Builder Pro (ResumeForge)

> **Document Version:** 1.0.0  
> **Last Updated:** August 2026  
> **Target Audience:** AI Engineering Agents (Claude / Antigravity / Cursor / Windsurf) & Lead Developers  
> **Project Goal:** Full-stack, production-grade AI-powered resume and cover letter builder SaaS with Supabase authentication, database persistence, credit-based usage, ATS score optimization, dynamic templating, and subscription billing.

---

## 1. Executive Summary & Tech Stack

**AI Resume Builder Pro** (internal brand: *ResumeForge*) is a modern Single Page Application (SPA) built with React 19 and Vite 8, featuring Tailwind CSS v4 for UI styling, Framer Motion for rich micro-animations, and Supabase for backend-as-a-service (PostgreSQL database, Row-Level Security, Supabase Auth, Storage Buckets, and Deno Edge Functions).

### Technology Matrix

| Layer | Technology | Version / Details |
|---|---|---|
| **Frontend Framework** | React | `^19.2.8` |
| **Build & Dev Tool** | Vite | `^8.2.0` |
| **Routing** | React Router DOM | `^7.18.2` |
| **Styling** | Tailwind CSS (Vite plugin) | `@tailwindcss/vite ^4.3.3`, `tailwindcss ^4.3.3` |
| **Icons & UI** | React Icons & Lucide React | `react-icons ^5.7.0`, `lucide-react ^1.31.0` |
| **Animations** | Framer Motion | `^12.43.0` |
| **Document Export** | react-to-print | `^3.3.0` (High-fidelity A4 multi-page CSS `@media print`) |
| **Backend & Auth** | Supabase JS SDK | `@supabase/supabase-js ^2.112.0` |
| **Edge Compute** | Supabase Edge Functions | Deno TypeScript (`create-checkout`, `payment-webhook`) |
| **Database Engine** | PostgreSQL (Supabase) | Row-Level Security, RPC functions, Realtime channels |

---

## 2. Directory Structure & File Map

```
ai-resume-builder-pro/
├── .env                              # VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY
├── index.html                        # SPA HTML root with Inter typography
├── package.json                      # Dependencies & scripts
├── vite.config.js                    # Vite configuration with React & Tailwind plugins
├── supabase/
│   └── functions/
│       ├── create-checkout/index.ts  # Edge function: Validates plan & creates payment order
│       └── payment-webhook/index.ts  # Edge function: Activates subscription & credits via RPC
├── src/
│   ├── main.jsx                      # App root with Context Providers
│   ├── App.jsx                       # Entry component
│   ├── index.css                     # Global Tailwind directives
│   ├── lib/
│   │   └── supabase.js               # Initialized Supabase client instance
│   ├── router/
│   │   └── AppRoutes.jsx             # Public & Protected route definitions
│   ├── context/
│   │   ├── AuthContext.jsx           # Session & user auth state + onAuthStateChange
│   │   ├── ResumeContext.jsx         # Live resume builder state, normalizer & CRUD reducers
│   │   ├── PricingContext.jsx        # Active plan, credit balance, feature flags, realtime sync
│   │   ├── ProfileContext.jsx        # User profile, skills, education, avatar upload
│   │   ├── SettingsContext.jsx       # User preferences, security, documents settings
│   │   └── CoverLetterContext.jsx    # Cover letter state management
│   ├── services/
│   │   ├── authService.js            # Supabase auth wrapper (signUp, signIn, signOut)
│   │   ├── creditService.js          # RPC caller for `deduct_credit` & subscription balance
│   │   ├── pricingService.js         # Plan fetching & pricing utilities
│   │   ├── resumeService.js          # Supabase resume CRUD helper (needs import fix)
│   │   └── settingsService.js        # User settings updates
│   ├── utils/
│   │   ├── featureEntitlements.js    # Plan-tier access rules (Starter/Pro/Team capabilities)
│   │   ├── resumeCompletion.js       # Field completion percentage helper
│   │   ├── ats/
│   │   │   └── calculateATSScore.js  # Heuristic ATS score algorithm (0-100%)
│   │   └── storage/
│   │       └── resumeStorage.js      # LocalStorage fallback storage helper
│   ├── components/
│   │   ├── auth/                     # LoginForm, RegisterForm, AuthInput, SocialLogin, ProtectedRoute
│   │   ├── builder/                  # BuilderHeader, BuilderSidebar, BuilderContent, ResumePreview
│   │   │   ├── forms/                # Form fields for Experience, etc.
│   │   │   ├── modals/               # Add/Edit Modals (Experience, Education, Skills, Projects, Certs)
│   │   │   ├── preview/              # Modular resume preview sections
│   │   │   └── sections/             # Section forms & list cards
│   │   ├── coverLetter/              # CoverLetterEditor, CoverLetterTemplates
│   │   ├── dashboard/                # WelcomeBanner, StatsCards, QuickActions, RecentResumes
│   │   ├── layout/                   # Navbar, Footer, DashboardHeader
│   │   ├── profile/                  # PersonalInformation, SkillsSection, EducationSection (stubs)
│   │   ├── resumes/                  # ResumeCard, EmptyState, DeleteModal
│   │   ├── sections/                 # Landing page sections (Hero, Features, HowItWorks, Demo, etc.)
│   │   ├── settings/                 # AccountSettings, SecuritySettings, AppearanceSettings, DangerZone
│   │   ├── templates/                # 5 Resume Templates (Modern, Professional, Minimal, Creative, Executive)
│   │   └── UI/                       # Reusable UI atoms (Badge, Button, Card, Modal, ScrollToTop)
│   └── pages/
│       ├── Home.jsx                  # Marketing landing page
│       ├── Login.jsx                 # User login page
│       ├── Register.jsx              # User registration page
│       ├── Dashboard.jsx             # User dashboard with stats, plan perks & recent docs
│       ├── ResumeBuilder.jsx         # Full-featured live resume builder
│       ├── Templates.jsx             # Template catalogue with filtering & interactive previews
│       ├── MyResumes.jsx             # User resumes library with CRUD actions
│       ├── CoverLetter.jsx           # Cover letter editor & generator
│       ├── MyProfile.jsx             # Comprehensive user profile & master resume data
│       ├── Settings.jsx              # Account, appearance, document settings
│       ├── Checkout.jsx              # Plan checkout gateway
│       ├── TestCheckout.jsx          # Test payment simulator
│       └── NotFound.jsx              # 404 page
```

---

## 3. Database Schema & Architecture

The database is hosted on Supabase (PostgreSQL). The key relational tables and RPC functions are:

### Database Tables

1. **`resumes`**
   - `id` (`uuid`, Primary Key, default `gen_random_uuid()`)
   - `user_id` (`uuid`, Foreign Key -> `auth.users.id`)
   - `title` (`text`) - e.g. "Talal Hassan - Resume"
   - `ats_score` (`numeric`) - Calculated score (0-100)
   - `downloads` (`integer`, default `0`)
   - `template` (`text`) - e.g. `"modern"`, `"professional"`, `"minimal"`, `"creative"`, `"executive"`
   - `resume_data` (`jsonb`) - Complete normalized JSON object:
     ```json
     {
       "template": "modern",
       "personalInfo": {
         "fullName": "", "jobTitle": "", "email": "", "phone": "",
         "location": "", "website": "", "linkedin": "", "github": "", "summary": ""
       },
       "experience": [{ "id": "uuid", "company": "", "jobTitle": "", "startDate": "", "endDate": "", "description": "", "currentlyWorking": false }],
       "education": [{ "id": "uuid", "institution": "", "degree": "", "fieldOfStudy": "", "startDate": "", "endDate": "" }],
       "skills": [{ "id": "uuid", "name": "", "level": "Expert" }],
       "projects": [{ "id": "uuid", "title": "", "description": "", "link": "", "technologies": "" }],
       "certifications": [{ "id": "uuid", "name": "", "issuer": "", "issueDate": "" }]
     }
     ```
   - `created_at` (`timestamp with time zone`)
   - `updated_at` (`timestamp with time zone`)

2. **`profiles`**
   - `id` (`uuid`, Primary Key -> `auth.users.id`)
   - `full_name`, `professional_title`, `location`, `summary`, `years_of_experience`, `desired_job_title`
   - `email`, `phone`, `website`, `linkedin`, `github`, `photo_url`
   - `skills` (`jsonb` array)
   - `education` (`jsonb` array)
   - `experience` (`jsonb` array)

3. **`plans`**
   - `id` (`uuid`, PK)
   - `name` (`text`) - "Starter", "Pro", "Team"
   - `slug` (`text`) - `"starter"`, `"pro"`, `"team"`
   - `price_monthly` (`numeric`), `price_yearly` (`numeric`), `currency` (`text`)
   - `max_resumes` (`integer` or `null` for unlimited)
   - `monthly_credits` (`integer`) - e.g. 50, 500, 1500
   - `premium_templates` (`boolean`)
   - `cover_letters` (`boolean`)
   - `ats_optimization` (`boolean`)
   - `ai_resume_generation` (`boolean`)
   - `ai_resume_analysis` (`boolean`)
   - `team_workspace` (`boolean`)
   - `max_team_members` (`integer`)
   - `is_active` (`boolean`)

4. **`user_subscriptions`**
   - `id` (`uuid`, PK)
   - `user_id` (`uuid` -> `auth.users.id`)
   - `plan_id` (`uuid` -> `plans.id`)
   - `status` (`text`) - `"active"`, `"canceled"`, `"past_due"`
   - `billing_cycle` (`text`) - `"monthly"`, `"yearly"`
   - `credits_remaining` (`integer`) - **Single source of truth for AI credits**
   - `current_period_start`, `current_period_end`

5. **`payment_transactions`**
   - `id` (`uuid`, PK), `user_id` (`uuid`), `order_id` (`text`), `provider` (`text`), `plan_id` (`uuid`), `billing_cycle` (`text`), `amount` (`numeric`), `currency` (`text`), `status` (`text`: `"pending"`, `"paid"`, `"failed"`).

### Supabase Storage Buckets
- `profile-photos`: Public bucket for user profile avatar uploads.

### Stored Procedures / RPCs
- `deduct_credit(p_amount integer, p_description text)`: Atomically validates active subscription, checks `credits_remaining >= p_amount`, decrements `credits_remaining`, and returns remaining balance.
- `activate_paid_subscription(p_order_id text, p_provider_payment_id text, p_provider_subscription_id text)`: Validates payment transaction, updates status to `'paid'`, sets user subscription with new plan, and assigns plan's `monthly_credits`.

---

## 4. Current State of the Application

### What is Working Well:
1. **Live Interactive Resume Builder (`/builder`, `/builder/:id`):** Real-time side-by-side editing, instant template switching, full modal-driven section management, credit deduction on resume creation, automatic save/update to Supabase `resumes` table.
2. **5 Built-in Beautiful Resume Templates:**
   - `modern`: Two-column modern layout with skill pills and contact badges.
   - `professional`: Structured corporate layout with clean borders.
   - `minimal`: Elegant typography-first ATS design.
   - `creative`: Sidebar-accented layout for designers and creatives.
   - `executive`: Formal serif-accented layout for senior leaders.
3. **High Quality PDF Generation:** `react-to-print` with customized CSS rules (`break-inside: avoid`, exact A4 dimensions, print color preservation).
4. **Interactive Templates Showcase (`/templates`):** Category filter, search, interactive preview modal, "Use Template" redirect into builder.
5. **Dashboard (`/dashboard`):** Realtime listener for subscription & credits, average ATS score aggregation, profile completeness tracker, recent resumes quick actions.
6. **Authentication & Protected Routes:** Protected routes automatically redirect unauthenticated users to `/login`.
7. **Test Checkout Pipeline (`/checkout` -> `create-checkout` -> `/test-checkout` -> `payment-webhook`):** Fully simulated checkout flow that securely validates plan IDs in edge functions without trusting client prices.

---

## 5. Critical Issues, Bugs & Technical Debt to Address

Before adding new features, the following bugs and code debt must be resolved:

### A. Empty / 0-Byte Stub Files
The following files were created as empty stubs and should either be implemented or removed:
- `src/App.css` (Unused, remove or keep empty)
- `src/components/dashboard/ResumeCard.jsx` (Duplicate stub — the real one is `src/components/resumes/ResumeCard.jsx`)
- `src/components/layout/Navbar/MobileMenu.jsx` (Inline inside `Navbar.jsx`)
- `src/components/profile/EducationSection.jsx`, `PersonalInformation.jsx`, `ProfessionalInformation.jsx`, `ProfileHeader.jsx`, `SkillsSection.jsx` (Stub files — `MyProfile.jsx` was written as a 1380-line monolithic file instead of importing these)
- `src/components/resumes/DeleteModal.jsx`, `ResumeList.jsx`
- `src/components/sections/Demo/useDemoAnimation.js`
- `src/components/UI/Card/GlassCard.jsx`, `src/components/UI/Input/Input.jsx`
- `src/data/coverLetterTemplates.js`

### B. Broken / Dead Imports
- `src/services/resumeService.js`: Line 1 imports `import { supabase } from "../supabase/supabase";` (which does not exist; correct path is `../lib/supabase`). Currently unused because pages write inline Supabase queries.
- `src/components/auth/SocialLogin.jsx`: `handleGoogleLogin()` only logs to console instead of calling `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: ... } })`.
- `src/components/auth/LoginForm.jsx`: Links to `/forgot-password`, but `/forgot-password` route is missing in `AppRoutes.jsx` (navigates to 404).

### C. Redundant Provider Wrapping
- `ProfileProvider` is wrapped in `main.jsx` AND also re-wrapped inside `AppRoutes.jsx` on `/profile`. Re-wrapping creates two independent profile context states. Keep it only at `main.jsx` level.

### D. Monolithic Files
- `src/pages/CoverLetter.jsx` is 1,967 lines long and bypasses `CoverLetterContext.jsx` and `src/components/coverLetter/CoverLetterEditor.jsx`.
- `src/pages/MyProfile.jsx` is 1,381 lines long and does not use `src/components/profile/*`.

### E. Simulated AI (No Real AI API Connected)
- In `src/pages/ResumeBuilder.jsx`, `handleGenerateResume()` deducts 1 credit and runs `setTimeout(1200)` as a placeholder. It needs a real AI backend integration (Gemini / Anthropic / OpenAI) to generate tailored resumes.
- In `src/pages/CoverLetter.jsx`, AI generation uses static placeholder string interpolation.

---

## 6. High-Priority Feature Roadmap for the Claude Agent

When updating the project, prioritize the following features in phases:

### Phase 1: Real AI Integration & Intelligence Suite 🤖
1. **AI Resume Generator Edge Function (`supabase/functions/ai-resume-generator`):**
   - Connect to LLM (Google Gemini API / Anthropic Claude / OpenAI API).
   - Support inputs: Target Job Title, Industry, Years of Experience, Key Skills, or raw Job Description text.
   - Output structured JSON matching `initialResumeData` to populate all sections automatically.
2. **AI Bullet Point Improver (Section-level AI):**
   - "Enhance with AI" button on Work Experience bullet points.
   - Converts passive text (e.g. "Worked on frontend") to high-impact STAR format with action verbs and metrics (e.g. "Architected 12+ responsive React components, improving page load speed by 35%").
3. **AI Summary & Headline Generator:**
   - 1-click generation of 3 distinct summary styles (Executive, Creative, Technical) based on filled experience and skills.
4. **AI Job-Tailored Cover Letter Generator:**
   - Paste a Job Description -> AI analyzes user's resume data and generates a highly personalized, compelling cover letter in seconds.
5. **AI ATS Scanner & Match Analyzer:**
   - Compare current resume against a pasted Job Description.
   - Provide keyword match percentage, missing required keywords, formatting warnings, and 1-click optimization suggestions.

### Phase 2: User Experience & Export Enhancements 📄
1. **Multi-Format Export:**
   - In addition to PDF, add **Export to Word (.docx)** and **Export to JSON / Plain Text**.
2. **Resume Import:**
   - Upload existing PDF / DOCX / LinkedIn PDF resume -> AI parser extracts and maps data directly into builder fields.
3. **Color Palette & Font Customizer in Builder:**
   - Allow users to select custom primary/accent colors and Google Fonts (Inter, Roboto, Poppins, Merriweather) with live preview.
4. **Multi-page Drag-and-Drop Section Reordering:**
   - Allow reordering sections (e.g. move Skills above Experience) dynamically.

### Phase 3: Auth & Security Complete Lifecycle 🔐
1. **Google OAuth Integration:**
   - Wire `SocialLogin.jsx` to `supabase.auth.signInWithOAuth({ provider: 'google' })`.
2. **Forgot / Reset Password Flow:**
   - Create `/forgot-password` and `/reset-password` pages with `supabase.auth.resetPasswordForEmail()`.
3. **Email Verification Banner / Flow:**
   - Handle email confirmation feedback cleanly.

### Phase 4: Database Persistence for Cover Letters & Cloud Sync ☁️
1. **`cover_letters` Supabase Table:**
   - Move cover letters from `localStorage` into PostgreSQL table linked to `auth.users.id`.
   - Add Cover Letters tab to Dashboard and My Documents.

---

## 7. Development Guidelines & Conventions

1. **Environment Variables:**
   - Always access frontend env variables via `import.meta.env.VITE_*`.
   - Supabase keys in edge functions via `Deno.env.get("SUPABASE_URL")` and `Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")`.
2. **Security Rules:**
   - Never expose `SUPABASE_SERVICE_ROLE_KEY` to Vite / React frontend.
   - All credit deductions and subscription status updates MUST run server-side via Supabase RPC or Edge Functions.
3. **Styling System:**
   - Tailwind CSS v4 is used with modern color schemes (`slate-*`, `blue-*`, `indigo-*`, `emerald-*`).
   - Use glassmorphism (`backdrop-blur-md bg-white/80`), subtle borders (`border-slate-200`), rounded modern radius (`rounded-2xl`, `rounded-3xl`), and responsive grids.
4. **State Management:**
   - Use `useResume()`, `usePricing()`, `useProfile()`, `useAuth()`, and `useSettings()`.
   - Always normalize data structures when loading from database to avoid undefined errors in templates.
5. **Verification & Build:**
   - Run `npm run build` after major edits to ensure TypeScript/Vite bundle compiles without errors.
