import React from 'react';

const Icon: React.FC<React.SVGProps<SVGSVGElement>> = ({ children, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        {children}
    </svg>
);


export const SendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></Icon>;
export const PaperclipIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></Icon>;
export const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Icon>;
export const AILogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/><circle cx="12" cy="12" r="2" fill="currentColor"/></Icon>;
export const TopicListIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs>
            <linearGradient id="topicListGradient" x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="#EC4899"/>
                <stop offset="1" stopColor="#8B5CF6"/>
            </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="12" fill="url(#topicListGradient)"/>
        <circle cx="6.5" cy="7.5" r="1.5" fill="white"/>
        <circle cx="6.5" cy="12" r="1.5" fill="white"/>
        <circle cx="6.5" cy="16.5" r="1.5" fill="white"/>
        <rect x="9.5" y="6.5" width="8" height="2" rx="1" fill="white"/>
        <rect x="9.5" y="11" width="8" height="2" rx="1" fill="white"/>
        <rect x="9.5" y="15.5" width="8" height="2" rx="1" fill="white"/>
    </svg>
);
export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M16.5 7.5C16.5 5.01472 14.4853 3 12 3C9.51472 3 7.5 5.01472 7.5 7.5C7.5 9.98528 9.51472 12 12 12C14.4853 12 16.5 14.0147 16.5 16.5C16.5 18.9853 14.4853 21 12 21C9.51472 21 7.5 18.9853 7.5 16.5" stroke="url(#paint0_linear_logo)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <defs>
        <linearGradient id="paint0_linear_logo" x1="12" y1="3" x2="12" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#8B5CF6"/>
        <stop offset="1" stopColor="#EC4899"/>
        </linearGradient>
        </defs>
    </svg>
);
export const ChatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></Icon>;
export const ImageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></Icon>;
export const TemplatesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></Icon>;
export const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Icon>;
export const MicIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="23"/><line x1="8" x2="16" y1="23" y2="23"/></Icon>;
export const LockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></Icon>;
export const VideoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></Icon>;
export const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Icon>;
export const SubscriptionIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></Icon>;
export const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></Icon>;
export const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Icon>;
export const PersonaIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></Icon>;
export const DocumentIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></Icon>;
export const MusicIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></Icon>;
export const ExcelIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></Icon>;
export const DashboardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></Icon>;
export const DiscoverIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></Icon>;
export const CodeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></Icon>;
export const HelpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></Icon>;
export const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></Icon>;
export const AudioIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M3 10v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/><path d="M15 10v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2z"/><path d="M4 14v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></Icon>;
export const CommunityIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Icon>;
export const CreatorsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></Icon>;
export const AdminIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></Icon>;
export const TrendingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></Icon>;
export const HistoryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/></Icon>;
export const LiveIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></Icon>;
export const IdeaIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M15.5 14h-7A4.5 4.5 0 0 1 4 9.5c0-2.49 2.01-4.5 4.5-4.5 1.54 0 2.9.78 3.75 2"/><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 18v-2"/><path d="M18 10.5c0 2.49-2.01 4.5-4.5 4.5-1.54 0-2.9-.78-3.75-2"/></Icon>;
export const TranslatorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M20 12h-8" /><path d="M17 2l-4 10" /><path d="M10 2l-4 10" /><path d="M12 12V2" /><path d="M22 22l-5-5" /><path d="M17 22l5-5" /></Icon>;
export const LogoutIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></Icon>;
export const MapIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></Icon>;
export const UserCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="4"/><path d="M12 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></Icon>;
export const GoogleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props} stroke="none" fill="currentColor"><path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C14.03,4.73 15.69,5.36 16.95,6.45L19.05,4.36C17.2,2.79 14.96,2 12.19,2C6.92,2 2.71,6.62 2.71,12C2.71,17.38 6.92,22 12.19,22C17.6,22 21.54,18.33 21.54,12.27C21.54,11.72 21.48,11.4 21.35,11.1Z" /></Icon>;
export const FacebookIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props} stroke="none" fill="currentColor"><path d="M13.397,20.997v-8.196h2.765l0.411-3.209h-3.176V7.548c0-0.926,0.258-1.555,1.587-1.555h1.684V3.127 C15.849,3.088,14.978,3.002,14.053,3.002c-2.822,0-4.752,1.726-4.752,4.887v2.368H6.623v3.209h2.678v8.196H13.397z"/></Icon>;
export const GitHubIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props} stroke="none" fill="currentColor"><path d="M12,2C6.477,2,2,6.477,2,12c0,4.419,2.865,8.166,6.839,9.491c0.5,0.092,0.682-0.217,0.682-0.482 c0-0.237-0.009-0.865-0.014-1.699c-2.782,0.602-3.369-1.34-3.369-1.34c-0.455-1.158-1.11-1.465-1.11-1.465 c-0.908-0.62,0.069-0.608,0.069-0.608c1.004,0.071,1.532,1.03,1.532,1.03c0.891,1.529,2.341,1.089,2.91,0.833 c0.091-0.647,0.349-1.086,0.635-1.337c-2.22-0.252-4.555-1.11-4.555-4.943c0-1.091,0.39-1.984,1.03-2.682 C6.532,8.432,6.2,7.534,6.602,6.468c0,0,0.84-0.269,2.75,1.025C10.126,7.223,11.07,7.09,12,7.086 c0.93,0.004,1.874,0.137,2.648,0.404c1.91-1.294,2.748-1.025,2.748-1.025c0.402,1.066,0.07,1.964,0.07,1.964 c0.64,0.699,1.028,1.59,1.028,2.682c0,3.842-2.336,4.686-4.564,4.932c0.359,0.309,0.678,0.918,0.678,1.852 c0,1.336-0.012,2.415-0.012,2.741c0,0.268,0.18,0.578,0.688,0.48C19.135,20.166,22,16.419,22,12C22,6.477,17.523,2,12,2z" /></Icon>;
export const GamepadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><rect x="2" y="6" width="20" height="12" rx="5"/><line x1="6" y1="10" x2="10" y2="10"/><line x1="8" y1="8" x2="8" y2="12"/><circle cx="16" cy="12" r="1.5"/><circle cx="18" cy="9" r=".5" fill="currentColor"/></Icon>;
export const LeaderboardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2v0a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2V4z"/><path d="M6 20a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6Z"/></Icon>;
export const TrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M12 2c2.8 0 5 2.2 5 5v5a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7c0-2.8 2.2-5 5-5z"/><path d="M12 14v6"/><path d="M8 22h8"/><path d="M5 7H3"/><path d="M19 7h2"/></Icon>;
export const FinancialIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><line x1="12" x2="12" y1="1" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></Icon>;
export const HealthIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /><line x1="12" x2="12" y1="8" y2="14" /><line x1="9" x2="15" y1="11" y2="11" /></Icon>;
export const StyleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></Icon>;
export const KeyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></Icon>;
export const ChevronIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><polyline points="6 9 12 15 18 9"/></Icon>;

// Fix: Add missing icons used in various views.
export const GlobeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></Icon>;
export const ArticleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></Icon>;
export const WebsiteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M2 9h20"/><path d="M8 3v6"/></Icon>;
export const PresentationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></Icon>;
export const EmailIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></Icon>;
export const CalendarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></Icon>;

// --- NEW ICONS ---

// Create
export const BlogPostIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></Icon>;
export const AdCopyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M21 12H3"/><path d="M12 2l-9 10h18L12 2zM3 22h18"/></Icon>;
export const ProductDescIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></Icon>;
export const StoryWriterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 1 4 14.5v-10A2.5 2.5 0 0 1 6.5 2z"/><path d="m14 6-2 5 2 5"/><path d="m10 16 2-5-2-5"/></Icon>;
export const ScriptWriterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 8h8"/><path d="M8 12h5"/><path d="M8 16h3"/></Icon>;
export const SeoKeywordsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="m14.5 2-4.5 4.5 4.5 4.5-4.5 4.5 4.5 4.5"/><path d="m9.5 2-4.5 4.5 4.5 4.5-4.5 4.5 4.5 4.5"/></Icon>;

// Business
export const BusinessPlanIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><path d="M12 12h.01"/><path d="M12 17h.01"/><path d="M12 8h.01"/></Icon>;
export const SwotIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M3 3h18v18H3z"/><path d="M12 3v18"/><path d="M3 12h18"/></Icon>;
export const MarketResearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></Icon>;
export const BrandNamerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></Icon>;
export const SloganMakerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M20 6 9 17l-5-5"/></Icon>;
export const ColdEmailIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/><path d="M12 12v-2l-2 3h4l-2 3v-2"/></Icon>;
export const JobDescriptionIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M12 18h.01"/><path d="M12 15h.01"/><path d="M12 12h.01"/></Icon>;
export const PressReleaseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M20 2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM9 16H5v-4h4v4zm5 0h-4v-4h4v4zm5 0h-4v-4h4v4zm0-6H5V6h14v4z"/></Icon>;

// Developer
export const RegexIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M17 3v2"/><path d="M19 5h-2"/><path d="M19 5h2"/><path d="M19 5v-2"/><path d="M4 3h2"/><path d="M5 5v-2"/><path d="M5 5H3"/><path d="M5 5H7"/><path d="M11 5h2"/><path d="M12 3v2"/><path d="M12 13h2"/><path d="M13 15v-2"/><path d="M13 15h-2"/><path d="M13 15h2"/><path d="M13 15v2"/><path d="M8 15h2"/><path d="M9 13v2"/><circle cx="12" cy="19" r="2"/><path d="M16 19h2"/><path d="M6 19H4"/></Icon>;
export const CronIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></Icon>;
export const ApiDocsWriterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 1 4 14.5v-10A2.5 2.5 0 0 1 6.5 2z"/><path d="M16 13H8"/><path d="M16 9H8"/><path d="M10 9H8"/></Icon>;
export const UnitTestWriterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/><path d="m14.5 4-5 16"/></Icon>;
export const DbSchemaIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></Icon>;
export const ColorPaletteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><circle cx="7.5" cy="7.5" r="5.5"/><circle cx="16.5" cy="7.5" r="5.5"/><circle cx="7.5" cy="16.5" r="5.5"/><circle cx="16.5" cy="16.5" r="5.5"/></Icon>;
export const CommitMessageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></Icon>;

// Education
export const LessonPlannerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></Icon>;
export const StudyGuideIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 1 4 14.5v-10A2.5 2.5 0 0 1 6.5 2z"/><path d="m9 12-1-1 1-1"/><path d="M13 13l1 1-1 1"/></Icon>;
export const QuizMakerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M12 18h.01"/><path d="M10 15a2 2 0 1 1 4 0 2 2 0 1 1-4 0"/></Icon>;
export const TopicSimplifierIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M21 12h-2"/><path d="M5 12H3"/><path d="M12 21v-2"/><path d="M12 5V3"/><path d="m4.9 4.9 1.4 1.4"/><path d="m17.7 17.7 1.4 1.4"/><path d="m19.1 4.9-1.4 1.4"/><path d="m6.3 17.7-1.4 1.4"/><path d="m12 16-3-3 3-3 3 3-3 3z"/></Icon>;
export const HistoricalExplainerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></Icon>;
export const FlashcardsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><rect x="2" y="6" width="16" height="12" rx="2"/><path d="M6 6V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2"/></Icon>;

// Lifestyle
export const SocialPlannerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></Icon>;
export const TravelPlannerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 1.53 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></Icon>;
export const MealPlannerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/><circle cx="12" cy="12" r="3"/><path d="M12 12 8 8"/><path d="M16 16 12 12"/></Icon>;
export const DreamInterpreterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M22 17.5c-2.3-2.3-5.2-3.5-8.5-3.5-3.2 0-6.1 1.2-8.5 3.5"/><path d="M12 14v4"/><path d="M12 4v4"/><path d="m15.5 6.5-3 3-3-3"/><path d="M8.5 17.5 12 14l3.5 3.5"/></Icon>;
export const WorkoutGeneratorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M2 12h2"/><path d="M20 12h2"/><path d="M6.34 12H17.66"/><path d="M6 12h.01"/><path d="M18 12h.01"/><path d="M4 12V8a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v4"/><path d="M4 12v4a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2v-4"/><path d="M18 12V8a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v4"/><path d="M18 12v4a2 2 0 0 1-2 2h0a2 2 0 0 1-2-2v-4"/></Icon>;
export const GiftIdeasIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M20 12v10H4V12"/><path d="M2 7h20v5H2z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></Icon>;
export const HoroscopeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><circle cx="12" cy="12" r="10"/><path d="M12 12 8 8"/><path d="M16 8 8 16"/><path d="m12 2 4 10-4 10-4-10 4-10z"/></Icon>;
export const RecipeGeneratorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M2 12v10h20V12"/><path d="M2 7h20v5H2z"/><path d="M12 22V7"/><path d="M12 7c-2.76 0-5-2.24-5-5h10c0 2.76-2.24 5-5 5z"/></Icon>;
export const SpeechWriterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M17 11.5a5 5 0 0 1-10 0"/><path d="M12 3v13.5"/><path d="M8 8.5h8"/><path d="M10 13h4"/><path d="M4 17.5h16"/></Icon>;

// Fun & Creative
export const PoemGeneratorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="m18 5-3-3-3 3"/><path d="m18 19 3 3 3-3"/><path d="M15 22v-3.5a2.5 2.5 0 0 1 2.5-2.5 2.5 2.5 0 0 1 2.5 2.5V22"/><path d="M15 2h3.5A2.5 2.5 0 0 1 21 4.5 2.5 2.5 0 0 1 18.5 7H15V2z"/><path d="M3 5h8"/><path d="M3 9h10"/><path d="M3 13h8"/><path d="M3 17h10"/></Icon>;
export const SongLyricWriterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/><path d="M9 8H5"/><path d="M9 12H5"/></Icon>;
export const DndCharacterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M12 2.5c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5z"/><path d="M12 12.5c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5z"/></Icon>;
export const JokeWriterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M12 2a10 10 0 0 0-10 10c0 4.42 2.87 8.17 6.84 9.5.6.23 1.16-.2 1.16-.84v-2.73c0-.42-.25-.81-.66-1-.53-.25-1-1.03-1-1.66 0-1.1.9-2 2-2h4a2 2 0 0 1 2 2c0 .63-.47 1.41-1 1.66-.4.19-.66.58-.66 1v2.73c0 .63.56 1.07 1.16.84A10 10 0 0 0 22 12a10 10 0 0 0-10-10z"/><path d="M8 15h8"/></Icon>;
export const MoviePitchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M2 6h20v12H2z"/><path d="M6 12h12"/><path d="M6 12v-2h12v2"/><path d="M6 12v2h12v-2"/></Icon>;
export const TattooDesignerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="m15 5-1-1-1 1-1-1-1 1-1-1-1 1-1-1-1 1-1-1-1 1-1-1-1 1-1-1-1 1-1-1-1 1-1-1-1 1-1-1-1 1-1-1-1 1-1-1-1 1-1-1-1 1-1-1-1 1"/><path d="m20 18-5-5"/><path d="m20 13 1 1"/><path d="M15 13h1"/><path d="M14 14v1"/><path d="M14 8v1"/><path d="M15 9h1"/></Icon>;