import React from 'react';
import { ScriptWriterIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { runAiTool } from '../services/geminiService';

export const ScriptWriterView: React.FC = () => {
    const handleGenerate = (prompt: string) => {
        const systemInstruction = "You are an experienced screenwriter. Write a script scene based on the user's prompt. Use standard screenplay format (character names in caps, dialogue, and parenthetical actions). Use Markdown to format the response.";
        return runAiTool(systemInstruction, prompt);
    };

    return (
        <ToolViewLayout 
            icon={<ScriptWriterIcon />}
            title="AI Scriptwriter"
            description="Write scenes or full scripts for film, television, or your next video."
            promptPlaceholder="e.g., 'A dramatic scene where a detective confronts the main suspect in a rainy alley.' or 'A funny opening scene for a sitcom set in a coffee shop.'"
            onGenerate={handleGenerate}
        />
    );
};
