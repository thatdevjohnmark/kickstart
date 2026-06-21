# Kickstart

### Next.js + Supabase + 8-Bit Inspired SaaS

---

# Project Vision

Kickstart is a modern job application tracking platform inspired by retro 8-bit interfaces.

The goal is to create the best-looking and easiest-to-use job tracker for developers, remote workers, and job seekers.

Core principles:

* Fast
* Modern SaaS architecture
* Retro-inspired visuals
* Mobile-friendly
* Analytics-focused
* Resume performance tracking
* Secure cloud sync via Supabase

---

# Tech Stack

## Frontend

* Next.js 16 (App Router)
* TypeScript
* Tailwind CSS v4
* shadcn/ui
* Lucide React
* dnd-kit
* @aejkatappaja/phantom-ui (skeleton loading)

## Backend

* Supabase Authentication
* Supabase PostgreSQL
* Supabase Storage

## Deployment

* Vercel

---

# Folder Structure

```txt
kickstart/

├── app/
│
├── (public)/
│   ├── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── signup/
│   │   └── page.tsx
│   ├── forgot-password/
│   │   └── page.tsx
│
├── (dashboard)/
│   ├── dashboard/
│   │   └── page.tsx
│   ├── applications/
│   │   └── page.tsx
│   ├── analytics/
│   │   └── page.tsx
│   ├── settings/
│   │   └── page.tsx
│
├── layout.tsx
├── globals.css
│
├── components/
│   ├── board/
│   ├── dashboard/
│   ├── analytics/
│   ├── dialogs/
│   ├── auth/
│   └── ui/
│
├── hooks/
│   ├── use-applications.ts
│   ├── use-board.ts
│   ├── use-search.ts
│   └── use-theme.ts
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   │
│   ├── actions/
│   └── utils.ts
│
├── types/
│
├── public/
│   ├── icons/
│   ├── pixel-art/
│   └── logo.svg
│
├── middleware.ts
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

# Authentication

## Login

Route:

```txt
/login
```

Features:

* Email Login
* Password Login
* Google OAuth
* Remember Me
* Forgot Password
* Redirect to Dashboard

Layout:

```txt
┌─────────────────────────────┐
│        KICKSTART            │
│                             │
│      Welcome Back           │
│                             │
│ Email                       │
│ [____________________]      │
│                             │
│ Password                    │
│ [____________________]      │
│                             │
│ [ Login ]                   │
│                             │
│ Continue with Google        │
│                             │
│ Create Account              │
└─────────────────────────────┘
```

---

## Signup

Route:

```txt
/signup
```

Fields:

* Full Name
* Email
* Password
* Confirm Password

Buttons:

* Create Account
* Continue with Google

---

## Forgot Password

Route:

```txt
/forgot-password
```

Flow:

```txt
Email
→ Send Reset Link
→ Reset Password Page
```

---

# Landing Page

Route:

```txt
/
```

Sections:

## Hero

```txt
Track Every Application.
Land More Interviews.

Kanban-style job tracker
built for modern job seekers.

[ Get Started ]
[ Live Demo ]
```

## Features

* Job Pipeline Board
* Analytics Dashboard
* Resume Tracking
* Interview Tracking
* Supabase Sync

## CTA

```txt
Start tracking applications today.
```

---

# Database Schema

## applications

```sql
create table applications (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null,

  company text not null,
  role text not null,

  stage text not null,

  location text,
  notes text,

  job_url text,
  salary text,

  date_applied date,

  reminder_date date,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

# Application Stages

```ts
export const STAGES = [
  "saved",
  "applied",
  "assessment",
  "interviewing",
  "offer",
  "rejected",
  "ghosted"
];
```

---

# Supabase Security

Enable RLS:

```sql
alter table applications
enable row level security;
```

Policy:

```sql
create policy "Users can access own applications"
on applications
for all
using (
 auth.uid() = user_id
);
```

---

# Dashboard

## Statistics

Show:

* Total Applications
* Active Applications
* Response Rate
* Interviews
* Offers

---

## Board Layout

```txt
┌─────────┬─────────┬─────────┬─────────┐
│ Saved   │ Applied │ Assess. │ Interview
├─────────┼─────────┼─────────┼─────────┤
│ Cards   │ Cards   │ Cards   │ Cards   │
└─────────┴─────────┴─────────┴─────────┘

┌─────────┬─────────┬─────────┐
│ Offer   │ Reject  │ Ghosted │
└─────────┴─────────┴─────────┘
```

---

# UI Style Guide

## Design Theme

Retro 8-Bit + Modern SaaS

Inspired by:

* Retro RPG Menus
* Pokémon UI
* Game Boy
* Trello
* Linear
* Notion

---

## Fonts

### Titles

```txt
Press Start 2P
```

### Body

```txt
Space Grotesk
```

---

## Color Palette

```css
--background: #09090b;
--surface: #18181b;

--primary: #6c82ff;

--saved: #94a3b8;
--applied: #60a5fa;
--assessment: #fbbf24;
--interviewing: #fb923c;
--offer: #34d399;
--rejected: #f87171;
--ghosted: #71717a;
```

---

## Card Style

```css
border: 3px solid;
border-radius: 8px;
box-shadow: 4px 4px 0px #000;
```

Hover:

```css
transform: translate(-2px, -2px);
```

---

# Tailwind Setup

Install:

```bash
npm install tailwindcss @tailwindcss/postcss postcss
```

Create:

```txt
postcss.config.mjs
```

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

Import:

```css
@import "tailwindcss";
```

inside:

```txt
app/globals.css
```

---

# Optional CDN Prototype

```html
<script src="https://cdn.tailwindcss.com"></script>
```

Theme:

```html
<script>
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: "#6c82ff",
      },
    },
  },
};
</script>
```

---

# Protected Routes

```txt
/dashboard
/applications
/analytics
/settings
```

---

# Public Routes

```txt
/
/login
/signup
/forgot-password
```

---

# MVP Features

## Authentication

* [x] Email Login
* [x] Google Login
* [x] Signup
* [x] Password Reset

## Applications

* [x] Create Application
* [x] Edit Application
* [x] Delete Application
* [x] Drag and Drop Stages
* [x] Search Applications
* [x] Optimistic UI Updates (add/edit/move/drag)
* [x] Link Resumes to Applications
* [x] Filter Applications

## Analytics

* [x] Response Rate
* [x] Active Applications
* [x] Interview Count
* [x] Offer Count
* [x] Monthly Trends

## Resume Tracking

Store:

```txt
Resume A
Resume B
Resume C
```

Track:

* [x] Applications per Resume
* [x] Interview Rate
* [x] Offer Rate
* [x] Link Resume to Application (via modal dropdown)

---

# Future Roadmap

## Version 2

* [x] Analytics Dashboard
* [x] Resume Tracking
* [x] Calendar View
* [x] Follow-up Reminders


## Version 3

* [ ] AI Resume Review
* [ ] AI Cover Letter Generator
* [ ] Job Match Scoring
* [ ] Interview Preparation Assistant
* [ ] Chrome Extension
* [ ] Team Accounts
* [ ] Shared Pipelines

---

# Recommended Packages

```bash
npm install @supabase/supabase-js

npm install @supabase/ssr

npm install @dnd-kit/core
npm install @dnd-kit/sortable

npm install lucide-react

npm install clsx
npm install tailwind-merge

npm install date-fns

npm install recharts

npm install zod

npm install react-hook-form

npm install @aejkatappaja/phantom-ui
```

---

# Development Roadmap

* [x] 1. Create Next.js Project
* [x] 2. Configure Tailwind
* [x] 3. Configure Supabase
* [x] 4. Setup Authentication
* [x] 5. Create Database Schema
* [x] 6. Build Landing Page
* [x] 7. Build Login & Signup
* [x] 8. Build Dashboard Layout
* [x] 9. Build Kanban Board
* [x] 10. Implement Drag & Drop
* [x] 11. CRUD Applications
* [x] 12. Analytics Dashboard
* [x] 13. Resume Tracking
* [ ] 14. Mobile Optimization
* [ ] 15. Deploy to Vercel

---

# Post-MVP Features (Implemented)

## Skeleton Loading

```tsx
<phantom-ui loading animation="pulse" reveal={0.3}>
  <div className="card">
    <img src={user?.avatar} />
    <h3>{user?.name ?? "x"}</h3>
    <p>{user?.bio ?? "x"}</p>
  </div>
</phantom-ui>
```

Pages with skeletons:

* [x] Dashboard (`loading.tsx`)
* [x] Applications Board (`loading.tsx`)
* [x] Analytics (`loading.tsx`)

Powered by `@aejkatappaja/phantom-ui` — structure-aware shimmer skeleton loader that measures real DOM to generate perfectly-aligned shimmer blocks. Supports `pulse`, `shimmer`, `breathe`, and `solid` animation modes.

## Hydration Fixes

* [x] `suppressHydrationWarning` on `<html>` and `<body>` for browser extension compatibility
* [x] dnd-kit `aria-describedby` ID mismatch fix

---

# Final Goal

Build a polished SaaS-grade application tracker that combines:

* [x] Trello-style workflow
* [x] Retro 8-bit design
* [x] Modern analytics
* [x] Resume performance tracking
* [x] Supabase cloud sync
* [ ] Mobile-first experience
* [x] Professional developer-grade architecture
