import React from 'react';
import { QuizMakerIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { runAiTool } from '../services/geminiService';

export const QuizMakerView: React.FC = () => {
    const handleGenerate = (prompt: string) => {
        const systemInstruction = "You are a teacher and assessment expert. Create a quiz based on the user's topic and specifications. Use Markdown. Include a mix of multiple-choice, true/false, and short answer questions. Provide an answer key at the end.";
        return runAiTool(systemInstruction, prompt);
    };

    return (
        <ToolViewLayout 
            icon={<QuizMakerIcon />}
            title="AI Quiz Maker"
            description="Generate quizzes with multiple question types on any subject."
            promptPlaceholder="e.g., 'A 10-question quiz on the planets in our solar system for middle school students.'"
            onGenerate={handleGenerate}
        />
    );
};
