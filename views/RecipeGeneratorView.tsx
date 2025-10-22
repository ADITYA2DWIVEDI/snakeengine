import React from 'react';
import { RecipeGeneratorIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { generateRecipe } from '../services/geminiService';

export const RecipeGeneratorView: React.FC = () => {
    return (
        <ToolViewLayout 
            icon={<RecipeGeneratorIcon />}
            title="AI Recipe Generator"
            description="Create unique recipes from the ingredients you have on hand."
            promptPlaceholder="e.g., 'I have chicken breasts, broccoli, rice, and soy sauce. I'd like something quick and healthy.'"
            onGenerate={generateRecipe}
        />
    );
};
