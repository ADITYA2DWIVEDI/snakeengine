import React, { useState, useEffect, useCallback } from 'react';
import { Page, ApiKey, ApiProvider } from '../../types';
import { Icon } from '../icons';
import { ProviderIcon } from '../common/ProviderIcon';

export const STORAGE_KEY = 'snakeEngineApiKeys';

const initialKeys: ApiKey[] = [
    { id: 'gemini-1', nickname: 'Gemini Pro', provider: 'Google', key: 'AIzaSyBDTQ9i_JXSSln8wunZt9JTwdm2AwLJD4g' },
    { id: 'openai-1', nickname: 'OpenAI GPT-4', provider: 'OpenAI', key: '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' },
    { id: 'perplexity-1', nickname: 'Perplexity AI', provider: 'Perplexity', key: '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' },
    { id: 'deepseek-1', nickname: 'DeepSeek Coder', provider: 'DeepSeek', key: 'sk-65f16441c9914b29bc5272f6b5335c27' },
    { id: 'grok-1', nickname: 'Grok AI', provider: 'Grok', key: 'xai-fKKfoa1n7RaxsTj1DP9EAZcrH2ge5tKsMKnFNWBaSmXc8TRCFAkvBhMuGyZ3EF8KE2HFyLxN9s97qWmk' },
];

const maskApiKey = (key: string): string => {
    if (key.length < 8) return '********';
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
};

const TopModelKeysView: React.FC = () => {
    const [keys, setKeys] = useState<ApiKey[]>(() => {
        try {
            const storedKeys = localStorage.getItem(STORAGE_KEY);
            // If there are stored keys, use them; otherwise, use the initial set.
            return storedKeys ? JSON.parse(storedKeys) : initialKeys;
        } catch (error) {
            console.error("Failed to load API keys from storage, using defaults:", error);
            return initialKeys;
        }
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentKey, setCurrentKey] = useState<ApiKey | null>(null);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
        } catch (error) {
            console.error("Failed to save API keys to storage:", error);
        }
    }, [keys]);

    const handleAdd = () => {
        setCurrentKey(null);
        setIsModalOpen(true);
    };

    const handleEdit = (key: ApiKey) => {
        setCurrentKey(key);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this API key?')) {
            setKeys(keys.filter(key => key.id !== id));
        }
    };
    
    const handleSave = (keyToSave: Omit<ApiKey, 'id'> & { id?: string }) => {
        if (keyToSave.id) { // Editing
            setKeys(keys.map(k => k.id === keyToSave.id ? { ...k, ...keyToSave } as ApiKey : k));
        } else { // Adding
            setKeys([...keys, { ...keyToSave, id: Date.now().toString() } as ApiKey]);
        }
        setIsModalOpen(false);
    };
    
    const handleCopy = (key: string) => {
        navigator.clipboard.writeText(key);
        alert('API Key copied to clipboard!');
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-3">
                    <Icon name={Page.TOP_MODEL_KEYS} className="w-8 h-8 gradient-text" />
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">Top Model API Keys</h1>
                </div>
                <button
                    onClick={handleAdd}
                    className="px-4 py-2 bg-purple-600 dark:bg-teal-600 text-white font-semibold rounded-lg hover:bg-purple-500 dark:hover:bg-teal-500 transition-colors flex items-center gap-2 text-sm self-end sm:self-auto"
                >
                    <Icon name="key" className="w-4 h-4" />
                    <span>Add New Key</span>
                </button>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Manage your API keys for various AI providers. Your keys are stored securely in your browser's local storage and are never sent to our servers.</p>
                <div className="space-y-3">
                    {keys.length > 0 ? (
                        keys.map(key => (
                            <div key={key.id} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-4">
                                    <ProviderIcon provider={key.provider} className="w-6 h-6" />
                                    <div>
                                        <p className="font-semibold text-slate-700 dark:text-slate-200">{key.nickname}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">{maskApiKey(key.key)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 self-end sm:self-auto">
                                     <button onClick={() => handleCopy(key.key)} className="p-2 text-slate-500 hover:text-purple-600 dark:hover:text-teal-400 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"><Icon name="paperclip" className="w-4 h-4" /></button>
                                     <button onClick={() => handleEdit(key)} className="p-2 text-slate-500 hover:text-purple-600 dark:hover:text-teal-400 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"><Icon name="edit" className="w-4 h-4" /></button>
                                     <button onClick={() => handleDelete(key.id)} className="p-2 text-slate-500 hover:text-red-500 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"><Icon name="delete" className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                            <Icon name="key" className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
                            <p className="mt-2 text-slate-500 dark:text-slate-400">You haven't added any API keys yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <KeyModal
                    apiKey={currentKey}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

interface KeyModalProps {
    apiKey: ApiKey | null;
    onClose: () => void;
    onSave: (key: Omit<ApiKey, 'id'> & { id?: string }) => void;
}

const KeyModal: React.FC<KeyModalProps> = ({ apiKey, onClose, onSave }) => {
    const [nickname, setNickname] = useState(apiKey?.nickname || '');
    const [provider, setProvider] = useState<ApiProvider>(apiKey?.provider || 'Google');
    const [key, setKey] = useState(apiKey?.key || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nickname.trim() || !key.trim()) {
            alert("Please fill out all fields.");
            return;
        }
        onSave({ id: apiKey?.id, nickname, provider, key });
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h3 className="text-lg font-bold">{apiKey ? 'Edit API Key' : 'Add New API Key'}</h3>
                    </div>
                    <div className="p-6 space-y-4 border-y border-slate-200 dark:border-slate-700">
                        <div>
                            <label htmlFor="nickname" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Nickname</label>
                            <input id="nickname" type="text" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="e.g., My Personal Key" required className="w-full bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500" />
                        </div>
                        <div>
                            <label htmlFor="provider" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Provider</label>
                            <select id="provider" value={provider} onChange={e => setProvider(e.target.value as ApiProvider)} required className="w-full bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500">
                                <option>Google</option>
                                <option>OpenAI</option>
                                <option>Perplexity</option>
                                <option>DeepSeek</option>
                                <option>Grok</option>
                                <option>Anthropic</option>
                            </select>
                        </div>
                         <div>
                            <label htmlFor="key" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">API Key</label>
                            <input id="key" type="password" value={key} onChange={e => setKey(e.target.value)} placeholder="Paste your API key here" required className="w-full bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500" />
                        </div>
                    </div>
                    <div className="p-4 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-semibold rounded-lg bg-purple-600 dark:bg-teal-500 text-white hover:bg-purple-500 dark:hover:bg-teal-600">Save Key</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default TopModelKeysView;
