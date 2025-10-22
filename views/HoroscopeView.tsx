import React from 'react';
import { HoroscopeIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { runAiTool } from '../services/geminiService';

export const HoroscopeView: React.FC = () => {
    const handleGenerate = (prompt: string) => {
        const systemInstruction = "You are a creative and insightful astrologer. Based on the user's zodiac sign and area of focus (e.g., career, love, personal growth), write a personalized and inspiring horoscope for the day. Use a positive and encouraging tone.";
        return runAiTool(systemInstruction, prompt);
    };

    return (
        <ToolViewLayout 
            icon={<HoroscopeIcon />}
            title="Personalized Horoscope"
            description="Get an inspiring daily horoscope tailored to your sign and focus."
            promptPlaceholder="e.g., 'Aries, focus on career.' or 'Libra, focus on love life.'"
            onGenerate={handleGenerate}
        />
    );
};
