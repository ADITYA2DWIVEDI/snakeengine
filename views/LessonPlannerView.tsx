import React from 'react';
import { LessonPlannerIcon } from '../components/Icons';
import { ToolViewLayout } from '../components/ToolViewLayout';
import { generateLessonPlan } from '../services/geminiService';

export const LessonPlannerView: React.FC = () => {
    return (
        <ToolViewLayout 
            icon={<LessonPlannerIcon />}
            title="AI Lesson Plan Creator"
            description="Generate detailed lesson plans for any subject and grade level."
            promptPlaceholder="e.g., 'A 45-minute lesson on the water cycle for 4th-grade science class.' or 'An introduction to Python variables for high school computer science.'"
            onGenerate={generateLessonPlan}
        />
    );
};
