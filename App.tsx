import React, { useState, useEffect, useCallback } from 'react';
import { Page, Tab, Chat } from './types';
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
import PluginsPage from './components/PluginsPage';
import OnboardingModal from './components/OnboardingModal';
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

// Import new plugin tools
import GmailTool from './components/tools/GmailTool';
import GoogleCalendarTool from './components/tools/GoogleCalendarTool';
import SlackTool from './components/tools/SlackTool';
import NotionTool from './components/tools/NotionTool';
import FigmaTool from './components/tools/FigmaTool';
import GitHubTool from './components/tools/GitHubTool';
import AboutUsPage from './components/AboutUsPage';


const Sidebar: React.FC<{
    onOpenInTab: (options: { page: Page, name: string }) => void;
    onSignOut: () => void;
    onShowWhatsNew: () => void;
    chats: Chat[];
    activeChatId: string | null;
    onNewChat: () => void;
    onSelectChat: (id: string) => void;
    onDeleteChat: (id: string) => void;
}> = ({ onOpenInTab, onSignOut, onShowWhatsNew, chats, activeChatId, onNewChat, onSelectChat, onDeleteChat }) => {

    const NavLink: React.FC<{
        item: { name: string, icon: React.FC<{className?:string}>, page: Page | null, notification?: boolean };
    }> = ({ item }) => (
        <a
            href="#"
            onClick={(e) => {
                e.preventDefault();
                if (item.name === 'Sign Out') onSignOut();
                else if (item.name.includes("What's New")) onShowWhatsNew();
                else if (item.page !== null) onOpenInTab({ page: item.page, name: item.name });
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
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">BY ADITYA DWIVEDI & RASHISH SINGH</p>
                </div>
            </div>

            <div className="flex-grow space-y-2 overflow-y-auto pr-2">
                <div key="MAIN_AND_HISTORY">
                    <h2 className="px-3 mt-6 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">MAIN</h2>
                    <div className="space-y-1">
                        {NAVIGATION_ITEMS.MAIN.map(item => (
                            <NavLink key={item.name} item={item} />
                        ))}
                    </div>

                    <div className="px-3 mt-6 mb-2 flex justify-between items-center">
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">History</h2>
                        <button onClick={onNewChat} className="text-xs font-semibold text-purple-500 hover:text-purple-400">+ New Chat</button>
                    </div>
                    <div className="space-y-1">
                        {chats.map(chat => (
                            <a
                                key={chat.id}
                                href="#"
                                onClick={(e) => { e.preventDefault(); onSelectChat(chat.id); }}
                                className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors group ${activeChatId === chat.id ? 'bg-purple-100 dark:bg-purple-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800/60'}`}
                            >
                                <span className={`text-sm truncate ${activeChatId === chat.id ? 'font-semibold text-purple-700 dark:text-purple-300' : 'text-gray-600 dark:text-gray-400'}`}>
                                    {chat.title || 'New Chat'}
                                </span>
                                <button onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </a>
                        ))}
                    </div>
                </div>

                {Object.entries(NAVIGATION_ITEMS).filter(([section]) => section !== 'MAIN').map(([section, items]) => (
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
    const { 
        chats, 
        activeChat, 
        createNewChat, 
        deleteChat, 
        setActiveChatId, 
        updateActiveChat,
        clearAllChats 
    } = useChatHistory();
    const { clearAllTrackedCourses } = useCourseTracking();
    const { clearAiPersona } = useAiPersona();
    
    // --- WORKSPACE STATE ---
    const [tabs, setTabs] = useState<Tab[]>([]);
    const [activeTabId, setActiveTabId] = useState<string>('');
    
    const openInTab = useCallback((options: { page: Page; name: string; toolId?: string }) => {
        const { page, name, toolId } = options;
        
        // Home always opens in the first tab if it exists, or creates it.
        if (page === Page.Home) {
            const homeTab = tabs.find(t => t.page === Page.Home);
            if (homeTab) {
                setActiveTabId(homeTab.id);
            } else {
                 const newTab: Tab = { id: `tab_home`, name: "Home", page: Page.Home };
                 setTabs(prev => [newTab, ...prev.filter(t => t.page !== Page.Home)]);
                 setActiveTabId(newTab.id);
            }
            if (window.innerWidth < 1024) setIsSidebarOpen(false);
            return;
        }

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

    useEffect(() => {
        if (isLoggedIn && tabs.length === 0) {
             openInTab({ page: Page.Home, name: "Home" });
        }
        if (isLoggedIn && chats.length === 0) {
            createNewChat();
        }
    }, [isLoggedIn, tabs.length, openInTab, chats.length, createNewChat]);

    useEffect(() => {
        const hasVisited = localStorage.getItem('hasVisited');
        if (!hasVisited && isLoggedIn) {
            setShowOnboarding(true);
            localStorage.setItem('hasVisited', 'true');
        }
    }, [isLoggedIn]);

    const handleLogin = () => setIsLoggedIn(true);
    const handleSignOut = () => {
        handleDeleteAllData();
    };

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
        clearAllChats();
        clearTheme();
        clearAllTrackedCourses();
        clearAiPersona();
        localStorage.removeItem('hasVisited');
        setIsLoggedIn(false);
        setTabs([]);
        setActiveTabId('');
    };

    const renderPageInTab = (tab: Tab | undefined) => {
        if (!tab) return <HomePage activeChat={activeChat} updateActiveChat={updateActiveChat} />;

        const toolId = tab.toolId;

        if (toolId) {
            switch(toolId) {
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
                case 'gmail': return <GmailTool />;
                case 'google-calendar': return <GoogleCalendarTool />;
                case 'slack': return <SlackTool />;
                case 'notion': return <NotionTool />;
                case 'figma': return <FigmaTool />;
                case 'github': return <GitHubTool />;
                default: return <SmartStudioPage onOpenInTab={openInTab} />;
            }
        }
        
        switch (tab.page) {
            case Page.Home: return <HomePage activeChat={activeChat} updateActiveChat={updateActiveChat} />;
            case Page.SmartStudio: return <SmartStudioPage onOpenInTab={openInTab} />;
            case Page.Courses: return <CoursesPage />;
            case Page.MyLearning: return <MyLearningPage />;
            case Page.Promo: return <PromoPage />;
            case Page.Settings: return <SettingsPage theme={theme} onToggleTheme={toggleTheme} onDeleteAllData={handleDeleteAllData} />;
            case Page.Plans: return <PlansPage />;
            case Page.Help: return <HelpPage />;
            case Page.Plugins: return <PluginsPage onOpenInTab={openInTab} />;
            case Page.AboutUs: return <AboutUsPage />;
            default:
                return <HomePage activeChat={activeChat} updateActiveChat={updateActiveChat} />;
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
                    onOpenInTab={openInTab}
                    onSignOut={handleSignOut}
                    onShowWhatsNew={() => setIsWhatsNewOpen(true)}
                    chats={chats}
                    activeChatId={activeChat?.id || null}
                    onNewChat={createNewChat}
                    onSelectChat={(id) => {
                        setActiveChatId(id);
                        openInTab({ page: Page.Home, name: "Home" });
                    }}
                    onDeleteChat={deleteChat}
                />
            </aside>
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="lg:hidden relative z-10 flex items-center justify-between p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border-b dark:border-gray-800 flex-shrink-0">
                    <div className="flex items-center">
                        <LogoIcon className="h-8 w-8" />
                         <div className="ml-2 flex flex-col items-start">
                            <span className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-500">SnakeEngine</span>
                             <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 -mt-1">BY ADITYA DWIVEDI & RASHISH SINGH</p>
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