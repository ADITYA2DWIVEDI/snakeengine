import React from 'react';
import { BrandNamerIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { runAiTool } from '../services/geminiService';

export const BrandNamerView: React.FC = () => {
    const handleGenerate = (prompt: string) => {
        const systemInstruction = "You are a branding expert specializing in creating unique and memorable brand names. Based on the user's description, generate a list of 10-15 potential brand names. Categorize them into different styles (e.g., Modern, Classic, Playful). Use Markdown for formatting.";
        return runAiTool(systemInstruction, prompt);
    };

    return (
        <ToolViewLayout 
            icon={<BrandNamerIcon />}
            title="AI Brand Name Generator"
            description="Brainstorm unique and memorable names for your business or product."
            promptPlaceholder="e.g., 'A company that sells handmade leather journals' or 'A mobile app for tracking personal reading habits.'"
            onGenerate={handleGenerate}
        />
    );
};
