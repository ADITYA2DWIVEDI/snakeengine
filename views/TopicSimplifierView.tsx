import React from 'react';
import { TopicSimplifierIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { runAiTool } from '../services/geminiService';

export const TopicSimplifierView: React.FC = () => {
    const handleGenerate = (prompt: string) => {
        const systemInstruction = "You are an expert educator with a talent for simplification. Explain the user's complex topic in simple, easy-to-understand terms. Use analogies and real-world examples. Use Markdown for formatting.";
        return runAiTool(systemInstruction, prompt);
    };

    return (
        <ToolViewLayout 
            icon={<TopicSimplifierIcon />}
            title="Complex Topic Simplifier"
            description="Break down complex topics into simple, easy-to-understand explanations."
            promptPlaceholder="e.g., 'Explain blockchain technology like I'm five.' or 'What is quantum computing?'"
            onGenerate={handleGenerate}
        />
    );
};
