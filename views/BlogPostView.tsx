import React from 'react';
import { BlogPostIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { generateBlogPost } from '../services/geminiService';

export const BlogPostView: React.FC = () => {
    return (
        <ToolViewLayout 
            icon={<BlogPostIcon />}
            title="Blog Post Writer"
            description="Generate a complete, well-structured, and engaging blog post on any topic."
            promptPlaceholder="e.g., 'The benefits of learning a new programming language in 2024' or 'A travel guide to the Amalfi Coast.'"
            onGenerate={generateBlogPost}
        />
    );
};
