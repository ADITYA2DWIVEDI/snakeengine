import React from 'react';
import { Page } from './types';

export interface IconProps {
  className?: string;
}

export const LogoIcon = ({ className = 'h-8 w-8' }: IconProps) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 4L10 18L24 32L38 18L24 4Z" fill="url(#paint0_linear_logo)" />
    <path d="M10 18L24 32L10 46L10 18Z" fill="url(#paint1_linear_logo)" />
    <path d="M24 32L38 18L38 46L24 32Z" fill="url(#paint2_linear_logo)" />
    <defs>
      <linearGradient id="paint0_linear_logo" x1="24" y1="4" x2="24" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#8B5CF6" />
        <stop offset="1" stopColor="#3B82F6" />
      </linearGradient>
      <linearGradient id="paint1_linear_logo" x1="10" y1="32" x2="24" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3B82F6" />
        <stop offset="1" stopColor="#10B981" />
      </linearGradient>
      <linearGradient id="paint2_linear_logo" x1="38" y1="32" x2="24" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#8B5CF6" />
        <stop offset="1" stopColor="#EC4899" />
      </linearGradient>
    </defs>
  </svg>
);

export const MenuIcon = ({ className = 'h-6 w-6' }: IconProps) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export const HomeIcon = ({ className = 'h-6 w-6' }: IconProps) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

export const CubeIcon = ({ className = 'h-6 w-6' }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
);

export const BookOpenIcon = ({ className = 'h-6 w-6' }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
);

export const BookmarkIcon = ({ className = 'h-6 w-6' }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
);

export const PlayCircleIcon = ({ className = 'h-6 w-6' }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polygon points="10 8 16 12 10 16 10 8"></polygon>
    </svg>
);

export const PuzzleIcon = ({ className = 'h-6 w-6' }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 7V4.29a1 1 0 0 0-1.02-1.02A11.02 11.02 0 0 0 3.29 12a1 1 0 0 0 1.02 1.02H7"/>
        <path d="M10 20.71A11.02 11.02 0 0 0 20.71 12a1 1 0 0 0-1.02-1.02H17"/>
        <path d="M14 17h2.71a1 1 0 0 0 1.02-1.02A11.02 11.02 0 0 0 12 5.29a1 1 0 0 0-1.02 1.02V9"/>
        <path d="M10 3.29A11.02 11.02 0 0 1 20.71 12a1 1 0 0 1-1.02 1.02H17"/>
        <path d="M7 14v2.71a1 1 0 0 0 1.02 1.02A11.02 11.02 0 0 0 18.71 12a1 1 0 0 0-1.02-1.02H14"/>
    </svg>
);


export const CogIcon = ({ className = 'h-6 w-6' }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
);

export const CreditCardIcon = ({ className = 'h-6 w-6' }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
        <line x1="1" y1="10" x2="23" y2="10"></line>
    </svg>
);

export const HelpIcon = ({ className = 'h-6 w-6' }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
);

export const GiftIcon = ({ className = 'h-6 w-6' }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 12 20 22 4 22 4 12"></polyline>
        <rect x="2" y="7" width="20" height="5"></rect>
        <line x1="12" y1="22" x2="12" y2="7"></line>
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
    </svg>
);

export const LogoutIcon = ({ className = 'h-6 w-6' }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
);

export const GlobeIcon = ({ className = 'h-6 w-6' }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
);

export const MapPinIcon = ({ className = 'h-6 w-6' }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);

export const VolumeUpIcon = ({ className = 'h-6 w-6' }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
  </svg>
);

export const StudyPlanIcon = ({ className = 'h-6 w-6' }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    <path d="M12 3v18"></path>
    <line x1="5" y1="7" x2="9" y2="7"></line>
    <line x1="5" y1="12" x2="9" y2="12"></line>
    <line x1="15" y1="7" x2="19" y2="7"></line>
  </svg>
);

export const CodeReviewerIcon = ({ className = 'h-6 w-6' }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m18 16 4-4-4-4"></path>
    <path d="m6 8-4 4 4 4"></path>
    <path d="m14.5 4-5 16"></path>
  </svg>
);

export const FileTextIcon = ({ className = 'h-6 w-6' }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
);


export const InstagramIcon = ({ className = 'h-6 w-6' }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

export const FacebookIcon = ({ className = 'h-6 w-6' }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
);

export const YoutubeIcon = ({ className = 'h-6 w-6' }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
    </svg>
);

export const ThreadsIcon = ({ className = 'h-6 w-6' }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 12c-3.33 0-6-1.5-6-3.5S8.67 5 12 5s6 1.5 6 3.5-2.67 3.5-6 3.5z"/>
        <path d="M12 19c-3.33 0-6-1.5-6-3.5s2.67-3.5 6-3.5 6 1.5 6 3.5-2.67 3.5-6 3.5z"/>
    </svg>
);

export const GmailIcon = ({ className = 'h-6 w-6' }: IconProps) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M54 12H10C7.79086 12 6 13.7909 6 16V48C6 50.2091 7.79086 52 10 52H54C56.2091 52 58 50.2091 58 48V16C58 13.7909 56.2091 12 54 12Z" fill="#F2F2F2"/>
    <path d="M54 12H10C7.79086 12 6 13.7909 6 16V18.15L32 36L58 18.15V16C58 13.7909 56.2091 12 54 12Z" fill="#EA4335"/>
    <path d="M6 48V25.79L23.23 38.4C28.94 42.75 35.06 42.75 40.77 38.4L58 25.79V48C58 50.2091 56.2091 52 54 52H10C7.79086 52 6 50.2091 6 48Z" fill="#4285F4"/>
    <path d="M6 18.15V16C6 13.7909 7.79086 12 10 12H10.59L32 29.5L53.41 12H54C56.2091 12 58 13.7909 58 16V18.15L32 36L6 18.15Z" fill="#34A853"/>
    <path d="M54 12H10C7.79086 12 6 13.7909 6 16V16.64L32 34.25L58 16.64V16C58 13.7909 56.2091 12 54 12Z" fill="#FBBC05"/>
  </svg>
);

export const CalendarIcon = ({ className = 'h-6 w-6' }: IconProps) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M52 10H12C9.79086 10 8 11.7909 8 14V54C8 56.2091 9.79086 58 12 58H52C54.2091 58 56 56.2091 56 54V14C56 11.7909 54.2091 10 52 10Z" fill="#4285F4"/>
    <path d="M44 6V14" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 6V14" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 22H56" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="18" y="32" width="8" height="8" rx="2" fill="white"/>
    <rect x="38" y="32" width="8" height="8" rx="2" fill="white"/>
    <rect x="18" y="44" width="8" height="8" rx="2" fill="white"/>
  </svg>
);

export const SlackIcon = ({ className = 'h-6 w-6' }: IconProps) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 40C16 44.4183 19.5817 48 24 48H32V32H24C19.5817 32 16 35.5817 16 40Z" fill="#36C5F0"/>
    <path d="M24 16C19.5817 16 16 19.5817 16 24V32H32V24C32 19.5817 28.4183 16 24 16Z" fill="#2EB67D"/>
    <path d="M24 48C28.4183 48 32 44.4183 32 40V32H40C44.4183 32 48 35.5817 48 40C48 44.4183 44.4183 48 40 48H24Z" fill="#ECB22E"/>
    <path d="M48 24C48 19.5817 44.4183 16 40 16H32V32H40C44.4183 32 48 28.4183 48 24Z" fill="#E01E5A"/>
  </svg>
);

export const NotionIcon = ({ className = 'h-6 w-6' }: IconProps) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M42 8H14C11.7909 8 10 9.79086 10 12V52C10 54.2091 11.7909 56 14 56H50C52.2091 56 54 54.2091 54 52V20L42 8Z" fill="white"/>
    <path d="M42 8V20H54" fill="#E0E0E0"/>
    <path d="M22 28H42V32H22V28Z" fill="#424242"/>
    <path d="M22 38H42V42H22V38Z" fill="#424242"/>
    <path d="M22 48H34V52H22V48Z" fill="#424242"/>
  </svg>
);

export const FigmaIcon = ({ className = 'h-6 w-6' }: IconProps) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 8C23.1634 8 16 15.1634 16 24C16 32.8366 23.1634 40 32 40C40.8366 40 48 32.8366 48 24C48 15.1634 40.8366 8 32 8Z" fill="#A259FF"/>
    <path d="M16 24C16 15.1634 23.1634 8 32 8V24H16Z" fill="#F24E1E"/>
    <path d="M16 40C16 31.1634 23.1634 24 32 24V40H16Z" fill="#FF7262"/>
    <path d="M32 56C23.1634 56 16 48.8366 16 40H32V56Z" fill="#1ABCFE"/>
    <path d="M48 40C48 48.8366 40.8366 56 32 56V40H48Z" fill="#0ACF83"/>
  </svg>
);

export const GitHubIcon = ({ className = 'h-6 w-6' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.795 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);



export const NAVIGATION_ITEMS = {
    MAIN: [
        { name: 'Home', icon: HomeIcon, page: Page.Home },
        { name: 'Smart Studio', icon: CubeIcon, page: Page.SmartStudio },
        { name: 'Courses', icon: BookOpenIcon, page: Page.Courses },
        { name: 'My Learning', icon: BookmarkIcon, page: Page.MyLearning },
        { name: 'Plugins', icon: PuzzleIcon, page: Page.Plugins },
        { name: 'Promo', icon: PlayCircleIcon, page: Page.Promo },
    ],
    ACCOUNT: [
        { name: 'Settings', icon: CogIcon, page: Page.Settings },
        { name: 'Plans & Subscription', icon: CreditCardIcon, page: Page.Plans },
    ],
    RESOURCES: [
        { name: 'Help & Support', icon: HelpIcon, page: Page.Help },
    ],
    ADMIN: [
        { name: `What's New`, icon: GiftIcon, page: null, notification: true },
        { name: 'Sign Out', icon: LogoutIcon, page: null },
    ],
};