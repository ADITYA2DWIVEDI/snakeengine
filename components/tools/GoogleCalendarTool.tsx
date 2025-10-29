import React, { useState } from 'react';
import { createCalendarEventDetails } from '../../services/geminiService';
import { CalendarIcon } from '../../constants';

const Spinner = () => <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>;

const GoogleCalendarTool: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ event: { title: string, description: string, attendees: string[] } | null, error: string | null }>({ event: null, error: null });

    const handleGenerate = async () => {
        if (!prompt.trim() || isLoading) return;
        setIsLoading(true);
        setResult({ event: null, error: null });
        const response = await createCalendarEventDetails(prompt);
        setResult(response);
        setIsLoading(false);
    };

    return (
        <div className="h-full flex flex-col p-4 md:p-8 bg-transparent">
            <div className="w-full max-w-4xl mx-auto flex-grow flex flex-col">
                <div className="text-center mb-8">
                    <CalendarIcon className="h-12 w-12 mx-auto" />
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mt-2">Calendar Assistant</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Generate event details from a simple description.</p>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe your event... e.g., 'Schedule a team meeting for tomorrow at 4 PM to discuss the project launch with Aditya and Rashish.'" className="w-full p-3 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    <div className="mt-4 flex justify-end">
                        <button onClick={handleGenerate} disabled={isLoading || !prompt.trim()} className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-400 text-white font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90">
                            {isLoading ? <Spinner /> : 'Create Event Details'}
                        </button>
                    </div>
                </div>

                <div className="mt-8 flex-grow">
                     {result.error && <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500/30 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg" role="alert"><strong className="font-bold">Error: </strong><span className="block sm:inline">{result.error}</span></div>}
                    {result.event && (
                        <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Suggested Event</h2>
                            <div className="space-y-4">
                               <div>
                                    <h3 className="font-semibold text-gray-600 dark:text-gray-400">Title:</h3>
                                    <p className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md mt-1 text-gray-800 dark:text-gray-200">{result.event.title}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-600 dark:text-gray-400">Description:</h3>
                                    <p className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md mt-1 whitespace-pre-wrap text-gray-800 dark:text-gray-200">{result.event.description}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-600 dark:text-gray-400">Suggested Attendees:</h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {result.event.attendees.map((name, i) => (
                                            <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 text-sm font-medium rounded-full">{name}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GoogleCalendarTool;
