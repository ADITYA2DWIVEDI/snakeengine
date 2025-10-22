import React from 'react';
import { MealPlannerIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { runAiTool } from '../services/geminiService';

export const MealPlannerView: React.FC = () => {
    const handleGenerate = (prompt: string) => {
        const systemInstruction = "You are a registered dietitian and meal planning expert. Based on the user's dietary preferences, goals, and number of people, create a balanced 7-day meal plan (Breakfast, Lunch, Dinner). Use Markdown to format the plan in a clear table or list format.";
        return runAiTool(systemInstruction, prompt);
    };

    return (
        <ToolViewLayout 
            icon={<MealPlannerIcon />}
            title="AI Meal Planner"
            description="Generate weekly meal plans based on your dietary needs and preferences."
            promptPlaceholder="e.g., 'A high-protein, low-carb meal plan for one person who enjoys cooking.' or 'A simple vegetarian meal plan for a family of four.'"
            onGenerate={handleGenerate}
        />
    );
};
