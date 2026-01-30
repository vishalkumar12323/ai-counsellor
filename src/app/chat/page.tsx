"use client";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Send, User, Bot, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Message {
    role: "user" | "model";
    content: string;
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        { role: "model", content: "Hello! I'm your AI Counsellor. I've analyzed your profile. How can I help you plan your study abroad journey today?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = { role: "user" as const, content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    history: messages.map(m => ({ role: m.role, parts: [{ text: m.content }] })),
                    message: input
                }),
            });

            const data = await res.json();

            if (data.error) throw new Error(data.error);

            setMessages((prev) => [...prev, { role: "model", content: data.response }]);
        } catch (error) {
            setMessages((prev) => [...prev, { role: "model", content: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#0a0a16]">
            <header className="fixed top-0 w-full z-10 glass-panel border-b border-white/10 rounded-none bg-[rgba(10,10,22,0.8)] backdrop-blur-xl">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white">
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-(--primary) to-(--secondary) flex items-center justify-center">
                                <Bot size={18} className="text-white" />
                            </div>
                            <div>
                                <h1 className="font-semibold text-sm">AI Counsellor</h1>
                                <span className="text-xs text-green-400 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                    Online
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto pt-20 pb-24 px-4 scroll-smooth">
                <div className="max-w-3xl mx-auto space-y-6">
                    {messages.map((m, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={i}
                            className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-white/10" : "bg-linear-to-tr from-(--primary) to-(--secondary)"
                                }`}>
                                {m.role === "user" ? <User size={16} /> : <Bot size={16} />}
                            </div>

                            <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${m.role === "user"
                                ? "bg-white/10 text-white rounded-tr-sm"
                                : "glass-panel border-white/5 bg-[#13132b] rounded-tl-sm shadow-md"
                                }`}>
                                <ReactMarkdown
                                    components={{
                                        strong: ({ node, ...props }) => <span className="font-bold text-(--secondary)" {...props} />,
                                        ul: ({ node, ...props }) => <ul className="list-disc pl-4 my-2 space-y-1" {...props} />,
                                        li: ({ node, ...props }) => <li className="text-gray-300" {...props} />
                                    }}
                                >
                                    {m.content}
                                </ReactMarkdown>
                            </div>
                        </motion.div>
                    ))}
                    {loading && (
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-(--primary) to-(--secondary) flex items-center justify-center shrink-0">
                                <Bot size={16} />
                            </div>
                            <div className="bg-[#13132b] glass-panel border-white/5 rounded-2xl rounded-tl-sm p-4 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input */}
            <div className="fixed bottom-0 w-full p-4 bg-linear-to-t from-(--background) via-(--background) to-transparent">
                <form onSubmit={sendMessage} className="max-w-3xl mx-auto relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about universities, scholarships, or your profile..."
                        className="w-full glass-panel pl-6 pr-14 py-4 rounded-full border-white/10 bg-white/5 focus:bg-[#13132b] focus:ring-2 focus:ring-(--primary) transition-all outline-none shadow-lg"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-(--primary) text-white hover:bg-(--secondary) disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
}
