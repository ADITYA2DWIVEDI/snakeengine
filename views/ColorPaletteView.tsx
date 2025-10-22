import React from 'react';
import { ColorPaletteIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { runAiTool } from '../services/geminiService';

export const ColorPaletteView: React.FC = () => {
    const handleGenerate = (prompt: string) => {
        const systemInstruction = "You are a UI/UX designer with an expert eye for color theory. Based on the user's prompt, generate a harmonious color palette with 5 colors. Provide the HEX code for each color and a brief description of the mood it evokes. Use Markdown for formatting.";
        return runAiTool(systemInstruction, prompt);
    };

    return (
        <ToolViewLayout 
            icon={<ColorPaletteIcon />}
            title="AI Color Palette Generator"
            description="Generate harmonious color palettes from a descriptive prompt."
            promptPlaceholder="e.g., 'A calming and professional palette for a healthcare app' or 'A vibrant and energetic palette for a music festival website.'"
            onGenerate={handleGenerate}
        />
    );
};
