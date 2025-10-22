import React from 'react';
import { ImageIcon, TemplatesIcon } from '../components/Icons';

// Fix: Use React.FC to correctly type the functional component and resolve issues with the 'key' prop in lists.
const TrendingCard: React.FC<{ title: string, category: string, icon: React.ReactNode, author?: string }> = ({ title, category, icon, author }) => (
    <div className="p-6 rounded-2xl glass-pane shadow-lg hover:border-brand-purple/50 transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-start gap-4">
            <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-slate-100 flex items-center justify-center text-brand-purple">
                {icon}
            </div>
            <div>
                <p className="text-sm text-text-secondary">{category}</p>
                <h3 className="font-semibold text-text-primary mt-1">{title}</h3>
                {author && <p className="text-xs text-text-secondary mt-1">by @{author}</p>}
            </div>
        </div>
    </div>
);

const trendingPrompts = [
    { title: "A majestic bioluminescent forest at twilight", category: "Image Prompt", icon: <ImageIcon />, author: "PixelDreamer" },
    { title: "Steampunk owl with glowing mechanical eyes", category: "Image Prompt", icon: <ImageIcon />, author: "Cogsmith" },
    { title: "Cosmic whale swimming through a nebula", category: "Image Prompt", icon: <ImageIcon />, author: "StarSailor" },
];

const popularTemplates = [
    { title: "Email Subject Lines", category: "Marketing Template", icon: <TemplatesIcon /> },
    { title: "Code Explainer", category: "Development Template", icon: <TemplatesIcon /> },
    { title: "Creative Story Ideas", category: "Creative Template", icon: <TemplatesIcon /> },
];

export const TrendingPage: React.FC = () => {
    return (
        <div className="h-full w-full p-4 md:p-8 overflow-y-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary gradient-text">Trending Now</h1>
                <p className="text-text-secondary mt-1">Discover the most popular prompts and templates from the community.</p>
            </header>

            <section className="mb-12">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">Hot Image Prompts</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {trendingPrompts.map((item, index) => <TrendingCard key={`prompt-${index}`} title={item.title} category={item.category} icon={item.icon} author={item.author} />)}
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-text-primary mb-4">Popular Templates</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {popularTemplates.map((item, index) => <TrendingCard key={`template-${index}`} title={item.title} category={item.category} icon={item.icon} />)}
                </div>
            </section>
        </div>
    );
};