# 🚀 Kickstart V2 — "Job Hunter OS"

> *From passive tracker to active job-hunt coach.*

---

## Priority Legend

| Tier | When |
|------|------|
| **P0** | Ship-blocking. Do first. |
| **P1** | Core value. Ship in V2 or soon after. |
| **P2** | Engagement layer. Makes the app sticky. |
| **P3** | Nice-to-have. Build if P0-P2 land clean. |
| **P4** | Future. Not scoped for V2. |

---

## P0 — Ship It

### 🚀 Deploy to Vercel
- [ ] Set up production environment variables
- [ ] Configure Supabase production project
- [ ] Set up custom domain
- [ ] Configure CI/CD (auto-deploy on main)

### 🧩 shadcn/ui Component Migration
We already have shadcn/ui installed but only 3 components exist (`button`, `input`, `label`). Adding proper shadcn components cuts dev time on every feature below.

**Components to add:**
- `dialog` — modals for add/edit, ATS results
- `card` — dashboard cards, stats
- `select` — stage picker, filters
- `sheet` — mobile sidebar, detail panels
- `tabs` — dashboard sections, ATS report tabs
- `badge` — stage badges, score badges
- `progress` — ATS score bar, quality score bar
- `textarea` — notes fields
- `toast` — notifications, follow-up reminders
- `form` — all input forms with validation

**Why:** Every P1-P2 feature below needs modals, cards, forms. Building them from scratch is wasted effort when shadcn gives us accessible, styled primitives.

---

## P1 — Core Value

### 📄 ATS Resume Check ✅ IMPLEMENTED

Upload a resume → instant ATS compatibility analysis. No AI API needed — purely heuristic + keyword analysis.

**Built files:**

| File | Purpose |
|------|---------|
| `supabase/migrations/003_add_resume_checks.sql` | DB table + RLS |
| `lib/ats/engine.ts` | Graded scoring engine (0-100 per category) |
| `lib/ats/client-parser.ts` | Client-side PDF/DOCX/TXT text extraction |
| `lib/actions/resume-checks.ts` | Server actions: analyze + history |
| `components/ats/ats-form.tsx` | Scanner bed upload + scan animation + terminal green |
| `components/ats/ats-results.tsx` | High-score digit, collapsible category breakdown |
| `components/ats/ats-history.tsx` | Compact history with mini bars + sparkline |
| `app/(dashboard)/ats/page.tsx` | ATS page |
| `app/(dashboard)/ats/loading.tsx` | Skeleton loading |

**Analysis checks:**
| Check | What it looks for | Score range |
|-------|-------------------|-------------|
| Contact Information | Email, phone, LinkedIn, location | 0-100 |
| Section Headers | 13 standard resume sections | 0-100 (graded by count) |
| Action Verbs | 39 action verbs, passive voice, variety | 0-100 (graded by count) |
| Quantifiable Results | Percentages, money, scales, multipliers | 0-100 (4 sub-items) |
| Resume Length | Word count vs 1-page ideal | 0-100 (bell curve) |
| File Format | PDF preferred | 0-100 |
| Keyword Match | Optional JD paste → keyword overlap | 0-100 |

**Design features:**
- Scanner bed upload zone (L-bracket corners like a photocopier)
- Glowing scan line animation during analysis
- Terminal green (`#00ff88`) scanning phase
- High-score digit styling (`Press Start 2P`, `text-6xl`)
- Collapsible category cards (click to expand sub-items)
- Sparkline SVG showing score trend across history

**Dependencies installed:** `pdf-parse`, `mammoth`

### 📱 Mobile Optimization (Finish)
- [x] Responsive sidebar (bottom nav on mobile)
- [x] Touch-friendly drag and drop
- [x] Responsive board columns (horizontal scroll)
- [x] Responsive calendar grid
- [x] Mobile-friendly modals and dialogs
- [ ] Edge case polish: very small screens, landscape, tablet
- [ ] Test on real devices

---

## P2 — Engagement Layer ("Job Hunter OS" Differentiator)

### 🎯 Daily Focus Mode
Logic-driven dashboard showing exactly **3 priority tasks** per day:
- "Follow up with X (applied 7 days ago)"
- "Add a note to Y (interview tomorrow)"
- "Apply to 1 new job (weekly goal: 5/10)"
- Reduces decision fatigue and overwhelm

### ⭐ Application Quality Score
Self-assessment checklist scoring each application **0-100**:
- Custom cover letter? (+10)
- Referral noted? (+20)
- Skills match > 60%? (+15)
- Tailored resume? (+15)
- Followed up? (+10)
- Portfolio link included? (+10)
- Company research noted? (+10)
- Sent thank-you note? (+10)

Encourages higher-quality submissions.

### 🧭 Gentle Onboarding Wizard
2-minute setup flow on first login:
1. "What's your weekly application goal?" (5/10/15)
2. "Add your first job" — quick form
3. "Upload your resume" (optional, ties into ATS check)
4. Redirect to dashboard with Focus Mode active

Prevents "blank canvas" anxiety for new users.

---

## P3 — Smart Features

### 🔔 Smart Follow-up Reminders
Automated nudges based on application age + stage:
| Stage | Wait before reminder |
|-------|---------------------|
| Applied | 5 days |
| Assessment | 3 days after completion |
| Interviewing | 1 day before interview, 2 days after |
| Ghosted | 7 days |

Uses Supabase Edge Functions + Resend (free tier).

### 🔍 Job Match Scoring ✅ (built into ATS Check)
Text-frequency comparison between pasted Job Description and Resume:
- [x] Highlights missing keywords
- [x] Shows match percentage
- [x] No external API needed — pure text analysis

### 📝 Cover Letter Snippets Library
Save and reuse customizable paragraphs for different industries/roles.
Reduces friction of rewriting the same content.

---

## P4 — Future (Not in V2)

- 🤖 AI Resume Review (BYOK — bring your own API key)
- ✍️ AI Cover Letter Generator (BYOK)
- 💬 Interview Preparation Assistant
- 🧩 Chrome Extension
- 👥 Team Accounts & Shared Pipelines
- 📢 Public / Shareable Pipeline (for career coaches)

---

## 📦 Dependencies

```bash
# ✅ Installed
npm install pdf-parse mammoth

# ❌ Not yet installed
npm install @resend/react-email

# ❌ shadcn components not added yet
npx shadcn@latest add dialog card select sheet tabs badge progress textarea toast form
```

---

## ✅ V2 Progress

### P0 (Ship-blocking)
- [ ] Deploy to Vercel
- [ ] Add missing shadcn/ui components

### P1 (Core Value)
- [x] **ATS Resume Check** — upload + graded scoring + collapsible breakdown + scan animation + sparkline history
- [ ] Mobile optimization — polish edge cases, real-device testing

### P2 (Engagement)
- [ ] Daily Focus Mode — 3 priority tasks per day
- [ ] Application Quality Score — 0-100 self-assessment per application
- [ ] Gentle Onboarding Wizard — 2-minute first-run flow

### P3 (Smart Features)
- [x] **Job Match Scoring** (built into ATS as keyword analysis)
- [ ] Smart Follow-up Reminders — stage-based nudges
- [ ] Cover Letter Snippets Library — reusable paragraph templates

---

## 💸 Monetization (Considering)

| Tier | Price | What's included |
|------|-------|----------------|
| **Free** | $0 | Core tracking, ATS Check, Focus Mode, Quality Score, Reminders, Onboarding |
| **BYOK** | $0 | Bring your own OpenAI/Anthropic key for AI features — Kickstart takes zero cut |
| **Support** | Optional | "Buy Me a Coffee" link |
