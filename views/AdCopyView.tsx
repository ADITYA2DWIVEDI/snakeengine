import React from 'react';
import { AdCopyIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { runAiTool } from '../services/geminiService';

export const AdCopyView: React.FC = () => {
    const handleGenerate = (prompt: string) => {
        const systemInstruction = "You are an expert copywriter specializing in high-converting ad copy. Generate several options for ad copy based on the user's product/service description and target audience. Use Markdown to format the response with clear headings for each option.";
        return runAiTool(systemInstruction, prompt);
    };

    return (
        <ToolViewLayout 
            icon={<AdCopyIcon />}
            title="Ad Copy Generator"
            description="Create compelling ad copy for Google, Facebook, or LinkedIn ads."
            promptPlaceholder="e.g., 'A new brand of eco-friendly running shoes made from recycled materials. Target audience is environmentally conscious runners aged 25-40.'"
            onGenerate={handleGenerate}
        />
    );
};
