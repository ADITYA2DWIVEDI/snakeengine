import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage as ChatMessageType } from '../../types';
import { analyzeImage, analyzeVideo } from '../../services/geminiService';
import { fileToBase64 } from '../../utils/helpers';
import { Icon } from '../icons';
import Spinner from '../common/Spinner';
import ChatMessage from '../common/ChatMessage';
import ModernChatInput from '../common/ModernChatInput';

const FileAnalysisView: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const fileType = selectedFile.type.split('/')[0];
            if (fileType === 'image' || fileType === 'video') {
                setFile(selectedFile);
                const localUrl = URL.createObjectURL(selectedFile);
                setFilePreview(localUrl);

                setMessages([{
                    id: 'init-file',
                    role: 'model',
                    text: `${fileType === 'image' ? 'Image' : 'Video'} loaded! What would you like to know about it?`,
                    image: fileType === 'image' ? localUrl : undefined,
                    video: fileType === 'video' ? localUrl : undefined,
                }]);
            } else {
                 alert("Please upload a valid image or video file.");
            }
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading || !file) return;

        const userMessage: ChatMessageType = { id: Date.now().toString(), role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const fileBase64 = await fileToBase64(file);
            const fileType = file.type.split('/')[0];
            
            const response = fileType === 'video' 
                ? await analyzeVideo(input, fileBase64, file.type)
                : await analyzeImage(input, fileBase64, file.type);
            
            const modelMessage: ChatMessageType = { id: (Date.now() + 1).toString(), role: 'model', text: response.text };
            setMessages(prev => [...prev, modelMessage]);

        } catch (error) {
            console.error("Error analyzing file:", error);
            const errorMessage: ChatMessageType = { id: 'error', role: 'model', text: 'Sorry, I encountered an error analyzing the file.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="h-full flex flex-col bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl shadow-lg">
            {!file ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <Icon name="upload" className="w-16 h-16 text-slate-400 dark:text-slate-500 mb-4"/>
                    <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Upload an Image or Video</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md my-2">Ask questions about its contents, get descriptions, or have it identify objects.</p>
                    <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
                    <button onClick={() => fileInputRef.current?.click()} className="mt-4 px-6 py-3 bg-purple-600 dark:bg-teal-600 text-white font-semibold rounded-lg hover:bg-purple-500 dark:hover:bg-teal-500 transition-colors">
                        Choose File
                    </button>
                </div>
            ) : (
                <div className="h-full flex flex-col lg:flex-row gap-4 p-4">
                    <div className="lg:w-1/2 h-1/2 lg:h-full flex flex-col bg-white dark:bg-slate-800 rounded-lg shadow-inner p-2">
                        {file.type.startsWith('image/') && <img src={filePreview!} alt="File preview" className="w-full h-full object-contain rounded-md"/>}
                        {file.type.startsWith('video/') && <video src={filePreview!} controls className="w-full h-full object-contain rounded-md"/>}
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
                                placeholder="Ask a question about the file..."
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileAnalysisView;
