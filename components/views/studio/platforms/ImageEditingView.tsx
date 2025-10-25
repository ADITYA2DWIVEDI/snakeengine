import React from 'react';
import { Feature } from '../../../../types';
import { Icon } from '../../../icons';
import { editImage } from '../../../../services/geminiService';
import { fileToBase64 } from '../../../../utils/helpers';
import Spinner from '../../../common/Spinner';

const ImageEditingView: React.FC = () => {
    const [prompt, setPrompt] = React.useState('');
    const [originalImage, setOriginalImage] = React.useState<File | null>(null);
    const [originalImagePreview, setOriginalImagePreview] = React.useState<string | null>(null);
    const [editedImage, setEditedImage] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setOriginalImage(file);
            setOriginalImagePreview(URL.createObjectURL(file));
            setEditedImage(null);
            setError(null);
        } else {
            alert("Please upload a valid image file.");
        }
    };

    const handleEdit = async () => {
        if (!prompt.trim() || !originalImage) {
            setError('Please upload an image and provide an editing prompt.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setEditedImage(null);

        try {
            const base64Image = await fileToBase64(originalImage);
            const editedBase64 = await editImage(prompt, base64Image, originalImage.type);
            setEditedImage(`data:image/png;base64,${editedBase64}`);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="w-full bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md flex items-center gap-4 mb-6">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., Add a party hat on the cat"
                    className="w-full bg-slate-100 dark:bg-slate-700 border-transparent rounded-lg p-3 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                    onClick={handleEdit}
                    disabled={isLoading || !originalImage}
                    className="px-6 py-3 bg-purple-600 dark:bg-teal-600 text-white font-semibold rounded-lg hover:bg-purple-500 dark:hover:bg-teal-500 transition-colors disabled:bg-slate-400 flex items-center justify-center gap-2"
                >
                    {isLoading ? <Spinner /> : <Icon name={Feature.IMAGE_EDITING} className="w-5 h-5" />}
                    {isLoading ? 'Editing...' : 'Edit Image'}
                </button>
            </div>
            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-lg flex flex-col">
                    <h3 className="font-bold mb-2 text-center">Original Image</h3>
                    <div className="flex-1 flex items-center justify-center bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                        <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
                        {originalImagePreview ? (
                            <img src={originalImagePreview} alt="Original" className="max-w-full max-h-full object-contain rounded-md cursor-pointer" onClick={() => fileInputRef.current?.click()} />
                        ) : (
                            <button onClick={() => fileInputRef.current?.click()} className="text-center text-slate-400 p-8">
                                <Icon name="upload" className="w-12 h-12 mx-auto" />
                                <p>Click to upload an image</p>
                            </button>
                        )}
                    </div>
                </div>
                 <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-lg flex flex-col">
                    <h3 className="font-bold mb-2 text-center">Edited Image</h3>
                    <div className="flex-1 flex items-center justify-center bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                        {isLoading ? (
                            <div className="text-center">
                                <Spinner />
                                <p className="mt-2 text-slate-500 dark:text-slate-400">Applying edits...</p>
                            </div>
                        ) : editedImage ? (
                            <img src={editedImage} alt="Edited" className="max-w-full max-h-full object-contain rounded-md" />
                        ) : (
                            <div className="text-center text-slate-400">
                                <Icon name="photo" className="w-12 h-12 mx-auto" />
                                <p>Your edited image will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageEditingView;
