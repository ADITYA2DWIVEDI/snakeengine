import React from 'react';
import { ProductDescIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { runAiTool } from '../services/geminiService';

export const ProductDescriptionView: React.FC = () => {
    const handleGenerate = (prompt: string) => {
        const systemInstruction = "You are a skilled e-commerce copywriter. Write a persuasive and benefit-focused product description based on the user's input. Use Markdown to format the response with a short, catchy title, a descriptive paragraph, and a bulleted list of key features and benefits.";
        return runAiTool(systemInstruction, prompt);
    };

    return (
        <ToolViewLayout 
            icon={<ProductDescIcon />}
            title="Product Description Generator"
            description="Create persuasive and benefit-focused descriptions for your products."
            promptPlaceholder="e.g., 'A stainless steel, insulated water bottle that keeps drinks cold for 24 hours. Comes in 3 colors.'"
            onGenerate={handleGenerate}
        />
    );
};
