"use client";
import {
    CheckCircle,
    Circle,
    Lock,
    ArrowRight,
    BookOpen,
    GraduationCap,
    TrendingUp,
    AlertCircle
} from "lucide-react";
import Link from "next/link";

interface DashboardProps {
    profile: any;
    tasks: any[];
}

export default function DashboardUI({ profile, tasks }: DashboardProps) {
    const currentStage = 1;

    const stages = [
        { id: 1, name: "Building Profile", description: "Optimize your academic & extra-curricular profile." },
        { id: 2, name: "University Discovery", description: "Explore and shortlist potential universities." },
        { id: 3, name: "Shortlisting", description: "Lock your final list of universities." },
        { id: 4, name: "Applications", description: "Prepare and submit your applications." },
    ];

    const strengthScore = profile.gpa ? 85 : 50;
    const strengthLabel = strengthScore > 80 ? "Strong" : strengthScore > 60 ? "Average" : "Needs Work";
    const strengthColor = strengthScore > 80 ? "text-green-400" : "text-yellow-400";

    return (
        <div className="min-h-screen p-6 pb-20 md:p-10 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Hello, {profile.user.name.split(" ")[0]}</h1>
                    <p className="text-gray-400">Let's plan your journey to {profile.preferredCountries || "your dream university"}.</p>
                </div>
                <Link href="/api/auth/logout" className="text-sm text-gray-500 hover:text-white">
                    Logout
                </Link>
            </div>

            <div className="glass-panel p-6 overflow-x-auto">
                <div className="flex justify-between min-w-[600px] relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2 z-0"></div>

                    {stages.map((stage) => {
                        const isActive = stage.id === currentStage;
                        const isCompleted = stage.id < currentStage;

                        return (
                            <div key={stage.id} className="relative z-10 flex flex-col items-center gap-3 text-center w-40">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${isActive ? "bg-(--primary) border-(--primary) shadow-[0_0_20px_var(--primary-glow)]" :
                                    isCompleted ? "bg-(--secondary) border-(--secondary)" : "bg-[#0a0a16] border-white/20"
                                    }`}>
                                    {isCompleted ? <CheckCircle size={20} className="text-white" /> :
                                        isActive ? <Circle size={20} className="text-white" /> :
                                            <Lock size={16} className="text-gray-500" />}
                                </div>
                                <div>
                                    <p className={`font-semibold text-sm ${isActive ? "text-white" : "text-gray-500"}`}>{stage.name}</p>
                                    {isActive && <span className="text-[10px] text-(--primary) bg-(--primary)/10 px-2 py-0.5 rounded-full mt-1 inline-block">Current Stage</span>}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-6">
                    <div className="glass-panel p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <TrendingUp size={18} className="text-(--secondary)" />
                                Profile Strength
                            </h3>
                            <span className={`font-bold ${strengthColor}`}>{strengthLabel}</span>
                        </div>
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-linear-to-r from-(--primary) to-(--secondary)" style={{ width: `${strengthScore}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-400">
                            Based on your GPA ({profile.gpa}) and test readiness.
                        </p>
                    </div>

                    <div className="glass-panel p-6">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <GraduationCap size={18} className="text-blue-400" />
                            My Goals
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-gray-400">Degree</span>
                                <span>{profile.targetDegree}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-gray-400">Field</span>
                                <span>{profile.fieldOfStudy}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-gray-400">Intake</span>
                                <span>{profile.targetIntake}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Budget</span>
                                <span>${profile.budgetRange}</span>
                            </div>
                        </div>
                        <Link href="/onboarding" className="block mt-4 text-center text-xs text-(--primary) hover:underline">
                            Edit Profile
                        </Link>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <div className="glass-panel p-6 border-l-4 border-l-(--primary) relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-64 h-64 bg-(--primary)/10 blur-[80px] pointer-events-none"></div>
                        <h3 className="text-xl font-bold mb-2">What should you do next?</h3>
                        <p className="text-gray-400 mb-6 max-w-lg">
                            Based on your profile, it's time to explore universities that match your criteria. The AI Counsellor can help you categorize them into Dream, Target, and Safe options.
                        </p>
                        <div className="flex gap-4">
                            <Link href="/chat" className="primary-button flex items-center gap-2">
                                Talk to AI Counsellor <ArrowRight size={16} />
                            </Link>
                            <Link href="/universities" className="glass-button">
                                Browse Universities
                            </Link>
                        </div>
                    </div>

                    <div className="glass-panel p-6">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <BookOpen size={18} className="text-pink-400" />
                            Recommended Tasks
                        </h3>
                        <div className="space-y-3">
                            {tasks.length > 0 ? (
                                tasks.map((task) => (
                                    <div key={task.id}>{task.title}</div>
                                ))
                            ) : (
                                <>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                                        <Circle size={18} className="text-gray-500" />
                                        <span className="text-gray-300">Complete your profile details</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                                        <Circle size={18} className="text-gray-500" />
                                        <span className="text-gray-300">Take a mock IELTS test</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                                        <Circle size={18} className="text-gray-500" />
                                        <span className="text-gray-300">Draft your Statement of Purpose (SOP)</span>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/5">
                            <div className="flex items-center gap-2 text-sm text-(--secondary)">
                                <AlertCircle size={14} />
                                <span>AI updates this list as you progress.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
