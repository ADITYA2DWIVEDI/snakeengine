import React from 'react';

const TopicCard: React.FC<{ title: string; description: string }> = ({ title, description }) => (
    <div className="p-6 rounded-2xl glass-pane shadow-lg hover:border-brand-purple/50 hover:-translate-y-1 transition-all duration-300">
        <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
        <p className="text-sm text-text-secondary">{description}</p>
    </div>
);

const topics = [
    { title: "Creative Writing", description: "Explore tools for writing stories, scripts, poems, and more." },
    { title: "Business & Marketing", description: "Generate business plans, ad copy, and social media strategies." },
    { title: "Software Development", description: "Assist with code generation, debugging, and documentation." },
    { title: "Education & Learning", description: "Create lesson plans, study guides, and simplify complex topics." },
    { title: "Lifestyle & Productivity", description: "Plan your meals, workouts, travel, and boost your daily efficiency." },
    { title: "Fun & Games", description: "Design D&D characters, create game concepts, or write jokes." },
];

export const TopicListView: React.FC = () => {
    return (
        <div className="h-full w-full p-4 md:p-8 overflow-y-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary gradient-text">Explore Topics</h1>
                <p className="text-text-secondary mt-1">Discover the wide range of capabilities SnakeEngine.AI has to offer.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {topics.map((topic, index) => (
                    <TopicCard 
                        key={index}
                        title={topic.title}
                        description={topic.description}
                    />
                ))}
            </div>
        </div>
    );
};
