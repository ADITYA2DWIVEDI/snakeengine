import React from 'react';
import { Page } from '../types';
import { GmailIcon, CalendarIcon, SlackIcon, NotionIcon, FigmaIcon, GitHubIcon } from '../constants';

const PluginCard: React.FC<{ name: string; description: string; icon: React.ReactNode, onClick: () => void }> = ({ name, description, icon, onClick }) => (
    <div 
        onClick={onClick} 
        className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 text-center relative cursor-pointer group hover:-translate-y-1 transition-transform duration-300"
    >
        <div className="absolute -inset-px rounded-2xl border-2 border-transparent transition-all duration-300 group-hover:border-purple-500/50 group-hover:[box-shadow:0_0_12px_theme(colors.purple.500/50%)]"></div>
        <div className="flex justify-center mb-4 relative">
            <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-white dark:bg-gray-700 shadow-md">
                {icon}
            </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white relative">{name}</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm relative">{description}</p>
    </div>
);

interface PluginsPageProps {
    onOpenInTab: (options: { page: Page; name: string; toolId?: string }) => void;
}

const PluginsPage: React.FC<PluginsPageProps> = ({ onOpenInTab }) => {
    const plugins = [
        { id: 'gmail', name: 'Gmail', icon: <GmailIcon className="h-8 w-8" />, description: 'Summarize emails, draft replies, and manage your inbox with AI.', page: Page.GmailTool },
        { id: 'google-calendar', name: 'Google Calendar', icon: <CalendarIcon className="h-8 w-8" />, description: 'Automatically schedule meetings, set reminders, and manage your time.', page: Page.CalendarTool },
        { id: 'slack', name: 'Slack', icon: <SlackIcon className="h-8 w-8" />, description: 'Get meeting summaries, draft messages, and automate channel updates.', page: Page.SlackTool },
        { id: 'notion', name: 'Notion', icon: <NotionIcon className="h-8 w-8" />, description: 'Organize notes, create content, and build knowledge bases with AI assistance.', page: Page.NotionTool },
        { id: 'figma', name: 'Figma', icon: <FigmaIcon className="h-8 w-8" />, description: 'Generate UI components, get design feedback, and automate design tasks.', page: Page.FigmaTool },
        { id: 'github', name: 'GitHub', icon: <GitHubIcon className="h-8 w-8 text-gray-800 dark:text-white" />, description: 'Review pull requests, write documentation, and get help with your code.', page: Page.GitHubTool },
    ];
    
    const handlePluginClick = (plugin: typeof plugins[0]) => {
        onOpenInTab({
            page: plugin.page,
            name: plugin.name,
            toolId: plugin.id
        })
    }

    return (
        <div className="h-full p-4 md:p-8 bg-transparent">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-500">Plugin Marketplace</span>
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Connect your workspace with powerful integrations.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {plugins.map(plugin => (
                    <PluginCard key={plugin.name} {...plugin} onClick={() => handlePluginClick(plugin)} />
                ))}
            </div>
        </div>
    );
};

export default PluginsPage;