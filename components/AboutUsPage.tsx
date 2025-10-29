import React, { useState } from 'react';
import { CubeIcon, PuzzleIcon } from '../constants';
import { askAboutUs } from '../services/geminiService';

const Spinner = () => <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>;

// --- LOCAL ICONS ---
const ChatBubbleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const ChartBarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const MicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>;
const DeviceSyncIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
const ShieldCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944L12 23l9-2.056A12.02 12.02 0 0021 7.944a11.955 11.955 0 01-5.382-3.04z" /></svg>;

const FeatureHighlightCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-500">
                {icon}
            </div>
            <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">{description}</p>
            </div>
        </div>
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
    
    const features = [
      { icon: <ChatBubbleIcon />, title: 'AI Chat & Assistant', description: 'Talk to the smartest AI, get instant help, answers, and automate routine tasks.' },
      { icon: <CubeIcon className="h-8 w-8" />, title: 'Smart Studio', description: 'Edit, create, and enhance images, documents, and presentations with over 200 dynamic AI tools.' },
      { icon: <ChartBarIcon />, title: 'Pro Analytics', description: 'Visualize data instantly with interactive charts and real-time insights.'},
      { icon: <PuzzleIcon className="h-8 w-8" />, title: 'Workflow Automation', description: 'Drag-and-drop builder to automate your daily work and connect all your favorite apps.' },
      { icon: <MicIcon />, title: 'Voice & Video AI', description: 'Speak, transcribe, translate, and get automated summaries for meetings and calls.' },
      { icon: <DeviceSyncIcon />, title: 'Cross-Device Sync', description: 'Start on your PC, continue on mobile or tablet—your data follows you everywhere.' },
      { icon: <ShieldCheckIcon />, title: 'Secure & Private', description: 'Advanced security ensures your data is safe and private at all times.' },
    ];
    
    return (
        <div className="h-full p-4 md:p-8 bg-transparent overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
                        About <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-500">SnakeEngine.AI</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Your all-in-one platform for smarter work, powered by advanced artificial intelligence.</p>
                </div>

                {/* Our Story & Vision */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Our Story</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            SnakeEngine.ai was born out of a passion for making powerful, modern AI tools accessible to everyone. We bring together cutting-edge technology and intuitive design to help creators, teams, and businesses solve real problems and work smarter.
                        </p>
                    </div>
                     <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Our Vision</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                           To become the world’s leading AI productivity and creativity hub, making innovation simple across every screen, device, and workflow.
                        </p>
                    </div>
                </div>
                
                {/* What We Offer */}
                <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">What We Offer</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {features.map(feature => <FeatureHighlightCard key={feature.title} {...feature} />)}
                    </div>
                </div>
                
                 {/* Meet the Team */}
                <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Meet the Team</h2>
                     <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">SnakeEngine.ai is built by a passionate group of engineers, designers, and AI experts. Our diverse backgrounds help us deliver unique solutions trusted by creators and businesses worldwide.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="text-center">
                            <img src="https://i.pravatar.cc/150?u=aditya" alt="Aditya Dwivedi" className="w-24 h-24 rounded-full mx-auto mb-3 border-2 border-purple-400"/>
                            <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Aditya Dwivedi</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Co-Creator & Lead Developer</p>
                        </div>
                        <div className="text-center">
                             <img src="https://i.pravatar.cc/150?u=rashish" alt="Rashish Singh" className="w-24 h-24 rounded-full mx-auto mb-3 border-2 border-cyan-400"/>
                            <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Rashish Singh</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Co-Creator & UI/UX Visionary</p>
                        </div>
                    </div>
                </div>

                {/* Join the Community */}
                <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 text-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Join the Community</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">Become part of our fast-growing community!</p>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300 inline-block text-left">
                        <li className="flex items-center"><span className="text-green-500 mr-2">&#10003;</span> User stories, testimonials, and feedback</li>
                        <li className="flex items-center"><span className="text-green-500 mr-2">&#10003;</span> Early access to new features</li>
                        <li className="flex items-center"><span className="text-green-500 mr-2">&#10003;</span> Direct support from our team</li>
                    </ul>
                </div>

                {/* Ask Us Anything */}
                <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                     <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Ask About Us</h2>
                     <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">Have a question about our project? Ask our AI spokesperson!</p>
                     <form onSubmit={handleAskQuestion}>
                        <div className="relative">
                            <input 
                                type="text"
                                value={question}
                                onChange={e => setQuestion(e.target.value)}
                                placeholder="e.g., What is your vision for the future?"
                                className="w-full p-3 pr-24 bg-gray-100 dark:bg-gray-700 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                disabled={isLoading}
                            />
                            <button type="submit" disabled={isLoading || !question.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-md bg-purple-500 text-white font-semibold text-sm hover:bg-purple-600 disabled:opacity-50">
                                {isLoading ? <Spinner /> : "Ask"}
                            </button>
                        </div>
                     </form>
                     {(answer || error || isLoading) && (
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg min-h-[60px]">
                            {isLoading && <div className="flex justify-center items-center"><Spinner/></div>}
                            {error && <p className="text-sm text-red-500">{error}</p>}
                            {answer && <p className="text-sm text-gray-700 dark:text-gray-300">{answer}</p>}
                        </div>
                     )}
                </div>

                {/* Final CTA */}
                <div className="text-center py-8">
                     <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Let’s Build the Future Together</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">SnakeEngine.ai invites you to join, explore, and shape the next era of intelligent productivity. <br /> Try it free, share your feedback, and grow with us!</p>
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;