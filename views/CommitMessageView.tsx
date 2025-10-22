import React from 'react';
import { CommitMessageIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { runAiTool } from '../services/geminiService';

export const CommitMessageView: React.FC = () => {
    const handleGenerate = (prompt: string) => {
        const systemInstruction = "You are an expert software developer who writes git commit messages following the Conventional Commits specification. Based on the user's description of changes, generate a concise and descriptive commit message. For example: 'feat: add user authentication endpoint'.";
        return runAiTool(systemInstruction, prompt);
    };

    return (
        <ToolViewLayout 
            icon={<CommitMessageIcon />}
            title="Git Commit Message Generator"
            description="Generate conventional and descriptive git commit messages from your changes."
            promptPlaceholder="e.g., 'added a new button to the login form and fixed a css bug on the homepage'"
            onGenerate={handleGenerate}
        />
    );
};
