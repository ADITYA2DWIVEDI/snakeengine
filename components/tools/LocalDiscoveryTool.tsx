import React, { useState, useEffect } from 'react';
import { generateMapsResponse } from '../../services/geminiService';
import { LogoIcon } from '../../constants';

const Spinner = () => <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>;

const LocalDiscoveryTool: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [result, setResult] = useState<{ text: string; places: any[] } | null>(null);

    useEffect(() => {
        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
                setLocationError(null);
                setIsLoading(false);
            },
            (error) => {
                setLocationError(`Could not get location: ${error.message}. Please allow location access and refresh.`);
                setIsLoading(false);
            }
        );
    }, []);

    const handleSearch = async () => {
        if (!prompt.trim() || !location || isLoading) return;
        setIsLoading(true);
        setResult(null);
        const response = await generateMapsResponse(prompt, location);
        setResult(response);
        setIsLoading(false);
    };

    return (
        <div className="h-full flex flex-col p-4 md:p-8 bg-transparent">
            <div className="w-full max-w-4xl mx-auto flex-grow flex flex-col">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Local Discovery</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Find places and get location-aware info grounded in Google Maps.</p>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                    {locationError && <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500/30 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-4" role="alert">{locationError}</div>}
                    <div className="flex items-center gap-4">
                        <input value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} placeholder="e.g., Good cafes near me with Wi-Fi" className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 transition" disabled={isLoading || !!locationError} />
                        <button onClick={handleSearch} disabled={isLoading || !prompt.trim() || !!locationError} className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-400 text-white font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity">
                            {isLoading ? <Spinner /> : 'Discover'}
                        </button>
                    </div>
                </div>

                <div className="mt-8 flex-grow">
                    {isLoading && <div className="flex justify-center items-center h-full"><div className="text-center text-gray-500 dark:text-gray-400"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div><p className="mt-4">Discovering...</p></div></div>}
                    {result && (
                        <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                             <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center">
                                   <LogoIcon className="h-5 w-5 text-white"/>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap flex-1">{result.text}</p>
                            </div>
                            {result.places && result.places.length > 0 && (
                                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <h4 className="font-semibold text-gray-600 dark:text-gray-400 mb-2">Places Mentioned:</h4>
                                    <ul className="space-y-2">
                                        {result.places.map((place, i) => place && (
                                            <li key={i} className="text-sm">
                                                <a href={place.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">{place.title}</a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LocalDiscoveryTool;