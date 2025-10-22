import React from 'react';
import { DndCharacterIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { runAiTool } from '../services/geminiService';

export const DndCharacterView: React.FC = () => {
    const handleGenerate = (prompt: string) => {
        const systemInstruction = "You are a creative storyteller and Dungeons & Dragons enthusiast. Based on the user's character concept (class, race, alignment), write a compelling and unique backstory for their character. Include key life events, motivations, and personality flaws. Use Markdown for formatting.";
        return runAiTool(systemInstruction, prompt);
    };

    return (
        <ToolViewLayout 
            icon={<DndCharacterIcon />}
            title="D&D Character Backstory Generator"
            description="Create rich backstories for your role-playing game characters."
            promptPlaceholder="e.g., 'A lawful good Dragonborn Paladin who was exiled from their clan.' or 'A chaotic neutral Halfling Rogue who grew up on the streets.'"
            onGenerate={handleGenerate}
        />
    );
};
