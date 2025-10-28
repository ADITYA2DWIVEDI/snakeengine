import React, { useState } from 'react';
import { summarizeDocument } from '../../services/geminiService';
import { LogoIcon } from '../../constants';

// --- HELPER ICONS ---
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const Spinner = () => <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>;

const DocumentSummarizerTool: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ summary: string | null, error: string | null }>({ summary: null, error: null });

    const handleFileChange = (files: FileList | null) => {
        if (files && files[0]) {
            const file = files[0];
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setResult({ summary: null, error: "Please select a text file smaller than 5MB." });
                return;
            }
            if(file.type !== 'text/plain') {
                 setResult({ summary: null, error: "Please upload a valid .txt file." });
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                setFileContent(e.target?.result as string);
                setFileName(file.name);
                setResult({ summary: null, error: null });
            };
            reader.readAsText(file);
        }
    };
    
    const handleDragOver = (e: React.DragEvent) => e.preventDefault();
    const handleDrop = (e: React.DragEvent) => { e.preventDefault(); handleFileChange(e.dataTransfer.files); };

    const handleSummarize = async () => {
        if (!fileContent || isLoading) return;

        setIsLoading(true);
        setResult({ summary: null, error: null });
        const response = await summarizeDocument(fileContent);
        setResult(response);
        setIsLoading(false);
    };

    return (
        <div className="h-full flex flex-col p-4 md:p-8 bg-gray-100 dark:bg-gray-900">
            <div className="flex-shrink-0 mb-8"><button onClick={onBack} className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white font-medium"><BackIcon /><span className="ml-2">Back to Smart Studio</span></button></div>
            <div className="w-full max-w-4xl mx-auto flex-grow flex flex-col">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">AI Document Summarizer</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Get a concise summary of your text documents.</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <label 
                        htmlFor="file-upload" 
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onDragOver={handleDragOver} onDrop={handleDrop}>
                        <div className="text-center text-gray-500 dark:text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                            <p className="mt-2">{fileName || 'Drag & drop or click to upload'}</p>
                            <p className="text-xs mt-1">.txt files only, max 5MB</p>
                        </div>
                    </label>
                    <input id="file-upload" type="file" className="hidden" accept=".txt" onChange={(e) => handleFileChange(e.target.files)} />
                    <button onClick={handleSummarize} disabled={isLoading || !fileContent} className="w-full mt-4 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-400 text-white font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity">
                        {isLoading ? <Spinner /> : 'Summarize Document'}
                    </button>
                </div>

                <div className="mt-8 flex-grow">
                    {isLoading && <div className="flex justify-center items-center h-full"><div className="text-center text-gray-500 dark:text-gray-400"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div><p className="mt-4">Summarizing document...</p></div></div>}
                    {result.error && <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500/30 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg" role="alert"><strong className="font-bold">Error: </strong><span className="block sm:inline">{result.error}</span></div>}
                    {result.summary && (
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                             <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center">
                                   <LogoIcon className="h-5 w-5 text-white"/>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">Summary</h3>
                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{result.summary}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentSummarizerTool;