import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[rgba(99,102,241,0.2)] blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[rgba(168,85,247,0.2)] blur-[100px] rounded-full pointer-events-none"></div>

      <nav className="p-5 flex justify-between items-center z-10 glass-panel mx-6 mt-6 rounded-2xl border-white/5">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-300">
          AI Counsellor
        </h1>
        <div className="flex items-center gap-4">
          <Link href="/login" className="px-4 py-2 hover:text-white text-gray-300 transition-colors">
            Login
          </Link>
          <Link href="/signup" className="glass-button text-sm px-5 py-2">
            Get Started
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10">
        <div className="max-w-3xl space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-(--secondary) mb-4">
            <span>✨ Powered by AI</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            Plan your study-abroad journey with a <span className="bg-clip-text text-transparent bg-linear-to-r from-(--primary) to-(--secondary)">guided AI counsellor</span>.
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            From profile building to university shortlisting. No confusion, just clarity and actionable steps.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/signup" className="primary-button text-lg">
              Start Your Journey
            </Link>
            <Link href="/login" className="glass-button text-lg justify-center">
              Login to existing account
            </Link>
          </div>
        </div>
      </main>

      <footer className="p-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} AI Counsellor. All rights reserved.
      </footer>
    </div>
  );
}
