import * as React from 'react';
import { Page, FontStyle } from './types';
import Sidebar from './components/Sidebar';
import HomeView from './components/views/HomeView';
import CoursesView from './components/views/CoursesView';
import SettingsView from './components/views/SettingsView';
import PlansView from './components/views/PlansView';
import HelpView from './components/views/HelpView';
import WhatsNewView from './components/views/WhatsNewView';
import LoginView from './components/views/LoginView';
import { Icon } from './components/icons';
import SmartStudioView from './components/views/SmartStudioView';

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [activePage, setActivePage] = React.useState<Page>(Page.HOME);
    const [isMainMenuOpen, setMainMenuOpen] = React.useState(false);
    const [isWhatsNewOpen, setIsWhatsNewOpen] = React.useState(false);
    
    // Check for saved login state
    React.useEffect(() => {
        const savedLogin = localStorage.getItem('snakeEngineLoggedIn');
        if (savedLogin === 'true') {
            setIsLoggedIn(true);
        }
    }, []);

    const applyDynamicStyles = () => {
        const styleId = 'dynamic-styles';
        let styleElement = document.getElementById(styleId) as HTMLStyleElement;
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }

        const font = localStorage.getItem('snakeEngineFontStyle') as FontStyle || 'Inter';
        const radius = parseInt(localStorage.getItem('snakeEngineCornerRadius') || '12', 10);
        
        styleElement.innerHTML = `
            body { font-family: '${font}', sans-serif; }
            .rounded-sm { border-radius: ${radius * 0.5}px; }
            .rounded-md { border-radius: ${radius * 0.75}px; }
            .rounded-lg { border-radius: ${radius}px; }
            .rounded-xl { border-radius: ${radius * 1.25}px; }
            .rounded-2xl { border-radius: ${radius * 1.5}px; }
        `;
    };

    React.useEffect(() => {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        applyDynamicStyles();
    }, []);
    
    const handleSetActivePage = (page: Page) => {
        setActivePage(page);
        setMainMenuOpen(false);
    };

    const handleLoginSuccess = (remember: boolean) => {
        setIsLoggedIn(true);
        if (remember) {
            localStorage.setItem('snakeEngineLoggedIn', 'true');
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('snakeEngineLoggedIn');
        handleSetActivePage(Page.HOME);
    };
    
    if (!isLoggedIn) {
        return <LoginView onLoginSuccess={handleLoginSuccess} />;
    }

    const renderPage = () => {
        switch (activePage) {
            case Page.HOME:
                return <HomeView />;
            case Page.SMART_STUDIO:
                return <SmartStudioView />;
            case Page.COURSES:
                return <CoursesView />;
            case Page.SETTINGS:
                return <SettingsView applyStyles={applyDynamicStyles} />;
            case Page.PLANS_SUBSCRIPTIONS:
                return <PlansView />;
            case Page.HELP_SUPPORT:
                return <HelpView />;
            default:
                return <HomeView />;
        }
    };

    return (
        <div className="h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-300 flex flex-col">
            {isWhatsNewOpen && <WhatsNewView onClose={() => setIsWhatsNewOpen(false)} />}
            
            <Sidebar 
                id="main-menu-sidebar"
                activePage={activePage} 
                setActivePage={handleSetActivePage}
                isMobileOpen={isMainMenuOpen}
                setMobileOpen={setMainMenuOpen}
                handleLogout={handleLogout}
                openWhatsNew={() => setIsWhatsNewOpen(true)}
            />

            {isMainMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 z-30"
                    onClick={() => setMainMenuOpen(false)}
                ></div>
            )}

            {/* Header */}
            <header className="flex items-center h-16 px-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex-shrink-0 gap-4 z-20">
                <button 
                    onClick={() => setMainMenuOpen(prev => !prev)} 
                    className="p-2 text-slate-500 dark:text-slate-400"
                    aria-label={isMainMenuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isMainMenuOpen}
                    aria-controls="main-menu-sidebar"
                >
                    <Icon name="hamburger" className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-2">
                    <Icon name="logo" className="w-7 h-7" />
                    <h1 className="text-lg font-bold gradient-text">SnakeEngine</h1>
                </div>
            </header>

            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto">
                    <div className="mx-auto w-full h-full p-4 sm:p-6">
                        {renderPage()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;