import React from 'react';
import { TattooDesignerIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { runAiTool } from '../services/geminiService';

export const TattooDesignerView: React.FC = () => {
    const handleGenerate = (prompt: string) => {
        const systemInstruction = "You are a creative tattoo artist. Based on the user's idea, generate a detailed description of a tattoo design. Describe the visual elements, style (e.g., traditional, watercolor, minimalist), and potential placement on the body. This is for inspiration purposes.";
        return runAiTool(systemInstruction, prompt);
    };

    return (
        <ToolViewLayout 
            icon={<TattooDesignerIcon />}
            title="AI Tattoo Designer"
            description="Brainstorm and describe unique tattoo ideas for your next piece."
            promptPlaceholder="e.g., 'A minimalist tattoo of a mountain range on the forearm.' or 'A watercolor style tattoo of a phoenix on the back.'"
            onGenerate={handleGenerate}
        />
    );
};
