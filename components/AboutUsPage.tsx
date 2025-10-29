import React from 'react';
import { IconProps, CubeIcon, PuzzleIcon } from '../constants';

// --- NEW LOCAL ICONS FOR FEATURE GRID ---
const AiToolsIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
);
const SyncIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 2.1l4 4-4 4" />
        <path d="M3 12.2v-2a4 4 0 0 1 4-4h12.5" />
        <path d="M7 21.9l-4-4 4-4" />
        <path d="M21 11.8v2a4 4 0 0 1-4 4H4.5" />
    </svg>
);
const AnalyticsIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
);
const VideoIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m22 8-6 4 6 4V8z" />
        <rect x="2" y="6" width="14" height="12" rx="2" ry="2" />
    </svg>
);
const UnlimitedIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
        <path d="m16 8-8 8"/>
    </svg>
);
const SecurityIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
    
    return (
        <div className="h-full p-4 md:p-8 bg-transparent overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-16">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-white tracking-tighter">
                        About <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-400">SnakeEngine.AI</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-4 text-lg max-w-2xl mx-auto">Welcome to SnakeEngine.ai, your all-in-one platform for smarter work, powered by advanced artificial intelligence.</p>
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

                {/* What We Offer Grid */}
                <div>
                     <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">What We Offer</h2>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FeatureCard 
                            title="AI Chat & Assistant" 
                            description="Talk to the smartest AI, get instant help, answers, and automate routine tasks." 
                            icon={<AiToolsIcon className="h-6 w-6 text-pink-800 dark:text-pink-300"/>} 
                            gradient="bg-gradient-to-br from-pink-200 to-rose-200 dark:from-pink-900/50 dark:to-rose-900/50"
                        />
                         <FeatureCard 
                            title="Smart Studio" 
                            description="Edit, create, and enhance images, documents, and presentations with over 200 dynamic AI tools." 
                            icon={<CubeIcon className="h-6 w-6 text-indigo-800 dark:text-indigo-300"/>} 
                            gradient="bg-gradient-to-br from-indigo-200 to-purple-200 dark:from-indigo-900/50 dark:to-purple-900/50"
                        />
                        <FeatureCard 
                            title="Pro Analytics" 
                            description="Visualize data instantly with interactive charts and real-time insights." 
                            icon={<AnalyticsIcon className="h-6 w-6 text-blue-800 dark:text-blue-300"/>} 
                            gradient="bg-gradient-to-br from-blue-200 to-sky-200 dark:from-blue-900/50 dark:to-sky-900/50"
                        />
                         <FeatureCard 
                            title="Workflow Automation" 
                            description="Drag-and-drop builder to automate your daily work and connect all your favorite apps." 
                            icon={<PuzzleIcon className="h-6 w-6 text-orange-800 dark:text-orange-300"/>} 
                            gradient="bg-gradient-to-br from-orange-200 to-amber-200 dark:from-orange-900/50 dark:to-amber-900/50"
                        />
                        <FeatureCard 
                            title="Voice & Video AI" 
                            description="Speak, transcribe, translate, and get automated summaries for meetings and calls." 
                            icon={<VideoIcon className="h-6 w-6 text-cyan-800 dark:text-cyan-300"/>} 
                            gradient="bg-gradient-to-br from-cyan-200 to-sky-200 dark:from-cyan-900/50 dark:to-sky-900/50"
                        />
                         <FeatureCard 
                            title="Cross-Device Sync" 
                            description="Start on your PC, continue on mobile or tablet—your data follows you everywhere." 
                            icon={<SyncIcon className="h-6 w-6 text-green-800 dark:text-green-300"/>} 
                            gradient="bg-gradient-to-br from-green-200 to-teal-200 dark:from-green-900/50 dark:to-teal-900/50"
                        />
                         <FeatureCard 
                            title="Secure & Private" 
                            description="Advanced security ensures your data is safe and private at all times." 
                            icon={<SecurityIcon className="h-6 w-6 text-gray-800 dark:text-gray-300"/>} 
                            className="md:col-span-3"
                            gradient="bg-gradient-to-br from-gray-200 to-slate-200 dark:from-gray-700/50 dark:to-slate-700/50"
                        />
                    </div>
                </div>
                
                 {/* Meet the Team */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Meet the Team</h2>
                     <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">SnakeEngine.ai is built by a passionate group of engineers, designers, and AI experts. Our diverse backgrounds help us deliver unique solutions trusted by creators and businesses worldwide.</p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-10">
                        <div className="text-center">
                            <img src="https://images.unsplash.com/photo-1678496464322-10d2910795c1?q=80&w=256&h=256&fit=crop" alt="Aditya Dwivedi" className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-white/20 shadow-lg object-cover"/>
                            <h3 className="font-semibold text-xl text-gray-800 dark:text-white">Aditya Dwivedi</h3>
                            <p className="text-sm text-purple-500 dark:text-purple-400 font-medium">Co-Creator & Lead Developer</p>
                        </div>
                        <div className="text-center">
                             <img src="https://images.unsplash.com/photo-1698083812727-de5c99a473e2?q=80&w=256&h=256&fit=crop" alt="Rashish Singh" className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-white/20 shadow-lg object-cover"/>
                            <h3 className="font-semibold text-xl text-gray-800 dark:text-white">Rashish Singh</h3>
                            <p className="text-sm text-cyan-500 dark:text-cyan-400 font-medium">Co-Creator & UI/UX Visionary</p>
                        </div>
                    </div>
                </div>

                {/* Join the Community */}
                <div className="bg-white/50 dark:bg-gray-800/40 backdrop-blur-xl border border-white/20 shadow-lg rounded-3xl p-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Join the Community</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">Become part of our fast-growing community!</p>
                    <ul className="mt-4 text-gray-500 dark:text-gray-400 space-y-1">
                        <li>User stories, testimonials, and feedback</li>
                        <li>Early access to new features</li>
                        <li>Direct support from our team</li>
                    </ul>
                </div>
                
                {/* Contact & Connect */}
                <div className="text-center">
                     <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Contact & Connect</h2>
                     <p className="mt-4">
                        <a href="mailto:snakeengineofficial@gmail.com" className="text-purple-500 font-semibold">snakeengineofficial@gmail.com</a>
                     </p>
                     <p className="text-gray-500 dark:text-gray-400 mt-1">Social: @SNAKEENGINEOFFICIAL</p>
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