import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Layout, BarChart3, FileText, CloudSync } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#09090b] text-white font-sans">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b-4 border-black bg-[#18181b]">
        <div className="text-2xl font-pixel font-bold tracking-tighter">
          KICKSTART
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-white hover:bg-white/10">Login</Button>
          </Link>
          <Link href="/signup">
            <Button variant="pixel">Get Started</Button>
          </Link>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center py-24 px-6 space-y-8">
          <h1 className="text-5xl md:text-7xl font-pixel font-bold max-w-4xl leading-tight">
            Track Every Application.<br />
            Land More Interviews.
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Kanban-style job tracker built for modern job seekers. 
            Organize your hunt, track your resumes, and analyze your performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/signup">
              <Button size="lg" variant="pixel" className="text-lg px-8">
                Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 border-2 border-white text-white hover:bg-white hover:text-black">
                Live Demo
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 bg-[#18181b] border-t-4 border-black">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-pixel font-bold text-center mb-16">
              CORE FEATURES
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Layout className="w-8 h-8" />}
                title="Job Pipeline Board"
                description="Visual Kanban board to drag and drop your applications through stages from 'Saved' to 'Offer'."
              />
              <FeatureCard 
                icon={<BarChart3 className="w-8 h-8" />}
                title="Analytics Dashboard"
                description="Track your response rate and application trends with built-in data visualization."
              />
              <FeatureCard 
                icon={<FileText className="w-8 h-8" />}
                title="Resume Tracking"
                description="Link specific resumes to applications and see which version is landing the most interviews."
              />
              <FeatureCard 
                icon={<CheckCircle className="w-8 h-8" />}
                title="Interview Tracking"
                description="Keep detailed notes on interviews, follow-ups, and feedback in one centralized place."
              />
              <FeatureCard 
                icon={<CloudSync className="w-8 h-8" />}
                title="Supabase Sync"
                description="Your data is securely synced in the cloud, accessible from any device, anywhere."
              />
              <FeatureCard 
                icon={<div className="w-8 h-8 flex items-center justify-center font-pixel border-2 border-white">8BIT</div>}
                title="Retro Aesthetic"
                description="A clean, modern SaaS experience wrapped in a nostalgic 8-bit inspired interface."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 text-center space-y-8">
          <h2 className="text-4xl font-pixel font-bold">
            Ready to land your dream job?
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join hundreds of developers who are organizing their job search with Kickstart.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="pixel" className="text-xl px-12">
              Start Tracking Today
            </Button>
          </Link>
        </section>
      </main>

      <footer className="py-8 px-6 border-t-4 border-black bg-[#18181b] text-center text-sm text-gray-400">
        © {new Date().getFullYear()} KICKSTART. Built for the modern job seeker.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 border-4 border-black bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all group">
      <div className="mb-4 text-[#6c82ff] group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 font-pixel uppercase">{title}</h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

