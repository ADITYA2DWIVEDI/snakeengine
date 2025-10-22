import React from 'react';
import { UnitTestWriterIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { runAiTool } from '../services/geminiService';

export const UnitTestWriterView: React.FC = () => {
    const handleGenerate = (prompt: string) => {
        const systemInstruction = "You are a software quality assurance engineer. Based on the user's code snippet and language, write a set of unit tests to verify its functionality. Use a popular testing framework for that language (e.g., Jest for JavaScript, pytest for Python). Cover edge cases and happy paths. Provide the test code in a Markdown code block.";
        return runAiTool(systemInstruction, prompt);
    };

    return (
        <ToolViewLayout 
            icon={<UnitTestWriterIcon />}
            title="Unit Test Writer"
            description="Automatically generate unit tests for your code snippets."
            promptPlaceholder="e.g., 'Language: Python. Code: def add(a, b): return a + b' or 'Language: Javascript. Code: const greet = (name) => `Hello, ${name}!`;'"
            onGenerate={handleGenerate}
        />
    );
};
