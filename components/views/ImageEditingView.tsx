
import React, { useState, useRef } from 'react';
import { Feature } from '../../types';
import { editImage } from '../../services/geminiService';
import { fileToBase64 } from '../../utils/helpers';
import { Icon } from '../icons';
import Spinner from '../common/Spinner';

const ImageEditingView: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [originalImage, setOriginalImage] = useState<File | null>(null);
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
    const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setOriginalImage(file);
            setOriginalImageUrl(URL.createObjectURL(file));
            setEditedImageUrl(null);
            setError(null);
        }
    };

    const handleEdit = async () => {
        if (!prompt.trim()) {
            setError('Please enter an editing instruction.');
            return;
        }
        if (!originalImage) {
            setError('Please upload an image to edit.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setEditedImageUrl(null);

        try {
            const base64Image = await fileToBase64(originalImage);
            const editedBase64 = await editImage(prompt, base64Image, originalImage.type);
            setEditedImageUrl(`data:${originalImage.type};base64,${editedBase64}`);
        } catch (e: any) {
            console.error("Image editing error:", e);
            setError(`Failed to edit image: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleRemoveImage = () => {
        setOriginalImage(null);
        setOriginalImageUrl(null);
        setEditedImageUrl(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    return (
        <div className="h-full flex flex-col bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl shadow-lg">
            <div className="flex-1 p-6 flex flex-col">
                <div className="w-full bg-white dark:bg-slate-800 p-6 rounded-xl max-w-2xl mx-auto space-y-4">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., Add a retro filter, remove the person in the background"
                        className="w-full h-24 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-3 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-teal-500 resize-none"
                    />
                    <div className="flex gap-4">
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
                        <button onClick={() => fileInputRef.current?.click()} className="flex-1 px-4 py-2 bg-slate-500 text-white font-semibold rounded-lg hover:bg-slate-600 transition-colors flex items-center justify-center gap-2">
                           <Icon name="upload" className="w-5 h-5"/> Upload Image
                        </button>
                        <button
                            onClick={handleEdit}
                            disabled={isLoading || !originalImage}
                            className="flex-1 px-4 py-2 bg-purple-600 dark:bg-teal-600 text-white font-semibold rounded-lg hover:bg-purple-500 dark:hover:bg-teal-500 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Spinner /> : <Icon name={Feature.IMAGE_EDITING} className="w-5 h-5"/>}
                            {isLoading ? 'Editing...' : 'Apply Edit'}
                        </button>
                    </div>
                     {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>

                <div className="flex-1 mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-100 dark:bg-slate-900/50 rounded-lg flex flex-col p-4">
                        <h3 className="text-lg font-semibold mb-2 text-center text-slate-500 dark:text-slate-400">Original</h3>
                         <div className="flex-1 flex items-center justify-center relative">
                            {originalImageUrl ? (
                                <>
                                    <img src={originalImageUrl} alt="Original" className="max-w-full max-h-full object-contain rounded-lg" />
                                    <button onClick={handleRemoveImage} className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white hover:bg-black/80">
                                        <Icon name="close" className="w-4 h-4"/>
                                    </button>
                                </>
                            ) : (
                                <div className="text-center text-slate-500">
                                    <Icon name="photo" className="w-16 h-16 mx-auto mb-2" />
                                    <p>Upload an image to start</p>
                                </div>
                            )}
                        </div>
                    </div>
                     <div className="bg-slate-100 dark:bg-slate-900/50 rounded-lg flex flex-col p-4">
                        <h3 className="text-lg font-semibold mb-2 text-center text-slate-500 dark:text-slate-400">Edited</h3>
                        <div className="flex-1 flex items-center justify-center">
                            {isLoading ? (
                                <div className="text-center text-slate-500 dark:text-slate-400">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 dark:border-teal-400 mx-auto"></div>
                                    <p className="mt-4">Applying your edit...</p>
                                </div>
                            ) : editedImageUrl ? (
                                <img src={editedImageUrl} alt="Edited" className="max-w-full max-h-full object-contain rounded-lg" />
                            ) : (
                                <div className="text-center text-slate-500">
                                    <Icon name="brain" className="w-16 h-16 mx-auto mb-2" />
                                    <p>Your edited image will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageEditingView;
