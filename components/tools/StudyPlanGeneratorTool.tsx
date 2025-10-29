import React, { useState } from 'react';
import { generateStudyPlan } from '../../services/geminiService';
import { courseData } from '../../courseData';
import { BookOpenIcon } from '../../constants';
import { Course } from '../../types';

const Spinner = () => <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>;

interface StudyPlan {
    planTitle: string;
    weeklyPlan: {
        week: number;
        title: string;
        courses: {
            courseId: number;
            justification: string;
        }[];
    }[];
}

interface ToolProps { onBack: () => void; }

const StudyPlanGeneratorTool: React.FC<ToolProps> = ({ onBack }) => {
    const [goal, setGoal] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ plan: StudyPlan | null, error: string | null }>({ plan: null, error: null });

    const handleGenerate = async () => {
        if (!goal.trim() || isLoading) return;
        setIsLoading(true);
        setResult({ plan: null, error: null });
        const response = await generateStudyPlan(goal, courseData.courses);
        setResult(response);
        setIsLoading(false);
    };
    
    const getCourseById = (id: number): Course | undefined => {
        return courseData.courses.find(c => c.id === id);
    }

    return (
        <div className="h-full flex flex-col p-4 md:p-8 bg-transparent overflow-y-auto">
            <div className="w-full max-w-4xl mx-auto flex-grow flex flex-col">
                 <button onClick={onBack} className="self-start mb-4 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Back to Smart Studio
                </button>
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">AI Study Plan Generator</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Describe your learning goal and get a custom study plan.</p>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <textarea value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g., Become a frontend developer in 3 months" className="w-full p-3 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 transition" disabled={isLoading}/>
                    <div className="mt-4 flex justify-end">
                        <button onClick={handleGenerate} disabled={isLoading || !goal.trim()} className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-400 text-white font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity">
                            {isLoading ? <Spinner /> : 'Generate Plan'}
                        </button>
                    </div>
                </div>

                <div className="mt-8 flex-grow">
                    {isLoading && <div className="flex justify-center items-center h-full"><div className="text-center text-gray-500 dark:text-gray-400"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div><p className="mt-4">Generating your personalized plan...</p></div></div>}
                    {result.error && <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500/30 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg" role="alert"><strong className="font-bold">Error: </strong><span className="block sm:inline">{result.error}</span></div>}
                    {result.plan && (
                        <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                             <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">{result.plan.planTitle}</h2>
                             <div className="space-y-6">
                                {result.plan.weeklyPlan.map(week => (
                                    <div key={week.week} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <h3 className="font-bold text-lg text-purple-600 dark:text-purple-400">Week {week.week}: {week.title}</h3>
                                        <div className="mt-4 space-y-3">
                                            {week.courses.map(({ courseId, justification }) => {
                                                const course = getCourseById(courseId);
                                                return course ? (
                                                    <div key={courseId} className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                                                        <BookOpenIcon className="h-6 w-6 text-gray-400 mt-1"/>
                                                        <div>
                                                            <h4 className="font-semibold text-gray-800 dark:text-gray-200">{course.title}</h4>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{justification}"</p>
                                                        </div>
                                                    </div>
                                                ) : null;
                                            })}
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudyPlanGeneratorTool;