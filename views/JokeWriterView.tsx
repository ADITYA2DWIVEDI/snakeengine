import React from 'react';
import { JokeWriterIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { runAiTool } from '../services/geminiService';

export const JokeWriterView: React.FC = () => {
    const handleGenerate = (prompt: string) => {
        const systemInstruction = "You are a witty comedian. Generate a few short, family-friendly jokes (puns or one-liners) about the topic the user provides.";
        return runAiTool(systemInstruction, prompt);
    };

    return (
        <ToolViewLayout 
            icon={<JokeWriterIcon />}
            title="AI Joke Writer"
            description="Generate a few cheesy jokes about any topic you can think of."
            promptPlaceholder="e.g., 'Computers' or 'Coffee'"
            onGenerate={handleGenerate}
        />
    );
};
