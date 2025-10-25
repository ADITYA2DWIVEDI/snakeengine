// Fix: Changed React import to `import * as React from 'react'` to resolve JSX typing issues.
import * as React from 'react';
import { Page, FontStyle, AIPersonality, DesignDensity } from '../../types';
import { Icon } from '../icons';

interface SettingsViewProps {
    applyStyles: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ applyStyles }) => {
    const [theme, setTheme] = React.useState(() => localStorage.getItem('theme') || 'light');
    const [emailNotifications, setEmailNotifications] = React.useState(true);
    const [pushNotifications, setPushNotifications] = React.useState(false);
    
    // New customization state with updated defaults
    const [font, setFont] = React.useState<FontStyle>(() => (localStorage.getItem('snakeEngineFontStyle') as FontStyle) || 'Inter');
    const [personality, setPersonality] = React.useState<AIPersonality>(() => (localStorage.getItem('snakeEngineAIPersonality') as AIPersonality) || 'Creative');
    const [density, setDensity] = React.useState<DesignDensity>(() => (localStorage.getItem('snakeEngineDesignDensity') as DesignDensity) || 'Spacious');
    const [cornerRadius, setCornerRadius] = React.useState<number>(() => parseInt(localStorage.getItem('snakeEngineCornerRadius') || '24', 10));
    const [shadowStrength, setShadowStrength] = React.useState<number>(() => parseFloat(localStorage.getItem('snakeEngineShadowStrength') || '2.0'));

    // Effect for theme (dark/light mode)
    React.useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);
    
    // Effects for new customization options
    React.useEffect(() => { localStorage.setItem('snakeEngineFontStyle', font); applyStyles(); }, [font, applyStyles]);
    React.useEffect(() => { localStorage.setItem('snakeEngineAIPersonality', personality); }, [personality]);
    React.useEffect(() => { localStorage.setItem('snakeEngineDesignDensity', density); applyStyles(); }, [density, applyStyles]);
    React.useEffect(() => { localStorage.setItem('snakeEngineCornerRadius', cornerRadius.toString()); applyStyles(); }, [cornerRadius, applyStyles]);
    React.useEffect(() => { localStorage.setItem('snakeEngineShadowStrength', shadowStrength.toString()); applyStyles(); }, [shadowStrength, applyStyles]);

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
        <div className="flex items-center justify-between py-4">
            <span className="text-slate-600 dark:text-slate-300">{label}</span>
            {children}
        </div>
    );

    return (
        <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-8">
                <Icon name={Page.SETTINGS} className="w-8 h-8 gradient-text" />
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{Page.SETTINGS}</h1>
            </div>

            <div className="max-w-2xl mx-auto space-y-8">
                {/* Customization Settings */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-4 mb-4">
                        <Icon name="sliders" className="w-6 h-6 text-purple-600 dark:text-teal-400"/>
                        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Customization</h2>
                    </div>
                    <div className="space-y-2 divide-y divide-slate-200 dark:divide-slate-700">
                        <SettingRow label="Theme">
                            <div className="flex items-center gap-2">
                                <Icon name="sun" className={`w-6 h-6 ${theme === 'light' ? 'text-yellow-500' : 'text-slate-500'}`} />
                                <ToggleSwitch checked={theme === 'dark'} onChange={() => toggleTheme()} />
                                <Icon name="moon" className={`w-5 h-5 ${theme === 'dark' ? 'text-teal-400' : 'text-slate-500'}`} />
                            </div>
                        </SettingRow>
                         <SettingRow label="Font Style">
                            <select value={font} onChange={e => setFont(e.target.value as FontStyle)} className="bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500">
                                <option>Inter</option>
                                <option>Roboto</option>
                                <option>Poppins</option>
                                <option>Source Code Pro</option>
                            </select>
                        </SettingRow>
                        <SettingRow label="AI Writing Style">
                            <select value={personality} onChange={e => setPersonality(e.target.value as AIPersonality)} className="bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500">
                                <option value="Assistant">Helpful Assistant</option>
                                <option value="Creative">Creative & Playful</option>
                                <option value="Professional">Formal & Professional</option>
                                <option value="Concise">Concise & Direct</option>
                            </select>
                        </SettingRow>
                         <SettingRow label="Interface Density">
                             <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                                 {(['Compact', 'Comfortable', 'Spacious'] as DesignDensity[]).map(d => (
                                     <button key={d} onClick={() => setDensity(d)} className={`px-3 py-1 text-sm rounded-md ${density === d ? 'bg-white dark:bg-slate-600 shadow' : 'text-slate-500'}`}>{d}</button>
                                 ))}
                            </div>
                        </SettingRow>
                         <div className="pt-4">
                             <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 flex justify-between"><span>Corner Roundness</span><span>{cornerRadius}px</span></label>
                             <input type="range" min="0" max="24" value={cornerRadius} onChange={e => setCornerRadius(parseInt(e.target.value, 10))} className="w-full h-2 mt-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-600 dark:accent-teal-500" />
                         </div>
                          <div className="pt-4">
                             <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 flex justify-between"><span>Shadow Depth</span><span>{shadowStrength.toFixed(1)}x</span></label>
                             <input type="range" min="0" max="2" step="0.1" value={shadowStrength} onChange={e => setShadowStrength(parseFloat(e.target.value))} className="w-full h-2 mt-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-600 dark:accent-teal-500" />
                         </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

// Fix: Add default export to resolve import error in App.tsx
export default SettingsView;