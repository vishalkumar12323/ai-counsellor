"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        // Academic
        educationLevel: "",
        degree: "",
        graduationYear: "",
        gpa: "",
        // Goals
        targetDegree: "",
        fieldOfStudy: "",
        targetIntake: "",
        preferredCountries: "",
        // Budget
        budgetRange: "",
        fundingPlan: "",
        // Readiness
        ieltsScore: "",
        greScore: "",
        sopStatus: "",
    });

    const updateField = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const nextStep = () => setStep((s) => s + 1);
    const prevStep = () => setStep((s) => s - 1);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/onboarding", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                router.push("/dashboard");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-6">

            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-[#1e1b4b] via-[#1e1b4b] to-[#1e1b4b] pointer-events-none"></div>

            <div className="w-full max-w-2xl z-10">

                <div className="mb-8">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Step {step} of 4</span>
                        <span>{Math.round((step / 4) * 100)}% Completed</span>
                    </div>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-(--primary)"
                            initial={{ width: 0 }}
                            animate={{ width: `${(step / 4) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>

                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass-panel p-8"
                >
                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white">Academic Background</h2>
                            <Input label="Highest Education Level" value={formData.educationLevel} onChange={(v) => updateField("educationLevel", v)} placeholder="e.g. Bachelor's, High School" />
                            <Input label="Degree / Major" value={formData.degree} onChange={(v) => updateField("degree", v)} placeholder="e.g. Computer Science" />
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Graduation Year" value={formData.graduationYear} onChange={(v) => updateField("graduationYear", v)} placeholder="2024" />
                                <Input label="CGPA / Percentage" value={formData.gpa} onChange={(v) => updateField("gpa", v)} placeholder="e.g. 3.8 or 85%" />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white">Study Goals</h2>
                            <Input label="Intended Degree" value={formData.targetDegree} onChange={(v) => updateField("targetDegree", v)} placeholder="e.g. Master's in Data Science" />
                            <Input label="Target Field" value={formData.fieldOfStudy} onChange={(v) => updateField("fieldOfStudy", v)} placeholder="e.g. Artificial Intelligence" />
                            <Input label="Target Intake" value={formData.targetIntake} onChange={(v) => updateField("targetIntake", v)} placeholder="e.g. Fall 2025" />
                            <Input label="Preferred Countries" value={formData.preferredCountries} onChange={(v) => updateField("preferredCountries", v)} placeholder="e.g. USA, UK, Canada" />
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white">Budget & Finance</h2>
                            <Input label="Annual Budget (USD)" value={formData.budgetRange} onChange={(v) => updateField("budgetRange", v)} placeholder="e.g. 30,000 - 50,000" />
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Funding Plan</label>
                                <select
                                    className="w-full bg-[#161622] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-(--primary)"
                                    value={formData.fundingPlan}
                                    onChange={(e) => updateField("fundingPlan", e.target.value)}
                                >
                                    <option value="">Select an option</option>
                                    <option value="Self-funded">Self-funded</option>
                                    <option value="Loan">Education Loan</option>
                                    <option value="Scholarship">Scholarship Dependent</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white">Readiness</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="IELTS/TOEFL Score" value={formData.ieltsScore} onChange={(v) => updateField("ieltsScore", v)} placeholder="e.g. 7.5 (Not taken yet)" />
                                <Input label="GRE/GMAT Score" value={formData.greScore} onChange={(v) => updateField("greScore", v)} placeholder="e.g. 320 (Optional)" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">SOP Status</label>
                                <div className="flex gap-4">
                                    {["Not Started", "Drafting", "Completed"].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => updateField("sopStatus", status)}
                                            className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-all ${formData.sopStatus === status
                                                ? "bg-(--primary) border-(--primary) text-white"
                                                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                        {step > 1 ? (
                            <button onClick={prevStep} className="px-6 py-2 rounded-lg text-gray-400 hover:text-white transition-colors">
                                Back
                            </button>
                        ) : <div></div>}

                        {step < 4 ? (
                            <button onClick={nextStep} className="primary-button px-8">
                                Next Step
                            </button>
                        ) : (
                            <button onClick={handleSubmit} disabled={loading} className="primary-button px-8">
                                {loading ? "Completing..." : "Finish Onboarding"}
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function Input({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-(--primary) transition-all placeholder:text-gray-600"
            />
        </div>
    )
}
