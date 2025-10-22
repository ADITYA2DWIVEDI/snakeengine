import React from 'react';
import { StudyGuideIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { runAiTool } from '../services/geminiService';

export const StudyGuideView: React.FC = () => {
    const handleGenerate = (prompt: string) => {
        const systemInstruction = "You are an academic expert and study coach. Create a comprehensive study guide based on the user's topic or text. Use Markdown. The guide should include Key Terms & Definitions, a Summary of Main Concepts, and Potential Exam Questions.";
        return runAiTool(systemInstruction, prompt);
    };

    return (
        <ToolViewLayout 
            icon={<StudyGuideIcon />}
            title="AI Study Guide Maker"
            description="Generate comprehensive study guides from your course materials."
            promptPlaceholder="e.g., 'The American Revolution' or 'The core principles of microeconomics.'"
            onGenerate={handleGenerate}
        />
    );
};
