import React from 'react';
import { PoemGeneratorIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { runAiTool } from '../services/geminiService';

export const PoemGeneratorView: React.FC = () => {
    const handleGenerate = (prompt: string) => {
        const systemInstruction = "You are a world-renowned poet. Write a beautiful and evocative poem based on the user's topic and desired style. Use rich imagery and literary devices.";
        return runAiTool(systemInstruction, prompt);
    };

    return (
        <ToolViewLayout 
            icon={<PoemGeneratorIcon />}
            title="AI Poem Generator"
            description="Create beautiful poems in various styles, from sonnets to free verse."
            promptPlaceholder="e.g., 'A haiku about the changing seasons' or 'A free verse poem about the feeling of nostalgia.'"
            onGenerate={handleGenerate}
        />
    );
};
