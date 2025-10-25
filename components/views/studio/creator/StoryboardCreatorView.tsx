import React from 'react';
import { generatePrompt, generateImage } from '../../../../services/geminiService';
import { Type } from '@google/genai';
import { Icon } from '../../../icons';
import Spinner from '../../../common/Spinner';

interface Scene {
    description: string;
    imagePrompt: string;
}

const StoryboardCreatorView: React.FC = () => {
    const [idea, setIdea] = React.useState('');
    const [scenes, setScenes] = React.useState<Scene[]>([]);
    const [images, setImages] = React.useState<string[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [generationStep, setGenerationStep] = React.useState('');
    const [error, setError] = React.useState<string | null>(null);

    const handleGenerate = async () => {
        if (!idea.trim()) {
            setError('Please enter a story idea.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setScenes([]);
        setImages([]);

        try {
            setGenerationStep('Generating scene descriptions...');
            const scenesResponse = await generatePrompt({
                model: 'gemini-2.5-pro',
                prompt: `Based on the following story idea, generate a storyboard with 4 scenes. For each scene, provide a brief "description" of the action and a detailed "imagePrompt" for an AI image generator to create a visual representation. The style should be cinematic. Story Idea: "${idea}"`,
                generationConfig: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            storyboard: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        description: { type: Type.STRING },
                                        imagePrompt: { type: Type.STRING }
                                    },
                                    required: ['description', 'imagePrompt']
                                }
                            }
                        }
                    }
                }
            });
            const parsedScenes = JSON.parse(scenesResponse.text).storyboard as Scene[];
            setScenes(parsedScenes);

            const generatedImages: string[] = [];
            for (let i = 0; i < parsedScenes.length; i++) {
                setGenerationStep(`Generating image for scene ${i + 1}/${parsedScenes.length}...`);
                const imageBase64 = await generateImage(parsedScenes[i].imagePrompt, '16:9');
                generatedImages.push(`data:image/png;base64,${imageBase64}`);
                setImages([...generatedImages]);
            }

        } catch (e: any) {
            setError(`An error occurred: ${e.message}`);
        } finally {
            setIsLoading(false);
            setGenerationStep('');
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex-shrink-0">
                <div className="w-full bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md flex items-center gap-4 mb-6">
                    <input
                        type="text"
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        placeholder="Enter a story idea to visualize..."
                        className="w-full bg-slate-100 dark:bg-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="px-6 py-3 bg-purple-600 dark:bg-teal-600 text-white font-semibold rounded-lg hover:bg-purple-500 disabled:bg-slate-400 flex items-center gap-2"
                    >
                        {isLoading ? <Spinner /> : <Icon name="brain" className="w-5 h-5"/>}
                        {isLoading ? 'Creating...' : 'Create Storyboard'}
                    </button>
                </div>
                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl shadow-lg p-6">
                {isLoading ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <Spinner />
                        <p className="mt-4 text-slate-500 dark:text-slate-400">{generationStep}</p>
                    </div>
                ) : scenes.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center">
                        <Icon name="grid" className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>Your storyboard will appear here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                        {scenes.map((scene, index) => (
                            <div key={index} className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
                                <div className="aspect-video bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                    {images[index] ? <img src={images[index]} alt={`Scene ${index + 1}`} className="w-full h-full object-cover"/> : <Spinner />}
                                </div>
                                <div className="p-4">
                                    <p className="text-sm text-slate-600 dark:text-slate-300">{scene.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StoryboardCreatorView;
