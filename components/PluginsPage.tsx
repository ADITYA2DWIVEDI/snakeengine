import React from 'react';

const PluginCard: React.FC<{ name: string; description: string; icon: string }> = ({ name, description, icon }) => (
    <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 text-center relative">
        <div className="absolute top-2 right-2 bg-amber-200 text-amber-800 text-xs font-bold px-2 py-1 rounded-full">
            Coming Soon
        </div>
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{name}</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">{description}</p>
    </div>
);


const PluginsPage: React.FC = () => {
    const plugins = [
        { name: 'Gmail', icon: '📧', description: 'Summarize emails, draft replies, and manage your inbox with AI.' },
        { name: 'Slack', icon: '💬', description: 'Get meeting summaries, draft messages, and automate channel updates.' },
        { name: 'Notion', icon: '📝', description: 'Organize notes, create content, and build knowledge bases with AI assistance.' },
        { name: 'Google Calendar', icon: '🗓️', description: 'Automatically schedule meetings, set reminders, and manage your time.' },
        { name: 'Figma', icon: '🎨', description: 'Generate UI components, get design feedback, and automate design tasks.' },
        { name: 'GitHub', icon: '🐙', description: 'Review pull requests, write documentation, and get help with your code.' },
    ];
    return (
        <div className="h-full p-4 md:p-8 bg-transparent">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-500">Plugin Marketplace</span>
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Expand your workspace with powerful integrations.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {plugins.map(plugin => (
                    <PluginCard key={plugin.name} {...plugin} />
                ))}
            </div>
        </div>
    );
};

export default PluginsPage;