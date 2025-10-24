

import React, { useState, useEffect } from 'react';
import { Page, FontStyle, AIPersonality, DesignDensity } from '../../types';
import { Icon } from '../icons';

interface SettingsViewProps {
    applyStyles: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ applyStyles }) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(false);
    
    // New customization state
    const [font, setFont] = useState<FontStyle>(() => (localStorage.getItem('snakeEngineFontStyle') as FontStyle) || 'Inter');
    const [personality, setPersonality] = useState<AIPersonality>(() => (localStorage.getItem('snakeEngineAIPersonality') as AIPersonality) || 'Assistant');
    const [density, setDensity] = useState<DesignDensity>(() => (localStorage.getItem('snakeEngineDesignDensity') as DesignDensity) || 'Comfortable');
    const [cornerRadius, setCornerRadius] = useState<number>(() => parseInt(localStorage.getItem('snakeEngineCornerRadius') || '12', 10));
    const [shadowStrength, setShadowStrength] = useState<number>(() => parseFloat(localStorage.getItem('snakeEngineShadowStrength') || '1'));

    // Effect for theme (dark/light mode)
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);
    
    // Effects for new customization options
    useEffect(() => { localStorage.setItem('snakeEngineFontStyle', font); applyStyles(); }, [font, applyStyles]);
    useEffect(() => { localStorage.setItem('snakeEngineAIPersonality', personality); }, [personality]);
    useEffect(() => { localStorage.setItem('snakeEngineDesignDensity', density); applyStyles(); }, [density, applyStyles]);
    useEffect(() => { localStorage.setItem('snakeEngineCornerRadius', cornerRadius.toString()); applyStyles(); }, [cornerRadius, applyStyles]);
    useEffect(() => { localStorage.setItem('snakeEngineShadowStrength', shadowStrength.toString()); applyStyles(); }, [shadowStrength, applyStyles]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };
    
    const ToggleSwitch: React.FC<{checked: boolean, onChange: (checked: boolean) => void}> = ({ checked, onChange }) => (
        <button
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${
                checked ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'
            }`}
        >
            <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    checked ? 'translate-x-5' : 'translate-x-0'
                }`}
            />
        </button>
    );
    
    const SettingRow: React.FC<{label: string, children: React.ReactNode}> = ({ label, children }) => (
        <div className="flex items-center justify-between py-2">
            <span className="text-slate-600 dark:text-slate-300 text-sm">{label}</span>
            {children}
        </div>
    );

    return (
        <div>
            <div className="flex items-center gap-3 mb-8">
                <Icon name={Page.SETTINGS} className="w-8 h-8 gradient-text" />
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{Page.SETTINGS}</h1>
            </div>

            <div className="max-w-2xl space-y-8">
                {/* Customization Settings */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                        <Icon name="sliders" className="w-6 h-6 text-purple-600 dark:text-teal-400"/>
                        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Customization</h2>
                    </div>
                    <div className="space-y-4 divide-y divide-slate-200 dark:divide-slate-700">
                        <SettingRow label="Theme">
                            <div className="flex items-center gap-2">
                                <Icon name="sun" className={`w-6 h-6 ${theme === 'light' ? 'text-yellow-500' : 'text-slate-500'}`} />
                                <ToggleSwitch checked={theme === 'dark'} onChange={() => toggleTheme()} />
                                <Icon name="moon" className={`w-5 h-5 ${theme === 'dark' ? 'text-teal-400' : 'text-slate-500'}`} />
                            </div>
                        </SettingRow>
                         <SettingRow label="Font Style">
                            <select value={font} onChange={e => setFont(e.target.value as FontStyle)} className="text-sm bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500">
                                <option>Inter</option>
                                <option>Roboto</option>
                                <option>Poppins</option>
                                <option>Source Code Pro</option>
                            </select>
                        </SettingRow>
                        <SettingRow label="AI Writing Style">
                            <select value={personality} onChange={e => setPersonality(e.target.value as AIPersonality)} className="text-sm bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500">
                                <option value="Assistant">Helpful Assistant</option>
                                <option value="Creative">Creative & Playful</option>
                                <option value="Professional">Formal & Professional</option>
                                <option value="Concise">Concise & Direct</option>
                            </select>
                        </SettingRow>
                         <SettingRow label="Interface Density">
                             <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                                 {(['Compact', 'Comfortable', 'Spacious'] as DesignDensity[]).map(d => (
                                     <button key={d} onClick={() => setDensity(d)} className={`px-3 py-1 text-xs rounded-md ${density === d ? 'bg-white dark:bg-slate-600 shadow' : ''}`}>{d}</button>
                                 ))}
                            </div>
                        </SettingRow>
                         <div className="pt-4">
                             <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 flex justify-between"><span>Corner Roundness</span><span>{cornerRadius}px</span></label>
                             <input type="range" min="0" max="24" value={cornerRadius} onChange={e => setCornerRadius(parseInt(e.target.value, 10))} className="w-full h-2 mt-1 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer" />
                         </div>
                          <div className="pt-4">
                             <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 flex justify-between"><span>Shadow Depth</span><span>{shadowStrength.toFixed(1)}x</span></label>
                             <input type="range" min="0" max="2" step="0.1" value={shadowStrength} onChange={e => setShadowStrength(parseFloat(e.target.value))} className="w-full h-2 mt-1 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer" />
                         </div>
                    </div>
                </div>

                {/* Profile Settings */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                        <Icon name="profile" className="w-6 h-6 text-purple-600 dark:text-teal-400"/>
                        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Profile</h2>
                    </div>
                    <div className="space-y-4">
                         <div>
                            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">Name</label>
                            <input type="text" defaultValue="Alex Johnson" className="mt-1 block w-full bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">Email Address</label>
                            <input type="email" defaultValue="alex.johnson@example.com" className="mt-1 block w-full bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50" />
                        </div>
                        <div className="text-right">
                             <button className="px-4 py-2 bg-purple-600 dark:bg-teal-600 text-white font-semibold rounded-lg hover:bg-purple-500 dark:hover:bg-teal-500 transition-colors text-sm">Save Changes</button>
                        </div>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                        <Icon name="notification" className="w-6 h-6 text-purple-600 dark:text-teal-400"/>
                        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Notifications</h2>
                    </div>
                     <div className="space-y-4">
                         <SettingRow label="Email Notifications">
                            <ToggleSwitch checked={emailNotifications} onChange={setEmailNotifications} />
                        </SettingRow>
                         <SettingRow label="Push Notifications">
                            <ToggleSwitch checked={pushNotifications} onChange={setPushNotifications} />
                        </SettingRow>
                    </div>
                </div>

                {/* API Settings */}
                 <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                        <Icon name="key" className="w-6 h-6 text-purple-600 dark:text-teal-400"/>
                        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">API Management</h2>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Manage your API keys for accessing SnakeEngine.AI services programmatically.</p>
                    <div className="text-right">
                         <button className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-sm">Generate New Key</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;