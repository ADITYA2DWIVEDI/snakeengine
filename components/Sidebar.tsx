/// <reference types="react" />
import React, { useState } from 'react';
import { Page, Feature } from '../types';
import { Icon } from './icons';

interface SidebarProps {
    activePage: Page;
    setActivePage: (page: Page, subPage?: Feature) => void;
    isCollapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
    isMobileOpen: boolean;
    setMobileOpen: (open: boolean) => void;
    id?: string;
    onLogout: () => void;
    isAuthenticated: boolean;
    onLoginRequest: () => void;
    hasNewUpdates: boolean;
}

const navSections = [
    {
        title: 'Main',
        pages: [Page.HOME, Page.BUILD_EVERYTHING]
    },
    {
        title: 'Tools',
        pages: [Page.AI_BUSINESS, Page.LIVE_CHAT_PLATFORM]
    },
    {
        title: 'Account',
        pages: [Page.SETTINGS, Page.PLANS_SUBSCRIPTIONS, Page.TOP_MODEL_KEYS, Page.OWNER_ADMINS]
    },
    {
        title: 'Resources',
        pages: [Page.COURSES, Page.HELP_SUPPORT]
    },
];

const Sidebar: React.FC<SidebarProps> = ({ 
    activePage, setActivePage, isCollapsed, setCollapsed, 
    isMobileOpen, setMobileOpen, id, isAuthenticated, onLoginRequest, onLogout, hasNewUpdates 
}) => {
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        'Main': true, 'Tools': true, 'Account': true, 'Resources': true,
    });
    
    const isPageActive = (page: Page) => activePage === page;

    const toggleSection = (title: string) => {
        if (!isCollapsed) {
            setOpenSections(prev => ({ ...prev, [title]: !prev[title] }));
        }
    };

    const NavLink: React.FC<{ page: Page; }> = ({ page }) => (
        <li>
            <button
                onClick={() => setActivePage(page)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                    isPageActive(page)
                        ? 'bg-gradient-to-r from-purple-500 to-teal-500 text-white shadow-md'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
            >
                <Icon name={page} className="w-5 h-5 flex-shrink-0" />
                <span className={`whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? 'md:opacity-0' : 'opacity-100'}`}>{page}</span>
            </button>
        </li>
    );

    return (
        <nav 
            id={id}
            className={`fixed top-0 left-0 h-full bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col z-40 transition-transform duration-300 ease-in-out
            md:translate-x-0 ${isCollapsed ? 'md:w-20' : 'w-64'} w-64
            ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
            <div className={`flex items-center gap-2 h-16 md:h-20 border-b border-slate-200 dark:border-slate-700 px-6`}>
                 <Icon name="logo" className="w-8 h-8 flex-shrink-0"/>
                <h1 className={`text-xl font-bold gradient-text whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? 'md:opacity-0' : 'opacity-100'}`}>SnakeEngine</h1>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
                {navSections.map(section => (
                    <div key={section.title}>
                        <button onClick={() => toggleSection(section.title)} className={`w-full flex items-center justify-between mt-4 mb-2 px-3`}>
                            <h2 className={`text-xs font-semibold text-slate-400 uppercase tracking-wider transition-opacity duration-200 ${isCollapsed ? 'md:opacity-0' : 'opacity-100'}`}>{section.title}</h2>
                            <Icon name="chevron-right" className={`w-4 h-4 text-slate-400 transition-all duration-200 ${openSections[section.title] ? 'rotate-90' : ''} ${isCollapsed ? 'opacity-0' : ''}`} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${isCollapsed || openSections[section.title] ? 'max-h-[500px]' : 'max-h-0'}`}>
                            <ul className="space-y-2">
                                {section.pages.map(page => <NavLink key={page} page={page} />)}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                <ul className="space-y-2">
                     <li>
                        <a
                            href="snakeengine.ai.apk"
                            download
                            className="w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                        >
                            <Icon name="android" className="w-5 h-5 flex-shrink-0 text-green-500" />
                            <span className={`whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? 'md:opacity-0' : 'opacity-100'}`}>Download App</span>
                        </a>
                    </li>
                     <li>
                        <button
                            onClick={() => setActivePage(Page.WHATS_NEW)}
                            className="w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 relative"
                        >
                            <Icon name="gift" className="w-5 h-5 flex-shrink-0 text-purple-500 dark:text-teal-400" />
                            <span className={`whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? 'md:opacity-0' : 'opacity-100'}`}>What's New</span>
                             {hasNewUpdates && (
                                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-teal-400 border-2 border-white dark:border-slate-800"></span>
                            )}
                        </button>
                    </li>
                    {isAuthenticated ? (
                        <li>
                            <button
                                onClick={onLogout}
                                className="w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400"
                            >
                                <Icon name="sign-out" className="w-5 h-5 flex-shrink-0" />
                                <span className={`whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? 'md:opacity-0' : 'opacity-100'}`}>Sign Out</span>
                            </button>
                        </li>
                    ) : (
                        <li>
                            <button
                                onClick={onLoginRequest}
                                className="w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200"
                            >
                                <Icon name="profile" className="w-5 h-5 flex-shrink-0" />
                                <span className={`whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? 'md:opacity-0' : 'opacity-100'}`}>Sign In</span>
                            </button>
                        </li>
                    )}
                    <li className="hidden md:block">
                        <button 
                            onClick={() => setCollapsed(!isCollapsed)} 
                            className="w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                        >
                            <Icon name={isCollapsed ? 'chevron-right' : 'chevron-left'} className="w-5 h-5 flex-shrink-0" />
                            <span className={`whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>Collapse</span>
                        </button>
                    </li>
                </ul>
                 <div className={`mt-4 text-center transition-opacity duration-200 ${isCollapsed ? 'md:opacity-0 md:hidden' : 'opacity-100'}`}>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                        &copy; {new Date().getFullYear()} SnakeEngineOfficial.
                        <br/>
                        All Rights Reserved.
                    </p>
                </div>
            </div>
        </nav>
    );
};

export default Sidebar;