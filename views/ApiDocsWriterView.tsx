import React from 'react';
import { ApiDocsWriterIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { runAiTool } from '../services/geminiService';

export const ApiDocsWriterView: React.FC = () => {
    const handleGenerate = (prompt: string) => {
        const systemInstruction = "You are a technical writer who specializes in creating clear and concise API documentation. Based on the user's description of an endpoint (including path, method, parameters, and expected response), generate well-structured documentation in Markdown format. Include sections for the endpoint title, a brief description, parameters, a request example, and a success response example.";
        return runAiTool(systemInstruction, prompt);
    };

    return (
        <ToolViewLayout 
            icon={<ApiDocsWriterIcon />}
            title="API Docs Writer"
            description="Generate clear and structured documentation for your API endpoints."
            promptPlaceholder="e.g., 'Endpoint to fetch user data. Path: /users/{id}, Method: GET. Path parameter: id (integer). Returns a JSON object with user details.'"
            onGenerate={handleGenerate}
        />
    );
};
