'use client';

import { motion } from 'framer-motion';
import {
    Trophy, Flame, Star, Target, TrendingUp, Award,
    Book, Zap, Crown, Sparkles, ChevronLeft
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import Link from 'next/link';

export default function DashboardPage() {
    // Mock data
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
        { subject: 'Fractions', mastery: 85 },
        { subject: 'Algebra', mastery: 62 },
        { subject: 'Geometry', mastery: 78 },
        { subject: 'Word Problems', mastery: 91 },
        { subject: 'Percentages', mastery: 70 },
    ];

    const subjectRadar = [
        { subject: 'Math', score: 85 },
        { subject: 'Science', score: 72 },
        { subject: 'English', score: 90 },
        { subject: 'History', score: 65 },
        { subject: 'Kiswahili', score: 88 },
    ];

    const achievements = [
        { id: 1, title: 'First Steps', desc: 'Completed your first lesson', icon: '🎯', unlocked: true, xp: 10 },
        { id: 2, title: 'Matatu Master', desc: 'Solved 50 word problems', icon: '🚌', unlocked: true, xp: 75 },
        { id: 3, title: 'Question Warrior', desc: 'Asked 100 questions', icon: '💬', unlocked: true, xp: 50 },
        { id: 4, title: 'Streak Keeper', desc: '7-day learning streak', icon: '🔥', unlocked: true, xp: 100 },
        { id: 5, title: 'M-Pesa Mathematician', desc: 'Master currency calculations', icon: '💰', unlocked: true, xp: 60 },
        { id: 6, title: 'The Professor\'s Favorite', desc: 'Survived 10 hard challenges', icon: '👨‍🏫', unlocked: true, xp: 150 },
        { id: 7, title: 'Fraction Ninja', desc: 'Perfect score on fractions', icon: '🥷', unlocked: false, xp: 200 },
        { id: 8, title: 'Algebra Ace', desc: 'Complete algebra module', icon: '🎓', unlocked: false, xp: 250 },
        { id: 9, title: 'Top 10 Scholar', desc: 'Reach top 10 leaderboard', icon: '👑', unlocked: false, xp: 500 },
    ];

    const stats = {
        level: 5,
        xp: 1250,
        nextLevelXP: 1500,
        streak: 7,
        totalProblems: 127,
        averageStruggle: 3.2,
        rank: 15,
    };

    return (
        <div className="min-h-screen bg-nairobi-charcoal">
            {/* Header */}
            <header className="bg-gray-900/50 backdrop-blur-md border-b border-gray-800 px-4 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Link href="/chat">
                            <button className="p-2 hover:bg-gray-800 rounded-lg transition">
                                <ChevronLeft size={24} />
                            </button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-display font-bold">Your Dashboard</h1>
                            <p className="text-sm text-gray-400">Track your learning journey</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Link href="/chat" className="btn-primary">
                            Continue Learning
                        </Link>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="card-gradient"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-nairobi-yellow/20 flex items-center justify-center">
                                <Star className="text-nairobi-yellow" size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">Level {stats.level}</div>
                                <div className="text-xs text-gray-400">{stats.xp}/{stats.nextLevelXP} XP</div>
                            </div>
                        </div>
                        <div className="mt-3 xp-bar">
                            <div className="xp-bar-fill" style={{ width: `${(stats.xp / stats.nextLevelXP) * 100}%` }}></div>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="card"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-nairobi-sunset/20 flex items-center justify-center">
                                <Flame className="text-nairobi-sunset" size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.streak} days</div>
                                <div className="text-xs text-gray-400">Current Streak</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="card"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-nairobi-teal/20 flex items-center justify-center">
                                <Target className="text-nairobi-teal" size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.totalProblems}</div>
                                <div className="text-xs text-gray-400">Problems Solved</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="card"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-nairobi-coral/20 flex items-center justify-center">
                                <Crown className="text-nairobi-coral" size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">#{stats.rank}</div>
                                <div className="text-xs text-gray-400">Leaderboard Rank</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Charts */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Weekly Progress */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <TrendingUp className="text-nairobi-teal" />
                                    Weekly Progress
                                </h2>
                            </div>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={weeklyProgress}>
                                    <XAxis dataKey="day" stroke="#6B7280" />
                                    <YAxis stroke="#6B7280" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                                    />
                                    <Line type="monotone" dataKey="xp" stroke="#FFD23F" strokeWidth={3} dot={{ fill: '#FFD23F', r: 5 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </motion.div>

                        {/* Topic Mastery */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="card"
                        >
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                                <Book className="text-nairobi-sunset" />
                                Topic Mastery
                            </h2>
                            <div className="space-y-4">
                                {topicMastery.map((topic, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>{topic.subject}</span>
                                            <span className="font-semibold">{topic.mastery}%</span>
                                        </div>
                                        <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${topic.mastery}%` }}
                                                transition={{ delay: i * 0.1, duration: 0.7 }}
                                                className="h-full bg-gradient-to-r from-nairobi-teal to-nairobi-sage rounded-full"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Subject Radar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="card"
                        >
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                                <Sparkles className="text-nairobi-yellow" />
                                Subject Overview
                            </h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <RadarChart data={subjectRadar}>
                                    <PolarGrid stroke="#374151" />
                                    <PolarAngleAxis dataKey="subject" stroke="#9CA3AF" />
                                    <PolarRadiusAxis stroke="#6B7280" />
                                    <Radar dataKey="score" stroke="#FF6B35" fill="#FF6B35" fillOpacity={0.3} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </motion.div>
                    </div>

                    {/* Right Column: Achievements */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="card"
                        >
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                                <Trophy className="text-nairobi-yellow" />
                                Achievements
                            </h2>
                            <div className="grid grid-cols-3 gap-3">
                                {achievements.map((achievement, i) => (
                                    <motion.div
                                        key={achievement.id}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        whileHover={{ scale: achievement.unlocked ? 1.1 : 1.0 }}
                                        className={`relative p-3 rounded-xl text-center cursor-pointer transition ${achievement.unlocked
                                                ? 'bg-gradient-to-br from-nairobi-yellow/80 to-nairobi-sunset/80 border-2 border-nairobi-yellow/50'
                                                : 'bg-gray-800/50 border-2 border-gray-700 opacity-50'
                                            }`}
                                        title={`${achievement.title} - ${achievement.desc}`}
                                    >
                                        <div className="text-3xl mb-1">{achievement.icon}</div>
                                        <div className="text-[10px] font-semibold leading-tight">{achievement.title}</div>
                                        {achievement.unlocked && (
                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-nairobi-yellow rounded-full flex items-center justify-center">
                                                <Zap size={12} className="text-nairobi-charcoal" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                            <div className="mt-4 p-3 bg-nairobi-sunset/10 border border-nairobi-sunset/30 rounded-lg">
                                <div className="text-sm font-semibold mb-1">Achievement Progress</div>
                                <div className="text-xs text-gray-400">{achievements.filter(a => a.unlocked).length} of {achievements.length} unlocked</div>
                            </div>
                        </motion.div>

                        {/* Recent Activity */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="card"
                        >
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                                <Award className="text-nairobi-coral" />
                                Recent Activity
                            </h2>
                            <div className="space-y-3">
                                {[
                                    { text: 'Completed "M-Pesa Math" lesson', time: '2 hours ago', icon: '🎓' },
                                    { text: 'Earned "Streak Keeper" badge', time: '1 day ago', icon: '🏆' },
                                    { text: 'Reached Level 5', time: '2 days ago', icon: '⬆️' },
                                    { text: 'Asked 100th question', time: '3 days ago', icon: '💬' },
                                ].map((activity, i) => (
                                    <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition">
                                        <div className="text-2xl">{activity.icon}</div>
                                        <div className="flex-1">
                                            <div className="text-sm">{activity.text}</div>
                                            <div className="text-xs text-gray-400">{activity.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
