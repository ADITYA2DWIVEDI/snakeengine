import React from 'react';
import { CronIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { runAiTool } from '../services/geminiService';

export const CronGeneratorView: React.FC = () => {
    const handleGenerate = (prompt: string) => {
        const systemInstruction = "You are an expert in system administration. Your task is to convert a natural language description of a schedule into the correct cron syntax. Provide only the cron string and a brief explanation of what it does. For example, for 'run every day at 5 AM', you would respond with `0 5 * * * - This runs at 5:00 AM every day.`";
        return runAiTool(systemInstruction, prompt);
    };

    return (
        <ToolViewLayout 
            icon={<CronIcon />}
            title="Cron Job Generator"
            description="Translate natural language descriptions into cron syntax for scheduling tasks."
            promptPlaceholder="e.g., 'Every Monday at 3:30 PM' or 'Twice an hour'"
            onGenerate={handleGenerate}
        />
    );
};
