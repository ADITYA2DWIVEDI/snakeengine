import React, { useState, useEffect } from 'react';
import { Page } from './types';
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
import Footer from './components/Footer';
import StudyPlanGeneratorTool from './components/tools/StudyPlanGeneratorTool';
import CodeReviewerTool from './components/tools/CodeReviewerTool';
import DocumentSummarizerTool from './components/tools/DocumentSummarizerTool';
import { useTheme } from './hooks/useTheme';

const Sidebar: React.FC<{
    currentPage: Page;
    onNavigate: (page: Page) => void;
    onSignOut: () => void;
    onShowWhatsNew: () => void;
}> = ({ currentPage, onNavigate, onSignOut, onShowWhatsNew }) => {

    const NavLink: React.FC<{
        item: { name: string, icon: React.FC<{className?:string}>, page: Page | null, notification?: boolean };
        isActive: boolean;
    }> = ({ item, isActive }) => (
        <a
            href="#"
            onClick={(e) => {
                e.preventDefault();
                if (item.name === 'Sign Out') onSignOut();
                else if (item.name.includes("What's New")) onShowWhatsNew();
                else if (item.page !== null) onNavigate(item.page);
            }}
            className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${isActive ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'}`}
        >
            <item.icon className={`h-5 w-5 transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-white'}`} />
            <span className="ml-4 font-medium text-sm">{item.name}</span>
            {item.notification && <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-cyan-400 rounded-full ring-2 ring-white dark:ring-gray-900"></span>}
        </a>
    );

    return (
        <nav className="p-4 flex flex-col h-full bg-white dark:bg-gray-900/80 dark:backdrop-blur-sm border-r dark:border-gray-800">
            <div className="flex items-center mb-10 px-2">
                <LogoIcon className="h-9 w-9" />
                <h1 className="text-xl font-bold ml-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-500">
                    SnakeEngine
                </h1>
            </div>
            <div className="flex-grow space-y-2 overflow-y-auto">
                {Object.entries(NAVIGATION_ITEMS).map(([section, items]) => (
                    <div key={section}>
                        <h2 className="px-3 mt-6 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">{section}</h2>
                        <div className="space-y-1">
                            {items.map(item => (
                                <NavLink key={item.name} item={item} isActive={item.page === currentPage} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </nav>
    );
};

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isWhatsNewOpen, setIsWhatsNewOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const handleLogin = () => setIsLoggedIn(true);
    const handleSignOut = () => setIsLoggedIn(false);

    const handleNavigate = (page: Page) => {
        setCurrentPage(page);
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    };

    const renderPage = () => {
        switch (currentPage) {
            case Page.Home: return <HomePage />;
            case Page.SmartStudio: return <SmartStudioPage />;
            case Page.Courses: return <CoursesPage />;
            case Page.MyLearning: return <MyLearningPage />;
            case Page.Promo: return <PromoPage />;
            case Page.Settings: return <SettingsPage theme={theme} onToggleTheme={toggleTheme} />;
            case Page.Plans: return <PlansPage />;
            case Page.Help: return <HelpPage />;
            case Page.StudyPlan: return <StudyPlanGeneratorTool onBack={() => setCurrentPage(Page.SmartStudio)} />;
            case Page.CodeReviewer: return <CodeReviewerTool onBack={() => setCurrentPage(Page.SmartStudio)} />;
            case Page.DocumentSummarizer: return <DocumentSummarizerTool onBack={() => setCurrentPage(Page.SmartStudio)} />;
            default: return <HomePage />;
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

    return (
        <div className="h-screen w-full flex bg-gray-100 dark:bg-[#111827] text-gray-800 dark:text-gray-200 overflow-hidden">
            {isWhatsNewOpen && <WhatsNewModal onClose={() => setIsWhatsNewOpen(false)} />}
            
            {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/40 z-20 lg:hidden"></div>}

            <aside className={`fixed lg:relative top-0 left-0 h-full bg-white dark:bg-gray-900/80 dark:backdrop-blur-sm border-r border-gray-200 dark:border-gray-800 w-64 z-30 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <Sidebar 
                    currentPage={currentPage} 
                    onNavigate={handleNavigate}
                    onSignOut={handleSignOut}
                    onShowWhatsNew={() => setIsWhatsNewOpen(true)}
                />
            </aside>
            
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex-shrink-0 lg:hidden h-16 flex items-center justify-between px-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center">
                        <LogoIcon className="h-7 w-7" />
                        <h1 className="text-lg font-bold ml-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-500">
                            SnakeEngine
                        </h1>
                    </div>
                     <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600 dark:text-gray-400">
                        <MenuIcon />
                    </button>
                </header>
                <main className="flex-1 overflow-y-auto">
                    {renderPage()}
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default App;