import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage as ChatMessageType } from '../../../../types';
import { analyzeVideo } from '../../../../services/geminiService';
import { fileToBase64 } from '../../../../utils/helpers';
import { Icon } from '../../../icons';
import ChatMessage from '../../../common/ChatMessage';
import ModernChatInput from '../../../common/ModernChatInput';
import Spinner from '../../../common/Spinner';

const VideoAnalysisView: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const videoFileRef = useRef<HTMLVideoElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('video/')) {
            setVideoFile(file);
            setMessages([{
                id: 'init-vid',
                role: 'model',
                text: "Video loaded! What would you like to know about it? Ask me for a summary, to find key moments, or transcribe spoken content.",
            }]);
            if (videoFileRef.current) {
                videoFileRef.current.src = URL.createObjectURL(file);
            }
        } else {
            alert("Please upload a valid video file.");
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading || !videoFile) return;

        const userMessage: ChatMessageType = { id: Date.now().toString(), role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const videoBase64 = await fileToBase64(videoFile);
            const response = await analyzeVideo(input, videoBase64, videoFile.type);
            
            const modelMessage: ChatMessageType = { id: (Date.now() + 1).toString(), role: 'model', text: response.text };
            setMessages(prev => [...prev, modelMessage]);

        } catch (error: any) {
            console.error("Error analyzing video:", error);
            const errorMessage: ChatMessageType = { id: (Date.now() + 1).toString(), role: 'model', text: `Sorry, I encountered an error: ${error.message}` };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="h-full flex flex-col bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl shadow-lg">
            {!videoFile ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <Icon name="upload" className="w-16 h-16 text-slate-400 dark:text-slate-500 mb-4"/>
                    <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Upload a Video to Analyze</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md my-2">Powered by Gemini 2.5 Pro for deep video understanding.</p>
                    <input type="file" accept="video/*" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
                    <button onClick={() => fileInputRef.current?.click()} className="mt-4 px-6 py-3 bg-purple-600 dark:bg-teal-600 text-white font-semibold rounded-lg hover:bg-purple-500 dark:hover:bg-teal-500 transition-colors">
                        Choose Video
                    </button>
                </div>
            ) : (
                <div className="h-full flex flex-col lg:flex-row gap-4 p-4">
                    <div className="lg:w-1/2 h-1/2 lg:h-full flex flex-col bg-white dark:bg-slate-800 rounded-lg shadow-inner p-2">
                        <video ref={videoFileRef} controls className="w-full h-full object-contain rounded-md" src={URL.createObjectURL(videoFile)} />
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
                                       <span className="ml-3 text-slate-500 dark:text-slate-400">Analyzing video...</span>
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
                                placeholder="Ask a question about the video..."
                                showAttachButton={false}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoAnalysisView;