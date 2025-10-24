/// <reference types="react" />
import React from 'react';
import { Page, Feature, FontStyle, DesignDensity } from './types';
import Sidebar from './components/Sidebar';
import HomeView from './components/views/HomeView';
import SettingsView from './components/views/SettingsView';
import PlansView from './components/views/PlansView';
import { Icon } from './components/icons';
import LoginView from './components/views/LoginView';
import WhatsNewView from './components/views/WhatsNewView';
import AdminView from './components/views/AdminView';
import HelpView from './components/views/HelpView';
import CoursesView from './components/views/CoursesView';
import BuildEverythingView from './components/views/BuildEverythingView';
// Fix: Import the missing TopModelKeysView component.
import TopModelKeysView from './components/views/TopModelKeysView';
import AIBusinessView from './components/views/AIBusinessView';
import LiveChatPlatformView from './components/views/LiveChatPlatformView';

interface ActivePage {
    page: Page;
    subPage?: string; // For deep-linking into features
}

const ApiKeyBanner: React.FC = () => (
    <div className="bg-yellow-500 dark:bg-yellow-600 text-white p-2 h-10 flex items-center justify-center text-center text-sm fixed top-0 left-0 right-0 z-50 shadow-lg">
        <strong>Warning:</strong> API_KEY is not configured. Most AI features will not work. For Video Generation, please use the in-app API key selector.
    </div>
);

const App: React.FC = () => {
    const [activePage, setActivePage] = React.useState<ActivePage>({ page: Page.HOME });
    const [isSidebarCollapsed, setSidebarCollapsed] = React.useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [isApiKeyMissing, setIsApiKeyMissing] = React.useState(false);
    const [isLoginVisible, setIsLoginVisible] = React.useState(false);
    const [isWhatsNewVisible, setIsWhatsNewVisible] = React.useState(false);
    const [hasSeenWhatsNew, setHasSeenWhatsNew] = React.useState(false);

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
        const shadow = parseFloat(localStorage.getItem('snakeEngineShadowStrength') || '1');
        const density = localStorage.getItem('snakeEngineDesignDensity') as DesignDensity || 'Comfortable';
        
        let densityStyles = '';
        if (density === 'Compact') {
            densityStyles = `
                .p-2 { padding: 0.25rem; } .p-3 { padding: 0.5rem; } .p-4 { padding: 0.75rem; } .p-6 { padding: 1rem; } .p-8 { padding: 1.5rem; }
                .py-2 { padding-top: 0.25rem; padding-bottom: 0.25rem; } .py-3 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
                .gap-2 { gap: 0.25rem; } .gap-3 { gap: 0.5rem; } .gap-4 { gap: 0.75rem; } .gap-6 { gap: 1rem; } .gap-8 { gap: 1.5rem; }
                .space-y-2 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.25rem; } .space-y-4 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.75rem; } .space-y-6 > :not([hidden]) ~ :not([hidden]) { margin-top: 1rem; }
            `;
        } else if (density === 'Spacious') {
             densityStyles = `
                .p-2 { padding: 0.75rem; } .p-3 { padding: 1rem; } .p-4 { padding: 1.5rem; } .p-6 { padding: 2.25rem; } .p-8 { padding: 3rem; }
                .py-2 { padding-top: 0.75rem; padding-bottom: 0.75rem; } .py-3 { padding-top: 1rem; padding-bottom: 1rem; }
                .gap-2 { gap: 0.75rem; } .gap-3 { gap: 1rem; } .gap-4 { gap: 1.5rem; } .gap-6 { gap: 2rem; } .gap-8 { gap: 2.5rem; }
                .space-y-2 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.75rem; } .space-y-4 > :not([hidden]) ~ :not([hidden]) { margin-top: 1.5rem; } .space-y-6 > :not([hidden]) ~ :not([hidden]) { margin-top: 2rem; }
            `;
        }
        
        styleElement.innerHTML = `
            body { font-family: '${font}', sans-serif; }
            .rounded-sm { border-radius: ${radius * 0.5}px; }
            .rounded-md { border-radius: ${radius * 0.75}px; }
            .rounded-lg { border-radius: ${radius}px; }
            .rounded-xl { border-radius: ${radius * 1.25}px; }
            .rounded-2xl { border-radius: ${radius * 1.5}px; }
            
            .shadow-sm { box-shadow: 0 1px 2px 0 rgb(0 0 0 / ${0.05 * shadow}); }
            .shadow-md { box-shadow: 0 4px 6px -1px rgb(0 0 0 / ${0.1 * shadow}), 0 2px 4px -2px rgb(0 0 0 / ${0.1 * shadow}); }
            .shadow-lg { box-shadow: 0 10px 15px -3px rgb(0 0 0 / ${0.1 * shadow}), 0 4px 6px -4px rgb(0 0 0 / ${0.1 * shadow}); }
            .shadow-xl { box-shadow: 0 20px 25px -5px rgb(0 0 0 / ${0.1 * shadow}), 0 8px 10px -6px rgb(0 0 0 / ${0.1 * shadow}); }
            
            .dark .shadow-sm, .dark .shadow-md, .dark .shadow-lg, .dark .shadow-xl {
                 box-shadow: 0 0 #0000, 0 0 #0000, 0 10px 15px -3px rgb(0 0 0 / ${0.3 * shadow}), 0 4px 6px -4px rgb(0 0 0 / ${0.3 * shadow});
            }
            ${densityStyles}
        `;
    };

    React.useEffect(() => {
        if (!process.env.API_KEY) {
            console.warn("API_KEY environment variable is not set. Most features will fail.");
            setIsApiKeyMissing(true);
        }

        try {
            const authStatus = localStorage.getItem('snakeEngineAuthenticated');
            if (authStatus === 'true') {
                setIsAuthenticated(true);
            }
            const seenStatus = localStorage.getItem('snakeEngineSeenWhatsNew');
            if (seenStatus === 'true') {
                setHasSeenWhatsNew(true);
            }
        } catch (error) {
            console.error("Could not access localStorage.", error);
        }

        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        
        applyDynamicStyles();

        // Add protection against content copying
        const handleContextMenu = (e: MouseEvent) => e.preventDefault();
        document.addEventListener('contextmenu', handleContextMenu);

        const style = document.createElement('style');
        style.innerHTML = `
          body, html {
            -webkit-user-select: none; /* Safari */
            -ms-user-select: none; /* IE 10 and IE 11 */
            user-select: none; /* Standard syntax */
          }
        `;
        document.head.appendChild(style);

        return () => {
          document.removeEventListener('contextmenu', handleContextMenu);
          if(document.head.contains(style)) {
            document.head.removeChild(style);
          }
        };
    }, []);
    
    const handleLogin = (remember: boolean) => {
        if (remember) {
            localStorage.setItem('snakeEngineAuthenticated', 'true');
        }
        setIsAuthenticated(true);
        setIsLoginVisible(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('snakeEngineAuthenticated');
        setIsAuthenticated(false);
        setMobileMenuOpen(false);
    };

    const handleShowLogin = () => {
        setIsLoginVisible(true);
        setMobileMenuOpen(false);
    };

    const handleCloseLogin = () => {
        setIsLoginVisible(false);
    };

    const handleShowWhatsNew = () => {
        setIsWhatsNewVisible(true);
        setHasSeenWhatsNew(true);
        localStorage.setItem('snakeEngineSeenWhatsNew', 'true');
        setMobileMenuOpen(false);
    }

    const handleSetActivePage = (page: Page, subPage?: Feature) => {
        if (page === Page.WHATS_NEW) {
            handleShowWhatsNew();
            return;
        }
        setActivePage({ page, subPage });
        setMobileMenuOpen(false);
    };

    const renderPage = () => {
        switch (activePage.page) {
            case Page.HOME:
                return <HomeView setActivePage={handleSetActivePage} />;
            case Page.BUILD_EVERYTHING:
                return <BuildEverythingView initialFeature={activePage.subPage as Feature} />;
            case Page.AI_BUSINESS:
                return <AIBusinessView />;
            case Page.LIVE_CHAT_PLATFORM:
                return <LiveChatPlatformView />;
            case Page.COURSES:
                return <CoursesView />;
            case Page.SETTINGS:
                return <SettingsView applyStyles={applyDynamicStyles} />;
            case Page.PLANS_SUBSCRIPTIONS:
                return <PlansView />;
            case Page.TOP_MODEL_KEYS:
                return <TopModelKeysView />;
            case Page.OWNER_ADMINS:
                return <AdminView />;
            case Page.HELP_SUPPORT:
                return <HelpView />;
            default:
                return <HomeView setActivePage={handleSetActivePage} />;
        }
    };

    return (
        <div className="h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-300 overflow-hidden">
            {isApiKeyMissing && <ApiKeyBanner />}
            <Sidebar 
                id="mobile-sidebar"
                activePage={activePage.page} 
                setActivePage={handleSetActivePage}
                isCollapsed={isSidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
                isMobileOpen={isMobileMenuOpen}
                setMobileOpen={setMobileMenuOpen}
                isAuthenticated={isAuthenticated}
                onLoginRequest={handleShowLogin}
                onLogout={handleLogout}
                hasNewUpdates={!hasSeenWhatsNew}
            />

            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 z-30 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                ></div>
            )}

            <main className={`flex-1 flex flex-col h-full transition-all duration-300 ease-in-out md:${isSidebarCollapsed ? 'ml-20' : 'ml-64'} ${isApiKeyMissing ? 'pt-10' : ''}`}>
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between h-16 px-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <button 
                        onClick={() => setMobileMenuOpen(prev => !prev)} 
                        className="p-2 text-slate-500 dark:text-slate-400"
                        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="mobile-sidebar"
                    >
                        <Icon name="hamburger" className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-2">
                        <Icon name="logo" className="w-7 h-7" />
                        <h1 className="text-lg font-bold gradient-text">SnakeEngine</h1>
                    </div>
                    <div className="w-8" /> {/* Spacer to center the title */}
                </header>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <div className="mx-auto w-full h-full max-w-screen-2xl">
                        {renderPage()}
                    </div>
                </div>
            </main>

            {isLoginVisible && (
                <div className="fixed inset-0 z-50 animate-fade-in">
                    <LoginView
                        onLoginSuccess={handleLogin}
                        isModal={true}
                        onClose={handleCloseLogin}
                    />
                </div>
            )}
            
            {isWhatsNewVisible && (
                <WhatsNewView onClose={() => setIsWhatsNewVisible(false)} />
            )}
        </div>
    );
};

export default App;