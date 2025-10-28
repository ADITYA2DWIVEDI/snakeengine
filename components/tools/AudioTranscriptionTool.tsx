import React, { useState } from 'react';
import { transcribeAudio } from '../../services/geminiService';

// --- HELPER ICONS ---
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const Spinner = () => <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>;

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
    return { data: await base64EncodedDataPromise, mimeType: file.type };
};

interface AudioTranscriptionToolProps { onBack: () => void; }

const AudioTranscriptionTool: React.FC<AudioTranscriptionToolProps> = ({ onBack }) => {
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [transcription, setTranscription] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (files: FileList | null) => {
        if (files && files[0]) {
            setError(null);
            setTranscription(null);
            setAudioFile(files[0]);
        }
    };
    
    const handleDragOver = (e: React.DragEvent) => e.preventDefault();
    const handleDrop = (e: React.DragEvent) => { e.preventDefault(); handleFileChange(e.dataTransfer.files); };

    const handleTranscribe = async () => {
        if (!audioFile || isLoading) return;

        setIsLoading(true);
        setTranscription(null);
        setError(null);

        try {
            const audioPart = await fileToGenerativePart(audioFile);
            const result = await transcribeAudio(audioPart);
            if (result.startsWith("Sorry")) {
                setError(result);
            } else {
                setTranscription(result);
            }
        } catch(err) {
            setError("An unexpected error occurred during transcription.");
        }
        setIsLoading(false);
    };

    return (
        <div className="h-full flex flex-col p-4 md:p-8 bg-gray-50">
            <div className="flex-shrink-0 mb-8"><button onClick={onBack} className="flex items-center text-gray-500 hover:text-gray-800 font-medium"><BackIcon /><span className="ml-2">Back to Smart Studio</span></button></div>
            <div className="w-full max-w-4xl mx-auto flex-grow flex flex-col">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Audio Transcription</h1>
                    <p className="text-gray-500 mt-2">Convert speech from an audio file into text.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <label 
                        htmlFor="file-upload" 
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                        onDragOver={handleDragOver} onDrop={handleDrop}>
                        <div className="text-center text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                            <p className="mt-2">{audioFile ? audioFile.name : 'Drag & drop or click to upload audio'}</p>
                            <p className="text-xs mt-1">MP3, WAV, M4A, etc.</p>
                        </div>
                    </label>
                    <input id="file-upload" type="file" className="hidden" accept="audio/*" onChange={(e) => handleFileChange(e.target.files)} />
                    <button onClick={handleTranscribe} disabled={isLoading || !audioFile} className="w-full mt-4 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-400 text-white font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity">
                        {isLoading ? <Spinner /> : 'Transcribe Audio'}
                    </button>
                </div>

                <div className="mt-8 flex-grow">
                    {isLoading && <div className="flex justify-center items-center h-full"><div className="text-center text-gray-500"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div><p className="mt-4">Transcribing audio...</p></div></div>}
                    {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert"><strong className="font-bold">Error: </strong><span className="block sm:inline">{error}</span></div>}
                    {transcription && (
                        <div className="bg-white p-6 rounded-2xl shadow-lg">
                            <h3 className="font-semibold text-lg text-gray-800 mb-4">Transcription Result</h3>
                            <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">{transcription}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AudioTranscriptionTool;
