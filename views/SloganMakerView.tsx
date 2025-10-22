import React from 'react';
import { SloganMakerIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { runAiTool } from '../services/geminiService';

export const SloganMakerView: React.FC = () => {
    const handleGenerate = (prompt: string) => {
        const systemInstruction = "You are a creative advertising director. Generate a list of 10 catchy slogans or taglines for the user's company or product. Provide a variety of styles (e.g., witty, professional, benefit-focused). Use Markdown for formatting.";
        return runAiTool(systemInstruction, prompt);
    };

    return (
        <ToolViewLayout 
            icon={<SloganMakerIcon />}
            title="AI Slogan Maker"
            description="Generate catchy slogans and taglines for your brand or product."
            promptPlaceholder="e.g., 'A coffee shop that focuses on sustainable sourcing and community.' or 'A productivity app that helps users focus and avoid distractions.'"
            onGenerate={handleGenerate}
        />
    );
};
