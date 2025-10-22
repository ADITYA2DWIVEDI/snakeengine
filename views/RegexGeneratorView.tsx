import React from 'react';
import { RegexIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { runAiTool } from '../services/geminiService';

export const RegexGeneratorView: React.FC = () => {
    const handleGenerate = (prompt: string) => {
        const systemInstruction = "You are a regular expression expert. Your task is to convert a natural language description of a pattern into a valid regular expression. Provide only the regex pattern and a brief explanation of how it works. For example, for 'match a valid email address', you would provide the regex and a short description.";
        return runAiTool(systemInstruction, prompt);
    };

    return (
        <ToolViewLayout 
            icon={<RegexIcon />}
            title="Regex Generator"
            description="Translate natural language descriptions into regular expressions."
            promptPlaceholder="e.g., 'Match a US phone number with an optional country code' or 'Find all words that start with a capital letter.'"
            onGenerate={handleGenerate}
        />
    );
};
