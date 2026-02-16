'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, Trophy, Zap, Target, MessageCircle, TrendingUp } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-nairobi-charcoal overflow-hidden">
            {/* Animated background */}
            <div className="fixed inset-0 opacity-20">
                <div className="absolute top-20 left-10 w-72 h-72 bg-nairobi-sunset rounded-full blur-[128px] animate-pulse-slow"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-nairobi-teal rounded-full blur-[128px] animate-pulse-slow animation-delay-2000"></div>
            </div>

            {/* Navigation */}
            <nav className="relative z-10 flex justify-between items-center px-8 py-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2"
                >
                    <Sparkles className="text-nairobi-yellow w-8 h-8" />
                    <span className="text-2xl font-display font-bold text-gradient">EduMentor AI</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-4"
                >
                    <Link href="/chat" className="btn-outline">
                        Start Learning
                    </Link>
                </motion.div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 max-w-7xl mx-auto px-8 py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="inline-block px-4 py-2 bg-nairobi-sunset/20 border border-nairobi-sunset/50 rounded-full mb-6">
                            <span className="text-nairobi-yellow text-sm font-semibold">🔥 Sasa! Ready to Learn?</span>
                        </div>

                        <h1 className="text-6xl font-display font-bold mb-6 leading-tight">
                            Learn Smarter, <br />
                            <span className="text-gradient">Not Harder</span>
                        </h1>

                        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                            Meet <span className="text-nairobi-yellow font-semibold">Imani</span>, your AI tutor who
                            knows Nairobi. From M-Pesa math to matatu logic—we make learning <span className="italic">poa</span>!
                        </p>

                        <div className="flex gap-4 mb-12">
                            <Link href="/chat" className="btn-primary group">
                                Twende Kazi! 🚀
                                <Zap className="inline ml-2 group-hover:animate-bounce" size={20} />
                            </Link>
                            <button className="btn-secondary">
                                Watch Demo
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-nairobi-yellow">10K+</div>
                                <div className="text-sm text-gray-400">Students</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-nairobi-sage">95%</div>
                                <div className="text-sm text-gray-400">Success Rate</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-nairobi-coral">24/7</div>
                                <div className="text-sm text-gray-400">Available</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Animated UI Preview */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="relative"
                    >
                        {/* Floating achievement badge */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute -top-6 -left-6 z-20"
                        >
                            <div className="achievement-badge">
                                <Trophy className="text-nairobi-charcoal" size={24} />
                            </div>
                        </motion.div>

                        {/* Main phone mockup */}
                        <div className="relative w-full max-w-sm mx-auto">
                            {/* Phone frame */}
                            <div className="glass rounded-[3rem] p-4 shadow-2xl glow">
                                {/* Screen */}
                                <div className="bg-nairobi-charcoal rounded-[2.5rem] overflow-hidden">
                                    {/* Status bar */}
                                    <div className="flex justify-between items-center px-6 py-3 bg-gray-900">
                                        <span className="text-xs">9:41</span>
                                        <div className="flex gap-1">
                                            <div className="w-1 h-1 bg-white rounded-full"></div>
                                            <div className="w-1 h-1 bg-white rounded-full"></div>
                                            <div className="w-1 h-1 bg-white rounded-full"></div>
                                        </div>
                                    </div>

                                    {/* Chat header */}
                                    <div className="flex items-center gap-3 px-6 py-4 bg-gray-900/50 border-b border-gray-800">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nairobi-sunset to-nairobi-coral flex items-center justify-center">
                                            <span className="text-lg">😊</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold">Imani</div>
                                            <div className="text-xs text-gray-400">Your AI Mentor</div>
                                        </div>
                                        {/* Struggle meter mini */}
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 rounded-full bg-struggle-low"></div>
                                            <div className="w-2 h-2 rounded-full bg-struggle-medium"></div>
                                            <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                                        </div>
                                    </div>

                                    {/* Chat messages */}
                                    <div className="p-6 space-y-4 h-96 overflow-y-auto custom-scrollbar">
                                        {/* Agent message */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.6 }}
                                            className="flex gap-2"
                                        >
                                            <div className="chat-bubble-agent animate-slideInUp">
                                                <p className="text-sm">Sasa! Ready for today's challenge? 🔥</p>
                                                <span className="text-xs text-gray-400 block mt-1">2:15 PM</span>
                                            </div>
                                        </motion.div>

                                        {/* User message */}
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.8 }}
                                            className="flex gap-2 justify-end"
                                        >
                                            <div className="chat-bubble-user animate-slideInUp">
                                                <p className="text-sm">Help me with fractions</p>
                                                <span className="text-xs text-white/70 block mt-1">2:16 PM</span>
                                            </div>
                                        </motion.div>

                                        {/* Agent typing */}
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 1 }}
                                            className="flex gap-2"
                                        >
                                            <div className="chat-bubble-agent">
                                                <div className="flex gap-1">
                                                    <motion.div
                                                        animate={{ scale: [1, 1.3, 1] }}
                                                        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                                                        className="w-2 h-2 bg-nairobi-sunset rounded-full"
                                                    />
                                                    <motion.div
                                                        animate={{ scale: [1, 1.3, 1] }}
                                                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                                                        className="w-2 h-2 bg-nairobi-yellow rounded-full"
                                                    />
                                                    <motion.div
                                                        animate={{ scale: [1, 1.3, 1] }}
                                                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                                                        className="w-2 h-2 bg-nairobi-teal rounded-full"
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* XP Notification */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 1.2 }}
                                            className="mx-auto w-fit"
                                        >
                                            <div className="bg-gradient-to-r from-nairobi-yellow/20 to-nairobi-sunset/20 border border-nairobi-yellow/50 rounded-xl px-4 py-2 flex items-center gap-2">
                                                <Sparkles size={16} className="text-nairobi-yellow" />
                                                <span className="text-sm font-semibold">+50 XP</span>
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Input area */}
                                    <div className="p-4 bg-gray-900/50 border-t border-gray-800">
                                        <div className="flex gap-2 items-center">
                                            {/* Voice button */}
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="relative w-12 h-12 rounded-full bg-nairobi-sunset flex items-center justify-center shadow-lg"
                                            >
                                                <div className="pulse-ring"></div>
                                                <MessageCircle size={20} />
                                            </motion.button>

                                            {/* Text input */}
                                            <div className="flex-1 bg-gray-800 rounded-full px-4 py-2 text-sm text-gray-400">
                                                Type or speak...
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating streak indicator */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                            className="absolute -bottom-6 -right-6 z-20"
                        >
                            <div className="card-gradient p-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">🔥</span>
                                    <div>
                                        <div className="text-sm font-semibold">5 Day Streak!</div>
                                        <div className="text-xs text-gray-400">Keep it up!</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative z-10 max-w-7xl mx-auto px-8 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-display font-bold mb-4">
                        Why <span className="text-gradient">EduMentor AI</span>?
                    </h2>
                    <p className="text-xl text-gray-300">Built for Nairobi students, by people who understand you</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <Trophy size={32} />,
                            title: "Gamified Learning",
                            description: "Earn XP, unlock achievements, and compete on leaderboards. Learning has never been this fun!",
                            color: "nairobi-yellow"
                        },
                        {
                            icon: <Target size={32} />,
                            title: "Productive Struggle",
                            description: "The Professor challenges you at the right moment. We don't give answers—we help you discover them.",
                            color: "nairobi-sunset"
                        },
                        {
                            icon: <TrendingUp size={32} />,
                            title: "Track Progress",
                            description: "See your struggle score, topic mastery, and growth over time. Know exactly where you stand.",
                            color: "nairobi-teal"
                        }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="card hover:glow cursor-pointer"
                        >
                            <div className={`w-16 h-16 rounded-2xl bg-${feature.color}/20 flex items-center justify-center mb-4 text-${feature.color}`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-gray-400">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 max-w-4xl mx-auto px-8 py-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="card-gradient text-center p-12"
                >
                    <h2 className="text-4xl font-display font-bold mb-4">
                        Ready to Level Up?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Join 10,000+ Nairobi students learning smarter with AI
                    </p>
                    <Link href="/chat" className="btn-primary inline-flex items-center gap-2 text-lg">
                        Start Your Journey 🚀
                    </Link>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-gray-800 mt-20">
                <div className="max-w-7xl mx-auto px-8 py-12">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="text-nairobi-yellow" />
                                <span className="font-display font-bold text-xl">EduMentor AI</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Empowering Nairobi students with AI-powered learning.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="/chat" className="hover:text-nairobi-sunset transition">Chat</Link></li>
                                <li><Link href="/dashboard" className="hover:text-nairobi-sunset transition">Dashboard</Link></li>
                                <li><Link href="/achievements" className="hover:text-nairobi-sunset transition">Achievements</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-nairobi-sunset transition">About</a></li>
                                <li><a href="#" className="hover:text-nairobi-sunset transition">Blog</a></li>
                                <li><a href="#" className="hover:text-nairobi-sunset transition">Careers</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-nairobi-sunset transition">Privacy</a></li>
                                <li><a href="#" className="hover:text-nairobi-sunset transition">Terms</a></li>
                                <li><a href="#" className="hover:text-nairobi-sunset transition">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
                        <p>© 2026 EduMentor AI. Built with ❤️ for Nairobi students.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
