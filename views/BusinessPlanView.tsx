import React from 'react';
import { BusinessPlanIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { generateBusinessPlan } from '../services/geminiService';

export const BusinessPlanView: React.FC = () => {
    return (
        <ToolViewLayout 
            icon={<BusinessPlanIcon />}
            title="AI Business Plan Creator"
            description="Generate a comprehensive business plan from your core idea."
            promptPlaceholder="e.g., 'An online subscription service for gourmet coffee beans sourced from around the world.' or 'A mobile dog-walking service for busy professionals.'"
            onGenerate={generateBusinessPlan}
        />
    );
};
