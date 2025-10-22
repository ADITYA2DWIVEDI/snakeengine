import React from 'react';
import { SwotIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { runAiTool } from '../services/geminiService';

export const SwotAnalysisView: React.FC = () => {
    const handleGenerate = (prompt: string) => {
        const systemInstruction = "You are a business analyst. Conduct a SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) for the user's business or idea. Present the results in four distinct sections using Markdown headings and bullet points.";
        return runAiTool(systemInstruction, prompt);
    };

    return (
        <ToolViewLayout 
            icon={<SwotIcon />}
            title="SWOT Analysis Generator"
            description="Analyze your business's strengths, weaknesses, opportunities, and threats."
            promptPlaceholder="e.g., 'A small, independent coffee shop in a busy downtown area.' or 'A new SaaS product for project management.'"
            onGenerate={handleGenerate}
        />
    );
};
