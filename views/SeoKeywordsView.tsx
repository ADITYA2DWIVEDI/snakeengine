import React from 'react';
import { SeoKeywordsIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { generateSeoKeywords } from '../services/geminiService';

export const SeoKeywordsView: React.FC = () => {
    return (
        <ToolViewLayout 
            icon={<SeoKeywordsIcon />}
            title="SEO Keyword Analyzer"
            description="Generate primary, secondary, and LSI keywords to boost your content's search ranking."
            promptPlaceholder="e.g., 'Beginner tips for landscape photography' or 'Content marketing for small businesses.'"
            onGenerate={generateSeoKeywords}
        />
    );
};
