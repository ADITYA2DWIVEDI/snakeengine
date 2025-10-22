import React from 'react';
import { GiftIdeasIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { runAiTool } from '../services/geminiService';

export const GiftIdeasView: React.FC = () => {
    const handleGenerate = (prompt: string) => {
        const systemInstruction = "You are a thoughtful and creative gift-giving expert. Based on the user's description of a person (age, relationship, interests) and the occasion, generate a list of unique and personalized gift ideas. Categorize them by type (e.g., Experiences, Hobbies, Tech). Use Markdown for formatting.";
        return runAiTool(systemInstruction, prompt);
    };

    return (
        <ToolViewLayout 
            icon={<GiftIdeasIcon />}
            title="Gift Idea Suggester"
            description="Brainstorm unique and personalized gift ideas for any occasion."
            promptPlaceholder="e.g., 'A birthday gift for my dad who loves fishing and history books.' or 'A wedding anniversary gift for my wife who is into gardening and minimalist design.'"
            onGenerate={handleGenerate}
        />
    );
};
