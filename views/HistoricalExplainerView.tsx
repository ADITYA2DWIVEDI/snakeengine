import React from 'react';
import { HistoricalExplainerIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { runAiTool } from '../services/geminiService';

export const HistoricalExplainerView: React.FC = () => {
    const handleGenerate = (prompt: string) => {
        const systemInstruction = "You are a knowledgeable and engaging history professor. Provide a clear, concise, and accurate explanation of the historical event, figure, or concept requested by the user. Use Markdown for formatting, and structure the explanation for easy understanding.";
        return runAiTool(systemInstruction, prompt);
    };

    return (
        <ToolViewLayout 
            icon={<HistoricalExplainerIcon />}
            title="Historical Event Explainer"
            description="Get clear and concise explanations of historical events, figures, and concepts."
            promptPlaceholder="e.g., 'The causes of the French Revolution' or 'The significance of the Silk Road.'"
            onGenerate={handleGenerate}
        />
    );
};
