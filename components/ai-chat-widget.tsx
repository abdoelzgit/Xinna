"use client"

import * as React from "react"
import { IconMessageChatbot, IconX, IconSend, IconRobot, IconUser, IconPill } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useChat } from "@/components/chat-context"
import Link from "next/link"
import Image from "next/image"

interface Message {
    role: "user" | "model"
    content: string
}

export function AiChatWidget() {
    const { isOpen, closeChat, initialMessage, setInitialMessage } = useChat()
    const [messages, setMessages] = React.useState<Message[]>([])
    const [input, setInput] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const scrollRef = React.useRef<HTMLDivElement>(null)

    // Handle initial message from hero search
    React.useEffect(() => {
        if (isOpen && initialMessage) {
            const msg = initialMessage
            setInitialMessage(null) // Clear it so it doesn't trigger again
            handleSendMessage(msg)
        }
    }, [isOpen, initialMessage])

    // Auto-scroll to bottom
    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isOpen])

    const handleSendMessage = async (customMsg?: string) => {
        const messageToSend = customMsg || input.trim()
        if (!messageToSend || isLoading) return

        if (!customMsg) setInput("")

        setMessages(prev => [...prev, { role: "user", content: messageToSend }])
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
                    message: messageToSend,
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
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeChat}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />

                    {/* Chat Window */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="relative w-full max-w-[450px] h-[600px] bg-white rounded-lg shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-slate-900 flex justify-between items-center text-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                    <IconRobot className="size-6 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="font-black uppercase tracking-tighter text-sm">Xin</h3>
                                    <p className="text-[10px] text-white/60 font-medium flex items-center gap-1.5">
                                        <span className="size-2 rounded-full border border-white bg-green-300 animate-pulse" />
                                        Online & Ready to Help
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/10 rounded-xl size-8"
                                onClick={closeChat}
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
                                        {msg.role === "model" ? (
                                            msg.content.split(/\[PRODUCT:(.*?)\]/).map((part, index) => {
                                                if (index % 2 === 1) {
                                                    try {
                                                        const product = JSON.parse(part)
                                                        return <ChatProductCard key={index} product={product} />
                                                    } catch (e) {
                                                        return null
                                                    }
                                                }
                                                return <span key={index}>{part}</span>
                                            })
                                        ) : (
                                            msg.content
                                        )}
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
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    handleSendMessage()
                                }}
                                className="flex gap-2 relative"
                            >
                                <Input
                                    className="rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-emerald-500/20 pr-10 h-11 text-sm"
                                    placeholder="Apa keluhan anda?"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    disabled={isLoading}
                                />
                                <Button
                                    size="icon"
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="rounded-xl bg-slate-900 hover:bg-slate-900 text-white absolute right-1 top-1 bottom-1 h-auto w-9 shadow-md transition-all hover:scale-95 active:scale-90"
                                >
                                    <IconSend className="size-4" />
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

function ChatProductCard({ product }: { product: any }) {
    return (
        <div className="mt-3 bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow max-w-[280px]">
            <Link href={`/medicine/${product.id}`} className="block group/card">
                {product.image ? (
                    <div className="relative aspect-video w-full overflow-hidden">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                        />
                    </div>
                ) : (
                    <div className="aspect-video w-full bg-slate-100 flex items-center justify-center">
                        <IconPill className="size-8 text-slate-300" />
                    </div>
                )}
                <div className="p-3">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Rekomendasi</p>
                    <h4 className="font-bold text-slate-900 leading-tight mb-1 truncate">{product.name}</h4>
                    <p className="text-sm font-black text-slate-900 italic tracking-tighter">
                        Rp {new Intl.NumberFormat('id-ID').format(product.price)}
                    </p>
                </div>
            </Link>
        </div>
    )
}
