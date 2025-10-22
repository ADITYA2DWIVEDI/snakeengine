import React from 'react';
import { ChatIcon, ImageIcon, TemplatesIcon } from '../components/Icons';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; gradient: string }> = ({ title, value, icon, gradient }) => (
    <div className="p-6 rounded-2xl glass-pane shadow-lg flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-slate-300">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-lg ${gradient}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-text-secondary">{title}</p>
            <p className="text-2xl font-bold text-text-primary">{value}</p>
        </div>
    </div>
);

const ActivityItem: React.FC<{ title: string; description: string; time: string; icon: React.ReactNode }> = ({ title, description, time, icon }) => (
    <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-slate-100 transition-colors">
        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-text-secondary">
            {icon}
        </div>
        <div className="flex-1">
            <p className="font-medium text-text-primary">{title}</p>
            <p className="text-sm text-text-secondary">{description}</p>
        </div>
        <p className="text-xs text-slate-400">{time}</p>
    </div>
);

export const DashboardView: React.FC = () => {
    return (
        <div className="h-full w-full p-4 md:p-8 overflow-y-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary gradient-text">Welcome Back!</h1>
                <p className="text-text-secondary mt-1">Here's a snapshot of your recent activity and goals.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="Conversations Today" value="24" icon={<ChatIcon className="w-6 h-6"/>} gradient="bg-gradient-to-br from-brand-purple to-brand-pink" />
                <StatCard title="Images Generated" value="15" icon={<ImageIcon className="w-6 h-6"/>} gradient="bg-gradient-to-br from-brand-pink to-rose-400" />
                <StatCard title="Templates Used" value="7" icon={<TemplatesIcon className="w-6 h-6"/>} gradient="bg-gradient-to-br from-fuchsia-500 to-orange-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 p-6 rounded-2xl glass-pane">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Recent Activity</h2>
                    <div className="space-y-2">
                        <ActivityItem title="New Chat" description="Started a conversation about React state management." time="15m ago" icon={<ChatIcon />} />
                        <ActivityItem title="Image Generation" description="Created 'a cat astronaut on the moon'." time="45m ago" icon={<ImageIcon />} />
                        <ActivityItem title="Template Used" description="Used the 'Blog Post Outline' template." time="2h ago" icon={<TemplatesIcon />} />
                         <ActivityItem title="New Chat" description="Asked for a recipe for chocolate chip cookies." time="5h ago" icon={<ChatIcon />} />
                    </div>
                </div>

                <div className="p-6 rounded-2xl glass-pane">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Your Goals</h2>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-text-primary">Daily Chats</span>
                                <span className="text-sm text-text-secondary">24 / 30</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2.5">
                                <div className="bg-brand-purple h-2.5 rounded-full" style={{ width: '80%' }}></div>
                            </div>
                        </div>
                         <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-text-primary">Images This Week</span>
                                <span className="text-sm text-text-secondary">15 / 20</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2.5">
                                <div className="bg-brand-pink h-2.5 rounded-full" style={{ width: '75%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};