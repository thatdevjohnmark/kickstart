# 🚀 KickStart

> Track every application. Land more interviews.

KickStart is a modern job application tracking platform built with **Next.js**, **Supabase**, and **Tailwind CSS**. It helps job seekers organize applications, monitor progress, analyze performance, and manage resumes through a clean Kanban-style workflow with a retro 8-bit inspired interface.

---

## ✨ Features

### 📋 Application Tracking

* Create, edit, and delete applications
* Drag-and-drop Kanban board
* Track application status through custom stages
* Store job links, notes, salary information, and locations

### 📊 Analytics Dashboard

* Total applications
* Active applications
* Interview count
* Offer count
* Response rate tracking
* Stage conversion metrics

### 📄 Resume Management

* Upload multiple resume versions
* Track which resume performs best
* Resume-to-interview analytics

### 🔐 Authentication

* Email & Password Login
* Google OAuth
* Password Recovery
* Secure Supabase Authentication

### ☁️ Cloud Sync

* Real-time database powered by Supabase
* Secure Row Level Security (RLS)
* Multi-device access

---

## 🖼️ Application Stages

```txt
Saved
↓
Applied
↓
Assessment
↓
Interviewing
↓
Offer

Rejected
Ghosted
```

---

## 🛠️ Tech Stack

### Frontend

* Next.js 15
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide React
* dnd-kit

### Backend

* Supabase Authentication
* PostgreSQL
* Supabase Storage

### Deployment

* Vercel

---

## 📂 Project Structure

```txt
app/
components/
hooks/
lib/
types/
public/
supabase/

├── migrations/
├── config.toml

middleware.ts
```

---

## 🚦 Getting Started

### Clone Repository

```bash
git clone https://github.com/your-username/kickstart.git
cd kickstart
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Run Development Server

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

## 🗄️ Database Setup

Install Supabase CLI:

```bash
npm install -g supabase
```

Login:

```bash
supabase login
```

Link Project:

```bash
supabase link --project-ref YOUR_PROJECT_ID
```

Run Migrations:

```bash
supabase db push
```

---

## 🔒 Security

KickStart uses:

* Supabase Authentication
* PostgreSQL Row Level Security (RLS)
* Protected Routes
* User-scoped Data Access

Users can only access their own applications, resumes, and analytics.

---

## 📱 Roadmap

### Version 1

* Authentication
* Kanban Board
* CRUD Applications
* Analytics Dashboard

### Version 2

* Resume Tracking
* Calendar View
* Follow-up Reminders

### Version 3

* AI Resume Review
* AI Cover Letter Generator
* Job Match Analysis
* Interview Preparation Tools
* Chrome Extension

---

## 🎨 Design Philosophy

KickStart combines:

* Retro 8-bit aesthetics
* Modern SaaS usability
* Fast workflows
* Mobile responsiveness
* Developer-friendly architecture

Inspired by:

* Trello
* Linear
* Notion
* Retro RPG Interfaces
* Classic Game Boy UI

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

Feel free to fork the repository and submit a pull request.

---

## 📄 License

MIT License

---

## ⭐ Support

If you find this project useful, consider starring the repository.

It helps the project grow and reach more job seekers.

---

Built with ❤️ using Next.js, Supabase, and Tailwind CSS.
