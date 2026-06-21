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

      {/* Meet the Team Section */}
      <section className="py-20 px-6 bg-[#09090b] border-t-4 border-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-pixel font-bold text-white mb-4">
            MEET THE TEAM
          </h2>
          <p className="text-gray-400 text-sm mb-12 max-w-xl mx-auto">
            Built by a solo developer, powered by AI agents.
          </p>

          <div className="flex flex-col items-center gap-6 mb-12">
            {/* Creator card */}
            <div className="p-6 border-4 border-black bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full max-w-sm">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full border-4 border-black bg-[#6c82ff] flex items-center justify-center text-white text-2xl font-pixel">
                JM
              </div>
              <h3 className="text-lg font-bold font-pixel uppercase mb-1">
                thatdevjohnmark
              </h3>
              <p className="text-gray-600 text-sm">
                Solo developer &amp; job seeker. Built Kickstart to solve his own job hunt chaos.
              </p>
            </div>
          </div>

          {/* AI Agents */}
          <div>
            <p className="text-gray-500 text-xs mb-4 font-pixel uppercase tracking-wider">
              Powered By
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {["DeepSeek", "Gemma", "Claude", "ChatGPT"].map((agent) => (
                <span
                  key={agent}
                  className="px-4 py-2 border-2 border-black bg-[#18181b] text-white text-xs font-medium shadow-[2px_2px_0px_#000]"
                >
                  {agent}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t-4 border-black bg-[#18181b] text-center space-y-4">
        <span
          className="inline-flex items-center gap-2 px-6 py-3 rounded-md border-2 border-black bg-[#FF813F] text-white text-sm font-bold shadow-[3px_3px_0px_#000] opacity-80 cursor-not-allowed"
          title="Buy me a coffee (coming soon)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 21V19H20V21H2ZM20 8V5H22V11H20V10H18V13C18 13.5304 17.7893 14.0391 17.4142 14.4142C17.0391 14.7893 16.5304 15 16 15H10C9.46957 15 8.96086 14.7893 8.58579 14.4142C8.21071 14.0391 8 13.5304 8 13V3H18V8H20ZM16 8V5H10V8H16Z"/>
          </svg>
          Buy Me a Coffee
        </span>
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} KICKSTART. Built for the modern job seeker.
        </p>
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

