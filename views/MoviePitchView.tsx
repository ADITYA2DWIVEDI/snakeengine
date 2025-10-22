import React from 'react';
import { MoviePitchIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { runAiTool } from '../services/geminiService';

export const MoviePitchView: React.FC = () => {
    const handleGenerate = (prompt: string) => {
        const systemInstruction = "You are a creative Hollywood screenwriter. Based on the user's genre or concept, generate three unique movie pitches. Each pitch should include a Title, a Logline (a one-sentence summary), and a short Synopsis. Use Markdown for formatting.";
        return runAiTool(systemInstruction, prompt);
    };

    return (
        <ToolViewLayout 
            icon={<MoviePitchIcon />}
            title="AI Movie Pitch Generator"
            description="Brainstorm unique movie ideas, loglines, and synopses."
            promptPlaceholder="e.g., 'A sci-fi comedy' or 'A detective story set in ancient Rome.'"
            onGenerate={handleGenerate}
        />
    );
};
