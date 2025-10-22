import React from 'react';
import { DbSchemaIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { runAiTool } from '../services/geminiService';

export const DbSchemaView: React.FC = () => {
    const handleGenerate = (prompt: string) => {
        const systemInstruction = "You are an expert database architect. Based on the user's application description, design a logical database schema. Use Markdown to define the tables, columns (with data types), and relationships (e.g., one-to-many, many-to-many).";
        return runAiTool(systemInstruction, prompt);
    };

    return (
        <ToolViewLayout 
            icon={<DbSchemaIcon />}
            title="Database Schema Designer"
            description="Generate a logical database schema from your application's requirements."
            promptPlaceholder="e.g., 'A simple blogging platform with users, posts, and comments. Users can have multiple posts, and posts can have multiple comments.'"
            onGenerate={handleGenerate}
        />
    );
};
