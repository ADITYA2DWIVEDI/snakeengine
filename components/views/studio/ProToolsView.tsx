import React, { useState, useEffect } from 'react';
import { Feature } from '../../../types';
import { Icon } from '../../icons';

// Import pro feature views
import AppBuilderView from './pro/AppBuilderView';
import WebsiteBuilderView from './pro/WebsiteBuilderView';
import ExcelAutomationView from '../ExcelAutomationView';
import AISearchView from '../AISearchView';
import PromptEngineeringView from '../PromptEngineeringView';


interface ProToolsViewProps {
    initialFeature?: Feature;
}

const features: { name: Feature, icon: Feature }[] = [
    { name: Feature.APP_BUILDER, icon: Feature.APP_BUILDER },
    { name: Feature.WEBSITE_BUILDER, icon: Feature.WEBSITE_BUILDER },
    { name: Feature.EXCEL_AUTOMATION, icon: Feature.EXCEL_AUTOMATION },
    { name: Feature.AI_SEARCH, icon: Feature.AI_SEARCH },
    { name: Feature.PROMPT_ENGINEERING, icon: Feature.PROMPT_ENGINEERING },
];

const ProToolsView: React.FC<ProToolsViewProps> = ({ initialFeature }) => {
    const [activeFeature, setActiveFeature] = useState<Feature>(initialFeature || Feature.APP_BUILDER);

    useEffect(() => {
        if (initialFeature) {
            setActiveFeature(initialFeature);
        }
    }, [initialFeature]);

    const renderActiveFeature = () => {
        switch (activeFeature) {
            case Feature.APP_BUILDER:
                return <AppBuilderView />;
            case Feature.WEBSITE_BUILDER:
                return <WebsiteBuilderView />;
            case Feature.EXCEL_AUTOMATION:
                return <ExcelAutomationView />;
            case Feature.AI_SEARCH:
                return <AISearchView />;
            case Feature.PROMPT_ENGINEERING:
                return <PromptEngineeringView />;
            default:
                 return <AppBuilderView />;
        }
    };
    
    return (
        <div className="h-full flex flex-col md:flex-row gap-6">
            <aside className="w-full md:w-64 lg:w-56 flex-shrink-0">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-lg">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 p-2">Pro Tools</h2>
                    <nav className="space-y-2">
                        {features.map(feature => (
                            <button 
                                key={feature.name} 
                                onClick={() => setActiveFeature(feature.name)}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 text-sm font-medium ${
                                    activeFeature === feature.name
                                    ? 'bg-gradient-to-r from-purple-500 to-teal-500 text-white shadow-md'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                            >
                                <Icon name={feature.icon} className="w-5 h-5 flex-shrink-0"/>
                                <span>{feature.name}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </aside>
            <main className="flex-1 min-h-0">
                {renderActiveFeature()}
            </main>
        </div>
    );
};

export default ProToolsView;