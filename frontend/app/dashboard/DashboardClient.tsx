'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Trophy, Flame, Star, Target, TrendingUp, Award,
    Book, Zap, Crown, Sparkles, ChevronLeft, ArrowRight
} from 'lucide-react';
import {
    LineChart, Line, BarChart, Bar,
    XAxis, YAxis, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import Link from 'next/link';

const weeklyProgress = [
    { day: 'Mon', xp: 120, struggles: 3 },
    { day: 'Tue', xp: 180, struggles: 4 },
    { day: 'Wed', xp: 150, struggles: 2 },
    { day: 'Thu', xp: 200, struggles: 5 },
    { day: 'Fri', xp: 170, struggles: 3 },
    { day: 'Sat', xp: 190, struggles: 4 },
    { day: 'Sun', xp: 220, struggles: 3 },
];

const topicMastery = [
    { subject: 'Fractions',     mastery: 85 },
    { subject: 'Algebra',       mastery: 62 },
    { subject: 'Geometry',      mastery: 78 },
    { subject: 'Word Problems', mastery: 91 },
    { subject: 'Percentages',   mastery: 70 },
];

const subjectRadar = [
    { subject: 'Math',      score: 85 },
    { subject: 'Science',   score: 72 },
    { subject: 'English',   score: 90 },
    { subject: 'History',   score: 65 },
    { subject: 'Kiswahili', score: 88 },
];

const achievements = [
    { id: 1, title: 'First Steps',         desc: 'Completed your first lesson',    icon: '🎯', unlocked: true,  xp: 10  },
    { id: 2, title: 'Matatu Master',       desc: 'Solved 50 word problems',        icon: '🚌', unlocked: true,  xp: 75  },
    { id: 3, title: 'Question Warrior',    desc: 'Asked 100 questions',            icon: '💬', unlocked: true,  xp: 50  },
    { id: 4, title: 'Streak Keeper',       desc: '7-day learning streak',          icon: '🔥', unlocked: true,  xp: 100 },
    { id: 5, title: 'M-Pesa Mathematician',desc: 'Master currency calculations',   icon: '💰', unlocked: true,  xp: 60  },
    { id: 6, title: "Professor's Fav",     desc: 'Survived 10 hard challenges',    icon: '👨‍🏫', unlocked: true,  xp: 150 },
    { id: 7, title: 'Fraction Ninja',      desc: 'Perfect score on fractions',     icon: '🥷', unlocked: false, xp: 200 },
    { id: 8, title: 'Algebra Ace',         desc: 'Complete algebra module',        icon: '🎓', unlocked: false, xp: 250 },
    { id: 9, title: 'Top 10 Scholar',      desc: 'Reach top 10 leaderboard',      icon: '👑', unlocked: false, xp: 500 },
];

const defaultStats = {
    totalProblems: 127,
    averageStruggle: 3.2,
    rank: 15,
};

// ─── Reusable stat card ───────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, accent }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    sub?: string;
    accent: string;
}) {
    return (
        <motion.div
            whileHover={{ y: -2 }}
            style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px 22px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
            }}
        >
            <div
                className="gem-stat-icon"
                style={{
                    width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                    background: `${accent}18`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: accent,
                }}
            >
                {icon}
            </div>
            <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{value}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{label}</div>
                {sub && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>}
            </div>
        </motion.div>
    );
}

// ─── Reusable panel card ──────────────────────────────────────────────────────
function Panel({ title, icon, children }: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div
            style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '22px 24px',
            }}
        >
            <h2
                style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    fontSize: '0.9375rem', fontWeight: 600,
                    color: 'var(--text-primary)', marginBottom: 20,
                }}
            >
                {icon}
                {title}
            </h2>
            {children}
        </div>
    );
}

export default function DashboardPage() {
    const [xp, setXp] = useState(1250);
    const [streak, setStreak] = useState(7);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        try {
            const savedXp = localStorage.getItem('edu_xp');
            if (savedXp) setXp(parseInt(savedXp, 10));
            
            const savedStreak = localStorage.getItem('edu_streak');
            if (savedStreak) setStreak(parseInt(savedStreak, 10));
        } catch (_) {}
    }, []);

    const level = Math.floor(xp / 500) + 1;
    const nextLevelXP = level * 500;

    const tooltipStyle = {
        contentStyle: {
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-strong)',
            borderRadius: 10,
            color: 'var(--text-primary)',
            fontSize: 12,
        },
    };

    if (!mounted) return null;

    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'var(--bg-base)',
                color: 'var(--text-primary)',
                overflowY: 'auto',
            }}
        >
            {/* ── Header ────────────────────────────────────────────────────── */}
            <header className="gem-topbar">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Link href="/chat">
                        <button
                            style={{
                                padding: '6px 8px', borderRadius: 8,
                                background: 'transparent', border: 'none',
                                color: 'var(--text-secondary)', cursor: 'pointer',
                                display: 'flex', transition: 'background .15s',
                            }}
                            className="hover:bg-white/5"
                        >
                            <ChevronLeft size={20} />
                        </button>
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
                            style={{
                                width: 26, height: 26, borderRadius: '50%',
                                background: 'linear-gradient(135deg, #4285f4, #81c995)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                        >
                            <Sparkles size={12} color="#fff" />
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '0.9375rem' }} className="hidden sm:inline">Dashboard</span>
                    </div>
                </div>

                <Link href="/chat" className="btn-gem" style={{ fontSize: '13px', padding: '8px 18px' }}>
                    <span className="hidden sm:inline">Continue Learning</span>
                    <span className="sm:hidden">Continue</span>
                    <ArrowRight size={14} />
                </Link>
            </header>

            <div className="container-responsive">

                {/* ── XP progress bar ───────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '18px 24px',
                        marginBottom: 20,
                        display: 'flex', alignItems: 'center', gap: 20,
                    }}
                >
                    <div
                        style={{
                            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                            background: 'rgba(255,210,63,.12)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                    >
                        <Star size={22} color="var(--xp-gold)" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span style={{ fontWeight: 600 }}>Level {level}</span>
                            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                {xp} / {nextLevelXP} XP
                            </span>
                        </div>
                        <div
                            style={{
                                height: 6, borderRadius: 9999,
                                background: 'var(--bg-hover)',
                                overflow: 'hidden',
                            }}
                        >
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(xp / nextLevelXP) * 100}%` }}
                                transition={{ duration: 0.9, ease: 'easeOut' }}
                                style={{
                                    height: '100%',
                                    background: 'linear-gradient(90deg, #4285f4, #8ab4f8)',
                                    borderRadius: 9999,
                                }}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* ── Stat cards row ─────────────────────────────────────────── */}
                <div className="grid-responsive" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: 24 }}>
                    <StatCard icon={<Flame size={22} />}   label="Streak"   value={`${streak}d`} accent="var(--streak-orange)" />
                    <StatCard icon={<Target size={22} />}  label="Solved"  value={`${defaultStats.totalProblems}`} accent="var(--accent)" />
                    <StatCard icon={<Crown size={22} />}   label="Rank" value={`#${defaultStats.rank}`} accent="var(--xp-gold)" />
                    <StatCard icon={<Zap size={22} />}     label="Struggle"     value={`${defaultStats.averageStruggle}`} accent="var(--accent-2)" />
                </div>

                {/* ── Main content grid ──────────────────────────────────────── */}
                <div className="flex flex-col lg:flex-row gap-5">
                    {/* Left - Charts */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>

                        {/* Weekly XP chart */}
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                            <Panel title="Weekly XP" icon={<TrendingUp size={16} color="var(--accent)" />}>
                                <ResponsiveContainer width="100%" height={220}>
                                    <LineChart data={weeklyProgress}>
                                        <XAxis dataKey="day" stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                                        <YAxis stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                                        <Tooltip {...tooltipStyle} />
                                        <Line
                                            type="monotone" dataKey="xp"
                                            stroke="var(--accent)" strokeWidth={2.5}
                                            dot={{ fill: 'var(--accent)', r: 4, strokeWidth: 0 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Panel>
                        </motion.div>

                        {/* Topic Mastery */}
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
                            <Panel title="Topic Mastery" icon={<Book size={16} color="var(--streak-orange)" />}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    {topicMastery.map((t, i) => (
                                        <div key={i}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: 6 }}>
                                                <span>{t.subject}</span>
                                                <span style={{ fontWeight: 600 }}>{t.mastery}%</span>
                                            </div>
                                            <div style={{ height: 5, borderRadius: 9999, background: 'var(--bg-hover)', overflow: 'hidden' }}>
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${t.mastery}%` }}
                                                    transition={{ delay: i * 0.08, duration: 0.7 }}
                                                    style={{
                                                        height: '100%',
                                                        background: 'linear-gradient(90deg, #4285f4, #8ab4f8)',
                                                        borderRadius: 9999,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Panel>
                        </motion.div>

                        {/* Radar chart */}
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
                            <Panel title="Subject Overview" icon={<Sparkles size={16} color="var(--accent-2)" />}>
                                <ResponsiveContainer width="100%" height={280}>
                                    <RadarChart data={subjectRadar}>
                                        <PolarGrid stroke="rgba(255,255,255,.07)" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                                        <PolarRadiusAxis stroke="rgba(255,255,255,.05)" tick={{ fontSize: 9 }} />
                                        <Radar dataKey="score" stroke="#8ab4f8" fill="#8ab4f8" fillOpacity={0.18} strokeWidth={2} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </Panel>
                        </motion.div>
                    </div>

                    {/* Right column - Achievements */}
                    <div style={{ width: '100%', lgWidth: 320, display: 'flex', flexDirection: 'column', gap: 20 }}>

                        {/* Achievements */}
                        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
                            <Panel title="Achievements" icon={<Trophy size={16} color="var(--xp-gold)" />}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                                    {achievements.map((a, i) => (
                                        <motion.div
                                            key={a.id}
                                            initial={{ opacity: 0, scale: 0.85 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.04 }}
                                            whileHover={{ scale: a.unlocked ? 1.08 : 1.02 }}
                                            title={`${a.title}: ${a.desc} (+${a.xp} XP)`}
                                            style={{
                                                textAlign: 'center',
                                                padding: '10px 6px',
                                                borderRadius: 12,
                                                border: '1px solid',
                                                borderColor: a.unlocked ? 'rgba(138,180,248,.3)' : 'var(--border)',
                                                background: a.unlocked ? 'rgba(138,180,248,.06)' : 'var(--bg-hover)',
                                                opacity: a.unlocked ? 1 : 0.45,
                                                cursor: 'pointer',
                                                position: 'relative',
                                            }}
                                        >
                                            <div style={{ fontSize: '1.7rem', marginBottom: 4 }}>{a.icon}</div>
                                            <div style={{ fontSize: '9px', fontWeight: 600, color: 'var(--text-secondary)', lineHeight: 1.2 }}>
                                                {a.title}
                                            </div>
                                            {a.unlocked && (
                                                <div
                                                    style={{
                                                        position: 'absolute', top: -5, right: -5,
                                                        width: 17, height: 17, borderRadius: '50%',
                                                        background: 'var(--accent-2)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    }}
                                                >
                                                    <Zap size={9} color="#0d1117" />
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                                <div
                                    style={{
                                        marginTop: 14, padding: '10px 12px',
                                        borderRadius: 10,
                                        background: 'rgba(138,180,248,.06)',
                                        border: '1px solid rgba(138,180,248,.15)',
                                        fontSize: '12px', color: 'var(--text-secondary)',
                                    }}
                                >
                                    {achievements.filter(a => a.unlocked).length} / {achievements.length} unlocked
                                </div>
                            </Panel>
                        </motion.div>

                        {/* Recent Activity */}
                        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                            <Panel title="Recent Activity" icon={<Award size={16} color="var(--streak-orange)" />}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    {[
                                        { text: 'Completed "M-Pesa Math" lesson', time: '2 hours ago',  icon: '🎓' },
                                        { text: 'Earned "Streak Keeper" badge',  time: '1 day ago',    icon: '🏆' },
                                        { text: 'Reached Level 5',               time: '2 days ago',   icon: '⬆️' },
                                        { text: 'Asked 100th question',          time: '3 days ago',   icon: '💬' },
                                    ].map((item, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                display: 'flex', alignItems: 'flex-start', gap: 10,
                                                padding: '8px 10px', borderRadius: 10,
                                                transition: 'background .15s',
                                            }}
                                            className="hover:bg-white/5"
                                        >
                                            <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{item.icon}</span>
                                            <div>
                                                <div style={{ fontSize: '12.5px', color: 'var(--text-primary)' }}>{item.text}</div>
                                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.time}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Panel>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
