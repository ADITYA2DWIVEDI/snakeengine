import React, { useState, useEffect } from 'react';
import { LockIcon, KeyIcon } from '../components/Icons';

type Tab = 'Profile' | 'Notifications' | 'Privacy' | 'API';

const ToggleSwitch = ({ enabled, setEnabled }: { enabled: boolean, setEnabled: (enabled: boolean) => void }) => (
    <button onClick={() => setEnabled(!enabled)} className={`${enabled ? 'bg-brand-purple' : 'bg-slate-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-purple`}>
        <span className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
    </button>
);

export const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('Profile');
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [saveHistory, setSaveHistory] = useState(true);
    const [useDataForTraining, setUseDataForTraining] = useState(false);

    // API Key State
    const [apiKey, setApiKey] = useState('');
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success'>('idle');

    useEffect(() => {
        const storedKey = localStorage.getItem('gemini_api_key');
        if (storedKey) {
            setApiKey(storedKey);
        }
    }, []);

    const handleSaveApiKey = () => {
        localStorage.setItem('gemini_api_key', apiKey);
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 2000);
    };

    const handleClearApiKey = () => {
        localStorage.removeItem('gemini_api_key');
        setApiKey('');
    };


    const renderContent = () => {
        switch (activeTab) {
            case 'Profile':
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-text-primary">Name</label>
                            <input type="text" defaultValue="Demo User" className="mt-1 block w-full bg-white border-border-color rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-purple sm:text-sm text-text-primary" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-primary">Email</label>
                            <input type="email" defaultValue="demo@snakeengine.ai" className="mt-1 block w-full bg-white border-border-color rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-purple sm:text-sm text-text-primary" />
                        </div>
                         <button className="py-2 px-4 bg-brand-purple text-white font-semibold rounded-lg shadow-lg hover:bg-brand-purple/80 transition-all">Save Changes</button>
                    </div>
                );
            case 'Notifications':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-slate-100">
                            <div>
                                <h4 className="font-medium text-text-primary">Email Notifications</h4>
                                <p className="text-sm text-text-secondary">Receive updates and news via email.</p>
                            </div>
                            <ToggleSwitch enabled={emailNotifications} setEnabled={setEmailNotifications} />
                        </div>
                    </div>
                );
            case 'Privacy':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-slate-100">
                            <div>
                                <h4 className="font-medium text-text-primary">Save Chat History</h4>
                                <p className="text-sm text-text-secondary">Keep a record of your conversations.</p>
                            </div>
                            <ToggleSwitch enabled={saveHistory} setEnabled={setSaveHistory} />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-slate-100">
                            <div>
                                <h4 className="font-medium text-text-primary">Improve The Model</h4>
                                <p className="text-sm text-text-secondary">Allow us to use your anonymized data to improve our AI.</p>
                            </div>
                            <ToggleSwitch enabled={useDataForTraining} setEnabled={setUseDataForTraining} />
                        </div>
                        <div className="pt-4 border-t border-border-color flex flex-col sm:flex-row gap-4">
                           <button className="py-2 px-4 text-sm bg-slate-200 text-text-primary font-semibold rounded-lg hover:bg-slate-300 transition-all">Export My Data</button>
                           <button className="py-2 px-4 text-sm bg-brand-red/10 text-brand-red font-semibold rounded-lg hover:bg-brand-red/20 transition-all">Delete My Account</button>
                        </div>
                    </div>
                );
            case 'API':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-text-primary">Gemini API Key</h3>
                            <p className="text-sm text-text-secondary mt-1">
                                Provide your own Gemini API key. This will be stored locally in your browser and will be used for all requests. Your key will take precedence over any default keys.
                            </p>
                        </div>
                        <div>
                            <label htmlFor="api-key" className="block text-sm font-medium text-text-primary">Your API Key</label>
                            <input 
                                id="api-key" 
                                type="password" 
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="Enter your Gemini API Key" 
                                className="mt-1 block w-full bg-white border-border-color rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-purple sm:text-sm text-text-primary" 
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={handleSaveApiKey} className="py-2 px-4 bg-brand-purple text-white font-semibold rounded-lg shadow-lg hover:bg-brand-purple/80 transition-all disabled:opacity-50">
                                {saveStatus === 'success' ? 'Saved!' : 'Save Key'}
                            </button>
                             <button onClick={handleClearApiKey} className="py-2 px-4 bg-slate-200 text-text-primary font-semibold rounded-lg hover:bg-slate-300 transition-all">
                                Clear Key
                            </button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="h-full w-full p-4 md:p-8 overflow-y-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
                <p className="text-text-secondary mt-1">Manage your account and preferences.</p>
            </header>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/4">
                    <nav className="flex flex-col space-y-2">
                        {(['Profile', 'Notifications', 'Privacy', 'API'] as Tab[]).map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`text-left px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${activeTab === tab ? 'bg-brand-purple/10 text-brand-purple font-semibold' : 'hover:bg-slate-100 text-slate-600'}`}>
                                {tab === 'Privacy' && <LockIcon className="w-4 h-4" />}
                                {tab === 'API' && <KeyIcon className="w-4 h-4" />}
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="flex-1 p-6 rounded-2xl glass-pane">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};