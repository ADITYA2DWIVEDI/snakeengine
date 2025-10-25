// Fix: Changed React import to `import * as React from 'react'` to resolve JSX typing issues.
import * as React from 'react';
import { Page } from '../../types';
import { Icon } from '../icons';
import { templates } from '../../data/templates';

interface TemplatesViewProps {
    onUseTemplate: (prompt: string) => void;
}

const TemplatesView: React.FC<TemplatesViewProps> = ({ onUseTemplate }) => {
    
    const categories = [...new Set(templates.map(t => t.category))];

    return (
        <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
                <Icon name={Page.TEMPLATES} className="w-8 h-8 gradient-text" />
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">Prompt Templates</h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
                Get a head start with our curated collection of prompts. Find the perfect template for your task and jump right into the conversation.
            </p>

            <div className="space-y-10">
                {categories.map(category => (
                    <div key={category}>
                        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4">{category}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {templates.filter(t => t.category === category).map(template => (
                                <div key={template.title} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg flex flex-col border border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-slate-100 dark:bg-slate-700 text-purple-600 dark:text-teal-400 flex items-center justify-center">
                                            <Icon name={template.icon} className="w-5 h-5" />
                                        </div>
                                        <h3 className="font-bold text-slate-800 dark:text-slate-100">{template.title}</h3>
                                    </div>
                                    <p className="flex-1 mt-4 text-sm text-slate-500 dark:text-slate-400">{template.description}</p>
                                    <button
                                        onClick={() => onUseTemplate(template.prompt)}
                                        className="mt-6 w-full py-2 px-4 bg-purple-100 dark:bg-teal-900/50 text-purple-700 dark:text-teal-300 text-sm font-semibold rounded-lg hover:bg-purple-200 dark:hover:bg-teal-800/50 transition-colors"
                                    >
                                        Use Template
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TemplatesView;