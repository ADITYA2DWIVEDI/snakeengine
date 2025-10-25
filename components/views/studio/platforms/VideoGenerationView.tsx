import React from 'react';
import { useVeoGenerator } from '../../../../hooks/useVeoGenerator';
import { fileToBase64 } from '../../../../utils/helpers';
import { Icon } from '../../../icons';
import Spinner from '../../../common/Spinner';

const VideoGenerationView: React.FC = () => {
    const [prompt, setPrompt] = React.useState('');
    const [imageFile, setImageFile] = React.useState<File | null>(null);
    const [imagePreview, setImagePreview] = React.useState<string | null>(null);
    const [aspectRatio, setAspectRatio] = React.useState<'16:9' | '9:16'>('16:9');
    
    const { isGenerating, videoUrl, error, progressMessage, generateVideo, isKeySelected, selectApiKey, checkApiKey } = useVeoGenerator();
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        checkApiKey();
    }, [checkApiKey]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleGenerate = async () => {
        if (!prompt.trim() && !imageFile) {
            alert('Please enter a prompt or upload an image.');
            return;
        }

        let imagePayload;
        if (imageFile) {
            const imageBytes = await fileToBase64(imageFile);
            imagePayload = { imageBytes, mimeType: imageFile.type };
        }

        await generateVideo({ prompt, image: imagePayload, aspectRatio });
    };

    return (
        <div className="h-full flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6">
                <div>
                    <label className="block text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Prompt</label>
                    <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={4} className="w-full bg-slate-100 dark:bg-slate-700 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500" placeholder="e.g., A robot surfing on a wave of data"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Starting Image (Optional)</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden"/>
                    <div onClick={() => fileInputRef.current?.click()} className="w-full h-32 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center cursor-pointer border-2 border-dashed border-slate-300 dark:border-slate-600">
                        {imagePreview ? <img src={imagePreview} alt="Upload preview" className="max-h-full max-w-full object-contain"/> : <span className="text-slate-400 text-sm">Click to upload</span>}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Aspect Ratio</label>
                    <div className="flex gap-2">
                        <button onClick={() => setAspectRatio('16:9')} className={`w-full py-2 rounded-md ${aspectRatio === '16:9' ? 'bg-purple-600 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>16:9</button>
                        <button onClick={() => setAspectRatio('9:16')} className={`w-full py-2 rounded-md ${aspectRatio === '9:16' ? 'bg-purple-600 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>9:16</button>
                    </div>
                </div>
                 <div className="flex-1" />
                {!isKeySelected ? (
                     <div className="p-3 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
                        Video generation requires you to select a Google Cloud API key with billing enabled. <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Learn more</a>.
                        <button onClick={selectApiKey} className="mt-2 w-full py-2 bg-yellow-500 text-white font-bold rounded-lg">Select API Key</button>
                     </div>
                ) : (
                    <button onClick={handleGenerate} disabled={isGenerating} className="w-full py-3 bg-purple-600 dark:bg-teal-600 text-white font-semibold rounded-lg hover:bg-purple-500 disabled:bg-slate-400 flex items-center justify-center gap-2">
                        {isGenerating ? <Spinner/> : <Icon name="video" className="w-5 h-5"/>}
                        {isGenerating ? 'Generating...' : 'Generate Video'}
                    </button>
                )}
            </div>

            <div className="flex-1 flex items-center justify-center bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl shadow-lg p-4">
                 {isGenerating ? (
                    <div className="text-center p-4">
                        <Spinner />
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{progressMessage || 'Initializing...'}</p>
                        <p className="text-xs text-slate-400">(Video generation can take several minutes)</p>
                    </div>
                ) : videoUrl ? (
                    <video src={videoUrl} controls autoPlay loop className="max-w-full max-h-full rounded-md"/>
                ) : error ? (
                    <p className="text-red-500 text-sm p-4">{error}</p>
                ) : (
                    <div className="text-center text-slate-400">
                        <Icon name="video" className="w-16 h-16 mx-auto" />
                        <p>Your generated video will appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoGenerationView;
