'use client';

export const dynamic = 'force-dynamic';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, Trophy, Zap, Target, MessageCircle, TrendingUp, ArrowRight, CheckCircle2 } from 'lucide-react';

const FEATURES = [
    {
        icon: <Trophy size={28} />,
        title: 'Gamified XP System',
        desc: 'Earn XP for every question you answer, unlock achievements, and climb the Nairobi leaderboard.',
        accent: 'var(--xp-gold)',
    },
    {
        icon: <Target size={28} />,
        title: 'Productive Struggle',
        desc: "The Professor doesn't hand you answers. You're guided through discovery — the real way to learn.",
        accent: 'var(--accent)',
    },
    {
        icon: <TrendingUp size={28} />,
        title: 'Progress Tracking',
        desc: 'Visualise your mastery per topic, weekly streaks, and struggle scores over time.',
        accent: 'var(--accent-2)',
    },
];

const SUBJECTS = ['Mathematics', 'Science', 'English', 'Kiswahili', 'History', 'Geography', 'Physics', 'Chemistry'];

export default function HomePage() {
    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'var(--bg-base)',
                color: 'var(--text-primary)',
                overflowY: 'auto',
                overflowX: 'hidden',
            }}
        >
            {/* ── Ambient blobs ─────────────────────────────────────────────── */}
            <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                <div
                    style={{
                        position: 'absolute', top: '-10%', right: '-5%',
                        width: 600, height: 600,
                        background: 'radial-gradient(circle, rgba(66,133,244,0.12) 0%, transparent 70%)',
                        borderRadius: '50%',
                    }}
                />
                <div
                    style={{
                        position: 'absolute', bottom: '10%', left: '-5%',
                        width: 500, height: 500,
                        background: 'radial-gradient(circle, rgba(129,201,149,0.1) 0%, transparent 70%)',
                        borderRadius: '50%',
                    }}
                />
            </div>

            {/* ── Nav ───────────────────────────────────────────────────────── */}
            <motion.nav
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                    position: 'sticky', top: 0, zIndex: 50,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 20px', height: 60,
                    background: 'rgba(30,31,32,0.8)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid var(--border)',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                        style={{
                            width: 28, height: 28, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #4285f4, #81c995)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                    >
                        <Sparkles size={14} color="#fff" />
                    </div>
                    <span
                        style={{
                            fontFamily: "'Google Sans', sans-serif",
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                        }}
                    >
                        EduMentor AI
                    </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Link href="/dashboard" className="nav-link" style={{ padding: '6px 12px' }}>
                        <span className="hidden sm:inline">Dashboard</span>
                    </Link>
                    <Link href="/chat" className="btn-gem" style={{ padding: '8px 16px', fontSize: '13px' }}>
                        <span className="hidden sm:inline">Start Learning</span>
                        <span className="sm:hidden">Start</span>
                        <ArrowRight size={15} />
                    </Link>
                </div>
            </motion.nav>

            {/* ── Hero ──────────────────────────────────────────────────────── */}
            <section
                style={{
                    position: 'relative', zIndex: 1,
                    maxWidth: 760, margin: '0 auto',
                    padding: '64px 20px 48px',
                    textAlign: 'center',
                }}
            >
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}
                >
                    <span
                        style={{
                            fontSize: '12px', fontWeight: 600,
                            padding: '5px 14px', borderRadius: 9999,
                            background: 'var(--brand-soft)',
                            color: 'var(--accent)',
                            border: '1px solid rgba(138,180,248,.25)',
                            letterSpacing: '0.04em',
                        }}
                    >
                        🔥 Built for students
                    </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    style={{
                        fontFamily: "'Google Sans', sans-serif",
                        fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                        fontWeight: 700,
                        lineHeight: 1.15,
                        marginBottom: 20,
                        letterSpacing: '-0.02em',
                    }}
                >
                    Learn smarter with{' '}
                    <span className="text-gradient">AI-powered tutoring</span>
                    <br />designed for <em>you</em>.
                </motion.h1>

                {/* Subhead */}
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{
                        fontSize: '1.0625rem',
                        lineHeight: 1.7,
                        color: 'var(--text-secondary)',
                        marginBottom: 36,
                        maxWidth: 560,
                        margin: '0 auto 36px',
                    }}
                >
                    Meet <strong style={{ color: 'var(--text-primary)' }}>Imani</strong>, your AI mentor who understands Kenyan context — from M-Pesa maths to matatu logic. Gamified, adaptive, and always poa.
                </motion.p>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}
                >
                    <Link href="/chat" className="btn-gem" style={{ fontSize: '0.9375rem', padding: '12px 28px' }}>
                        Twende Kazi 🚀
                        <ArrowRight size={16} />
                    </Link>
                    <Link href="/dashboard" className="btn-ghost" style={{ fontSize: '0.9375rem', padding: '12px 24px' }}>
                        View Dashboard
                    </Link>
                </motion.div>

                {/* Stats row */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    style={{
                        display: 'flex', gap: '5vw', justifyContent: 'center', flexWrap: 'wrap',
                        marginTop: 48,
                        borderTop: '1px solid var(--border)',
                        paddingTop: 32,
                    }}
                >
                    {[
                        { value: '10K+', label: 'Students' },
                        { value: '95%',  label: 'Success Rate' },
                        { value: '24/7', label: 'Available' },
                    ].map(s => (
                        <div key={s.label} style={{ textAlign: 'center' }}>
                            <div style={{
                                fontFamily: "'Google Sans', sans-serif",
                                fontSize: '1.75rem', fontWeight: 700,
                                color: 'var(--text-primary)',
                            }}>
                                {s.value}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 4 }}>
                                {s.label}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </section>

            {/* ── Features ──────────────────────────────────────────────────── */}
            <section
                style={{
                    position: 'relative', zIndex: 1,
                    maxWidth: 1100, margin: '0 auto',
                    padding: '40px 20px',
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center', marginBottom: 48 }}
                >
                    <h2 style={{
                        fontFamily: "'Google Sans', sans-serif",
                        fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                        fontWeight: 700, marginBottom: 12,
                    }}>
                        Why EduMentor AI?
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                        Tools that actually understand how Kenyan students learn best.
                    </p>
                </motion.div>

                <div className="grid-responsive">
                    {FEATURES.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            className="feat-card"
                        >
                            <div
                                style={{
                                    width: 52, height: 52, borderRadius: 14,
                                    background: `${f.accent}18`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: 16, color: f.accent,
                                }}
                            >
                                {f.icon}
                            </div>
                            <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, marginBottom: 8 }}>{f.title}</h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                                {f.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── Subjects strip ────────────────────────────────────────────── */}
            <section
                style={{
                    position: 'relative', zIndex: 1,
                    padding: '32px 24px',
                    borderTop: '1px solid var(--border)',
                    borderBottom: '1px solid var(--border)',
                    background: 'var(--bg-surface)',
                }}
            >
                <div
                    style={{
                        maxWidth: 900, margin: '0 auto',
                        display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center',
                    }}
                >
                    {SUBJECTS.map(s => (
                        <div
                            key={s}
                            style={{
                                padding: '6px 16px', borderRadius: 9999,
                                border: '1px solid var(--border-strong)',
                                fontSize: '13px', color: 'var(--text-secondary)',
                                display: 'flex', alignItems: 'center', gap: 6,
                            }}
                        >
                            <CheckCircle2 size={13} color="var(--accent-2)" />
                            {s}
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Gemini-style chat preview ──────────────────────────────────── */}
            <section
                style={{
                    position: 'relative', zIndex: 1,
                    maxWidth: 760, margin: '0 auto',
                    padding: '72px 24px',
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass-card"
                    style={{ padding: '0', overflow: 'hidden' }}
                >
                    {/* Mock top bar */}
                    <div
                        style={{
                            padding: '14px 20px',
                            borderBottom: '1px solid var(--border)',
                            display: 'flex', alignItems: 'center', gap: 10,
                        }}
                    >
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #4285f4, #81c995)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Sparkles size={13} color="#fff" />
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: 500 }}>Chat with Imani</span>
                        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent-2)', boxShadow: '0 0 5px var(--accent-2)' }} />
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Online</span>
                        </div>
                    </div>

                    {/* Mock messages */}
                    <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* Agent message */}
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}
                        >
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #4285f4, #8ab4f8)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Sparkles size={13} color="#fff" />
                            </div>
                            <div style={{ background: 'var(--bg-hover)', borderRadius: '16px 16px 16px 4px', padding: '10px 14px', maxWidth: '75%' }}>
                                <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                                    Sasa! 🔥 Let's tackle fractions today. What part are you finding tricky?
                                </p>
                            </div>
                        </motion.div>

                        {/* User message */}
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            style={{ display: 'flex', justifyContent: 'flex-end' }}
                        >
                            <div style={{ background: 'var(--bg-active)', borderRadius: '16px 16px 4px 16px', padding: '10px 14px', maxWidth: '65%' }}>
                                <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                                    How do I add ½ + ⅓ without a calculator?
                                </p>
                            </div>
                        </motion.div>

                        {/* Agent response */}
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}
                        >
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #4285f4, #8ab4f8)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Sparkles size={13} color="#fff" />
                            </div>
                            <div style={{ fontSize: '13.5px', lineHeight: 1.7, color: 'var(--text-primary)', maxWidth: '75%' }}>
                                Great question! Before I tell you the answer, think about this:
                                when you split a mandazi into 2 equal pieces, each piece is ½. When you split another into 3 equal pieces, each piece is ⅓.
                                How many pieces would you need to make them the same size? 🤔
                            </div>
                        </motion.div>

                        {/* XP pop */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.85 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.35 }}
                            style={{ display: 'flex', justifyContent: 'center' }}
                        >
                            <div className="xp-badge" style={{ padding: '6px 16px', fontSize: '12px' }}>
                                ⚡ +25 XP — Productive struggle!
                            </div>
                        </motion.div>
                    </div>

                    {/* Mock input */}
                    <div
                        style={{
                            padding: '12px 16px',
                            borderTop: '1px solid var(--border)',
                            display: 'flex', alignItems: 'center', gap: 10,
                        }}
                    >
                        <div
                            style={{
                                flex: 1, background: 'var(--bg-hover)',
                                borderRadius: 20, padding: '9px 16px',
                                fontSize: '13px', color: 'var(--text-muted)',
                                border: '1px solid var(--border)',
                            }}
                        >
                            Ask Imani anything…
                        </div>
                        <div
                            style={{
                                width: 34, height: 34, borderRadius: '50%',
                                background: 'var(--brand)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                        >
                            <MessageCircle size={15} color="#fff" />
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ── CTA ───────────────────────────────────────────────────────── */}
            <section
                style={{
                    position: 'relative', zIndex: 1,
                    maxWidth: 640, margin: '0 auto',
                    padding: '60px 24px 100px',
                    textAlign: 'center',
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 style={{
                        fontFamily: "'Google Sans', sans-serif",
                        fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)',
                        fontWeight: 700, marginBottom: 16,
                    }}>
                        Ready to level up?
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: '1rem' }}>
                        Join 10,000+ Nairobi students learning smarter with AI.
                    </p>
                    <Link href="/chat" className="btn-gem" style={{ fontSize: '1rem', padding: '14px 32px' }}>
                        Start Your Journey 🚀
                        <ArrowRight size={17} />
                    </Link>
                </motion.div>
            </section>

            {/* ── Footer ────────────────────────────────────────────────────── */}
            <footer
                style={{
                    borderTop: '1px solid var(--border)',
                    padding: '28px 32px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexWrap: 'wrap', gap: 12,
                    position: 'relative', zIndex: 1,
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg, #4285f4, #81c995)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Sparkles size={11} color="#fff" />
                    </div>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        © 2026 EduMentor AI · Built with ❤️ for Nairobi students
                    </span>
                </div>
                <div style={{ display: 'flex', gap: 24 }}>
                    {['Chat', 'Dashboard', 'About', 'Privacy'].map(link => (
                        <Link
                            key={link}
                            href={link === 'Chat' ? '/chat' : link === 'Dashboard' ? '/dashboard' : '#'}
                            style={{ fontSize: '13px', color: 'var(--text-muted)', transition: 'color .15s' }}
                            className="nav-link"
                        >
                            {link}
                        </Link>
                    ))}
                </div>
            </footer>
        </div>
    );
}
