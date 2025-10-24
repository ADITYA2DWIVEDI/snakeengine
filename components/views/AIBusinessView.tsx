
import React from 'react';
import { Page } from '../../types';
import { Icon } from '../icons';

const businessIdeas = [
    {
        icon: 'database' as const,
        title: 'Unlimited Data Processing',
        description: 'Ability to handle and analyze vast amounts of data in real-time without slowdowns, enabling better insights and accurate predictions.'
    },
    {
        icon: 'users' as const,
        title: 'Unlimited User Scalability',
        description: 'Support for an unlimited number of users simultaneously without performance degradation, ensuring a smooth experience as the user base grows.'
    },
    {
        icon: 'sliders' as const,
        title: 'Unlimited Customization',
        description: 'Highly flexible AI models and workflows that can be tailored to diverse business needs, industries, and user preferences without constraints.'
    },
    {
        icon: 'link' as const,
        title: 'Unlimited Integrations',
        description: 'Seamless connectivity to an unlimited number of third-party tools, platforms, and APIs for expanded functionality and automation.'
    },
    {
        icon: 'robot' as const,
        title: 'Unlimited Automation',
        description: 'Capability to automate unlimited business processes, repetitive tasks, and workflows, significantly boosting productivity and reducing manual effort.'
    },
    {
        icon: 'globe' as const,
        title: 'Unlimited Language Support',
        description: 'Ability to understand and generate content in unlimited languages, enabling global reach and multilingual communication.'
    },
    {
        icon: 'devices' as const,
        title: 'Unlimited Device Compatibility',
        description: 'Support for unlimited types of devices and platforms, including mobile, web, desktop, and IoT, ensuring accessibility anywhere.'
    },
    {
        icon: 'brain-update' as const,
        title: 'Unlimited Updates and Learning',
        description: 'Continuous AI model improvement and updating from unlimited new data inputs, keeping the system smart and adaptive.'
    },
];

const AIBusinessView: React.FC = () => {
    return (
        <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
                <Icon name={Page.AI_BUSINESS} className="w-8 h-8 gradient-text" />
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">AI Business Ideas</h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-3xl">
                Explore business concepts built on the foundation of limitless AI capabilities. These ideas represent the next generation of intelligent, scalable, and automated enterprise solutions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {businessIdeas.map(idea => (
                    <div key={idea.title} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-purple-600 dark:text-teal-400">
                            <Icon name={idea.icon} className="w-6 h-6"/>
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 mt-4">{idea.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 flex-1">{idea.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AIBusinessView;
