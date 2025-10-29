import React, { useState } from 'react';
import { askAboutUs } from '../services/geminiService';
import { IconProps } from '../constants';

const Spinner = () => <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>;

// --- NEW LOCAL ICONS FOR FEATURE GRID ---
const AiToolsIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3L4 9v12h16V9l-8-6z" />
        <path d="M12 21V9" />
        <path d="M4 9l8 6 8-6" />
    </svg>
);
const SyncIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        <path d="M16 8h5v5" />
        <path d="M3 12a9 9 0 0 1 15-6.71" />
    </svg>
);
const AnalyticsIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M18.7 8a4 4 0 0 1-4.7 4.7" />
        <path d="M8 12a4 4 0 0 1 4-4" />
    </svg>
);
const VideoIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m22 8-6 4 6 4V8z" />
        <rect x="2" y="6" width="14" height="12" rx="2" ry="2" />
    </svg>
);
const UnlimitedIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14l-4-4 1.41-1.41L10 12.17l6.59-6.59L18 7l-8 8z" />
    </svg>
);
const SecurityIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);


const FeatureCard: React.FC<{
    title: string;
    description: string;
    icon: React.ReactNode;
    className?: string;
    gradient: string;
    children?: React.ReactNode;
}> = ({ title, description, icon, className = '', gradient, children }) => (
    <div className={`relative rounded-3xl p-6 md:p-8 flex flex-col justify-between overflow-hidden bg-white/50 dark:bg-gray-800/40 backdrop-blur-2xl border border-white/20 shadow-lg ${className}`}>
        <div className={`absolute inset-0 opacity-20 dark:opacity-30 ${gradient}`}></div>
        <div className="relative z-10">
            <div className="mb-4 w-12 h-12 flex items-center justify-center bg-white/20 rounded-xl">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
            {description && <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">{description}</p>}
        </div>
        {children && <div className="relative z-10 mt-4">{children}</div>}
    </div>
);


const AboutUsPage: React.FC = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAskQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim() || isLoading) return;
        
        setIsLoading(true);
        setError('');
        setAnswer('');
        const response = await askAboutUs(question);
        if (response.startsWith("Sorry")) {
            setError(response);
        } else {
            setAnswer(response);
        }
        setIsLoading(false);
    }
    
    return (
        <div className="h-full p-4 md:p-8 bg-transparent overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-16">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-white tracking-tighter">
                        About <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-400">SnakeEngine.AI</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-4 text-lg max-w-2xl mx-auto">Your all-in-one platform for smarter work, powered by advanced artificial intelligence.</p>
                </div>

                {/* What We Offer Grid */}
                <div>
                     <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">What We Offer</h2>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FeatureCard 
                            title="AI Productivity Tools" 
                            description="Over 200 dynamic tools for every need." 
                            icon={<AiToolsIcon className="h-6 w-6 text-pink-800 dark:text-pink-300"/>} 
                            gradient="bg-gradient-to-br from-pink-200 to-rose-200 dark:from-pink-900/50 dark:to-rose-900/50"
                        />
                        <FeatureCard 
                            title="Cross-Device Sync" 
                            description="Your work follows you everywhere." 
                            icon={<SyncIcon className="h-6 w-6 text-green-800 dark:text-green-300"/>} 
                            gradient="bg-gradient-to-br from-green-200 to-teal-200 dark:from-green-900/50 dark:to-teal-900/50"
                        />
                         <FeatureCard 
                            title="Voice & Video AI" 
                            description="Transcribe, translate, and summarize." 
                            icon={<VideoIcon className="h-6 w-6 text-cyan-800 dark:text-cyan-300"/>} 
                            gradient="bg-gradient-to-br from-cyan-200 to-sky-200 dark:from-cyan-900/50 dark:to-sky-900/50"
                        />
                        <FeatureCard 
                            title="Unlimited Features" 
                            description="Explore limitless possibilities in your workspace." 
                            icon={<UnlimitedIcon className="h-6 w-6 text-indigo-800 dark:text-indigo-300"/>} 
                            className="md:col-span-2"
                            gradient="bg-gradient-to-br from-indigo-200 to-purple-200 dark:from-indigo-900/50 dark:to-purple-900/50"
                        />
                        <FeatureCard 
                            title="Real-Time Analytics" 
                            description="Visualize data with interactive charts." 
                            icon={<AnalyticsIcon className="h-6 w-6 text-blue-800 dark:text-blue-300"/>} 
                            className="md:row-span-2"
                            gradient="bg-gradient-to-br from-blue-200 to-sky-200 dark:from-blue-900/50 dark:to-sky-900/50"
                        />
                        <FeatureCard 
                            title="Secure & Private" 
                            description="Advanced security for your peace of mind." 
                            icon={<SecurityIcon className="h-6 w-6 text-gray-800 dark:text-gray-300"/>} 
                            className="md:col-span-2"
                            gradient="bg-gradient-to-br from-gray-200 to-slate-200 dark:from-gray-700/50 dark:to-slate-700/50"
                        />
                    </div>
                </div>

                 {/* Our Story & Vision */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                     <div className="backdrop-blur-xl p-8 rounded-2xl">
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Our Story</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            SnakeEngine.ai was born out of a passion for making powerful, modern AI tools accessible to everyone. We bring together cutting-edge technology and intuitive design to help creators, teams, and businesses solve real problems and work smarter.
                        </p>
                    </div>
                     <div className="backdrop-blur-xl p-8 rounded-2xl">
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Our Vision</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                           To become the world’s leading AI productivity and creativity hub, making innovation simple across every screen, device, and workflow.
                        </p>
                    </div>
                </div>
                
                 {/* Meet the Team */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Meet the Team</h2>
                     <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">SnakeEngine.ai is built by a passionate group of engineers, designers, and AI experts. Our diverse backgrounds help us deliver unique solutions trusted by creators and businesses worldwide.</p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-10">
                        <div className="text-center">
                            <img src="https://i.pravatar.cc/150?u=aditya" alt="Aditya Dwivedi" className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-white/20 shadow-lg"/>
                            <h3 className="font-semibold text-xl text-gray-800 dark:text-white">Aditya Dwivedi</h3>
                            <p className="text-sm text-purple-500 dark:text-purple-400 font-medium">Co-Creator & Lead Developer</p>
                        </div>
                        <div className="text-center">
                             <img src="https://i.pravatar.cc/150?u=rashish" alt="Rashish Singh" className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-white/20 shadow-lg"/>
                            <h3 className="font-semibold text-xl text-gray-800 dark:text-white">Rashish Singh</h3>
                            <p className="text-sm text-cyan-500 dark:text-cyan-400 font-medium">Co-Creator & UI/UX Visionary</p>
                        </div>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="text-center py-8">
                     <h2 className="text-4xl font-bold text-gray-800 dark:text-white">Let’s Build the Future Together</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-xl mx-auto">SnakeEngine.ai invites you to join, explore, and shape the next era of intelligent productivity. Try it free, share your feedback, and grow with us!</p>
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;
