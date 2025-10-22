import React from 'react';
import { JobDescriptionIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { runAiTool } from '../services/geminiService';

export const JobDescriptionView: React.FC = () => {
    const handleGenerate = (prompt: string) => {
        const systemInstruction = "You are an experienced HR manager and recruiter. Based on the user's input for a job title and key responsibilities, write a comprehensive and professional job description. Use Markdown. Include sections for Job Summary, Responsibilities, and Qualifications.";
        return runAiTool(systemInstruction, prompt);
    };

    return (
        <ToolViewLayout 
            icon={<JobDescriptionIcon />}
            title="Job Description Writer"
            description="Create clear, professional, and effective job descriptions."
            promptPlaceholder="e.g., 'Job Title: Senior Frontend Developer. Responsibilities: Build and maintain our React-based web app, collaborate with designers, mentor junior developers.'"
            onGenerate={handleGenerate}
        />
    );
};
