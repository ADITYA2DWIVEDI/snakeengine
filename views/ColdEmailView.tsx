import React from 'react';
import { ColdEmailIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { runAiTool } from '../services/geminiService';

export const ColdEmailView: React.FC = () => {
    const handleGenerate = (prompt: string) => {
        const systemInstruction = "You are a sales and networking expert who writes effective cold emails. Based on the user's goal, target person, and company, write a concise, professional, and personalized cold email. Provide a clear subject line and a call to action. Use Markdown for formatting.";
        return runAiTool(systemInstruction, prompt);
    };

    return (
        <ToolViewLayout 
            icon={<ColdEmailIcon />}
            title="Cold Email Writer"
            description="Draft professional and effective cold outreach emails."
            promptPlaceholder="e.g., 'Goal: Schedule a demo. Target: Head of Marketing at a tech startup. My product: an AI-powered social media scheduling tool.'"
            onGenerate={handleGenerate}
        />
    );
};
