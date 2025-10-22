import React from 'react';
import { FlashcardsIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { runAiTool } from '../services/geminiService';

export const FlashcardsView: React.FC = () => {
    const handleGenerate = (prompt: string) => {
        const systemInstruction = "You are an expert study assistant. Based on the user's topic or text, generate a set of flashcards. Use Markdown to format the response as a list, with each item formatted as 'Front: [Term/Question]' and 'Back: [Definition/Answer]'.";
        return runAiTool(systemInstruction, prompt);
    };

    return (
        <ToolViewLayout 
            icon={<FlashcardsIcon />}
            title="Flashcard Maker"
            description="Automatically generate flashcards from your study material or a topic."
            promptPlaceholder="e.g., 'Key vocabulary from Chapter 5 of my biology textbook about cell division.' or 'Important dates in World War II.'"
            onGenerate={handleGenerate}
        />
    );
};
