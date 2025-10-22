import React from 'react';
import { WorkoutGeneratorIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { generateWorkout } from '../services/geminiService';

export const WorkoutGeneratorView: React.FC = () => {
    return (
        <ToolViewLayout 
            icon={<WorkoutGeneratorIcon />}
            title="AI Workout Generator"
            description="Get a personalized workout plan tailored to your goals and equipment."
            promptPlaceholder="e.g., 'Goal: build muscle. Experience: intermediate. Equipment: dumbbells and a bench. Days per week: 3.' or 'A 30-minute bodyweight HIIT workout for beginners.'"
            onGenerate={generateWorkout}
        />
    );
};
