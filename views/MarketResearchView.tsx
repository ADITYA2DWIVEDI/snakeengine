import React from 'react';
import { MarketResearchIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { runAiTool } from '../services/geminiService';

export const MarketResearchView: React.FC = () => {
    const handleGenerate = (prompt: string) => {
        const systemInstruction = "You are a market research analyst. Based on the user's product or industry, provide a high-level market research summary. Use Markdown. Include sections on Target Audience, Market Size & Trends, and Potential Competitors.";
        return runAiTool(systemInstruction, prompt);
    };

    return (
        <ToolViewLayout 
            icon={<MarketResearchIcon />}
            title="AI Market Research Assistant"
            description="Generate a high-level summary of the market for your product or industry."
            promptPlaceholder="e.g., 'The market for plant-based milk alternatives in the US' or 'A new mobile app for language learning.'"
            onGenerate={handleGenerate}
        />
    );
};
