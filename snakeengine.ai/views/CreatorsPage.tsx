import React from 'react';
import { TemplatesIcon, CodeIcon, ImageIcon } from '../components/Icons';

// Fix: Use React.FC to correctly type the functional component and resolve issues with the 'key' prop in lists.
// Fix: Changed icon prop type to `React.ReactElement<any>` to resolve a TypeScript error when using React.cloneElement.
const CreatorCard: React.FC<{ name: string, specialty: string, bio: string, icon: React.ReactElement<any> }> = ({ name, specialty, bio, icon }) => (
    <div className="p-6 rounded-2xl glass-pane shadow-lg text-center transform hover:-translate-y-1 transition-transform duration-300">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-brand-purple">
            {React.cloneElement(icon, { className: "w-8 h-8" })}
        </div>
        <h3 className="text-xl font-semibold text-text-primary">@{name}</h3>
        <p className="text-sm font-medium text-brand-purple mb-2">{specialty}</p>
        <p className="text-text-secondary text-sm">{bio}</p>
    </div>
);

interface Creator {
    name: string;
    specialty: string;
    bio: string;
    icon: React.ReactElement;
}

const creators: Creator[] = [
    { name: "PromptMaster", specialty: "Marketing Templates", bio: "Crafting powerful templates that boost engagement and drive conversions.", icon: <TemplatesIcon /> },
    { name: "CodeWizard", specialty: "Developer Tools", bio: "Building tools and code templates to accelerate development workflows.", icon: <CodeIcon /> },
    { name: "VisualVirtuoso", specialty: "Image Prompts", bio: "Designing stunning and imaginative prompts for the AI Image Generator.", icon: <ImageIcon /> },
    { name: "ProductivityPro", specialty: "Productivity Templates", bio: "Creating templates to help you organize, plan, and execute your goals.", icon: <TemplatesIcon /> },
];

export const CreatorsPage: React.FC = () => {
    return (
        <div className="h-full w-full p-4 md:p-8 overflow-y-auto">
            <header className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-text-primary">Featured Creators</h1>
                <p className="text-text-secondary mt-1 max-w-2xl mx-auto">Meet the minds behind our top templates and tools.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {creators.map((creator, index) => (
                    <CreatorCard key={index} name={creator.name} specialty={creator.specialty} bio={creator.bio} icon={creator.icon} />
                ))}
            </div>
        </div>
    );
};