import React from 'react';

const TemplateCard: React.FC<{ title: string; description: string; category: string; color: string; }> = ({ title, description, category, color }) => (
    <div className="relative p-6 rounded-2xl glass-pane shadow-lg overflow-hidden group hover:shadow-2xl hover:border-brand-purple/50 hover:-translate-y-1 transition-all duration-300">
        <div className={`absolute top-0 left-0 w-full h-1 ${color}`}></div>
        <p className={`text-sm font-medium mb-1 ${color.replace('bg-', 'text-')}`}>{category}</p>
        <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
        <p className="text-sm text-text-secondary mb-4 h-16">{description}</p>
        <button className="w-full py-2 px-4 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors group-hover:bg-brand-purple/20 group-hover:text-brand-purple">
            Use Template
        </button>
    </div>
);

const templates = [
    { title: "Blog Post Outline", description: "Generate a structured outline for your next blog post on any topic.", category: "Writing", color: "text-brand-purple" },
    { title: "Email Subject Lines", description: "Create catchy and effective email subject lines to boost open rates.", category: "Marketing", color: "text-brand-pink" },
    { title: "Social Media Captions", description: "Craft engaging captions for your Instagram, Twitter, or Facebook posts.", category: "Social Media", color: "text-rose-500" },
    { title: "Code Explainer", description: "Get a simple explanation for a complex snippet of code in any language.", category: "Development", color: "text-brand-purple" },
    { title: "Meeting Agenda", description: "Quickly generate a professional agenda for your next team meeting.", category: "Productivity", color: "text-brand-pink" },
    { title: "Creative Story Ideas", description: "Brainstorm unique story plots, characters, and settings for your next masterpiece.", category: "Creative", color: "text-rose-500" },
    { title: "Resume Builder", description: "Generate key points and summaries for a professional resume.", category: "Productivity", color: "text-brand-purple" },
    { title: "Ad Copy Generator", description: "Create compelling ad copy for Google, Facebook, or LinkedIn ads.", category: "Marketing", color: "text-brand-pink" },
];

export const TemplatesView: React.FC = () => {
    return (
        <div className="h-full w-full p-4 md:p-8 overflow-y-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary gradient-text">Template Marketplace</h1>
                <p className="text-text-secondary mt-1">Boost your productivity with ready-to-use AI templates.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {templates.map((template, index) => (
                    <TemplateCard 
                        key={index}
                        title={template.title}
                        description={template.description}
                        category={template.category}
                        color={template.color.replace('text-', 'bg-')}
                    />
                ))}
            </div>
        </div>
    );
};