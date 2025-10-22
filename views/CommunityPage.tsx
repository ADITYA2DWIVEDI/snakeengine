import React from 'react';

// Fix: Use React.FC to correctly type the functional component and resolve issues with the 'key' prop in lists.
const CommunityPost: React.FC<{ imageUrl: string, prompt: string, author: string }> = ({ imageUrl, prompt, author }) => (
    <div className="group relative overflow-hidden rounded-2xl glass-pane shadow-lg aspect-square">
        <img src={imageUrl} alt={prompt} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 left-0 p-4">
            <p className="text-sm font-medium text-white line-clamp-2">{prompt}</p>
            <p className="text-xs text-slate-300">by @{author}</p>
        </div>
    </div>
);

const communityCreations = [
    { imageUrl: "https://picsum.photos/seed/comm1/500/500", prompt: "A majestic bioluminescent forest at twilight", author: "PixelDreamer" },
    { imageUrl: "https://picsum.photos/seed/comm2/500/500", prompt: "Steampunk owl with glowing mechanical eyes", author: "Cogsmith" },
    { imageUrl: "https://picsum.photos/seed/comm3/500/500", prompt: "Floating islands connected by ancient vine bridges", author: "SkyWanderer" },
    { imageUrl: "https://picsum.photos/seed/comm4/500/500", prompt: "A robot meditating in a zen garden", author: "SynthSage" },
    { imageUrl: "https://picsum.photos/seed/comm5/500/500", prompt: "Underwater city of Atlantis, coral architecture", author: "AquaArchitect" },
    { imageUrl: "https://picsum.photos/seed/comm6/500/500", prompt: "A library that stretches into infinity", author: "Bookwyrm" },
    { imageUrl: "https://picsum.photos/seed/comm7/500/500", prompt: "A dragon made of crystal shards", author: "GemDragon" },
    { imageUrl: "https://picsum.photos/seed/comm8/500/500", prompt: "Cosmic whale swimming through a nebula", author: "StarSailor" },
];

export const CommunityPage: React.FC = () => {
    return (
        <div className="h-full w-full p-4 md:p-8 overflow-y-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary">Community Hub</h1>
                <p className="text-text-secondary mt-1">See what others are creating with SnakeEngine.AI.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {communityCreations.map((creation, index) => (
                    <CommunityPost key={index} imageUrl={creation.imageUrl} prompt={creation.prompt} author={creation.author} />
                ))}
            </div>
        </div>
    );
};