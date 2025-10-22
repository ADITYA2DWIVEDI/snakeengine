import React from 'react';
import { TemplatesIcon, ImageIcon, ChatIcon } from '../components/Icons';

// Fix: Use React.FC to correctly type the functional component and resolve issues with the 'key' prop in lists.
const DiscoverCard: React.FC<{ title: string, description: string, category: string, icon: React.ReactNode }> = ({ title, description, category, icon }) => (
    <div className="p-6 rounded-2xl glass-pane shadow-lg hover:border-brand-purple/50 transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-start gap-4">
            <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-slate-100 flex items-center justify-center text-brand-purple">
                {icon}
            </div>
            <div>
                <p className="text-sm text-text-secondary">{category}</p>
                <h3 className="font-semibold text-text-primary mt-1">{title}</h3>
                <p className="text-sm text-text-secondary mt-1">{description}</p>
            </div>
        </div>
    </div>
);

interface DiscoverItem {
    title: string;
    description: string;
    category: string;
    icon: React.ReactNode;
}

export const DiscoverPage: React.FC = () => {
    const trendingPrompts: DiscoverItem[] = [
        { title: "Neon-drenched cityscape at midnight", description: "Generate a vibrant, cyberpunk-style city.", category: "Image Prompt", icon: <ImageIcon /> },
        { title: "Explain quantum computing to a 5-year-old", description: "Simplify a complex topic with an analogy.", category: "Chat Prompt", icon: <ChatIcon /> },
        { title: "A solarpunk utopia", description: "Create an image of a green, high-tech future.", category: "Image Prompt", icon: <ImageIcon /> },
    ];
    const featuredTemplates: DiscoverItem[] = [
        { title: "Workout Planner", description: "Generate a custom weekly fitness routine.", category: "Template", icon: <TemplatesIcon /> },
        { title: "Cover Letter Writer", description: "Create a professional cover letter for any job.", category: "Template", icon: <TemplatesIcon /> },
        { title: "Recipe Creator", description: "Generate a unique recipe based on ingredients you have.", category: "Template", icon: <TemplatesIcon /> },
    ];

    return (
        <div className="h-full w-full p-4 md:p-8 overflow-y-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary">Discover</h1>
                <p className="text-text-secondary mt-1">Explore what's possible with SnakeEngine.AI.</p>
            </header>

            <section className="mb-12">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">Trending Prompts</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {trendingPrompts.map((item, index) => <DiscoverCard key={`prompt-${index}`} title={item.title} description={item.description} category={item.category} icon={item.icon} />)}
                </div>
            </section>

             <section>
                <h2 className="text-2xl font-semibold text-text-primary mb-4">Featured Templates</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {featuredTemplates.map((item, index) => <DiscoverCard key={`template-${index}`} title={item.title} description={item.description} category={item.category} icon={item.icon} />)}
                </div>
            </section>
        </div>
    );
};