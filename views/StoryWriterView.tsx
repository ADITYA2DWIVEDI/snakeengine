import React from 'react';
import { StoryWriterIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { runAiTool } from '../services/geminiService';

export const StoryWriterView: React.FC = () => {
    const handleGenerate = (prompt: string) => {
        const systemInstruction = "You are a bestselling author. Write a short, compelling fictional story based on the user's prompt. Develop interesting characters, a clear plot (beginning, middle, end), and a satisfying conclusion.";
        return runAiTool(systemInstruction, prompt);
    };

    return (
        <ToolViewLayout 
            icon={<StoryWriterIcon />}
            title="Fictional Story Writer"
            description="Generate complete short stories from a single prompt or idea."
            promptPlaceholder="e.g., 'A sci-fi story about a robot who discovers it can feel emotions.' or 'A fantasy story about a young wizard's first day at a magical academy.'"
            onGenerate={handleGenerate}
        />
    );
};
