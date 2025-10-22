import React from 'react';
import { DreamInterpreterIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { runAiTool } from '../services/geminiService';

export const DreamInterpreterView: React.FC = () => {
    const handleGenerate = (prompt: string) => {
        const systemInstruction = "You are a dream interpreter with knowledge of common dream symbols and psychological theories. Based on the user's description of their dream, provide a thoughtful and insightful interpretation. Explore possible meanings and connections to waking life. Always include a disclaimer that dream interpretation is subjective and not a science.";
        return runAiTool(systemInstruction, prompt);
    };

    return (
        <ToolViewLayout 
            icon={<DreamInterpreterIcon />}
            title="AI Dream Interpreter"
            description="Describe your dream and get a thoughtful interpretation of its possible meanings."
            promptPlaceholder="e.g., 'I dreamed I was flying over a city made of glass, but I couldn't find a place to land.'"
            onGenerate={handleGenerate}
        />
    );
};
