import React, { useState, useRef, useEffect } from 'react';
import { Page, ChatMessage as ChatMessageType, Feature } from '../../types';
import { Icon } from '../icons';
import { analyzeSpreadsheet, convertNumberToWords, generatePdfExtractionGuide } from '../../services/geminiService';
import ChatMessage from '../common/ChatMessage';
import Spinner from '../common/Spinner';
import ModernChatInput from '../common/ModernChatInput';

type ExcelTool = 'copilot' | 'numberToWords' | 'pdfExtractor';

const sampleProjectPlan = `Task,Assignee,Status,Deadline
"Design Mockups","Alice","Completed","2023-10-15"
"Develop Frontend","Bob","In Progress","2023-11-05"
"Develop Backend","Charlie","In Progress","2023-11-10"
"User Testing","Alice","Not Started","2023-11-15"
"Deployment","Bob","Not Started","2023-11-20"`;

const sampleBudget = `Category,Allocated,Spent,Remaining
"Marketing","$5,000","$3,500","$1,500"
"Software","$2,000","$2,200","-$200"
"Hardware","$3,000","$1,500","$1,500"
"Salaries","$10,000","$10,000","$0"`;

// Sub-component for Spreadsheet Co-Pilot
const SpreadsheetCoPilotView: React.FC = () => {
    const [data, setData] = useState<string[][] | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const parseCSV = (csv: string): string[][] => {
        const rows = csv.split('\n');
        return rows.map(row => {
            const result: string[] = [];
            let current = '';
            let inQuotes = false;
            for (let i = 0; i < row.length; i++) {
                const char = row[i];
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    result.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }
            result.push(current.trim());
            return result;
        });
    };

    const loadData = (csv: string, name: string) => {
        const parsedData = parseCSV(csv);
        setData(parsedData);
        setFileName(name);
        setMessages([{
            id: 'init',
            role: 'model',
            text: `Loaded "${name}". I'm ready to help you analyze this data. What would you like to know?`,
        }]);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result as string;
                loadData(text, file.name);
            };
            reader.readAsText(file);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading || !data) return;

        const userMessage: ChatMessageType = { id: Date.now().toString(), role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const csvString = data.map(row => row.join(',')).join('\n');
            const response = await analyzeSpreadsheet(currentInput, csvString);
            const modelMessage: ChatMessageType = { id: (Date.now() + 1).toString(), role: 'model', text: response.text };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("Error analyzing spreadsheet:", error);
            setMessages(prev => [...prev, { id: 'error', role: 'model', text: 'Sorry, I encountered an error analyzing the data.' }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!data) {
        return (
            <div className="flex items-center justify-center h-full animate-fade-in">
                <div className="text-center bg-white dark:bg-slate-800 p-10 rounded-2xl shadow-xl max-w-md w-full">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-100 to-teal-100 dark:from-purple-900/50 dark:to-teal-900/50 flex items-center justify-center mb-6">
                        <Icon name="grid" className="w-10 h-10 text-purple-600 dark:text-teal-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Spreadsheet Co-Pilot</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 mb-8">Upload a CSV file or start with a template to begin analyzing your data.</p>
                    <div className="space-y-3">
                         <input type="file" accept=".csv" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
                        <button onClick={() => fileInputRef.current?.click()} className="w-full py-3 px-4 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                            Upload Spreadsheet
                        </button>
                        <button onClick={() => loadData(sampleProjectPlan, "Sample Project Plan.csv")} className="w-full py-3 px-4 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                            Load Sample Project Plan
                        </button>
                        <button onClick={() => loadData(sampleBudget, "Sample Budget.csv")} className="w-full py-3 px-4 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                            Load Sample Budget
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl shadow-lg animate-fade-in">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button onClick={() => setData(null)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                        <Icon name="back-arrow" className="w-5 h-5" />
                    </button>
                    <h2 className="font-semibold">{fileName}</h2>
                </div>
            </div>
            <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 overflow-hidden">
                <div className="lg:w-1/2 h-1/2 lg:h-full bg-white dark:bg-slate-800 rounded-lg shadow-inner overflow-auto">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-100 dark:bg-slate-700 sticky top-0">
                            <tr>
                                {data[0].map((header, i) => <th key={i} className="px-6 py-3">{header}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {data.slice(1).map((row, i) => (
                                <tr key={i} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
                                    {row.map((cell, j) => <td key={j} className="px-6 py-4">{cell}</td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="lg:w-1/2 h-1/2 lg:h-full flex flex-col bg-slate-100/50 dark:bg-slate-900/50 rounded-lg">
                    <div className="flex-1 p-4 overflow-y-auto">
                        {messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
                        {isLoading && (
                            <div className="flex justify-start gap-4 my-4">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-teal-500 flex-shrink-0 flex items-center justify-center">
                                    <Icon name="logo" className="w-5 h-5 text-white" />
                                </div>
                                <div className="bg-white dark:bg-slate-700 p-4 rounded-xl flex items-center shadow-sm">
                                   <Spinner />
                                   <span className="ml-3 text-slate-500 dark:text-slate-400">Analyzing...</span>
                                </div>
                            </div>
                        )}
                         <div ref={messagesEndRef} />
                    </div>
                     <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                        <ModernChatInput 
                            input={input}
                            setInput={setInput}
                            handleSend={handleSend}
                            isLoading={isLoading}
                            placeholder="Ask about the data..."
                        />
                     </div>
                </div>
            </div>
        </div>
    );
}

// Sub-component for Number to Words
const NumberToWordsView: React.FC = () => {
    const [inputNumber, setInputNumber] = useState('');
    const [resultText, setResultText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleConvert = async () => {
        if (!inputNumber.trim()) {
            setError('Please enter a number.');
            return;
        }
        setIsLoading(true);
        setError('');
        setResultText('');
        try {
            const response = await convertNumberToWords(inputNumber);
            setResultText(response.text);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="p-6 h-full flex items-center justify-center animate-fade-in">
             <div className="w-full max-w-lg bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl">
                 <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Number to Words Converter</h2>
                 <p className="text-slate-500 dark:text-slate-400 mb-6">Enter a number to convert it into its word representation, perfect for checks or documents.</p>
                 <div className="flex items-center gap-2">
                     <input type="number" step="any" value={inputNumber} onChange={e => setInputNumber(e.target.value)} placeholder="e.g., 1234.56" className="w-full bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-md p-3 focus:ring-purple-500"/>
                     <button onClick={handleConvert} disabled={isLoading} className="px-5 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-500 disabled:bg-slate-400 flex items-center justify-center">
                         {isLoading ? <Spinner/> : 'Convert'}
                     </button>
                 </div>
                 {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                 {resultText && (
                     <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                         <p className="font-mono text-lg text-purple-700 dark:text-teal-300">{resultText}</p>
                     </div>
                 )}
             </div>
        </div>
    );
}

// Sub-component for PDF Extractor
const PdfExtractorView: React.FC = () => {
    const [description, setDescription] = useState('');
    const [result, setResult] = useState<{guide: string, vbaMacro: string} | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

     const handleGenerate = async () => {
        if (!description.trim()) {
            setError('Please describe the data you want to extract.');
            return;
        }
        setIsLoading(true);
        setError('');
        setResult(null);
        try {
            const response = await generatePdfExtractionGuide(description);
            setResult(JSON.parse(response.text));
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="p-6 h-full flex flex-col animate-fade-in">
             <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">PDF Data Extractor Guide</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-2xl mx-auto">Describe the data you need from a PDF, and the AI will generate a step-by-step guide and a VBA macro to help you extract it in Excel.</p>
            </div>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g., The total sales from the summary table on page 3" rows={3} className="w-full bg-white dark:bg-slate-800 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg"></textarea>
            <button onClick={handleGenerate} disabled={isLoading} className="mt-4 mx-auto px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-500 disabled:bg-slate-400 flex items-center justify-center gap-2">
                {isLoading ? <Spinner/> : <Icon name="brain" className="w-5 h-5"/>}
                {isLoading ? 'Generating Guide...' : 'Generate Guide'}
            </button>
             {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

             <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 overflow-hidden">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg overflow-y-auto">
                    <h3 className="font-bold text-lg mb-2">Step-by-Step Guide</h3>
                    {result?.guide ? <div className="prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{__html: result.guide.replace(/\n/g, '<br/>')}}/> : <p className="text-slate-400 text-sm">Your guide will appear here.</p>}
                </div>
                 <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg overflow-y-auto">
                    <h3 className="font-bold text-lg mb-2">VBA Macro</h3>
                    {result?.vbaMacro ? <pre className="text-xs bg-slate-100 dark:bg-slate-700/50 p-3 rounded-md overflow-x-auto"><code>{result.vbaMacro}</code></pre> : <p className="text-slate-400 text-sm">Your macro will appear here.</p>}
                </div>
             </div>
        </div>
    );
}

// Main View Component
const ExcelAutomationView: React.FC = () => {
    const [activeTool, setActiveTool] = useState<ExcelTool>('copilot');

    const tools: { id: ExcelTool, name: string, icon: Page | Feature, description: string }[] = [
        { id: 'copilot', name: 'Spreadsheet Co-Pilot', icon: Page.EXCEL_AUTOMATION, description: 'Analyze CSV data with AI chat.' },
        { id: 'numberToWords', name: 'Number to Words', icon: Feature.EXCEL_NUMBER_TO_WORDS, description: 'Convert numbers to text.' },
        { id: 'pdfExtractor', name: 'PDF Data Extractor', icon: Feature.EXCEL_PDF_EXTRACTOR, description: 'Get guides to extract data from PDFs.' },
    ];

    const renderActiveTool = () => {
        switch(activeTool) {
            case 'copilot': return <SpreadsheetCoPilotView />;
            case 'numberToWords': return <NumberToWordsView />;
            case 'pdfExtractor': return <PdfExtractorView />;
            default: return <SpreadsheetCoPilotView />;
        }
    };

    return (
        <div className="h-full flex flex-col md:flex-row gap-6">
            <aside className="w-full md:w-64 flex-shrink-0 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-lg">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 p-2">Excel Tools</h2>
                <nav className="space-y-2">
                    {tools.map(tool => (
                        <button 
                            key={tool.id} 
                            onClick={() => setActiveTool(tool.id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 text-sm font-medium ${
                                activeTool === tool.id
                                ? 'bg-gradient-to-r from-purple-500 to-teal-500 text-white shadow-md'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                        >
                            <Icon name={tool.icon} className="w-5 h-5 flex-shrink-0"/>
                            <span>{tool.name}</span>
                        </button>
                    ))}
                </nav>
            </aside>
            <main className="flex-1 min-h-0">
                {renderActiveTool()}
            </main>
        </div>
    );
};

export default ExcelAutomationView;