import React from 'react';
import { Feature, AspectRatio } from '../../../../types';
import { Icon } from '../../../icons';
import { generateImage } from '../../../../services/geminiService';
import Spinner from '../../../common/Spinner';

const imageStyles = ["Default", "Cinematic", "Photorealistic", "Cyberpunk", "Fantasy", "Anime", "Game Asset", "Pixel Art", "Minimalist"];
const aspectRatios: AspectRatio[] = ["1:1", "16:9", "9:16", "4:3", "3:4"];

const ImageGenerationView: React.FC = () => {
    const [prompt, setPrompt] = React.useState('');
    const [style, setStyle] = React.useState('Default');
    const [aspectRatio, setAspectRatio] = React.useState<AspectRatio>('1:1');
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = React.useState<string | null>(null);

    const handleGenerate = async () => {
        const fullPrompt = style === 'Default' ? prompt : `${prompt}, in a ${style.toLowerCase()} style`;
        if (!prompt.trim()) {
            setError('Please enter a prompt to generate an image.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const base64Image = await generateImage(fullPrompt, aspectRatio);
            setGeneratedImage(`data:image/png;base64,${base64Image}`);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col md:flex-row gap-6">
            {/* Left Panel: Controls */}
            <div className="w-full md:w-1/3 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6">
                <div>
                    <label htmlFor="prompt" className="block text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Prompt</label>
                    <textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., A majestic lion wearing a crown, photorealistic..."
                        rows={5}
                        className="w-full bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                <div>
                    <label htmlFor="style" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Style</label>
                    <select id="style" value={style} onChange={(e) => setStyle(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                        {imageStyles.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                
                <div>
                     <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Aspect Ratio</label>
                     <div className="grid grid-cols-5 gap-2">
                        {aspectRatios.map(ar => (
                            <button key={ar} onClick={() => setAspectRatio(ar)} className={`py-2 text-sm font-semibold rounded-md transition-colors ${aspectRatio === ar ? 'bg-purple-600 dark:bg-teal-500 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>
                                {ar}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1" />

                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full py-3 bg-purple-600 dark:bg-teal-600 text-white font-semibold rounded-lg hover:bg-purple-500 dark:hover:bg-teal-500 transition-colors disabled:bg-slate-400 flex items-center justify-center gap-2"
                >
                    {isLoading ? <Spinner /> : <Icon name={Feature.IMAGE_GENERATION} className="w-5 h-5" />}
                    {isLoading ? 'Generating...' : 'Generate Image'}
                </button>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            {/* Right Panel: Image Display */}
            <div className="flex-1 flex items-center justify-center bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl shadow-lg p-4">
                {isLoading ? (
                    <div className="text-center">
                        <Spinner />
                        <p className="mt-2 text-slate-500 dark:text-slate-400">Generating your masterpiece...</p>
                    </div>
                ) : generatedImage ? (
                    <img src={generatedImage} alt="Generated" className="max-w-full max-h-full object-contain rounded-lg shadow-xl" />
                ) : (
                    <div className="text-center text-slate-400">
                        <Icon name="photo" className="w-16 h-16 mx-auto" />
                        <p>Your generated image will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageGenerationView;
