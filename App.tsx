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
            className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-gradient-to-r from-purple-500 to-cyan-400 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
        >
            <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
            <span className="ml-4 font-medium">{item.name}</span>
            {item.notification && <span className="ml-auto h-2 w-2 bg-cyan-400 rounded-full"></span>}
        </a>
    );

    return (
        <nav className="p-4 flex flex-col h-full">
            <div className="flex items-center mb-8 px-2">
                <LogoIcon className="h-8 w-8" />
                <h1 className="text-xl font-bold ml-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-500">
                    SnakeEngine
                </h1>
            </div>
            <div className="flex-grow space-y-2">
                {Object.entries(NAVIGATION_ITEMS).map(([section, items]) => (
                    <div key={section}>
                        <h2 className="px-4 mt-6 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">{section}</h2>
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

    const handleLogin = () => setIsLoggedIn(true);
    const handleSignOut = () => setIsLoggedIn(false);

    const handleNavigate = (page: Page) => {
        setCurrentPage(page);
        setIsSidebarOpen(false);
    };

    const renderPage = () => {
        switch (currentPage) {
            case Page.Home: return <HomePage />;
            case Page.SmartStudio: return <SmartStudioPage />;
            case Page.Courses: return <CoursesPage />;
            case Page.Settings: return <SettingsPage />;
            case Page.Plans: return <PlansPage />;
            case Page.Help: return <HelpPage />;
            default: return <HomePage />;
        }
    };
    
    useEffect(() => {
        // Automatically open sidebar on larger screens
        const mediaQuery = window.matchMedia('(min-width: 1024px)');
        setIsSidebarOpen(mediaQuery.matches);
        const handler = (e: MediaQueryListEvent) => setIsSidebarOpen(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    if (!isLoggedIn) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <div className="h-screen w-full flex bg-gray-50 overflow-hidden">
            {isWhatsNewOpen && <WhatsNewModal onClose={() => setIsWhatsNewOpen(false)} />}
            
            {/* Sidebar Overlay for mobile */}
            {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/20 z-10 lg:hidden"></div>}

            <aside className={`fixed lg:static top-0 left-0 h-full bg-white border-r border-gray-200 w-72 z-20 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <Sidebar 
                    currentPage={currentPage} 
                    onNavigate={handleNavigate}
                    onSignOut={handleSignOut}
                    onShowWhatsNew={() => setIsWhatsNewOpen(true)}
                />
            </aside>
            
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex-shrink-0 lg:hidden h-16 flex items-center px-4 bg-white border-b border-gray-200">
                    <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600">
                        <MenuIcon />
                    </button>
                    <div className="flex items-center ml-4">
                        <LogoIcon className="h-7 w-7" />
                        <h1 className="text-lg font-bold ml-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-500">
                            SnakeEngine
                        </h1>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
};

export default App;
