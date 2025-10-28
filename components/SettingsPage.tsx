import React, { useState } from 'react';

const SunIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
);

const MoonIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
);

const SettingsPage: React.FC = () => {
    const [theme, setTheme] = useState('light');
    const [density, setDensity] = useState('Spacious');
    const [roundness, setRoundness] = useState(24);
    const [shadow, setShadow] = useState(2.0);

    return (
        <div className="h-full flex items-center justify-center p-4 md:p-8 bg-gray-50">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center mb-8">
                     <div className="p-2 bg-purple-100 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 16v-2m8-8h-2M4 12H2m15.364 6.364l-1.414-1.414M6.05 6.05l-1.414-1.414m12.728 0l-1.414 1.414M6.05 17.95l-1.414 1.414" /></svg>
                     </div>
                     <h1 className="text-2xl font-bold text-gray-800 ml-4">Customization</h1>
                </div>

                <div className="space-y-8">
                    {/* Theme */}
                    <div className="flex items-center justify-between">
                        <label className="text-gray-600 font-medium">Theme</label>
                        <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-full">
                            <SunIcon className={`h-6 w-6 p-1 rounded-full transition-colors ${theme === 'light' ? 'text-yellow-500 bg-white shadow' : 'text-gray-400'}`} />
                            <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="relative w-12 h-6 bg-gray-300 rounded-full focus:outline-none">
                                <span className={`absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : ''}`}></span>
                            </button>
                             <MoonIcon className={`h-6 w-6 p-1 rounded-full transition-colors ${theme === 'dark' ? 'text-blue-400 bg-gray-700 shadow' : 'text-gray-400'}`} />
                        </div>
                    </div>

                    {/* Font Style */}
                    <div className="flex items-center justify-between">
                        <label className="text-gray-600 font-medium">Font Style</label>
                        <select className="w-48 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400">
                            <option>Inter</option>
                            <option>Roboto</option>
                            <option>Lato</option>
                        </select>
                    </div>

                    {/* AI Writing Style */}
                    <div className="flex items-center justify-between">
                        <label className="text-gray-600 font-medium">AI Writing Style</label>
                        <select className="w-48 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400">
                            <option>Creative & Playful</option>
                            <option>Formal & Professional</option>
                            <option>Concise & Direct</option>
                        </select>
                    </div>

                    {/* Interface Density */}
                    <div className="flex items-center justify-between">
                        <label className="text-gray-600 font-medium">Interface Density</label>
                        <div className="flex items-center bg-gray-100 p-1 rounded-full">
                            {['Compact', 'Comfortable', 'Spacious'].map(d => (
                                <button key={d} onClick={() => setDensity(d)} className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${density === d ? 'bg-white shadow text-purple-600' : 'text-gray-500'}`}>
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Corner Roundness */}
                    <div className="flex items-center justify-between">
                        <label className="text-gray-600 font-medium">Corner Roundness</label>
                        <div className="flex items-center space-x-4 w-48">
                            <input type="range" min="0" max="48" value={roundness} onChange={(e) => setRoundness(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600" />
                            <span className="text-sm text-gray-500 w-10 text-right">{roundness}px</span>
                        </div>
                    </div>
                    
                    {/* Shadow Depth */}
                    <div className="flex items-center justify-between">
                        <label className="text-gray-600 font-medium">Shadow Depth</label>
                        <div className="flex items-center space-x-4 w-48">
                            <input type="range" min="0" max="4" step="0.1" value={shadow} onChange={(e) => setShadow(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600" />
                            <span className="text-sm text-gray-500 w-10 text-right">{shadow.toFixed(1)}x</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
