import React from 'react';
import { SongLyricWriterIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { runAiTool } from '../services/geminiService';

export const SongLyricWriterView: React.FC = () => {
    const handleGenerate = (prompt: string) => {
        const systemInstruction = "You are a professional songwriter. Based on the user's topic and genre, write a song with a clear structure (e.g., Verse 1, Chorus, Verse 2, Chorus, Bridge, Chorus). Use evocative language and rhyming schemes appropriate for the genre. Use Markdown for formatting.";
        return runAiTool(systemInstruction, prompt);
    };

    return (
        <ToolViewLayout 
            icon={<SongLyricWriterIcon />}
            title="AI Song Lyric Writer"
            description="Generate original song lyrics in any genre, from pop to country."
            promptPlaceholder="e.g., 'A country song about heartbreak and moving on.' or 'An indie pop song about the feeling of a summer road trip.'"
            onGenerate={handleGenerate}
        />
    );
};
