import React from 'react';
import { User } from '../types';
import { 
    LogoIcon, DashboardIcon, ChatIcon, ImageIcon, VideoIcon, TemplatesIcon, 
    SearchIcon, DiscoverIcon, ExcelIcon, SettingsIcon, SubscriptionIcon, HelpIcon, 
    AudioIcon, CodeIcon, ArticleIcon, CommunityIcon, CreatorsIcon, AdminIcon, 
    TrendingIcon, HistoryIcon, PersonaIcon, DocumentIcon, MusicIcon, WebsiteIcon,
    PresentationIcon, EmailIcon, PlusIcon, LiveIcon, IdeaIcon, TranslatorIcon,
    PodcastIcon, CalendarIcon, DumbbellIcon, GlobeIcon, GamepadIcon,
    LeaderboardIcon, TrophyIcon, LogoutIcon, UserCircleIcon,
    FinancialIcon, HealthIcon, StyleIcon
} from './Icons';
import { View } from '../App';

interface SidebarProps {
    currentView: View;
    setCurrentView: (view: View) => void;
    onNewChat: () => void;
    user: User | null;
    onLogout: () => void;
}

const NavItem: React.FC<{
    view: View;
    label: string;
    icon: React.ReactNode;
    currentView: View;
    onClick: (view: View) => void;
}> = ({ view, label, icon, currentView, onClick }) => (
    <button
        onClick={() => onClick(view)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            currentView === view
                ? 'bg-brand-purple/10 text-brand-purple'
                : 'text-slate-500 hover:bg-slate-100'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

const SectionTitle: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mt-6 mb-2">
      {children}
    </h3>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, onNewChat, user, onLogout }) => {
    return (
        <aside className="w-64 bg-white/80 backdrop-blur-lg border-r border-border-color flex flex-col p-4 shadow-lg">
            <div className="flex items-center gap-2 px-2 mb-6">
                <div className="w-10 h-10 bg-black rounded-lg shadow-md flex items-center justify-center p-1.5 text-brand-purple">
                    <LogoIcon />
                </div>
                <h1 className="text-xl font-bold text-text-primary">SnakeEngine</h1>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                 <button onClick={onNewChat} className="w-full flex items-center justify-center gap-2 py-2.5 px-4 mb-4 bg-brand-purple text-white font-semibold rounded-lg shadow-lg hover:bg-brand-purple/80 transition-all duration-200 hover:shadow-glow-purple">
                    <PlusIcon className="w-5 h-5" /> New Chat
                </button>
                <nav className="flex flex-col gap-1">
                    <NavItem view="dashboard" label="Dashboard" icon={<DashboardIcon />} currentView={currentView} onClick={setCurrentView} />
                    <NavItem view="chat" label="Chat" icon={<ChatIcon />} currentView={currentView} onClick={setCurrentView} />
                    <NavItem view="history" label="History" icon={<HistoryIcon />} currentView={currentView} onClick={setCurrentView} />
                    <NavItem view="search" label="Search" icon={<SearchIcon />} currentView={currentView} onClick={setCurrentView} />
                
                    <SectionTitle>Create</SectionTitle>
                    <NavItem view="imageGen" label="Image Gen" icon={<ImageIcon />} currentView={currentView} onClick={setCurrentView} />
                    <NavItem view="videoGen" label="Video Gen" icon={<VideoIcon />} currentView={currentView} onClick={setCurrentView} />
                    <NavItem view="writer" label="Content Writer" icon={<ArticleIcon />} currentView={currentView} onClick={setCurrentView} />
                    <NavItem view="music" label="Music Composer" icon={<MusicIcon />} currentView={currentView} onClick={setCurrentView} />
                    <NavItem view="podcast" label="Podcast Script" icon={<PodcastIcon />} currentView={currentView} onClick={setCurrentView} />
                    <NavItem view="presentation" label="Presentations" icon={<PresentationIcon />} currentView={currentView} onClick={setCurrentView} />
                    <NavItem view="website" label="Website Builder" icon={<WebsiteIcon />} currentView={currentView} onClick={setCurrentView} />

                    <SectionTitle>Tools</SectionTitle>
                    <NavItem view="live" label="Live Conversation" icon={<LiveIcon />} currentView={currentView} onClick={setCurrentView} />
                    <NavItem view="idea" label="Idea Generator" icon={<IdeaIcon />} currentView={currentView} onClick={setCurrentView} />
                    <NavItem view="translator" label="Translator" icon={<TranslatorIcon />} currentView={currentView} onClick={setCurrentView} />
                    <NavItem view="templates" label="Templates" icon={<TemplatesIcon />} currentView={currentView} onClick={setCurrentView} />
                    <NavItem view="persona" label="Persona Hub" icon={<PersonaIcon />} currentView={currentView} onClick={setCurrentView} />
                    <NavItem view="code" label="Code Assistant" icon={<CodeIcon />} currentView={currentView} onClick={setCurrentView} />
                    <NavItem view="audio" label="Audio Tool" icon={<AudioIcon />} currentView={currentView} onClick={setCurrentView} />
                    <NavItem view="document" label="Doc Analyzer" icon={<DocumentIcon />} currentView={currentView} onClick={setCurrentView} />
                    <NavItem view="excel" label="Excel Automation" icon={<ExcelIcon />} currentView={currentView} onClick={setCurrentView} />
                    <NavItem view="email" label="Email Assistant" icon={<EmailIcon />} currentView={currentView} onClick={setCurrentView} />
                    
                    <SectionTitle>Planners</SectionTitle>
                    <NavItem view="social" label="Social Planner" icon={<CalendarIcon />} currentView={currentView} onClick={setCurrentView} />
                    <NavItem view="fitness" label="Fitness Planner" icon={<DumbbellIcon />} currentView={currentView} onClick={setCurrentView} />
                    <NavItem view="travel" label="Travel Planner" icon={<GlobeIcon />} currentView={currentView} onClick={setCurrentView} />
                    <NavItem view="game" label="Game Creator" icon={<GamepadIcon />} currentView={currentView} onClick={setCurrentView} />

                    <SectionTitle>Pro Tools</SectionTitle>
                    <NavItem view="financial" label="Financial Analyst" icon={<FinancialIcon />} currentView={currentView} onClick={setCurrentView} />
                    <NavItem view="health" label="Health Advisor" icon={<HealthIcon />} currentView={currentView} onClick={setCurrentView} />
                    <NavItem view="stylist" label="Personal Stylist" icon={<StyleIcon />} currentView={currentView} onClick={setCurrentView} />
                    
                    <SectionTitle>Community</SectionTitle>
                    <NavItem view="discover" label="Discover" icon={<DiscoverIcon />} currentView={currentView} onClick={setCurrentView} />
                    <NavItem view="trending" label="Trending" icon={<TrendingIcon />} currentView={currentView} onClick={setCurrentView} />
                    <NavItem view="community" label="Community Hub" icon={<CommunityIcon />} currentView={currentView} onClick={setCurrentView} />
                    <NavItem view="creators" label="Creators" icon={<CreatorsIcon />} currentView={currentView} onClick={setCurrentView} />
                    <NavItem view="leaderboard" label="Leaderboard" icon={<LeaderboardIcon />} currentView={currentView} onClick={setCurrentView} />
                    <NavItem view="challenges" label="Challenges" icon={<TrophyIcon />} currentView={currentView} onClick={setCurrentView} />
                </nav>
            </div>

            <div className="mt-auto pt-4 border-t border-border-color">
                 {user && (
                    <div className="p-2 rounded-lg hover:bg-slate-100 mb-2">
                        <div className="flex items-center gap-3">
                            <UserCircleIcon className="w-10 h-10 text-slate-500" />
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-semibold text-text-primary truncate">{user.name}</p>
                                <p className="text-xs text-text-secondary truncate">{user.email}</p>
                            </div>
                            <button onClick={onLogout} title="Logout" className="p-2 text-slate-500 hover:text-brand-red rounded-md">
                                <LogoutIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                 )}
                 <div className="flex flex-col gap-1">
                    <NavItem view="subscription" label="Subscription" icon={<SubscriptionIcon />} currentView={currentView} onClick={setCurrentView} />
                    <NavItem view="help" label="Help" icon={<HelpIcon />} currentView={currentView} onClick={setCurrentView} />
                    <NavItem view="settings" label="Settings" icon={<SettingsIcon />} currentView={currentView} onClick={setCurrentView} />
                    {/* Fix: Corrected typo from `currentV-iew` to `currentView` to resolve a missing property error. */}
                    <NavItem view="admin" label="Admin Panel" icon={<AdminIcon />} currentView={currentView} onClick={setCurrentView} />
                 </div>
            </div>
        </aside>
    );
};
