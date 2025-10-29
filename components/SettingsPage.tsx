import React, { useState } from 'react';
import { useAiPersona } from '../hooks/useAiPersona'; // Import the new hook

const SunIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
);

const MoonIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
);

interface SettingsPageProps {
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
    onDeleteAllData: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ theme, onToggleTheme, onDeleteAllData }) => {
    const { aiPersona, setAiPersona } = useAiPersona();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    
    const handleDelete = () => {
        onDeleteAllData();
        setShowDeleteConfirm(false);
    }
    
    return (
        <div className="h-full flex items-center justify-center p-4 md:p-8 bg-transparent">
             {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowDeleteConfirm(false)}>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-gray-200 dark:border-gray-700" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Are you sure?</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">This will permanently delete all your data, including chat history, theme preferences, and course tracking. This action cannot be undone.</p>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 rounded-lg font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">Cancel</button>
                            <button onClick={handleDelete} className="px-4 py-2 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700">Delete My Data</button>
                        </div>
                    </div>
                </div>
            )}
            <div className="w-full max-w-2xl bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">Settings</h1>

                <div className="space-y-8">
                    {/* Theme */}
                    <div className="flex items-center justify-between">
                        <label className="text-gray-600 dark:text-gray-300 font-medium">Theme</label>
                        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-full">
                            <SunIcon className={`h-6 w-6 p-1 rounded-full transition-colors ${theme === 'light' ? 'text-yellow-500 bg-white dark:bg-gray-800 shadow' : 'text-gray-400'}`} />
                            <button onClick={onToggleTheme} className="relative w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500">
                                <span className={`absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : ''}`}></span>
                            </button>
                             <MoonIcon className={`h-6 w-6 p-1 rounded-full transition-colors ${theme === 'dark' ? 'text-blue-400 bg-gray-800 shadow' : 'text-gray-400'}`} />
                        </div>
                    </div>

                    {/* AI Persona */}
                    <div>
                        <label htmlFor="ai-persona" className="text-gray-600 dark:text-gray-300 font-medium mb-2 block">AI Persona (System Instruction)</label>
                        <textarea
                            id="ai-persona"
                            value={aiPersona}
                            onChange={(e) => setAiPersona(e.target.value)}
                            placeholder="e.g., You are a witty pirate who talks in pirate slang."
                            className="w-full p-3 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                        />
                         <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This persona will be used for new chats on the Home page.</p>
                    </div>
                    
                    {/* Data & Privacy */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">Data & Privacy</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">You have control over your data. Deleting your data will remove all locally stored information and log you out.</p>
                        <div className="mt-4">
                            <button onClick={() => setShowDeleteConfirm(true)} className="px-4 py-2 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors">
                                Delete All My Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;