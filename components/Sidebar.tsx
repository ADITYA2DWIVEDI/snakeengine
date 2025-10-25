import * as React from 'react';
import { Page } from '../types';
import { Icon } from './icons';

interface SidebarProps {
    activePage: Page;
    setActivePage: (page: Page) => void;
    isMobileOpen: boolean;
    setMobileOpen: (open: boolean) => void;
    handleLogout: () => void;
    openWhatsNew: () => void;
    id?: string;
}

const NavLink: React.FC<{ 
    page: Page; 
    activePage: Page; 
    setActivePage: (page: Page) => void;
    isWhatsNew?: boolean;
    openWhatsNew?: () => void;
}> = ({ page, activePage, setActivePage, isWhatsNew, openWhatsNew }) => (
    <li>
        <button
            onClick={() => isWhatsNew ? openWhatsNew && openWhatsNew() : setActivePage(page)}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 text-sm font-semibold ${
                activePage === page && !isWhatsNew
                    ? 'bg-gradient-to-r from-purple-500 to-teal-400 text-white shadow-lg'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title={page}
        >
            <Icon name={page} className="w-5 h-5 flex-shrink-0" />
            <span className="whitespace-nowrap">{page}</span>
            {isWhatsNew && <span className="w-2 h-2 rounded-full bg-teal-400 ml-auto"></span>}
        </button>
    </li>
);

const NavSection: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <div className="mt-4">
        <h3 className="px-3 text-xs font-bold uppercase text-slate-400 dark:text-slate-500">{title}</h3>
        <ul className="mt-2 space-y-1">
            {children}
        </ul>
    </div>
);


const Sidebar: React.FC<SidebarProps> = ({ 
    activePage, setActivePage, isMobileOpen, setMobileOpen, handleLogout, openWhatsNew
}) => {
    
    return (
        <nav 
            className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col z-40 transition-transform duration-300 ease-in-out
            ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
            <div className="flex items-center gap-2 h-16 border-b border-slate-200 dark:border-slate-700 px-6 flex-shrink-0">
                 <Icon name="logo" className="w-8 h-8 flex-shrink-0"/>
                <h1 className="text-xl font-bold gradient-text whitespace-nowrap">SnakeEngine</h1>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
                <NavSection title="Main">
                    <NavLink page={Page.HOME} {...{activePage, setActivePage}} />
                    <NavLink page={Page.SMART_STUDIO} {...{activePage, setActivePage}} />
                    <NavLink page={Page.COURSES} {...{activePage, setActivePage}} />
                </NavSection>

                 <NavSection title="Account">
                    <NavLink page={Page.SETTINGS} {...{activePage, setActivePage}} />
                    <NavLink page={Page.PLANS_SUBSCRIPTIONS} {...{activePage, setActivePage}} />
                </NavSection>
                
                 <NavSection title="Resources">
                    <NavLink page={Page.HELP_SUPPORT} {...{activePage, setActivePage}} />
                </NavSection>

                <NavSection title="Admin">
                    <NavLink page={Page.WHATS_NEW} isWhatsNew openWhatsNew={openWhatsNew} {...{activePage, setActivePage}} />
                </NavSection>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                 <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600"
                    title="Sign Out"
                >
                    <Icon name="sign-out" className="w-5 h-5 flex-shrink-0" />
                    <span className="whitespace-nowrap">Sign Out</span>
                </button>
            </div>
        </nav>
    );
};

export default Sidebar;