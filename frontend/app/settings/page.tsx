'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft, User, MessageSquare, Sparkles,
    ChevronRight, Trash2, Check, Pencil
} from 'lucide-react';
import Link from 'next/link';

// ─── Types ─────────────────────────────────────────────────────────────────────
interface ChatSession {
    date: string;
    messages: { text: string; sender: 'user' | 'agent'; agentName?: string }[];
}

interface UserProfile {
    name: string;
    email: string;
    xp: number;
    level: number;
    streak: number;
    memberSince: string;
}

const AGENT_EMOJIS = ['🤖', '🦉', '⭐', '🔥', '🧠', '💡', '🦁', '🌟', '🎓', '🪄'];

// ─── Reusable section card ────────────────────────────────────────────────────
function Section({ title, children }: { title?: string; children: React.ReactNode }) {
    return (
        <div
            style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
            }}
        >
            {title && (
                <p style={{
                    padding: '14px 20px 4px',
                    fontSize: '11px', fontWeight: 600,
                    letterSpacing: '0.07em', textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                }}>
                    {title}
                </p>
            )}
            {children}
        </div>
    );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div
            style={{
                padding: '14px 20px',
                borderTop: '1px solid var(--border)',
            }}
        >
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: 6 }}>{label}</p>
            {children}
        </div>
    );
}

// ─── Settings Page ─────────────────────────────────────────────────────────────
export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'account' | 'history' | 'agent'>('account');
    const [sessions, setSessions]   = useState<ChatSession[]>([]);

    // Profile
    const [profile, setProfile] = useState<UserProfile>({
        name: 'Flix', email: 'user@edumentor.ai',
        xp: 1250, level: 5, streak: 7, memberSince: 'February 2026',
    });
    const [editingName, setEditingName]   = useState(false);
    const [editingEmail, setEditingEmail] = useState(false);
    const [nameInput, setNameInput]       = useState('');
    const [emailInput, setEmailInput]     = useState('');

    // Agent
    const [agentName, setAgentName]       = useState('');
    const [agentEmoji, setAgentEmoji]     = useState(AGENT_EMOJIS[0]);
    const [agentNameInput, setAgentNameInput] = useState('');
    const [editingAgent, setEditingAgent] = useState(false);
    const [agentSaved, setAgentSaved]     = useState(false);

    // ── Load from localStorage ─────────────────────────────────────────────────
    useEffect(() => {
        try {
            const raw = localStorage.getItem('edu_chat_sessions') || '[]';
            setSessions(JSON.parse(raw));
        } catch (_) {}

        try {
            const saved = localStorage.getItem('edu_profile');
            if (saved) {
                const p = JSON.parse(saved);
                setProfile(p);
                setNameInput(p.name || '');
                setEmailInput(p.email || '');
            } else {
                setNameInput(profile.name);
                setEmailInput(profile.email);
            }
        } catch (_) {
            setNameInput(profile.name);
            setEmailInput(profile.email);
        }

        const savedAgent = localStorage.getItem('edu_agent_name') || '';
        const savedEmoji = localStorage.getItem('edu_agent_emoji') || AGENT_EMOJIS[0];
        setAgentName(savedAgent);
        setAgentEmoji(savedEmoji);
        setAgentNameInput(savedAgent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const saveProfile = () => {
        const updated = { ...profile, name: nameInput, email: emailInput };
        setProfile(updated);
        localStorage.setItem('edu_profile', JSON.stringify(updated));
        setEditingName(false);
        setEditingEmail(false);
    };

    const saveAgent = () => {
        const trimmed = agentNameInput.trim();
        if (!trimmed) return;
        localStorage.setItem('edu_agent_name', trimmed);
        localStorage.setItem('edu_agent_emoji', agentEmoji);
        setAgentName(trimmed);
        setEditingAgent(false);
        setAgentSaved(true);
        setTimeout(() => setAgentSaved(false), 2000);
    };

    const clearHistory = () => {
        if (confirm('Clear all chat history?')) {
            localStorage.removeItem('edu_chat_sessions');
            setSessions([]);
        }
    };

    const tabs = [
        { id: 'account' as const, label: 'Account',   icon: <User size={15} /> },
        { id: 'agent'   as const, label: 'AI Tutor',  icon: <Sparkles size={15} /> },
        { id: 'history' as const, label: 'History',   icon: <MessageSquare size={15} /> },
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', overflowY: 'auto' }}>

            {/* ── Header ─────────────────────────────────────────────────────── */}
            <header style={{
                position: 'sticky', top: 0, zIndex: 40,
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '0 20px', height: 56,
                background: 'rgba(30,31,32,0.85)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid var(--border)',
            }}>
                <Link href="/chat">
                    <button style={{
                        padding: '7px', borderRadius: 8, display: 'flex',
                        background: 'transparent', border: 'none',
                        color: 'var(--text-secondary)', cursor: 'pointer', transition: 'background .15s',
                    }} className="hover:bg-white/5">
                        <ArrowLeft size={18} />
                    </button>
                </Link>
                <h1 style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Settings</h1>
            </header>

            <div style={{ maxWidth: 580, margin: '0 auto', padding: '28px 20px 60px', display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* ── Tab row ──────────────────────────────────────────────────── */}
                <nav style={{
                    display: 'flex', gap: 4, padding: '4px',
                    background: 'var(--bg-surface)',
                    borderRadius: 14, border: '1px solid var(--border)',
                }}>
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id)}
                            style={{
                                flex: 1, display: 'flex', alignItems: 'center',
                                justifyContent: 'center', gap: 6,
                                padding: '8px 10px', borderRadius: 10,
                                border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                                transition: 'all .15s',
                                background: activeTab === t.id ? 'var(--bg-hover)' : 'transparent',
                                color: activeTab === t.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                            }}
                        >
                            {t.icon}
                            {t.label}
                        </button>
                    ))}
                </nav>

                {/* ══ ACCOUNT TAB ══════════════════════════════════════════════ */}
                {activeTab === 'account' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                        {/* Profile card */}
                        <Section>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
                                <div style={{
                                    width: 52, height: 52, borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #4285f4, #81c995)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.5rem', flexShrink: 0,
                                }}>
                                    🎓
                                </div>
                                <div>
                                    <p style={{ fontWeight: 600, fontSize: '1rem' }}>{profile.name}</p>
                                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{profile.email}</p>
                                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 2 }}>Member since {profile.memberSince}</p>
                                </div>
                            </div>
                            {/* Stats */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                                {[
                                    { label: 'XP',     value: profile.xp.toLocaleString() },
                                    { label: 'Level',  value: String(profile.level) },
                                    { label: 'Streak', value: `${profile.streak}d 🔥` },
                                ].map((s, i) => (
                                    <div key={s.label} style={{
                                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                                        padding: '14px 8px', gap: 2,
                                        borderRight: i < 2 ? '1px solid var(--border)' : 'none',
                                    }}>
                                        <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--accent)' }}>{s.value}</span>
                                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.label}</span>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        <Section title="Profile">
                            {/* Display Name */}
                            <FieldRow label="Display Name">
                                {editingName ? (
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <input
                                            value={nameInput}
                                            onChange={e => setNameInput(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && saveProfile()}
                                            autoFocus
                                            style={{
                                                flex: 1, background: 'var(--bg-hover)',
                                                border: '1px solid var(--accent)',
                                                borderRadius: 8, padding: '7px 12px',
                                                fontSize: '13.5px', color: 'var(--text-primary)', outline: 'none',
                                            }}
                                        />
                                        <button onClick={saveProfile} className="btn-gem" style={{ padding: '7px 14px', fontSize: '12px' }}>Save</button>
                                        <button
                                            onClick={() => setEditingName(false)}
                                            className="btn-ghost"
                                            style={{ padding: '7px 12px', fontSize: '12px' }}
                                        >Cancel</button>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '14px', fontWeight: 500 }}>{profile.name}</span>
                                        <button
                                            onClick={() => setEditingName(true)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: 4 }}
                                        >
                                            <Pencil size={12} /> Edit
                                        </button>
                                    </div>
                                )}
                            </FieldRow>

                            {/* Email */}
                            <FieldRow label="Email">
                                {editingEmail ? (
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <input
                                            type="email"
                                            value={emailInput}
                                            onChange={e => setEmailInput(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && saveProfile()}
                                            autoFocus
                                            style={{
                                                flex: 1, background: 'var(--bg-hover)',
                                                border: '1px solid var(--accent)',
                                                borderRadius: 8, padding: '7px 12px',
                                                fontSize: '13.5px', color: 'var(--text-primary)', outline: 'none',
                                            }}
                                        />
                                        <button onClick={saveProfile} className="btn-gem" style={{ padding: '7px 14px', fontSize: '12px' }}>Save</button>
                                        <button onClick={() => setEditingEmail(false)} className="btn-ghost" style={{ padding: '7px 12px', fontSize: '12px' }}>Cancel</button>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '14px', fontWeight: 500 }}>{profile.email}</span>
                                        <button
                                            onClick={() => setEditingEmail(true)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: 4 }}
                                        >
                                            <Pencil size={12} /> Edit
                                        </button>
                                    </div>
                                )}
                            </FieldRow>
                        </Section>
                    </motion.div>
                )}

                {/* ══ AI TUTOR TAB ═════════════════════════════════════════════ */}
                {activeTab === 'agent' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                        {/* Current agent preview */}
                        <div
                            style={{
                                background: 'var(--bg-surface)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-lg)',
                                padding: '20px',
                                display: 'flex', alignItems: 'center', gap: 14,
                            }}
                        >
                            <div style={{
                                width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
                                background: 'linear-gradient(135deg, #4285f4, #8ab4f8)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.8rem',
                            }}>
                                {agentEmoji}
                            </div>
                            <div>
                                <p style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                                    {agentName || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Not set yet</span>}
                                </p>
                                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: 2 }}>Your personal AI tutor</p>
                            </div>
                            {agentSaved && (
                                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, color: 'var(--accent-2)', fontSize: '12px' }}>
                                    <Check size={14} />
                                    Saved!
                                </div>
                            )}
                        </div>

                        {/* Edit form */}
                        <Section title="Customise your AI tutor">
                            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
                                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: 10 }}>Choose an emoji</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                                    {AGENT_EMOJIS.map(em => (
                                        <button
                                            key={em}
                                            onClick={() => setAgentEmoji(em)}
                                            style={{
                                                width: 42, height: 42, borderRadius: 10, fontSize: '1.3rem',
                                                border: '2px solid',
                                                borderColor: agentEmoji === em ? 'var(--accent)' : 'var(--border)',
                                                background: agentEmoji === em ? 'var(--accent-soft)' : 'var(--bg-hover)',
                                                cursor: 'pointer', display: 'flex', alignItems: 'center',
                                                justifyContent: 'center', transition: 'all .15s',
                                            }}
                                        >
                                            {em}
                                        </button>
                                    ))}
                                </div>

                                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: 8 }}>Agent name</p>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    border: '1px solid var(--border-strong)',
                                    background: 'var(--bg-hover)', borderRadius: 12,
                                    padding: '2px 6px 2px 12px', marginBottom: 16,
                                }}>
                                    <span style={{ fontSize: '1.1rem' }}>{agentEmoji}</span>
                                    <input
                                        type="text"
                                        value={agentNameInput}
                                        onChange={e => setAgentNameInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && saveAgent()}
                                        placeholder="e.g. Nova, Aria, Zara…"
                                        maxLength={24}
                                        style={{
                                            flex: 1, background: 'transparent', border: 'none', outline: 'none',
                                            fontSize: '14px', color: 'var(--text-primary)',
                                            padding: '10px 0',
                                        }}
                                    />
                                </div>

                                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: 8 }}>Suggestions</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                                    {['Nova', 'Zara', 'Atlas', 'Sage', 'Echo', 'Aria', 'Cleo', 'Orion', 'Mira', 'Leo'].map(n => (
                                        <button
                                            key={n}
                                            onClick={() => setAgentNameInput(n)}
                                            style={{
                                                padding: '4px 12px', borderRadius: 9999, fontSize: '12px',
                                                border: '1px solid', cursor: 'pointer',
                                                borderColor: agentNameInput === n ? 'var(--accent)' : 'var(--border-strong)',
                                                background: agentNameInput === n ? 'var(--accent-soft)' : 'var(--bg-hover)',
                                                color: agentNameInput === n ? 'var(--accent)' : 'var(--text-secondary)',
                                                transition: 'all .12s',
                                            }}
                                        >
                                            {n}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={saveAgent}
                                    disabled={!agentNameInput.trim()}
                                    className="btn-gem"
                                    style={{
                                        width: '100%', justifyContent: 'center',
                                        padding: '11px', fontSize: '14px',
                                        opacity: agentNameInput.trim() ? 1 : 0.4,
                                        cursor: agentNameInput.trim() ? 'pointer' : 'not-allowed',
                                    }}
                                >
                                    {agentSaved ? (
                                        <><Check size={15} /> Saved!</>
                                    ) : (
                                        <>Save — Meet {agentNameInput.trim() || 'your AI'}</>
                                    )}
                                </button>
                            </div>
                        </Section>

                        <Section>
                            <div style={{ padding: '14px 20px' }}>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                    Your AI tutor's name is displayed in the chat sidebar, message headers, and input placeholder. You can change it any time here.
                                </p>
                                <Link href="/chat" style={{ fontSize: '13px', color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 10 }}>
                                    Go to chat <ChevronRight size={13} />
                                </Link>
                            </div>
                        </Section>
                    </motion.div>
                )}

                {/* ══ HISTORY TAB ══════════════════════════════════════════════ */}
                {activeTab === 'history' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                {sessions.length === 0
                                    ? 'No sessions yet. Start chatting!'
                                    : `${sessions.length} session${sessions.length > 1 ? 's' : ''} saved locally`}
                            </p>
                            {sessions.length > 0 && (
                                <button
                                    onClick={clearHistory}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 5,
                                        fontSize: '12px', color: '#f28b82',
                                        background: 'none', border: 'none', cursor: 'pointer',
                                    }}
                                >
                                    <Trash2 size={13} /> Clear all
                                </button>
                            )}
                        </div>

                        {sessions.length === 0 ? (
                            <div style={{
                                background: 'var(--bg-surface)', border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-lg)', padding: '48px 20px',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                            }}>
                                <MessageSquare size={32} color="var(--text-muted)" />
                                <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>No chat history yet</p>
                                <Link href="/chat" style={{ fontSize: '13px', color: 'var(--accent)' }}>
                                    Start a conversation
                                </Link>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {sessions.map((session, i) => {
                                    const userMsgs  = session.messages.filter(m => m.sender === 'user').length;
                                    const agentMsgs = session.messages.filter(m => m.sender === 'agent').length;
                                    const preview   = session.messages.find(m => m.sender === 'user')?.text || 'No messages';
                                    return (
                                        <div
                                            key={i}
                                            style={{
                                                background: 'var(--bg-surface)',
                                                border: '1px solid var(--border)',
                                                borderRadius: 'var(--radius-md)',
                                                padding: '14px 16px',
                                                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
                                            }}
                                        >
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 3 }}>{session.date}</p>
                                                <p style={{ fontSize: '13.5px', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{preview}</p>
                                                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 4 }}>
                                                    {userMsgs} sent · {agentMsgs} replies
                                                </p>
                                            </div>
                                            <ChevronRight size={15} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 2 }} />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* App info */}
                <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
                    EduMentor AI · v1.0.0 · Built in Nairobi 🇰🇪
                </p>
            </div>
        </div>
    );
}
