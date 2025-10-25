import React, { useState, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Icon } from '../../../icons';
import Spinner from '../../../common/Spinner';
import { fileToBase64 } from '../../../../utils/helpers';

type RecordingState = 'idle' | 'recording' | 'transcribing' | 'finished';

const AudioTranscriptionView: React.FC = () => {
    const [recordingState, setRecordingState] = useState<RecordingState>('idle');
    const [transcript, setTranscript] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const handleStartRecording = async () => {
        if (recordingState === 'recording') return;
        setTranscript('');
        setError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };
            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                audioChunksRef.current = [];
                stream.getTracks().forEach(track => track.stop());
                await transcribeAudio(audioBlob);
            };
            audioChunksRef.current = [];
            mediaRecorderRef.current.start();
            setRecordingState('recording');
        } catch (err) {
            console.error("Error accessing microphone:", err);
            setError("Could not access microphone. Please check your browser permissions.");
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && recordingState === 'recording') {
            mediaRecorderRef.current.stop();
            setRecordingState('transcribing');
        }
    };

    const transcribeAudio = async (audioBlob: Blob) => {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const audioBase64 = await fileToBase64(audioBlob as File);
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: {
                    parts: [
                        { text: "Transcribe the following audio recording." },
                        { inlineData: { mimeType: audioBlob.type, data: audioBase64 } }
                    ]
                }
            });
            
            setTranscript(response.text);
            setRecordingState('finished');
        } catch (e: any) {
            console.error("Transcription error:", e);
            setError(`Failed to transcribe audio: ${e.message}`);
            setRecordingState('idle');
        }
    };
    
    const reset = () => {
        setRecordingState('idle');
        setTranscript('');
        setError(null);
    }

    const renderButton = () => {
        switch(recordingState){
            case 'recording':
                return (
                    <button onClick={handleStopRecording} className="w-24 h-24 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-lg hover:bg-red-600 transition-all">
                        Stop
                    </button>
                );
            case 'transcribing':
                return (
                    <div className="w-24 h-24 bg-slate-500 text-white rounded-full flex items-center justify-center">
                       <Spinner />
                    </div>
                );
            case 'finished':
                 return (
                    <button onClick={reset} className="w-24 h-24 bg-slate-500 text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-lg hover:bg-slate-600 transition-all">
                        Reset
                    </button>
                );
            case 'idle':
            default:
                 return (
                    <button onClick={handleStartRecording} className="w-24 h-24 bg-purple-600 dark:bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-lg hover:bg-purple-500 dark:hover:bg-teal-600 transition-all">
                        Record
                    </button>
                );
        }
    }

    return (
        <div className="h-full flex flex-col bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl shadow-lg p-6">
            <div className="flex-1 flex flex-col items-center justify-center gap-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Audio Transcription</h2>
                    <p className="text-slate-500 dark:text-slate-400">Click record to start, and stop when you're done.</p>
                </div>
                <div className="relative">
                    {recordingState === 'recording' && <div className="absolute inset-0 -m-3 bg-red-500/30 rounded-full animate-pulse"></div>}
                    {renderButton()}
                </div>
                 {error && <p className="text-red-500 text-center">{error}</p>}
            </div>

            <div className="h-1/3 min-h-[150px] bg-white dark:bg-slate-800 rounded-xl p-4 shadow-inner">
                 <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Transcript:</h3>
                <div className="h-full overflow-y-auto text-slate-600 dark:text-slate-300 text-sm">
                    {recordingState === 'transcribing' && <p>Transcribing audio...</p>}
                    {transcript ? <p className="whitespace-pre-wrap">{transcript}</p> : (recordingState !== 'transcribing' && <p>Your transcript will appear here.</p>)}
                </div>
            </div>
        </div>
    );
};

export default AudioTranscriptionView;
