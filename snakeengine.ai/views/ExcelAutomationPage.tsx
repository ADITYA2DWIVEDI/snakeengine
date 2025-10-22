import React, { useState } from 'react';
import { ExcelIcon, SendIcon } from '../components/Icons';

export const ExcelAutomationPage: React.FC = () => {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [instructions, setInstructions] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadedFile(e.target.files[0]);
        }
    };

    return (
        <div className="flex flex-col h-full w-full p-4 md:p-8 overflow-y-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary">Advanced Excel Automation</h1>
                <p className="text-text-secondary mt-1">Let AI handle your spreadsheet tasks. From data cleaning to complex formulas.</p>
            </header>

            <div className="flex-1 flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/2 p-6 rounded-2xl glass-pane flex flex-col">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">1. Upload Your File</h2>
                    <div className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-border-color rounded-lg text-center">
                        <ExcelIcon className="w-12 h-12 text-text-secondary mb-4" />
                        {uploadedFile ? (
                            <div>
                                <p className="font-medium text-text-primary">{uploadedFile.name}</p>
                                <button onClick={() => setUploadedFile(null)} className="text-sm text-brand-red mt-2">Remove file</button>
                            </div>
                        ) : (
                            <div>
                                <label htmlFor="file-upload" className="cursor-pointer font-semibold text-brand-purple hover:text-brand-purple/80">
                                    <span>Choose a file</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".xls,.xlsx" />
                                </label>
                                <p className="text-xs text-text-secondary">or drag and drop</p>
                            </div>
                        )}
                        <p className="text-xs text-text-secondary mt-4">Max file size: 10MB</p>
                    </div>
                </div>

                <div className="lg:w-1/2 p-6 rounded-2xl glass-pane flex flex-col">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">2. Provide Instructions</h2>
                    <textarea
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        placeholder="e.g., 'Summarize the sales data by region', 'Find all duplicate rows in column B', 'Create a pivot table showing average profit by product category'"
                        className="flex-1 w-full p-3 bg-white rounded-lg border border-border-color focus:ring-2 focus:ring-brand-purple focus:outline-none transition resize-none text-text-primary placeholder:text-text-secondary"
                    />
                     <button
                        disabled={!uploadedFile || !instructions}
                        className="w-full flex items-center justify-center gap-2 mt-4 py-3 px-6 bg-brand-purple text-white font-semibold rounded-lg shadow-lg hover:bg-brand-purple/80 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow-purple"
                    >
                        Automate Now <SendIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};