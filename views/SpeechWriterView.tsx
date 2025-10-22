import React from 'react';
import { SpeechWriterIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { runAiTool } from '../services/geminiService';

export const SpeechWriterView: React.FC = () => {
    const handleGenerate = (prompt: string) => {
        const systemInstruction = "You are a professional speechwriter. Based on the user's occasion, audience, and key points, write a complete and engaging speech. Structure it with an introduction, a body, and a strong conclusion. Use Markdown for formatting.";
        return runAiTool(systemInstruction, prompt);
    };

    return (
        <ToolViewLayout 
            icon={<SpeechWriterIcon />}
            title="AI Speech Writer"
            description="Draft compelling speeches for weddings, business presentations, and more."
            promptPlaceholder="e.g., 'A 5-minute best man speech for my childhood friend. Key points: funny story about our trip, his good character, wishing the couple well.'"
            onGenerate={handleGenerate}
        />
    );
};
