"use client";
import { useState, useEffect } from "react";
import { Search, Plus, Trash2, Lock, Unlock, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface University {
    id?: string;
    name: string;
    location?: string;
    website?: string;
    isLocked?: boolean;
}

export default function UniversitiesPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<University[]>([]);
    const [shortlist, setShortlist] = useState<University[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        fetchShortlist();
    }, []);

    const fetchShortlist = async () => {
        const res = await fetch("/api/universities");
        const data = await res.json();
        setShortlist(data.universities);
    };

    const searchHipo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query) return;
        setIsSearching(true);
        try {
            const res = await fetch(`http://universities.hipolabs.com/search?name=${encodeURIComponent(query)}`);
            const data = await res.json();
            // console.log({ data });
            const formatted = data.slice(0, 10).map((u: any) => ({
                name: u.name,
                location: u.country,
                website: u.web_pages?.[0]
            }));
            // console.log({ formatted });
            setResults(formatted);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSearching(false);
        }
    };

    const addToShortlist = async (uni: University) => {
        await fetch("/api/universities", {
            method: "POST",
            body: JSON.stringify(uni)
        });
        fetchShortlist();
        setResults([]);
        setQuery("");
    };

    const toggleLock = async (id: string, currentStatus: boolean) => {
        if (!currentStatus) {
            if (!confirm("Locking this university will customize your checklist and tasks for this specific school. Proceed?")) return;
        }
        await fetch("/api/universities", {
            method: "PATCH",
            body: JSON.stringify({ id, isLocked: !currentStatus })
        });
        fetchShortlist();
    };

    return (
        <div className="min-h-screen p-6 md:p-10 max-w-6xl mx-auto space-y-8">

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-3xl font-bold">Manage Universities</h1>
                </div>
            </div>


            <div className="glass-panel p-6">
                <h2 className="text-xl font-semibold mb-4">Discover Universities</h2>
                <form onSubmit={searchHipo} className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by name (e.g. Stanford, Oxford)..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-(--primary)"
                        />
                    </div>
                    <button type="submit" disabled={isSearching} className="primary-button px-6">
                        {isSearching ? "Searching..." : "Search"}
                    </button>
                </form>

                {results.length > 0 && (
                    <div className="mt-6 space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                        {results.map((uni, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/5">
                                <div>
                                    <p className="font-semibold">{uni.name}</p>
                                    <p className="text-sm text-gray-400">{uni.location}</p>
                                </div>
                                <button onClick={() => addToShortlist(uni)} className="p-2 bg-[--primary] rounded-full hover:scale-110 transition-transform cursor-pointer">
                                    <Plus size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Shortlist */}
            <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    Your Shortlist
                    <span className="text-sm bg-white/10 px-2 py-0.5 rounded-full text-gray-300">{shortlist.length}</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {shortlist.map((uni: any) => (
                        <div key={uni.id} className={`glass-panel p-6 relative group transition-all ${uni.isLocked ? "border-[--primary] shadow-[0_0_30px_rgba(99,102,241,0.2)] bg-[--primary]/5" : ""}`}>
                            {uni.isLocked && (
                                <div className="absolute top-4 right-4 text-[--primary] flex items-center gap-1 text-xs font-bold bg-[--primary]/10 px-2 py-1 rounded-full">
                                    <Lock size={12} /> LOCKED CHOICE
                                </div>
                            )}

                            <h3 className="text-xl font-bold mb-1 pr-20">{uni.name}</h3>
                            <p className="text-gray-400 text-sm mb-4">{uni.location}</p>

                            <div className="flex gap-4 mt-6">
                                <button
                                    onClick={() => toggleLock(uni.id, uni.isLocked)}
                                    className={`flex-1 py-2 rounded-lg text-sm font-medium border flex items-center justify-center gap-2 transition-all cursor-pointer ${uni.isLocked
                                        ? "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                                        : "bg-[--primary] border-transparent hover:brightness-110 text-white"
                                        }`}
                                >
                                    {uni.isLocked ? <><Unlock size={16} /> Unlock</> : <><Lock size={16} /> Lock Decision</>}
                                </button>
                                {uni.website && (
                                    <a href={uni.website} target="_blank" className="p-2 glass-button justify-center">
                                        <ExternalLink size={18} />
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}

                    {shortlist.length === 0 && (
                        <div className="col-span-full py-10 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl">
                            Your shortlist is empty. Search above or ask AI to recommend universities.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
