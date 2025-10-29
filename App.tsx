import React, { useState, useEffect, useCallback } from 'react';
import { Page, Tab } from './types';
import { LogoIcon, MenuIcon, NAVIGATION_ITEMS } from './constants';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import SmartStudioPage from './components/SmartStudioPage';
import CoursesPage from './components/CoursesPage';
import SettingsPage from './components/SettingsPage';
import PlansPage from './components/PlansPage';
import HelpPage from './components/HelpPage';
import WhatsNewModal from './components/WhatsNewModal';
import MyLearningPage from './components/MyLearningPage';
import PromoPage from './components/PromoPage';
import PluginsPage from './components/PluginsPage'; // New
import OnboardingModal from './components/OnboardingModal'; // New
import Footer from './components/Footer';
import { useTheme } from './hooks/useTheme';
import { useChatHistory } from './hooks/useChatHistory';
import { useCourseTracking } from './hooks/useCourseTracking';
import { useAiPersona } from './hooks/useAiPersona';

// Import all tools
import ImageGenerationTool from './components/tools/ImageGenerationTool';
import ImageEditingTool from './components/tools/ImageEditingTool';
import ImageAnalysisTool from './components/tools/ImageAnalysisTool';
import ThinkingModeTool from './components/tools/ThinkingModeTool';
import LiveChatTool from './components/tools/LiveChatTool';
import AudioTranscriptionTool from './components/tools/AudioTranscriptionTool';
import VideoGenerationTool from './components/tools/VideoGenerationTool';
import VideoAnalysisTool from './components/tools/VideoAnalysisTool';
import WebSearchTool from './components/tools/WebSearchTool';
import LocalDiscoveryTool from './components/tools/LocalDiscoveryTool';
import TextToSpeechTool from './components/tools/TextToSpeechTool';
import StudyPlanGeneratorTool from './components/tools/StudyPlanGeneratorTool';
import CodeReviewerTool from './components/tools/CodeReviewerTool';
import DocumentSummarizerTool from './components/tools/DocumentSummarizerTool';


const Sidebar: React.FC<{
    onNavigate: (page: Page) => void;
    onSignOut: () => void;
    onShowWhatsNew: () => void;
}> = ({ onNavigate, onSignOut, onShowWhatsNew }) => {

    const NavLink: React.FC<{
        item: { name: string, icon: React.FC<{className?:string}>, page: Page | null, notification?: boolean };
    }> = ({ item }) => (
        <a
            href="#"
            onClick={(e) => {
                e.preventDefault();
                if (item.name === 'Sign Out') onSignOut();
                else if (item.name.includes("What's New")) onShowWhatsNew();
                else if (item.page !== null) onNavigate(item.page);
            }}
            className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group relative text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-white`}
        >
             <div className="absolute inset-0 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:bg-gray-100 dark:group-hover:bg-gray-800/60"></div>
            <div className="relative flex items-center">
                 <item.icon className="h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-white" />
                <span className="ml-4 font-medium text-sm">{item.name}</span>
            </div>
            {item.notification && <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-cyan-400 rounded-full ring-2 ring-white dark:ring-gray-900"></span>}
        </a>
    );

    return (
        <nav className="p-4 flex flex-col h-full bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl border-r dark:border-gray-800">
            <div className="flex items-center mb-10 px-2">
                <LogoIcon className="h-9 w-9" />
                <div className="ml-3">
                    <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-500">
                        SnakeEngine
                    </h1>
                    <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 tracking-wider">BY ADITYA DWIVEDI & RASHISH SINGH</p>
                </div>
            </div>
            <div className="flex-grow space-y-2 overflow-y-auto pr-2">
                {Object.entries(NAVIGATION_ITEMS).map(([section, items]) => (
                    <div key={section}>
                        <h2 className="px-3 mt-6 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">{section}</h2>
                        <div className="space-y-1">
                            {items.map(item => (
                                <NavLink key={item.name} item={item} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </nav>
    );
};

const TabBar: React.FC<{
    tabs: Tab[];
    activeTabId: string;
    onSelectTab: (id: string) => void;
    onCloseTab: (id: string) => void;
}> = ({ tabs, activeTabId, onSelectTab, onCloseTab }) => {
     return (
        <div className="flex-shrink-0 bg-gray-100/50 dark:bg-gray-900/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-1 p-1 overflow-x-auto">
                {tabs.map(tab => (
                    <div
                        key={tab.id}
                        onClick={() => onSelectTab(tab.id)}
                        className={`flex items-center justify-between px-4 py-2 rounded-md cursor-pointer text-sm whitespace-nowrap transition-colors duration-200 ${
                            activeTabId === tab.id
                                ? 'bg-white dark:bg-gray-700/50 shadow-sm'
                                : 'hover:bg-gray-200/50 dark:hover:bg-gray-700/20'
                        }`}
                    >
                        <span className={`mr-4 font-medium ${activeTabId === tab.id ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-300'}`}>
                            {tab.name}
                        </span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onCloseTab(tab.id);
                            }}
                            className="h-5 w-5 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isWhatsNewOpen, setIsWhatsNewOpen] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    
    const { theme, toggleTheme, clearTheme } = useTheme();
    const { clearAllChats } = useChatHistory();
    const { clearAllTrackedCourses } = useCourseTracking();
    const { clearAiPersona } = useAiPersona();
    
    // --- WORKSPACE STATE ---
    const [tabs, setTabs] = useState<Tab[]>([]);
    const [activeTabId, setActiveTabId] = useState<string>('');
    
    useEffect(() => {
        // Initialize with Home tab
        if(isLoggedIn && tabs.length === 0){
            openInTab({ page: Page.Home, name: "Home" });
        }
    }, [isLoggedIn]);

    useEffect(() => {
        const hasVisited = localStorage.getItem('hasVisited');
        if (!hasVisited && isLoggedIn) {
            setShowOnboarding(true);
            localStorage.setItem('hasVisited', 'true');
        }
    }, [isLoggedIn]);

    const handleLogin = () => setIsLoggedIn(true);
    const handleSignOut = () => {
        // Clear all data on sign out as well
        handleDeleteAllData();
    };

    const openInTab = useCallback((options: { page: Page; name: string; toolId?: string }) => {
        const { page, name, toolId } = options;
        // Check for existing tab: for tools, check toolId; for pages, check page
        const existingTab = tabs.find(t => 
            (toolId && t.toolId === toolId) || 
            (!toolId && t.page === page)
        );

        if (existingTab) {
            setActiveTabId(existingTab.id);
        } else {
            const newTab: Tab = {
                id: `tab_${Date.now()}`,
                name,
                page,
                toolId,
            };
            setTabs(prev => [...prev, newTab]);
            setActiveTabId(newTab.id);
        }
        if (window.innerWidth < 1024) setIsSidebarOpen(false);
    }, [tabs]);
    
    const closeTab = (tabId: string) => {
        setTabs(prev => {
            const index = prev.findIndex(t => t.id === tabId);
            const newTabs = prev.filter(t => t.id !== tabId);
            if (activeTabId === tabId) {
                const newActiveId = newTabs[index - 1]?.id || newTabs[0]?.id || '';
                setActiveTabId(newActiveId);
            }
            if(newTabs.length === 0) openInTab({ page: Page.Home, name: "Home" });
            return newTabs;
        });
    };
    
     const handleDeleteAllData = () => {
        // Clear all data from hooks
        clearAllChats();
        clearTheme();
        clearAllTrackedCourses();
        clearAiPersona();
        
        localStorage.removeItem('hasVisited');

        // Logout
        setIsLoggedIn(false);
        // Reset workspace
        setTabs([]);
        setActiveTabId('');
    };

    const renderPageInTab = (tab: Tab | undefined) => {
        if (!tab) return <HomePage />;

        // Prioritize rendering a tool if a toolId is present
        if (tab.toolId) {
            switch(tab.toolId) {
                case 'live-chat': return <LiveChatTool />;
                case 'audio-transcription': return <AudioTranscriptionTool />;
                case 'image-generation': return <ImageGenerationTool />;
                case 'image-editing': return <ImageEditingTool />;
                case 'video-generation': return <VideoGenerationTool />;
                case 'text-to-speech': return <TextToSpeechTool />;
                case 'image-analysis': return <ImageAnalysisTool />;
                case 'video-analysis': return <VideoAnalysisTool />;
                case 'web-search': return <WebSearchTool />;
                case 'local-discovery': return <LocalDiscoveryTool />;
                case 'study-plan': return <StudyPlanGeneratorTool />;
                case 'code-reviewer': return <CodeReviewerTool />;
                case 'document-summarizer': return <DocumentSummarizerTool />;
                case 'thinking-mode': return <ThinkingModeTool />;
            }
        }
        
        // Fallback to rendering a general page
        switch (tab.page) {
            case Page.Home: return <HomePage />;
            case Page.SmartStudio: return <SmartStudioPage onOpenInTab={openInTab} />;
            case Page.Courses: return <CoursesPage />;
            case Page.MyLearning: return <MyLearningPage />;
            case Page.Promo: return <PromoPage />;
            case Page.Settings: return <SettingsPage theme={theme} onToggleTheme={toggleTheme} onDeleteAllData={handleDeleteAllData} />;
            case Page.Plans: return <PlansPage />;
            case Page.Help: return <HelpPage />;
            case Page.Plugins: return <PluginsPage />;
            default:
                return <HomePage />;
        }
    };
    
    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 1024px)');
        const handler = (e: MediaQueryListEvent) => setIsSidebarOpen(e.matches);
        setIsSidebarOpen(mediaQuery.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    if (!isLoggedIn) {
        return <LoginPage onLogin={handleLogin} />;
    }

    const activeTab = tabs.find(t => t.id === activeTabId);

    return (
        <div className="h-screen w-full flex bg-gray-100 dark:bg-[#111827] text-gray-800 dark:text-gray-200">
            <div className="aurora-background">
                <div className="aurora-shape aurora-shape-1"></div>
                <div className="aurora-shape aurora-shape-2"></div>
                <div className="aurora-shape aurora-shape-3"></div>
            </div>
            <aside className={`fixed lg:relative z-20 h-full w-64 lg:w-72 flex-shrink-0 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <Sidebar
                    onNavigate={(page) => {
                        const pageName = NAVIGATION_ITEMS.MAIN.find(i => i.page === page)?.name || 
                                         NAVIGATION_ITEMS.ACCOUNT.find(i => i.page === page)?.name || 
                                         NAVIGATION_ITEMS.RESOURCES.find(i => i.page === page)?.name || 'Page';
                        openInTab({ page, name: pageName });
                    }}
                    onSignOut={handleSignOut}
                    onShowWhatsNew={() => setIsWhatsNewOpen(true)}
                />
            </aside>
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="lg:hidden relative flex items-center justify-between p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border-b dark:border-gray-800 flex-shrink-0">
                    <div className="flex items-center">
                        <LogoIcon className="h-8 w-8" />
                        <div className="ml-2">
                            <span className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-500">SnakeEngine</span>
                             <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">BY ADITYA DWIVEDI & RASHISH SINGH</p>
                        </div>
                    </div>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <MenuIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                    </button>
                </header>
                <TabBar tabs={tabs} activeTabId={activeTabId} onSelectTab={setActiveTabId} onCloseTab={closeTab} />
                <main className="flex-1 overflow-y-auto">
                    {renderPageInTab(activeTab)}
                </main>
                <Footer />
            </div>
            {isWhatsNewOpen && <WhatsNewModal onClose={() => setIsWhatsNewOpen(false)} />}
            {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}
        </div>
    );
};

export default App;