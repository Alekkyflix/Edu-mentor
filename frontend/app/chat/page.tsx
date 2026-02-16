'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageCircle, Mic, Send, Trophy, Flame, Zap, Star,
    TrendingUp, Award, Target, ChevronLeft, Menu
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'agent';
    timestamp: Date;
    agentName?: string;
}

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    xp: number;
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Sasa! Ready to tackle some challenges today? 🔥',
            sender: 'agent',
            timestamp: new Date(),
            agentName: 'Imani'
        }
    ]);
    const [input, setInput] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [struggling, setStruggling] = useState(2); // 0-5 struggle score
    const [xp, setXp] = useState(1250);
    const [level, setLevel] = useState(5);
    const [streak, setStreak] = useState(7);
    const [showAchievement, setShowAchievement] = useState(false);
    const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const xpForNextLevel = 1500;
    const xpProgress = (xp / xpForNextLevel) * 100;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const triggerAchievement = (achievement: Achievement) => {
        setCurrentAchievement(achievement);
        setShowAchievement(true);
        setXp(prev => prev + achievement.xp);

        // Confetti!
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FF6B35', '#FFD23F', '#006D77']
        });

        setTimeout(() => setShowAchievement(false), 3000);
    };

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');

        // Simulate agent response
        setTimeout(() => {
            const responses = [
                { text: 'Ebu tufikirie... what would happen if you approached it differently?', agent: 'The Professor' },
                { text: 'Poa! That\'s a good start. Let me help you break it down.', agent: 'Imani' },
                { text: 'Are you sure about that? Walk me through your reasoning.', agent: 'The Professor' },
                { text: 'Sawa! Like planning a matatu route—what\'s your first stop?', agent: 'Imani' }
            ];

            const response = responses[Math.floor(Math.random() * responses.length)];

            const agentMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: response.text,
                sender: 'agent',
                timestamp: new Date(),
                agentName: response.agent
            };

            setMessages(prev => [...prev, agentMessage]);

            // Randomly trigger achievements
            if (Math.random() > 0.7 && messages.length > 3) {
                const achievements = [
                    {
                        id: '1',
                        title: 'Question Warrior',
                        description: 'Asked 10 questions',
                        icon: '🎯',
                        xp: 50
                    },
                    {
                        id: '2',
                        title: 'Matatu Math Master',
                        description: 'Solved 5 word problems',
                        icon: '🚌',
                        xp: 75
                    },
                    {
                        id: '3',
                        title: 'Struggle Champion',
                        description: 'Pushed through a tough problem',
                        icon: '💪',
                        xp: 100
                    }
                ];

                triggerAchievement(achievements[Math.floor(Math.random() * achievements.length)]);
            }
        }, 1500);
    };

    const toggleRecording = () => {
        setIsRecording(!isRecording);
        // In production, integrate with Web Speech API
    };

    const getStruggleColor = () => {
        if (struggling <= 1) return 'bg-struggle-low';
        if (struggling <= 3) return 'bg-struggle-medium';
        return 'bg-struggle-high';
    };

    const getStruggleLabel = () => {
        if (struggling <= 1) return '🟢 Too Easy!';
        if (struggling <= 3) return '🟡 Sweet Spot';
        return '🔴 Need Support';
    };

    return (
        <div className="min-h-screen bg-nairobi-charcoal flex flex-col">
            {/* Header */}
            <header className="bg-gray-900/50 backdrop-blur-md border-b border-gray-800 px-4 py-3">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    {/* Left: Back + Agent Info */}
                    <div className="flex items-center gap-3">
                        <button className="lg:hidden">
                            <Menu className="text-gray-400" />
                        </button>
                        <div className="hidden lg:flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-nairobi-sunset to-nairobi-coral flex items-center justify-center text-2xl">
                                😊
                            </div>
                            <div>
                                <div className="font-semibold">Imani</div>
                                <div className="text-xs text-gray-400">Your AI Mentor • Online</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Stats */}
                    <div className="flex items-center gap-4">
                        {/* Streak */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-2 bg-nairobi-sunset/20 border border-nairobi-sunset/50 rounded-full px-3 py-1.5"
                        >
                            <Flame size={16} className="text-nairobi-sunset" />
                            <span className="text-sm font-semibold">{streak} days</span>
                        </motion.div>

                        {/* XP */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="hidden sm:flex items-center gap-2 bg-nairobi-yellow/20 border border-nairobi-yellow/50 rounded-full px-3 py-1.5"
                        >
                            <Star size={16} className="text-nairobi-yellow" />
                            <span className="text-sm font-semibold">Level {level}</span>
                        </motion.div>

                        {/* Menu */}
                        <button className="p-2 hover:bg-gray-800 rounded-lg transition">
                            <Trophy size={20} className="text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* XP Progress Bar */}
                <div className="max-w-4xl mx-auto mt-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>{xp} XP</span>
                        <span>{xpForNextLevel} XP</span>
                    </div>
                    <div className="xp-bar">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${xpProgress}%` }}
                            transition={{ duration: 0.7 }}
                            className="xp-bar-fill relative"
                        >
                            {/* Shimmer effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                        </motion.div>
                    </div>
                </div>

                {/* Struggle Meter */}
                <div className="max-w-4xl mx-auto mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-400">Struggle Score</span>
                        <span className="font-semibold">{getStruggleLabel()}</span>
                    </div>
                    <div className="struggle-meter">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(struggling / 5) * 100}%` }}
                            className={`struggle-meter-fill ${getStruggleColor()}`}
                        />
                    </div>
                </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-6">
                <div className="max-w-4xl mx-auto space-y-4">
                    <AnimatePresence>
                        {messages.map((message, index) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: index * 0.05 }}
                                className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {message.sender === 'agent' && (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-nairobi-sunset to-nairobi-coral flex items-center justify-center text-lg flex-shrink-0">
                                        {message.agentName === 'The Professor' ? '👨‍🏫' : '😊'}
                                    </div>
                                )}

                                <div className={message.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-agent'}>
                                    {message.agentName && (
                                        <div className="text-xs font-semibold text-nairobi-yellow mb-1">
                                            {message.agentName}
                                        </div>
                                    )}
                                    <p>{message.text}</p>
                                    <span className="text-xs opacity-70 block mt-1">
                                        {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>

                                {message.sender === 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-lg flex-shrink-0">
                                        👤
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="bg-gray-900/50 backdrop-blur-md border-t border-gray-800 px-4 py-4">
                <div className="max-w-4xl mx-auto flex gap-3 items-end">
                    {/* Voice Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleRecording}
                        className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${isRecording ? 'bg-red-500' : 'bg-nairobi-sunset'
                            }`}
                    >
                        {isRecording && (
                            <>
                                <div className="pulse-ring bg-red-500"></div>
                                <div className="pulse-ring bg-red-500" style={{ animationDelay: '0.5s' }}></div>
                            </>
                        )}
                        <Mic size={24} className={isRecording ? 'animate-pulse' : ''} />
                    </motion.button>

                    {/* Text Input */}
                    <div className="flex-1 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type your message or hold mic to speak..."
                            className="flex-1 bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 focus:outline-none focus:border-nairobi-sunset transition text-white placeholder-gray-500"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="w-14 h-14 rounded-full bg-nairobi-teal flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            <Send size={20} />
                        </motion.button>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="max-w-4xl mx-auto mt-3 flex gap-2 overflow-x-auto pb-2">
                    {['Need a hint', 'Explain this', 'Am I right?', 'Start new topic'].map((action) => (
                        <button
                            key={action}
                            onClick={() => setInput(action)}
                            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-full text-sm whitespace-nowrap transition"
                        >
                            {action}
                        </button>
                    ))}
                </div>
            </div>

            {/* Achievement Popup */}
            <AnimatePresence>
                {showAchievement && currentAchievement && (
                    <motion.div
                        initial={{ opacity: 0, y: -100, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -100, scale: 0.8 }}
                        className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
                    >
                        <div className="card-gradient p-6 shadow-2xl glow min-w-[300px]">
                            <div className="text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1, rotate: 360 }}
                                    transition={{ type: 'spring', duration: 0.7 }}
                                    className="text-6xl mb-3"
                                >
                                    {currentAchievement.icon}
                                </motion.div>
                                <div className="text-sm text-nairobi-yellow font-semibold mb-1">
                                    Achievement Unlocked!
                                </div>
                                <h3 className="text-xl font-bold mb-2">{currentAchievement.title}</h3>
                                <p className="text-sm text-gray-300 mb-3">{currentAchievement.description}</p>
                                <div className="inline-flex items-center gap-2 bg-nairobi-yellow/20 border border-nairobi-yellow/50 rounded-full px-4 py-2">
                                    <Zap size={16} className="text-nairobi-yellow" />
                                    <span className="font-semibold">+{currentAchievement.xp} XP</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
