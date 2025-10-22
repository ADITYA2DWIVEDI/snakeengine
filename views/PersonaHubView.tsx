import React, { useState } from 'react';
import { PersonaIcon, SendIcon } from '../components/Icons';

interface PersonaHubViewProps {
    onSetPersona: (persona: string) => void;
}

const PersonaCard: React.FC<{ title: string, description: string, onClick: () => void }> = ({ title, description, onClick }) => (
    <button onClick={onClick} className="p-6 rounded-2xl glass-pane shadow-lg text-left hover:border-brand-purple/50 hover:-translate-y-1 transition-all duration-300 w-full">
        <h3 className="font-semibold text-text-primary text-lg">{title}</h3>
        <p className="text-sm text-text-secondary mt-1">{description}</p>
    </button>
);

const presetPersonas = [
    { title: "Sarcastic Robot", description: "A witty and cynical AI that answers with dry humor." },
    { title: "Helpful Pirate", description: "Ahoy, matey! Get answers from a friendly pirate captain." },
    { title: "Shakespearean Poet", description: "Hark! Receive thy answers in the eloquent tongue of the Bard." },
    { title: "5-Year-Old Child", description: "Explains everything in very simple, childlike terms." }
];


export const PersonaHubView: React.FC<PersonaHubViewProps> = ({ onSetPersona }) => {
    const [customPersona, setCustomPersona] = useState('');

    const handleSetCustom = () => {
        if(customPersona.trim()) {
            onSetPersona(customPersona);
        }
    };
    
    return (
        <div className="h-full w-full p-4 md:p-8 overflow-y-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary gradient-text">Persona Hub</h1>
                <p className="text-text-secondary mt-1">Change the AI's personality for your current chat session.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-6 rounded-2xl glass-pane">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Choose a Preset Persona</h2>
                    <div className="space-y-4">
                        {presetPersonas.map(p => (
                            <PersonaCard key={p.title} title={p.title} description={p.description} onClick={() => onSetPersona(p.description)} />
                        ))}
                    </div>
                </div>

                <div className="p-6 rounded-2xl glass-pane flex flex-col">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Or Create Your Own</h2>
                    <textarea
                        value={customPersona}
                        onChange={(e) => setCustomPersona(e.target.value)}
                        placeholder="e.g., 'You are a world-weary detective from a 1940s noir film.' or 'You are an overly enthusiastic golden retriever.'"
                        className="w-full flex-1 p-3 bg-white rounded-lg border border-border-color focus:ring-2 focus:ring-brand-purple focus:outline-none transition resize-none text-text-primary placeholder:text-text-secondary"
                        rows={6}
                    />
                     <button onClick={handleSetCustom} disabled={!customPersona.trim()} className="w-full flex items-center justify-center gap-2 mt-4 py-3 px-6 bg-brand-purple text-white font-semibold rounded-lg shadow-lg hover:bg-brand-purple/80 transition-all disabled:opacity-50 hover:shadow-glow-purple">
                        Set Custom Persona <SendIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};