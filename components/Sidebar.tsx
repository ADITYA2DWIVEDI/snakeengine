import React, { useState } from 'react';
import { User } from '../types';
import { 
    LogoIcon, DashboardIcon, ChatIcon, ImageIcon, VideoIcon, TemplatesIcon, 
    SearchIcon, DiscoverIcon, ExcelIcon, SettingsIcon, SubscriptionIcon, HelpIcon, 
    AudioIcon, CodeIcon, CommunityIcon, CreatorsIcon, AdminIcon, 
    TrendingIcon, HistoryIcon, PersonaIcon, DocumentIcon, MusicIcon,
    PlusIcon, LiveIcon, IdeaIcon, TranslatorIcon,
    GamepadIcon,
    LeaderboardIcon, TrophyIcon, LogoutIcon, UserCircleIcon,
    FinancialIcon, HealthIcon, StyleIcon, KeyIcon,
    // New Icons
    BlogPostIcon, AdCopyIcon, ProductDescIcon, StoryWriterIcon, ScriptWriterIcon, SeoKeywordsIcon,
    BusinessPlanIcon, SwotIcon, MarketResearchIcon, BrandNamerIcon, SloganMakerIcon,
    ColdEmailIcon, JobDescriptionIcon, PressReleaseIcon,
    RegexIcon, CronIcon, ApiDocsWriterIcon, UnitTestWriterIcon, DbSchemaIcon, ColorPaletteIcon,
    CommitMessageIcon,
    LessonPlannerIcon, StudyGuideIcon, QuizMakerIcon, TopicSimplifierIcon, HistoricalExplainerIcon,
    FlashcardsIcon,
    SocialPlannerIcon, TravelPlannerIcon, MealPlannerIcon, DreamInterpreterIcon, WorkoutGeneratorIcon,
    GiftIdeasIcon, HoroscopeIcon, RecipeGeneratorIcon, SpeechWriterIcon,
    PoemGeneratorIcon, SongLyricWriterIcon, DndCharacterIcon, JokeWriterIcon, MoviePitchIcon,
    TattooDesignerIcon,
    ChevronIcon,
    TopicListIcon
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

const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="py-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-600 transition-colors rounded-md"
            >
                <span>{title}</span>
                <ChevronIcon className={`w-4 h-4 transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`} />
            </button>
            {isOpen && (
                <div className="mt-2 flex flex-col gap-1 animate-fade-in">
                    {children}
                </div>
            )}
        </div>
    );
};


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
                </nav>
                
                <nav className="flex flex-col mt-2 divide-y divide-slate-200/70">
                    <CollapsibleSection title="Create" defaultOpen>
                        <NavItem view="imageGen" label="Image Gen" icon={<ImageIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="videoGen" label="Video Gen" icon={<VideoIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="music" label="Music Composer" icon={<MusicIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="blogPost" label="Blog Post Writer" icon={<BlogPostIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="adCopy" label="Ad Copy Generator" icon={<AdCopyIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="productDesc" label="Product Descriptions" icon={<ProductDescIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="storyWriter" label="Story Writer" icon={<StoryWriterIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="scriptWriter" label="Scriptwriter" icon={<ScriptWriterIcon />} currentView={currentView} onClick={setCurrentView} />
                    </CollapsibleSection>

                    <CollapsibleSection title="Tools" defaultOpen>
                        <NavItem view="live" label="Live Conversation" icon={<LiveIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="idea" label="Idea Generator" icon={<IdeaIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="translator" label="Translator" icon={<TranslatorIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="templates" label="Templates" icon={<TemplatesIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="persona" label="Persona Hub" icon={<PersonaIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="audio" label="Audio Tool" icon={<AudioIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="document" label="Doc Analyzer" icon={<DocumentIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="excel" label="Excel Automation" icon={<ExcelIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="seoKeywords" label="SEO Keywords" icon={<SeoKeywordsIcon />} currentView={currentView} onClick={setCurrentView} />
                    </CollapsibleSection>

                    <CollapsibleSection title="Business Tools">
                        <NavItem view="businessPlan" label="Business Plan" icon={<BusinessPlanIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="swotAnalysis" label="SWOT Analysis" icon={<SwotIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="marketResearch" label="Market Research" icon={<MarketResearchIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="brandNamer" label="Brand Namer" icon={<BrandNamerIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="sloganMaker" label="Slogan Maker" icon={<SloganMakerIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="coldEmail" label="Cold Email Writer" icon={<ColdEmailIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="jobDescription" label="Job Descriptions" icon={<JobDescriptionIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="pressRelease" label="Press Release" icon={<PressReleaseIcon />} currentView={currentView} onClick={setCurrentView} />
                    </CollapsibleSection>

                    <CollapsibleSection title="Developer Tools">
                        <NavItem view="code" label="Code Assistant" icon={<CodeIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="regexGenerator" label="Regex Generator" icon={<RegexIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="cronGenerator" label="Cron Job Generator" icon={<CronIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="apiDocsWriter" label="API Docs Writer" icon={<ApiDocsWriterIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="unitTestWriter" label="Unit Test Writer" icon={<UnitTestWriterIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="dbSchema" label="DB Schema Designer" icon={<DbSchemaIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="colorPalette" label="Color Palette Gen" icon={<ColorPaletteIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="commitMessage" label="Git Commit Messages" icon={<CommitMessageIcon />} currentView={currentView} onClick={setCurrentView} />
                    </CollapsibleSection>

                    <CollapsibleSection title="Education">
                        <NavItem view="lessonPlanner" label="Lesson Planner" icon={<LessonPlannerIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="studyGuide" label="Study Guide Maker" icon={<StudyGuideIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="quizMaker" label="Quiz Maker" icon={<QuizMakerIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="topicSimplifier" label="Topic Simplifier" icon={<TopicSimplifierIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="historicalExplainer" label="History Explainer" icon={<HistoricalExplainerIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="flashcards" label="Flashcard Maker" icon={<FlashcardsIcon />} currentView={currentView} onClick={setCurrentView} />
                    </CollapsibleSection>
                    
                    <CollapsibleSection title="Lifestyle & Fun">
                        <NavItem view="social" label="Social Planner" icon={<SocialPlannerIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="travel" label="Travel Planner" icon={<TravelPlannerIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="mealPlanner" label="Meal Planner" icon={<MealPlannerIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="recipeGenerator" label="Recipe Generator" icon={<RecipeGeneratorIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="workoutGenerator" label="Workout Generator" icon={<WorkoutGeneratorIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="giftIdeas" label="Gift Idea Suggester" icon={<GiftIdeasIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="dreamInterpreter" label="Dream Interpreter" icon={<DreamInterpreterIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="horoscope" label="Personal Horoscope" icon={<HoroscopeIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="speechWriter" label="Speech Writer" icon={<SpeechWriterIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="poemGenerator" label="Poem Generator" icon={<PoemGeneratorIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="songLyricWriter" label="Song Lyric Writer" icon={<SongLyricWriterIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="dndCharacter" label="D&D Character" icon={<DndCharacterIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="jokeWriter" label="Joke Writer" icon={<JokeWriterIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="moviePitch" label="Movie Pitch" icon={<MoviePitchIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="tattooDesigner" label="Tattoo Designer" icon={<TattooDesignerIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="game" label="Game Creator" icon={<GamepadIcon />} currentView={currentView} onClick={setCurrentView} />
                    </CollapsibleSection>

                    <CollapsibleSection title="Pro Tools">
                        <NavItem view="financial" label="Financial Analyst" icon={<FinancialIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="health" label="Health Advisor" icon={<HealthIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="stylist" label="Personal Stylist" icon={<StyleIcon />} currentView={currentView} onClick={setCurrentView} />
                    </CollapsibleSection>
                    
                    <CollapsibleSection title="Community">
                        <NavItem view="discover" label="Discover" icon={<DiscoverIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="topicList" label="Topics" icon={<TopicListIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="trending" label="Trending" icon={<TrendingIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="creators" label="Creators" icon={<CreatorsIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="leaderboard" label="Leaderboard" icon={<LeaderboardIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="challenges" label="Challenges" icon={<TrophyIcon />} currentView={currentView} onClick={setCurrentView} />
                    </CollapsibleSection>

                    <CollapsibleSection title="Resources">
                        <NavItem view="help" label="Help" icon={<HelpIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="community" label="Community Hub" icon={<CommunityIcon />} currentView={currentView} onClick={setCurrentView} />
                        <NavItem view="apiDocs" label="API & Docs" icon={<KeyIcon />} currentView={currentView} onClick={setCurrentView} />
                    </CollapsibleSection>
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
                    <NavItem view="settings" label="Settings" icon={<SettingsIcon />} currentView={currentView} onClick={setCurrentView} />
                    <NavItem view="admin" label="Admin Panel" icon={<AdminIcon />} currentView={currentView} onClick={setCurrentView} />
                 </div>
            </div>
        </aside>
    );
};