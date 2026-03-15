'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mic, Send, Copy, Check, Plus, Settings, Disc,
    Sparkles, BookOpen, Trophy, Flame,
    ChevronLeft, PanelLeft, Pencil
} from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Message {
    id: string;
    text: string;
    sender: 'user' | 'agent';
    timestamp: Date;
    agentName?: string;
    attachmentUrl?: string;
}

interface ChatSession {
    id: string;
    preview: string;
    date: string;
    active?: boolean;
}

// ─── Suggested agent names (for the picker) ───────────────────────────────────
const SUGGESTED_NAMES = [
    'Nova', 'Zara', 'Atlas', 'Sage', 'Echo',
    'Aria', 'Cleo', 'Orion', 'Mira', 'Leo',
];

// ─── Agent personality emojis ─────────────────────────────────────────────────
const AGENT_EMOJIS = ['🤖', '🦉', '⭐', '🔥', '🧠', '💡', '🦁', '🌟', '🎓', '🪄'];

// ─── Simple Markdown → HTML renderer (Removed in favor of ReactMarkdown) ───

// ─── Agent avatar (Gemini-style diamond / sparkles) ──────────────────────────
function AgentAvatar({ emoji, size = 32 }: { emoji: string; size?: number }) {
    return (
        <div
            style={{
                width: size, height: size, flexShrink: 0, borderRadius: '50%',
                background: 'linear-gradient(135deg, #4285f4, #8ab4f8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: size * 0.44,
            }}
        >
            {emoji}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  ONBOARDING MODAL — shown when user has not yet named their agent
// ═══════════════════════════════════════════════════════════════════════════════
function AgentNameModal({
    onConfirm,
}: {
    onConfirm: (name: string, emoji: string) => void;
}) {
    const [nameInput, setNameInput] = useState('');
    const [selectedEmoji, setSelectedEmoji] = useState(AGENT_EMOJIS[0]);
    const [error, setError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setTimeout(() => inputRef.current?.focus(), 300);
    }, []);

    const choose = (name: string) => {
        const trimmed = name.trim();
        if (!trimmed) { setError('Please give your AI a name!'); return; }
        if (trimmed.length > 24) { setError('Keep it under 24 characters.'); return; }
        onConfirm(trimmed, selectedEmoji);
    };

    return (
        /* Backdrop */
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                background: 'rgba(0,0,0,0.72)',
                backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 24,
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 28, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-strong)',
                    borderRadius: 20,
                    padding: '36px 32px 32px',
                    maxWidth: 460,
                    width: '100%',
                    boxShadow: 'var(--shadow-lg)',
                }}
            >
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <motion.div
                        animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        style={{ fontSize: '2.8rem', marginBottom: 12, display: 'block' }}
                    >
                        ✨
                    </motion.div>
                    <h2 style={{
                        fontFamily: "'Google Sans', Outfit, sans-serif",
                        fontSize: '1.4rem', fontWeight: 700,
                        color: 'var(--text-primary)', marginBottom: 8,
                    }}>
                        Name your AI tutor
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        Give your personal AI mentor a name and pick an emoji — then let's start learning!
                    </p>
                </div>

                {/* Emoji picker row */}
                <div style={{ marginBottom: 20 }}>
                    <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
                        Choose an emoji
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {AGENT_EMOJIS.map(em => (
                            <button
                                key={em}
                                onClick={() => setSelectedEmoji(em)}
                                style={{
                                    width: 40, height: 40, borderRadius: 10, fontSize: '1.3rem',
                                    border: '2px solid',
                                    borderColor: selectedEmoji === em ? 'var(--accent)' : 'var(--border)',
                                    background: selectedEmoji === em ? 'var(--accent-soft)' : 'var(--bg-hover)',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', transition: 'all .15s',
                                }}
                            >
                                {em}
                            </button>
                        ))}
                        <input 
                            type="text"
                            value={selectedEmoji}
                            onChange={(e) => {
                                // Allow mostly single emojis (limit to ~2-3 chars for composite emojis)
                                const val = e.target.value;
                                if (val) setSelectedEmoji(val.substring(0, 4));
                            }}
                            placeholder="+"
                            style={{
                                width: 40, height: 40, borderRadius: 10, fontSize: '1.3rem',
                                border: '2px dashed var(--border-strong)',
                                background: 'transparent',
                                cursor: 'text', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', textAlign: 'center', color: 'var(--text-primary)',
                                outline: 'none'
                            }}
                            title="Type custom emoji"
                        />
                    </div>
                </div>

                {/* Name input */}
                <div style={{ marginBottom: 16 }}>
                    <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
                        Agent name
                    </p>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        border: '1px solid', borderColor: error ? '#f28b82' : 'var(--border-strong)',
                        background: 'var(--bg-hover)', borderRadius: 12,
                        padding: '2px 8px 2px 12px',
                        transition: 'border-color .15s',
                    }}
                        className="focus-within:!border-[var(--accent)]"
                    >
                        <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{selectedEmoji}</span>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="e.g. Nova, Aria, Zara…"
                            value={nameInput}
                            onChange={e => { setNameInput(e.target.value); setError(''); }}
                            onKeyDown={e => e.key === 'Enter' && choose(nameInput)}
                            maxLength={24}
                            style={{
                                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                                fontSize: '0.9375rem', color: 'var(--text-primary)',
                                padding: '10px 0',
                            }}
                        />
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', flexShrink: 0 }}>
                            {nameInput.length}/24
                        </span>
                    </div>
                    {error && (
                        <p style={{ fontSize: '12px', color: '#f28b82', marginTop: 6 }}>{error}</p>
                    )}
                </div>

                {/* Suggested names */}
                <div style={{ marginBottom: 24 }}>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: 8 }}>Suggested names</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {SUGGESTED_NAMES.map(n => (
                            <button
                                key={n}
                                onClick={() => { setNameInput(n); setError(''); }}
                                style={{
                                    padding: '4px 12px', borderRadius: 9999, fontSize: '12px',
                                    border: '1px solid', cursor: 'pointer',
                                    borderColor: nameInput === n ? 'var(--accent)' : 'var(--border-strong)',
                                    background: nameInput === n ? 'var(--accent-soft)' : 'var(--bg-hover)',
                                    color: nameInput === n ? 'var(--accent)' : 'var(--text-secondary)',
                                    transition: 'all .12s',
                                }}
                            >
                                {n}
                            </button>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <button
                    onClick={() => choose(nameInput)}
                    disabled={!nameInput.trim()}
                    className="btn-gem"
                    style={{
                        width: '100%', justifyContent: 'center',
                        padding: '13px', fontSize: '0.9375rem',
                        opacity: nameInput.trim() ? 1 : 0.4,
                        cursor: nameInput.trim() ? 'pointer' : 'not-allowed',
                    }}
                >
                    Meet {nameInput.trim() || 'your AI'} →
                </button>
            </motion.div>
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN CHAT PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function ChatPage() {
    // ── Agent identity (chosen by user) ────────────────────────────────────────
    const [agentName, setAgentName]   = useState('');
    const [agentEmoji, setAgentEmoji] = useState(AGENT_EMOJIS[0]);
    const [showNameModal, setShowNameModal] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [editNameInput, setEditNameInput] = useState('');

    // ── Chat state ─────────────────────────────────────────────────────────────
    const [messages, setMessages]     = useState<Message[]>([]);
    const [input, setInput]           = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading]   = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const [copiedId, setCopiedId]     = useState<string | null>(null);
    const [backendStatus, setBackendStatus] = useState<'online' | 'offline' | 'checking'>('checking');
    const [xp, setXp]                 = useState(1250);
    const [streak, setStreak]         = useState(7);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [sessions, setSessions]       = useState<any[]>([]);
    const [attachment, setAttachment]   = useState<{ url: string, file: File } | null>(null);
    const [codePanelContent, setCodePanelContent] = useState<{ code: string; language: string } | null>(null);

    // ── Refs ───────────────────────────────────────────────────────────────────
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef       = useRef<HTMLTextAreaElement>(null);
    const recognitionRef = useRef<any>(null);
    const fileInputRef   = useRef<HTMLInputElement>(null);

    // ── Load agent name from localStorage on mount ────────────────────────────
    useEffect(() => {
        try {
            const rawSessions = localStorage.getItem('edu_chat_sessions');
            if (rawSessions) setSessions(JSON.parse(rawSessions));
            
            const savedXp = localStorage.getItem('edu_xp');
            if (savedXp) setXp(parseInt(savedXp, 10));
            
            const savedStreak = localStorage.getItem('edu_streak');
            if (savedStreak) setStreak(parseInt(savedStreak, 10));
        } catch (_) {}

        const saved = localStorage.getItem('edu_agent_name');
        const savedEmoji = localStorage.getItem('edu_agent_emoji');
        if (saved) {
            setAgentName(saved);
            setAgentEmoji(savedEmoji || AGENT_EMOJIS[0]);
            // Do not inject an initial message to show the clean blank state
        } else {
            setShowNameModal(true);
        }
    }, []);

    // ── Backend connection monitor (polls max 3 times then stops) ───────────────
    useEffect(() => {
        let attempts = 0;
        const MAX_ATTEMPTS = 2;
        let interval: ReturnType<typeof setInterval>;

        const checkBackend = async () => {
            attempts++;
            try {
                const res = await fetch('/api/health', { cache: 'no-store' });
                // 200 or 404 both mean the server is reachable
                if (res.status < 500) {
                    setBackendStatus('online');
                    clearInterval(interval);
                    return;
                }
                if (attempts >= MAX_ATTEMPTS) {
                    setBackendStatus('offline');
                    clearInterval(interval);
                }
            } catch (_) {
                if (attempts >= MAX_ATTEMPTS) {
                    setBackendStatus('offline');
                    clearInterval(interval);
                }
            }
        };

        // Check once immediately
        checkBackend();

        // Then every 5s, but stop after MAX_ATTEMPTS
        interval = setInterval(() => {
            if (attempts >= MAX_ATTEMPTS) {
                clearInterval(interval);
                return;
            }
            checkBackend();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // ── Handle agent name confirmed from modal ────────────────────────────────
    const handleNameConfirm = (name: string, emoji: string) => {
        localStorage.setItem('edu_agent_name', name);
        localStorage.setItem('edu_agent_emoji', emoji);
        setAgentName(name);
        setAgentEmoji(emoji);
        setShowNameModal(false);
        setMessages([{
            id: '1',
            text: `Habari! I'm **${name}**, your personal AI learning mentor. 🔥\n\nAsk me anything — maths, science, English, Kiswahili — I've got you covered. What would you like to explore today?`,
            sender: 'agent',
            timestamp: new Date(),
            agentName: name,
        }]);
    };

    // ── Rename agent inline ───────────────────────────────────────────────────
    const saveAgentName = () => {
        const trimmed = editNameInput.trim();
        if (!trimmed) return;
        localStorage.setItem('edu_agent_name', trimmed);
        setAgentName(trimmed);
        setIsEditingName(false);
    };

    // ── Auto-scroll ───────────────────────────────────────────────────────────
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading, isStreaming]);

    // ── Auto-resize textarea ──────────────────────────────────────────────────
    useEffect(() => {
        const ta = inputRef.current;
        if (!ta) return;
        ta.style.height = 'auto';
        ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
    }, [input]);

    // ── Speech recognition ────────────────────────────────────────────────────
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRec) return;
        const rec = new SpeechRec();
        rec.continuous = true; rec.interimResults = true; rec.lang = 'en-KE';
        rec.onresult = (e: any) => {
            let t = '';
            for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
            setInput(t);
        };
        rec.onerror = () => setIsRecording(false);
        rec.onend   = () => setIsRecording(false);
        recognitionRef.current = rec;
    }, []);

    const toggleRecording = () => {
        if (!recognitionRef.current) { alert('Voice input not supported. Try Chrome/Edge.'); return; }
        if (isRecording) { recognitionRef.current.stop(); setIsRecording(false); }
        else { setInput(''); try { recognitionRef.current.start(); setIsRecording(true); } catch (_) {} }
    };

    const copyMessage = (id: string, text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        });
    };

    const persistMessage = useCallback((msg: Message) => {
        try {
            const raw = localStorage.getItem('edu_chat_sessions') || '[]';
            const sessionsList: any[] = JSON.parse(raw);
            const today = new Date().toDateString();
            const existing = sessionsList.find((s: any) => s.date === today);
            if (existing) existing.messages.push({ text: msg.text, sender: msg.sender });
            else sessionsList.unshift({ date: today, messages: [{ text: msg.text, sender: msg.sender }] });
            const newSessions = sessionsList.slice(0, 30);
            localStorage.setItem('edu_chat_sessions', JSON.stringify(newSessions));
            setSessions(newSessions);
        } catch (_) {}
    }, []);

    const loadSession = (session: any) => {
        if (!session.messages) return;
        const restoredMessages: Message[] = session.messages.map((m: any, idx: number) => ({
            id: `restored-${Date.now()}-${idx}`,
            text: m.text,
            sender: m.sender as 'user' | 'agent',
            timestamp: new Date(),
        }));
        setMessages(restoredMessages);
        if (window.innerWidth < 768) setSidebarOpen(false);
    };

    const handleSend = useCallback(async () => {
        const trimmed = input.trim();
        if ((!trimmed && !attachment) || isLoading || isStreaming) return;
        if (isRecording && recognitionRef.current) { recognitionRef.current.stop(); setIsRecording(false); }

        const userMsg: Message = { id: Date.now().toString(), text: trimmed || '[Image Attached]', sender: 'user', timestamp: new Date(), attachmentUrl: attachment?.url };
        setMessages(p => [...p, userMsg]);
        persistMessage(userMsg);
        setInput('');
        const currentAttachment = attachment;
        setAttachment(null);
        setIsLoading(true);

        let image_base64 = undefined;
        if (currentAttachment && currentAttachment.file) {
            const reader = new FileReader();
            image_base64 = await new Promise<string>((resolve) => {
                reader.onload = () => resolve(reader.result as string);
                reader.readAsDataURL(currentAttachment.file);
            });
        }

        const agentMsgId = (Date.now() + 1).toString();
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: trimmed || '[Image Attached]', image_base64, student_id: 'student123' }),
            });
            if (!res.ok) throw new Error('Bad response from backend');
            setBackendStatus('online');

            setIsLoading(false);
            setIsStreaming(true);

            const contentType = res.headers.get('content-type') || '';
            let finalResponseText = '';
            let telemetryXp = undefined;

            const agentMsg: Message = {
                id: agentMsgId,
                text: '',
                sender: 'agent',
                timestamp: new Date(),
                agentName: agentName,
            };
            setMessages(p => [...p, agentMsg]);

            if (contentType.includes('application/json')) {
                const data = await res.json();
                finalResponseText = data.response || 'No response.';
                if (data.telemetry?.xp !== undefined) telemetryXp = data.telemetry.xp;

                // Simulated streaming for JSON (UX enhancement)
                // Split string preserving whitespaces
                const tokens = finalResponseText.match(/(\s+|\S+)/g) || [finalResponseText];
                let currentText = '';
                for (let i = 0; i < tokens.length; i++) {
                    currentText += tokens[i];
                    setMessages(p => p.map(m => m.id === agentMsgId ? { ...m, text: currentText } : m));
                    await new Promise(r => setTimeout(r, 15));
                }
            } else {
                // Real streaming handler (future-proofing)
                const reader = res.body?.getReader();
                const decoder = new TextDecoder();
                if (reader) {
                    let currentText = '';
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        const chunk = decoder.decode(value, { stream: true });
                        currentText += chunk;
                        setMessages(p => p.map(m => m.id === agentMsgId ? { ...m, text: currentText } : m));
                    }
                    finalResponseText = currentText;
                }
            }

            persistMessage({ ...agentMsg, text: finalResponseText });
            if (telemetryXp !== undefined) {
                setXp(telemetryXp);
                localStorage.setItem('edu_xp', telemetryXp.toString());
            } else {
                setXp(prev => {
                    const newXp = prev + 25;
                    localStorage.setItem('edu_xp', newXp.toString());
                    return newXp;
                });
            }
        } catch (_) {
            setBackendStatus('offline');
            setMessages(p => [...p, {
                id: agentMsgId,
                text: "I'm having trouble connecting to the server.\n```bash\ncd backend && uvicorn app.main:app --reload\n```",
                sender: 'agent',
                timestamp: new Date(),
                agentName: agentName || 'System',
            }]);
        } finally {
            setIsLoading(false);
            setIsStreaming(false);
        }
    }, [input, isLoading, isStreaming, isRecording, persistMessage, agentName, attachment]);

    const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const items = e.clipboardData?.items;
        if (!items) return;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.type.indexOf('image') !== -1) {
                e.preventDefault();
                const file = item.getAsFile();
                if (file) {
                    setAttachment({ url: URL.createObjectURL(file), file });
                }
                break;
            }
        }
    };

    // ── Memoised messages ─────────────────────────────────────────────────────
    const renderedMessages = useMemo(() => messages.map((msg, idx) => {
        const showLabel = msg.sender === 'agent' &&
            (idx === 0 || messages[idx - 1].sender !== 'agent');

        return (
            <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                    type: 'spring', 
                    stiffness: 400, 
                    damping: 30 
                }}
            >
                {msg.sender === 'user' ? (
                    <div className="gem-msg-user my-2">
                        <div className="gem-msg-user-bubble">
                            {msg.attachmentUrl && (
                                <img 
                                    src={msg.attachmentUrl} 
                                    alt="User attachment" 
                                    style={{ 
                                        maxWidth: '280px', 
                                        maxHeight: '180px', 
                                        objectFit: 'contain', 
                                        borderRadius: 8, 
                                        marginBottom: msg.text !== '[Image Attached]' ? 8 : 0,
                                        display: 'block'
                                    }} 
                                />
                            )}
                            {msg.text !== '[Image Attached]' && (
                                <p style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}>{msg.text}</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="gem-msg-agent my-3">
                        <AgentAvatar emoji={agentEmoji} size={32} />
                        <div className="gem-msg-agent-text">
                            {showLabel && (
                                <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: 4, color: 'var(--text-muted)' }}>
                                    {msg.agentName || agentName} · EduMentor AI
                                </div>
                            )}
                            <div className="ai-content">
                                <ReactMarkdown
                                    remarkPlugins={[remarkMath]}
                                    rehypePlugins={[rehypeKatex]}
                                    components={{
                                        code(props: any) {
                                            const {children, className, node, ...rest} = props
                                            const match = /language-(\w+)/.exec(className || '')
                                            if (match) {
                                                const codeStr = String(children).replace(/\n$/, '')
                                                return (
                                                    <div style={{ margin: '14px 0', padding: '12px 16px', border: '1px solid var(--border)', borderRadius: 10, background: 'var(--bg-surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--brand-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand)' }}>
                                                                <span style={{ fontSize: 16 }}>{'</>'}</span>
                                                            </div>
                                                            <div>
                                                                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{match[1].toUpperCase()} Snippet</span>
                                                                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{codeStr.split('\n').length} lines of code</div>
                                                            </div>
                                                        </div>
                                                        <button onClick={() => {
                                                            setCodePanelContent({ code: codeStr, language: match[1] });
                                                            setSidebarOpen(false);
                                                        }} className="btn-gem" style={{ padding: '6px 14px', fontSize: 12, borderRadius: 6 }}>
                                                            View Code
                                                        </button>
                                                    </div>
                                                )
                                            }
                                            return <code {...rest} className={className} style={{ background: 'var(--bg-active)', padding: '2px 4px', borderRadius: 4, fontFamily: 'monospace', fontSize: '0.9em', color: 'var(--text-primary)' }}>{children}</code>
                                        }
                                    }}
                                >
                                    {msg.text}
                                </ReactMarkdown>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6, color: 'var(--text-muted)' }}>
                                <span style={{ fontSize: '11px' }}>
                                    {msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <button
                                    onClick={() => copyMessage(msg.id, msg.text)}
                                    style={{
                                        padding: '3px 5px', borderRadius: 6,
                                        background: 'transparent', border: 'none',
                                        cursor: 'pointer', color: 'var(--text-muted)',
                                        transition: 'color .15s, background .15s',
                                    }}
                                    title="Copy"
                                >
                                    {copiedId === msg.id ? <Check size={13} color="var(--accent-2)" /> : <Copy size={13} />}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        );
    }), [messages, copiedId, agentName, agentEmoji]);

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <>
            {/* Onboarding modal */}
            <AnimatePresence>
                {showNameModal && (
                    <AgentNameModal onConfirm={handleNameConfirm} />
                )}
            </AnimatePresence>

            <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-base)' }}>

                {/* ══ SIDEBAR ════════════════════════════════════════════════════ */}
                <AnimatePresence initial={false}>
                    {sidebarOpen && (
                        <motion.aside
                            key="sidebar"
                            initial={{ x: -260, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -260, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="gem-sidebar"
                        >
                            {/* Top controls */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '14px 12px 8px' }}>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="gem-icon-btn"
                                    style={{ padding: '7px' }}
                                    title="Close sidebar"
                                >
                                    <PanelLeft size={18} />
                                </button>
                                <button
                                    onClick={() => {
                                        if (agentName) {
                                            setMessages([]);
                                            setCodePanelContent(null);
                                        }
                                    }}
                                    className="gem-icon-btn"
                                    style={{ padding: '7px', marginLeft: 'auto' }}
                                    title="New chat"
                                >
                                    <Pencil size={15} />
                                </button>
                            </div>

                            {/* Agent identity block */}
                            <div
                                style={{
                                    margin: '4px 12px 8px',
                                    padding: '12px',
                                    background: 'var(--bg-hover)',
                                    borderRadius: 14,
                                    border: '1px solid var(--border)',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                    <div style={{
                                        width: 36, height: 36, borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #4285f4, #8ab4f8)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1.1rem', flexShrink: 0,
                                    }}>
                                        {agentEmoji}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        {isEditingName ? (
                                            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                                                <input
                                                    type="text"
                                                    value={editNameInput}
                                                    onChange={e => setEditNameInput(e.target.value)}
                                                    onKeyDown={e => { if (e.key === 'Enter') saveAgentName(); if (e.key === 'Escape') setIsEditingName(false); }}
                                                    maxLength={24}
                                                    autoFocus
                                                    style={{
                                                        flex: 1, background: 'var(--bg-surface)',
                                                        border: '1px solid var(--accent)',
                                                        borderRadius: 8, padding: '3px 8px',
                                                        fontSize: '13px', color: 'var(--text-primary)',
                                                        outline: 'none', minWidth: 0,
                                                    }}
                                                />
                                                <button
                                                    onClick={saveAgentName}
                                                    style={{
                                                        background: 'var(--brand)', color: '#fff',
                                                        border: 'none', borderRadius: 6,
                                                        padding: '3px 8px', fontSize: '11px',
                                                        cursor: 'pointer', flexShrink: 0,
                                                    }}
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <span style={{
                                                    fontWeight: 600,
                                                    fontSize: '13.5px',
                                                    color: 'var(--text-primary)',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    display: 'inline-block',
                                                    maxWidth: '100%'
                                                }}>
                                                    {agentName || '…'}
                                                </span>
                                                <button
                                                    onClick={() => { setEditNameInput(agentName); setIsEditingName(true); }}
                                                    style={{
                                                        background: 'none', border: 'none', cursor: 'pointer',
                                                        color: 'var(--text-muted)', padding: '2px', flexShrink: 0,
                                                        display: 'flex', borderRadius: 4,
                                                    }}
                                                    title="Rename agent"
                                                >
                                                    <Pencil size={11} />
                                                </button>
                                            </div>
                                        )}
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Your AI tutor</div>
                                    </div>
                                </div>

                                {/* Rename / re-pick button */}
                                <button
                                    onClick={() => setShowNameModal(true)}
                                    style={{
                                        width: '100%', padding: '6px 10px', borderRadius: 8,
                                        background: 'var(--bg-active)', border: '1px solid var(--border)',
                                        color: 'var(--text-secondary)', fontSize: '11.5px',
                                        cursor: 'pointer', textAlign: 'center', transition: 'all .15s',
                                    }}
                                    className="hover:!border-[var(--accent)] hover:!text-[var(--accent)]"
                                >
                                    ✨ Change name & emoji
                                </button>
                            </div>

                            {/* Nav links */}
                            <div style={{ padding: '4px 12px 8px', borderBottom: '1px solid var(--border)' }}>
                                <Link href="/dashboard" className="gem-sidebar-icon-btn">
                                    <Trophy size={16} />
                                    Dashboard
                                </Link>
                                <Link href="/settings" className="gem-sidebar-icon-btn">
                                    <Settings size={16} />
                                    Settings
                                </Link>
                            </div>

                            {/* History heading */}
                            <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
                                <p className="gem-section-label" style={{ marginBottom: 6 }}>Recent chats</p>
                                {sessions.length > 0 ? sessions.map((s, i) => {
                                    const preview = s.messages && s.messages.length > 0 ? s.messages[0].text : 'New chat';
                                    return (
                                        <div 
                                            key={i} 
                                            className={`gem-history-item`}
                                            onClick={() => loadSession(s)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div style={{ fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {preview}
                                            </div>
                                            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{s.date}</div>
                                        </div>
                                    );
                                }) : (
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '0 4px' }}>
                                        No recent chats
                                    </div>
                                )}
                            </div>

                            {/* Bottom: XP + status */}
                            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                    <span className="xp-badge">⚡ {xp.toLocaleString()} XP</span>
                                    <span className="streak-badge">🔥 {streak}d</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <div className={`status-dot ${backendStatus}`} />
                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                        {backendStatus === 'online' ? 'Backend online' : backendStatus === 'offline' ? 'Backend offline' : 'Connecting…'}
                                    </span>
                                </div>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* ══ MAIN AREA ════════════════════════════════════════════════ */}
                <div className="gem-main">

                    {/* Top bar */}
                    <header className="gem-topbar">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {!sidebarOpen && (
                                <button onClick={() => setSidebarOpen(true)} className="gem-icon-btn" style={{ padding: '7px' }}>
                                    <PanelLeft size={18} />
                                </button>
                            )}
                            {agentName && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ fontSize: '1rem' }}>{agentEmoji}</span>
                                    <span style={{
                                        fontFamily: "'Google Sans', Outfit, sans-serif",
                                        fontSize: '0.9375rem', fontWeight: 500,
                                        color: 'var(--text-secondary)',
                                    }}>
                                        Chat with {agentName}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {!sidebarOpen && (
                                <>
                                    <span className="xp-badge" style={{ marginRight: 4 }}>⚡ {xp.toLocaleString()} XP</span>
                                    <span className="streak-badge" style={{ marginRight: 4 }}>🔥 {streak}d</span>
                                </>
                            )}
                            <Link href="/dashboard" className="gem-icon-btn">
                                <Trophy size={16} />
                                <span style={{ display: 'none' }} className="sm:inline">Dashboard</span>
                            </Link>
                            <Link href="/" className="gem-icon-btn">
                                <ChevronLeft size={16} />
                                <span style={{ display: 'none' }} className="sm:inline">Home</span>
                            </Link>
                        </div>
                    </header>

                    {/* Messages */}
                    <div className="gem-messages" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="gem-messages-inner" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            {messages.length === 0 ? (
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', textAlign: 'center', paddingBottom: 40 }}>
                                    <div style={{ marginBottom: 24, padding: '6px 16px', background: 'var(--bg-hover)', borderRadius: 9999, fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--border-strong)', boxShadow: 'var(--shadow-sm)' }}>
                                        <span>👑 Level {Math.floor((xp || 0) / 500) + 1} Scholar</span>
                                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--border)' }} />
                                        <span style={{ color: 'var(--streak-orange)', fontWeight: 600 }}>🔥 {streak} Day Streak</span>
                                    </div>
                                    <div style={{ fontSize: '3.5rem', marginBottom: 16, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}>
                                        {agentEmoji}
                                    </div>
                                    <h1 style={{ fontFamily: "'Google Sans', Outfit, sans-serif", fontSize: '2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 40, letterSpacing: '-0.02em', lineHeight: 1.3 }}>
                                        Sasa! I'm <span style={{ color: 'var(--brand)' }}>{agentName}</span>.<br />Ready to level up?
                                    </h1>
                                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 680 }}>
                                        {[
                                            { icon: '➗', label: 'Math Problem', prompt: 'I want to solve a math problem...' },
                                            { icon: '💡', label: 'Concept breakdown', prompt: 'Can you break down the concept of...' },
                                            { icon: '📝', label: 'Quiz me', prompt: 'Can you quiz me on...' },
                                            { icon: '🧑‍💻', label: 'Code review', prompt: 'I need a code review for...' },
                                            { icon: '📈', label: 'Study plan', prompt: 'Help me create a study plan for...' }
                                        ].map(chip => (
                                            <button
                                                key={chip.label}
                                                onClick={() => { setInput(chip.prompt); inputRef.current?.focus(); }}
                                                className="gem-icon-btn hover:!border-[var(--brand)] hover:!text-[var(--text-primary)]"
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: 8,
                                                    padding: '12px 20px', background: 'var(--bg-surface)',
                                                    border: '1px solid var(--border)', borderRadius: 16,
                                                    color: 'var(--text-secondary)', fontSize: 14,
                                                    boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s'
                                                }}
                                            >
                                                <span style={{ fontSize: 18 }}>{chip.icon}</span>
                                                <span style={{ fontWeight: 500 }}>{chip.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <AnimatePresence initial={false}>
                                    {renderedMessages}
                                </AnimatePresence>
                            )}

                            {/* Typing indicator */}
                            {isLoading && !isStreaming && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="gem-msg-agent my-3"
                                >
                                    <AgentAvatar emoji={agentEmoji} size={32} />
                                    <div className="gem-msg-agent-text">
                                        <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: 6, color: 'var(--text-muted)' }}>
                                            {agentName} · EduMentor AI
                                        </div>
                                        <div className="gem-typing" style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                                            <span /><span /><span />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Quick chips */}
                    {messages.length > 0 && (
                        <div
                            className="hide-scrollbar"
                            style={{
                                maxWidth: 820, width: '100%',
                                margin: '0 auto', padding: '0 24px 8px',
                                display: 'flex', gap: 8, overflowX: 'auto',
                            }}
                        >
                        {[
                            { label: '💡 Give me a hint',       value: 'Give me a hint' },
                            { label: '📖 Explain step by step', value: 'Explain this step by step' },
                            { label: '✅ Is this correct?',     value: 'Is my answer correct?' },
                            { label: '🔄 Try another topic',    value: "Let's try a different topic" },
                        ].map(chip => (
                            <button
                                key={chip.label}
                                onClick={() => { setInput(chip.value); inputRef.current?.focus(); }}
                                className="gem-chip"
                            >
                                {chip.label}
                            </button>
                        ))}
                        </div>
                    )}

                    {/* Input area */}
                    <div className="gem-input-area">
                        <div className="gem-input-box">
                            {attachment && (
                                <div style={{ position: 'relative', display: 'inline-block', alignSelf: 'flex-start', marginBottom: 10 }}>
                                    <img src={attachment.url} alt="Attachment" style={{ height: 60, borderRadius: 8, border: '1px solid var(--border)' }} />
                                    <button 
                                        onClick={() => setAttachment(null)} 
                                        style={{ position: 'absolute', top: -6, right: -6, background: 'var(--bg-active)', borderRadius: '50%', border: '1px solid var(--border)', color: 'var(--text-primary)', width: 22, height: 22, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >×</button>
                                </div>
                            )}
                            <textarea
                                ref={inputRef}
                                rows={1}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKey}
                                onPaste={handlePaste}
                                placeholder={
                                    isRecording
                                        ? '🎙 Listening…'
                                        : agentName
                                            ? `Ask ${agentName} anything…`
                                            : 'Ask your AI anything…'
                                }
                                className="gem-textarea"
                                style={{ minHeight: 24 }}
                            />
                            <div className="gem-input-actions">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <button className="gem-icon-btn" title="Attach file" style={{ padding: '6px 8px' }} onClick={() => fileInputRef.current?.click()}>
                                        <Plus size={18} />
                                    </button>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        style={{ display: 'none' }} 
                                        accept="image/*,application/pdf" 
                                        onChange={e => {
                                            const file = e.target.files?.[0];
                                            if (file) setAttachment({ url: URL.createObjectURL(file), file });
                                            if (e.target) e.target.value = '';
                                        }} 
                                    />
                                    <button
                                        onClick={toggleRecording}
                                        className="gem-icon-btn"
                                        style={{ padding: '6px 10px', color: isRecording ? '#f28b82' : undefined }}
                                        title={isRecording ? 'Stop recording' : 'Voice input'}
                                    >
                                        {isRecording
                                            ? <Disc size={17} style={{ animation: 'pulse 1s infinite' }} />
                                            : <Mic size={17} />
                                        }
                                        <span style={{ fontSize: '12px', opacity: .65 }}>
                                            {isRecording ? 'Stop' : 'Voice'}
                                        </span>
                                    </button>
                                    <Link href="/dashboard" className="gem-icon-btn" style={{ padding: '6px 10px' }}>
                                        <BookOpen size={17} />
                                        <span style={{ fontSize: '12px', opacity: .65 }}>Progress</span>
                                    </Link>
                                </div>

                                <button
                                    onClick={handleSend}
                                    disabled={(!input.trim() && !attachment) || isLoading}
                                    className="gem-send-btn"
                                    title="Send (Enter)"
                                >
                                    <Send size={15} />
                                </button>
                            </div>
                        </div>
                        <p style={{
                            textAlign: 'center', fontSize: '11px',
                            color: 'var(--text-muted)', marginTop: 8,
                        }}>
                            Press <kbd style={{ fontFamily: 'monospace' }}>Enter</kbd> to send ·{' '}
                            <kbd style={{ fontFamily: 'monospace' }}>Shift+Enter</kbd> for new line
                        </p>
                    </div>
                </div>

                {/* ══ CODE PANEL ════════════════════════════════════════════════ */}
                <AnimatePresence>
                    {codePanelContent && (
                        <motion.aside
                            initial={{ x: 400, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 400, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                            style={{ 
                                width: '400px', 
                                borderLeft: '1px solid var(--border)', 
                                background: 'var(--bg-surface)', 
                                display: 'flex', 
                                flexDirection: 'column',
                                flexShrink: 0,
                                zIndex: 50
                            }}
                        >
                            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-base)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{codePanelContent.language.toUpperCase()} Code</span>
                                </div>
                                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                    <button
                                        onClick={() => copyMessage('code', codePanelContent.code)}
                                        className="gem-icon-btn"
                                        style={{ padding: '6px' }}
                                        title="Copy to clipboard"
                                    >
                                        {copiedId === 'code' ? <Check size={16} color="var(--accent-2)" /> : <Copy size={16} />}
                                    </button>
                                    <button
                                        onClick={() => {
                                            const element = document.createElement('a');
                                            const file = new Blob([codePanelContent.code], { type: 'text/plain' });
                                            element.href = URL.createObjectURL(file);
                                            element.download = `snippet.${codePanelContent.language || 'txt'}`;
                                            document.body.appendChild(element);
                                            element.click();
                                            document.body.removeChild(element);
                                        }}
                                        className="gem-icon-btn"
                                        style={{ padding: '6px' }}
                                        title="Download file"
                                    >
                                        <span style={{ fontSize: '14px' }}>⬇️</span>
                                    </button>
                                    <div style={{ width: 1, height: 16, background: 'var(--border)', margin: '0 4px' }} />
                                    <button
                                        onClick={() => setCodePanelContent(null)}
                                        className="gem-icon-btn"
                                        style={{ padding: '6px' }}
                                    >
                                        <span style={{ fontSize: '18px', lineHeight: 1 }}>×</span>
                                    </button>
                                </div>
                            </div>
                            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', background: 'var(--bg-hover)' }}>
                                <pre style={{ margin: 0, color: 'var(--text-primary)', fontSize: '13.5px', fontFamily: 'monospace', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                                    {codePanelContent.code}
                                </pre>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}