"use client"

import * as React from "react"
import { IconMessageChatbot, IconX, IconSend, IconRobot, IconUser } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface Message {
    role: "user" | "model"
    content: string
}

export function AiChatWidget() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [messages, setMessages] = React.useState<Message[]>([])
    const [input, setInput] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const scrollRef = React.useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom
    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isOpen])

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!input.trim() || isLoading) return

        const userMsg = input.trim()
        setInput("")
        setMessages(prev => [...prev, { role: "user", content: userMsg }])
        setIsLoading(true)

        try {
            // Build history for the API
            const history = messages.map(m => ({
                role: m.role,
                parts: [{ text: m.content }]
            }))

            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMsg,
                    history: history
                })
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.error || "Gagal mengirim pesan")

            setMessages(prev => [...prev, { role: "model", content: data.response }])

        } catch (error) {
            console.error(error)
            setMessages(prev => [...prev, { role: "model", content: "Maaf, sistem sedang sibuk. Coba lagi nanti." }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="w-[350px] md:w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-slate-900 flex justify-between items-center text-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-full bg-white/10 flex items-center justify-center">
                                    <IconRobot className="size-6 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="font-black uppercase italic tracking-tighter text-sm">Xinna AI Pharmacist</h3>
                                    <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5">
                                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        Online & Ready to Help
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/10 rounded-xl size-8"
                                onClick={() => setIsOpen(false)}
                            >
                                <IconX className="size-5" />
                            </Button>
                        </div>

                        {/* Chat Body */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50"
                        >
                            {messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-60">
                                    <IconMessageChatbot className="size-12 text-slate-300 mb-2" />
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mulai Konsultasi</p>
                                    <p className="text-xs text-slate-400 mt-1">Tanyakan stok obat atau keluhan kesehatan Anda.</p>
                                </div>
                            )}

                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "flex gap-3 max-w-[90%]",
                                        msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                                    )}
                                >
                                    <div className={cn(
                                        "size-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                                        msg.role === "user" ? "bg-slate-900 text-white" : "bg-emerald-100 text-emerald-600"
                                    )}>
                                        {msg.role === "user" ? <IconUser className="size-4" /> : <IconRobot className="size-4" />}
                                    </div>
                                    <div className={cn(
                                        "p-3 rounded-2xl text-sm font-medium leading-relaxed shadow-sm",
                                        msg.role === "user"
                                            ? "bg-slate-900 text-white rounded-tr-none"
                                            : "bg-white text-slate-700 rounded-tl-none border border-slate-100"
                                    )}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex gap-3 max-w-[90%]">
                                    <div className="size-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                                        <IconRobot className="size-4" />
                                    </div>
                                    <div className="p-3 bg-white text-slate-700 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                                        <div className="flex gap-1">
                                            <span className="size-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
                                            <span className="size-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
                                            <span className="size-1.5 rounded-full bg-slate-400 animate-bounce" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-white border-t border-slate-100 shrink-0">
                            <form onSubmit={handleSend} className="flex gap-2 relative">
                                <Input
                                    className="rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-emerald-500/20 pr-10 h-11 text-sm"
                                    placeholder="Ketik pertanyaan..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    disabled={isLoading}
                                />
                                <Button
                                    size="icon"
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white absolute right-1 top-1 bottom-1 h-auto w-9 shadow-md transition-all hover:scale-95 active:scale-90"
                                >
                                    <IconSend className="size-4" />
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Button
                    size="icon"
                    className="size-14 rounded-full shadow-2xl bg-slate-900 hover:bg-emerald-600 text-white transition-colors relative"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <IconX className="size-6" /> : <IconMessageChatbot className="size-7" />}

                    {!isOpen && (
                        <span className="absolute top-0 right-0 size-4 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
                    )}
                </Button>
            </motion.div>
        </div>
    )
}
