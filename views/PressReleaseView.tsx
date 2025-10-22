import React from 'react';
import { PressReleaseIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { runAiTool } from '../services/geminiService';

export const PressReleaseView: React.FC = () => {
    const handleGenerate = (prompt: string) => {
        const systemInstruction = "You are a public relations professional. Write a professional press release based on the user's announcement. Use a standard press release format, including a headline, dateline, introduction, body, boilerplate, and media contact information. Use Markdown for formatting.";
        return runAiTool(systemInstruction, prompt);
    };

    return (
        <ToolViewLayout 
            icon={<PressReleaseIcon />}
            title="Press Release Writer"
            description="Generate professional press releases for your company announcements."
            promptPlaceholder="e.g., 'Our tech startup just raised a $5 million Series A funding round to expand our AI platform.'"
            onGenerate={handleGenerate}
        />
    );
};
