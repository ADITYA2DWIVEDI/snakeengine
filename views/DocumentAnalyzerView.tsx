import React, { useState } from 'react';
import { DocumentIcon, SendIcon } from '../components/Icons';
import { analyzeDocument } from '../services/geminiService';

export const DocumentAnalyzerView: React.FC = () => {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [documentText, setDocumentText] = useState<string>('');
    const [question, setQuestion] = useState('');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setUploadedFile(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setDocumentText(event.target?.result as string);
            };
            reader.readAsText(file);
        }
    };
    
    const handleSubmit = async () => {
        if (!documentText || !question) return;
        setIsLoading(true);
        setResult('');
        try {
            const response = await analyzeDocument(question, documentText);
            setResult(response);
        } catch (error) {
            console.error(error);
            setResult("An error occurred while analyzing the document.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full p-4 md:p-8 overflow-y-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary">AI Document Analyzer</h1>
                <p className="text-text-secondary mt-1">Upload a document and ask questions about its content.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
                <div className="space-y-6 flex flex-col">
                    <div className="p-6 rounded-2xl glass-pane">
                        <h2 className="text-lg font-semibold text-text-primary mb-4">1. Upload Document</h2>
                        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border-color rounded-lg text-center">
                            <DocumentIcon className="w-12 h-12 text-text-secondary mb-4" />
                            {uploadedFile ? (
                                <div>
                                    <p className="font-medium text-text-primary">{uploadedFile.name}</p>
                                    <button onClick={() => { setUploadedFile(null); setDocumentText(''); }} className="text-sm text-brand-red mt-2">Remove file</button>
                                </div>
                            ) : (
                                <div>
                                    <label htmlFor="doc-upload" className="cursor-pointer font-semibold text-brand-purple hover:text-brand-purple/80">
                                        <span>Choose a file</span>
                                        <input id="doc-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".txt" />
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="p-6 rounded-2xl glass-pane flex-1 flex flex-col">
                        <h2 className="text-lg font-semibold text-text-primary mb-4">2. Ask a Question</h2>
                        <textarea
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="flex-1 w-full p-3 bg-white rounded-lg border border-border-color focus:ring-2 focus:ring-brand-purple focus:outline-none transition resize-none text-text-primary placeholder:text-text-secondary"
                            placeholder="e.g., 'What are the main conclusions of this report?' or 'Summarize the second paragraph.'"
                        />
                         <button onClick={handleSubmit} disabled={!documentText || !question || isLoading} className="w-full flex items-center justify-center gap-2 mt-4 py-3 px-6 bg-brand-purple text-white font-semibold rounded-lg shadow-lg hover:bg-brand-purple/80 transition-all disabled:opacity-50 hover:shadow-glow-purple">
                            {isLoading ? 'Analyzing...' : 'Get Answer'} <SendIcon />
                        </button>
                    </div>
                </div>
                
                <div className="p-6 rounded-2xl glass-pane bg-bg-secondary/50 flex flex-col">
                     <h2 className="text-lg font-semibold text-text-primary mb-4">Answer</h2>
                     <div className="flex-1 w-full p-3 bg-white rounded-lg border border-border-color whitespace-pre-wrap overflow-y-auto text-text-secondary">
                        {isLoading ? <span className="text-slate-400">AI is reading your document...</span> : result || <span className="text-slate-500">Your answer will appear here.</span>}
                     </div>
                </div>
            </div>
        </div>
    );
};