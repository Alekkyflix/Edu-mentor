'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mic, Send, Copy, Check, Plus, Settings, Disc,
    Sparkles, BookOpen, Trophy, Flame,
    ChevronLeft, PanelLeft, Pencil
} from 'lucide-react';
import Link from 'next/link';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Message {
    id: string;
    text: string;
    sender: 'user' | 'agent';
    timestamp: Date;
    agentName?: string;
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

// ─── Simple Markdown → HTML renderer ─────────────────────────────────────────
function renderMd(text: string): string {
    const esc = (t: string) =>
        t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return text
        .replace(/```(\w*)\n?([\s\S]*?)```/g, (_, l, c) =>
            `<pre><code class="language-${l}">${esc(c.trim())}</code></pre>`)
        .replace(/`([^`]+)`/g, (_, c) => `<code>${esc(c)}</code>`)
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/^[-*•] (.+)$/gm, '<li>$1</li>')
        .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
        .replace(/\n{2,}/g, '</p><p>');
}

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
    const [copiedId, setCopiedId]     = useState<string | null>(null);
    const [backendStatus, setBackendStatus] = useState<'online' | 'offline' | 'checking'>('checking');
    const [xp, setXp]                 = useState(1250);
    const [streak]                    = useState(7);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // ── Refs ───────────────────────────────────────────────────────────────────
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef       = useRef<HTMLTextAreaElement>(null);
    const recognitionRef = useRef<any>(null);

    // ── Load agent name from localStorage on mount ────────────────────────────
    useEffect(() => {
        const saved = localStorage.getItem('edu_agent_name');
        const savedEmoji = localStorage.getItem('edu_agent_emoji');
        if (saved) {
            setAgentName(saved);
            setAgentEmoji(savedEmoji || AGENT_EMOJIS[0]);
            // Show welcome message with saved name
            setMessages([{
                id: '1',
                text: `Habari! I'm **${saved}**, your AI learning mentor. 🔥\n\nAsk me anything — fractions, algebra, science, Kiswahili — I'm here to guide you. What would you like to explore today?`,
                sender: 'agent',
                timestamp: new Date(),
                agentName: saved,
            }]);
        } else {
            // First time — show the name picker modal
            setShowNameModal(true);
        }
    }, []);

    // ── Backend connection monitor ───────────────────────────────────────────
    useEffect(() => {
        let failureCount = 0;
        const checkBackend = async () => {
            try {
                const res = await fetch('/api/', { cache: 'no-store' });
                if (res.ok) {
                    setBackendStatus('online');
                    failureCount = 0; // Reset on success
                } else {
                    failureCount++;
                    if (failureCount >= 3) {
                        setBackendStatus('offline');
                        clearInterval(interval);
                    }
                }
            } catch (_) {
                failureCount++;
                if (failureCount >= 3) {
                    setBackendStatus('offline');
                    clearInterval(interval);
                }
            }
        };

        // Check initially
        checkBackend();

        // Check every 5 seconds
        const interval = setInterval(checkBackend, 5000);
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
    }, [messages, isLoading]);

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
            const sessions: any[] = JSON.parse(raw);
            const today = new Date().toDateString();
            const existing = sessions.find((s: any) => s.date === today);
            if (existing) existing.messages.push({ text: msg.text, sender: msg.sender });
            else sessions.unshift({ date: today, messages: [{ text: msg.text, sender: msg.sender }] });
            localStorage.setItem('edu_chat_sessions', JSON.stringify(sessions.slice(0, 30)));
        } catch (_) {}
    }, []);

    const handleSend = useCallback(async () => {
        const trimmed = input.trim();
        if (!trimmed || isLoading) return;
        if (isRecording && recognitionRef.current) { recognitionRef.current.stop(); setIsRecording(false); }

        const userMsg: Message = { id: Date.now().toString(), text: trimmed, sender: 'user', timestamp: new Date() };
        setMessages(p => [...p, userMsg]);
        persistMessage(userMsg);
        setInput('');
        setIsLoading(true);

        const agentMsgId = (Date.now() + 1).toString();
        try {
            // Use the relative path to leverage Next.js rewrites:
            // Local dev  →  http://localhost:8000/chat
            // Production →  ${NEXT_PUBLIC_API_URL}/chat
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: trimmed, student_id: 'student123' }),
            });
            if (!res.ok) throw new Error('Bad response from backend');
            setBackendStatus('online');
            const data = await res.json();
            const agentMsg: Message = {
                id: agentMsgId,
                text: data.response || 'No response.',
                sender: 'agent',
                timestamp: new Date(),
                agentName: agentName,
            };
            setMessages(p => [...p, agentMsg]);
            persistMessage(agentMsg);
            if (data.telemetry?.xp !== undefined) setXp(data.telemetry.xp);
            else setXp(prev => prev + 25);
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
        }
    }, [input, isLoading, isRecording, persistMessage, agentName]);

    const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    // ── Memoised messages ─────────────────────────────────────────────────────
    const renderedMessages = useMemo(() => messages.map((msg, idx) => {
        const showLabel = msg.sender === 'agent' &&
            (idx === 0 || messages[idx - 1].sender !== 'agent');

        return (
            <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
            >
                {msg.sender === 'user' ? (
                    <div className="gem-msg-user my-2">
                        <div className="gem-msg-user-bubble">
                            <p style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}>{msg.text}</p>
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
                            <div
                                className="ai-content"
                                dangerouslySetInnerHTML={{ __html: `<p>${renderMd(msg.text)}</p>` }}
                            />
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
                                            setMessages([{
                                                id: Date.now().toString(),
                                                text: `Sasa! Ready for a new session. What shall we tackle? 🚀`,
                                                sender: 'agent',
                                                timestamp: new Date(),
                                                agentName: agentName,
                                            }]);
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
                                {[
                                    { preview: 'Help me with fractions',       date: 'Yesterday' },
                                    { preview: 'Algebra: solving for x',       date: 'Mon' },
                                    { preview: 'M-Pesa percentage problem',    date: 'Sun' },
                                    { preview: 'Geometry – angles quiz',       date: 'Sat' },
                                ].map((s, i) => (
                                    <div key={i} className={`gem-history-item ${i === 0 ? 'active' : ''}`}>
                                        <div style={{ fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {s.preview}
                                        </div>
                                        <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{s.date}</div>
                                    </div>
                                ))}
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
                    <div className="gem-messages">
                        <div className="gem-messages-inner">
                            <AnimatePresence initial={false}>
                                {renderedMessages}
                            </AnimatePresence>

                            {/* Typing indicator */}
                            {isLoading && (
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

                    {/* Input area */}
                    <div className="gem-input-area">
                        <div className="gem-input-box">
                            <textarea
                                ref={inputRef}
                                rows={1}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKey}
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
                                    <button className="gem-icon-btn" title="Attach file" style={{ padding: '6px 8px' }}>
                                        <Plus size={18} />
                                    </button>
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
                                    disabled={!input.trim() || isLoading}
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
            </div>
        </>
    );
}
