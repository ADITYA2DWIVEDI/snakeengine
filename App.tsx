import React, { useState, useCallback, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { AuthPage } from './views/AuthPage';
import { DashboardView } from './views/DashboardView';
import { ChatView } from './views/ChatView';
import { ImageGenView } from './views/ImageGenView';
import { VideoGenView } from './views/VideoGenView';
import { TemplatesView } from './views/TemplatesView';
import { SearchView } from './views/SearchView';
import { DiscoverPage } from './views/DiscoverPage';
import { TopicListView } from './views/TopicListView';
import { ExcelAutomationPage } from './views/ExcelAutomationPage';
import { SettingsPage } from './views/SettingsPage';
import { SubscriptionPage } from './views/SubscriptionPage';
import { HelpPage } from './views/HelpPage';
import { AudioToolView } from './views/AudioToolView';
import { CodeAssistantView } from './views/CodeAssistantView';
import { CommunityPage } from './views/CommunityPage';
import { CreatorsPage } from './views/CreatorsPage';
import { AdminPage } from './views/AdminPage';
import { TrendingPage } from './views/TrendingPage';
import { ChatHistoryPage } from './views/ChatHistoryPage';
import { PersonaHubView } from './views/PersonaHubView';
import { DocumentAnalyzerView } from './views/DocumentAnalyzerView';
import { MusicComposerView } from './views/MusicComposerView';
import { LiveConversationView } from './views/LiveConversationView';
import { IdeaGeneratorView } from './views/IdeaGeneratorView';
import { TranslatorView } from './views/TranslatorView';
import { GameCreatorView } from './views/GameCreatorView';
import { LeaderboardPage } from './views/LeaderboardPage';
import { ChallengesPage } from './views/ChallengesPage';
import { FinancialAnalystView } from './views/FinancialAnalystView';
import { HealthAdvisorView } from './views/HealthAdvisorView';
import { PersonalStylistView } from './views/PersonalStylistView';
import { ApiDocsPage } from './views/ApiDocsPage';
import { Conversation, ChatMessage as Message, User } from './types';

// New Create Views
import { BlogPostView } from './views/BlogPostView';
import { AdCopyView } from './views/AdCopyView';
import { ProductDescriptionView } from './views/ProductDescriptionView';
import { StoryWriterView } from './views/StoryWriterView';
import { ScriptWriterView } from './views/ScriptWriterView';
import { SeoKeywordsView } from './views/SeoKeywordsView';

// New Business Views
import { BusinessPlanView } from './views/BusinessPlanView';
import { SwotAnalysisView } from './views/SwotAnalysisView';
import { MarketResearchView } from './views/MarketResearchView';
import { BrandNamerView } from './views/BrandNamerView';
import { SloganMakerView } from './views/SloganMakerView';
import { ColdEmailView } from './views/ColdEmailView';
import { JobDescriptionView } from './views/JobDescriptionView';
import { PressReleaseView } from './views/PressReleaseView';

// New Developer Views
import { RegexGeneratorView } from './views/RegexGeneratorView';
import { CronGeneratorView } from './views/CronGeneratorView';
import { ApiDocsWriterView } from './views/ApiDocsWriterView';
import { UnitTestWriterView } from './views/UnitTestWriterView';
import { DbSchemaView } from './views/DbSchemaView';
import { ColorPaletteView } from './views/ColorPaletteView';
import { CommitMessageView } from './views/CommitMessageView';

// New Education Views
import { LessonPlannerView } from './views/LessonPlannerView';
import { StudyGuideView } from './views/StudyGuideView';
import { QuizMakerView } from './views/QuizMakerView';
import { TopicSimplifierView } from './views/TopicSimplifierView';
import { HistoricalExplainerView } from './views/HistoricalExplainerView';
import { FlashcardsView } from './views/FlashcardsView';

// New Lifestyle Views
import { SocialPlannerView } from './views/SocialPlannerView';
import { TravelPlannerView } from './views/TravelPlannerView';
import { MealPlannerView } from './views/MealPlannerView';
import { DreamInterpreterView } from './views/DreamInterpreterView';
import { WorkoutGeneratorView } from './views/WorkoutGeneratorView';
import { GiftIdeasView } from './views/GiftIdeasView';
import { HoroscopeView } from './views/HoroscopeView';
import { RecipeGeneratorView } from './views/RecipeGeneratorView';
import { SpeechWriterView } from './views/SpeechWriterView';

// New Fun & Creative Views
import { PoemGeneratorView } from './views/PoemGeneratorView';
import { SongLyricWriterView } from './views/SongLyricWriterView';
import { DndCharacterView } from './views/DndCharacterView';
import { JokeWriterView } from './views/JokeWriterView';
import { MoviePitchView } from './views/MoviePitchView';
import { TattooDesignerView } from './views/TattooDesignerView';


export type View =
  | 'dashboard' | 'chat' | 'imageGen' | 'videoGen' | 'templates'
  | 'search' | 'discover' | 'excel' | 'settings' | 'subscription'
  | 'help' | 'audio' | 'code' | 'community' | 'creators'
  | 'admin' | 'trending' | 'history' | 'persona' | 'document'
  | 'music' | 'live' | 'idea'
  | 'translator' | 'social' | 'travel'
  | 'game' | 'leaderboard' | 'challenges' | 'financial' | 'health' | 'stylist'
  | 'apiDocs' | 'topicList'
  // Create
  | 'blogPost' | 'adCopy' | 'productDesc' | 'storyWriter' | 'scriptWriter' | 'seoKeywords'
  // Business
  | 'businessPlan' | 'swotAnalysis' | 'marketResearch' | 'brandNamer' | 'sloganMaker'
  | 'coldEmail' | 'jobDescription' | 'pressRelease'
  // Developer
  | 'regexGenerator' | 'cronGenerator' | 'apiDocsWriter' | 'unitTestWriter' | 'dbSchema'
  | 'colorPalette' | 'commitMessage'
  // Education
  | 'lessonPlanner' | 'studyGuide' | 'quizMaker' | 'topicSimplifier'
  | 'historicalExplainer' | 'flashcards'
  // Lifestyle
  | 'mealPlanner' | 'dreamInterpreter' | 'workoutGenerator' | 'giftIdeas'
  | 'horoscope' | 'recipeGenerator' | 'speechWriter'
  // Fun & Creative
  | 'poemGenerator' | 'songLyricWriter' | 'dndCharacter' | 'jokeWriter'
  | 'moviePitch' | 'tattooDesigner';


const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    const [currentView, setCurrentView] = useState<View>('chat');
    const [conversations, setConversations] = useState<Conversation[]>([
        {
            id: '1',
            title: 'SnakeEngine.AI',
            messages: [{ id: '1-1', sender: 'ai', text: 'Hello! I am SnakeEngine.AI. How can I help you today?' }],
            model: 'gemini-2.5-flash'
        }
    ]);
    const [activeConversationId, setActiveConversationId] = useState<string | null>('1');

    const handleLogin = () => {
        setUser({ name: 'Demo User', email: 'demo@snakeengine.ai' });
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setUser(null);
        setIsLoggedIn(false);
    };

    const handleNewChat = useCallback(() => {
        const newConversation: Conversation = {
            id: Date.now().toString(),
            title: 'SnakeEngine.AI',
            messages: [{ id: `${Date.now().toString()}-1`, sender: 'ai', text: 'Hello! I am SnakeEngine.AI. How can I assist you?' }],
            model: 'gemini-2.5-flash',
        };
        setConversations(prev => [newConversation, ...prev]);
        setActiveConversationId(newConversation.id);
        setCurrentView('chat');
    }, []);
    
    const handleSelectConversation = (id: string) => {
        setActiveConversationId(id);
        setCurrentView('chat');
    };

    const handleDeleteConversation = (id: string) => {
        setConversations(prev => prev.filter(c => c.id !== id));
        if (activeConversationId === id) {
            setActiveConversationId(conversations.length > 1 ? conversations.find(c => c.id !== id)?.id ?? null : null);
            if (conversations.length <= 1) {
                setCurrentView('chat');
            }
        }
    };

    const updateConversationMessages = useCallback((conversationId: string, updateFn: (messages: Message[]) => Message[]) => {
        setConversations(prev =>
            prev.map(c =>
                c.id === conversationId ? { ...c, messages: updateFn(c.messages) } : c
            )
        );
    }, []);

    const updateConversationTitle = useCallback((conversationId: string, title: string) => {
        // Title is now fixed, but we keep the function in case it's needed elsewhere
        if (title !== "SnakeEngine.AI") {
             setConversations(prev =>
                prev.map(c => (c.id === conversationId ? { ...c, title } : c))
            );
        }
    }, []);

    const handleUpdateConversationModel = useCallback((conversationId: string, model: string) => {
        setConversations(prev =>
            prev.map(c =>
                c.id === conversationId ? { ...c, model } : c
            )
        );
    }, []);
    
    const activeConversation = useMemo(() => {
        return conversations.find(c => c.id === activeConversationId);
    }, [conversations, activeConversationId]);
    
    const handleSetPersona = (persona: string) => {
        if (activeConversationId) {
            setConversations(prev => prev.map(c => c.id === activeConversationId ? { ...c, persona } : c));
            updateConversationMessages(activeConversationId, (messages) => [
                ...messages,
                { id: Date.now().toString(), sender: 'ai', text: `Persona set! I am now: ${persona}` }
            ]);
            setCurrentView('chat');
        }
    };


    const renderView = () => {
        const chatViewProps = {
            conversations,
            activeConversationId,
            updateConversationMessages,
            updateConversationTitle,
            onUpdateConversationModel: handleUpdateConversationModel,
        };

        switch (currentView) {
            case 'dashboard': return <DashboardView />;
            case 'chat': return <ChatView {...chatViewProps} />;
            case 'imageGen': return <ImageGenView />;
            case 'videoGen': return <VideoGenView />;
            case 'templates': return <TemplatesView />;
            case 'search': return <SearchView />;
            case 'discover': return <DiscoverPage />;
            case 'topicList': return <TopicListView />;
            case 'excel': return <ExcelAutomationPage />;
            case 'settings': return <SettingsPage />;
            case 'subscription': return <SubscriptionPage />;
            case 'help': return <HelpPage />;
            case 'audio': return <AudioToolView />;
            case 'code': return <CodeAssistantView />;
            case 'community': return <CommunityPage />;
            case 'creators': return <CreatorsPage />;
            case 'admin': return <AdminPage />;
            case 'trending': return <TrendingPage />;
            case 'history': return <ChatHistoryPage 
                conversations={conversations} 
                onSelectConversation={handleSelectConversation}
                onDeleteConversation={handleDeleteConversation}
                onNewChat={handleNewChat}
            />;
            case 'persona': return <PersonaHubView onSetPersona={handleSetPersona} />;
            case 'document': return <DocumentAnalyzerView />;
            case 'music': return <MusicComposerView />;
            case 'live': return <LiveConversationView />;
            case 'idea': return <IdeaGeneratorView />;
            case 'translator': return <TranslatorView />;
            case 'social': return <SocialPlannerView />;
            case 'travel': return <TravelPlannerView />;
            case 'game': return <GameCreatorView />;
            case 'leaderboard': return <LeaderboardPage />;
            case 'challenges': return <ChallengesPage />;
            case 'financial': return <FinancialAnalystView />;
            case 'health': return <HealthAdvisorView />;
            case 'stylist': return <PersonalStylistView />;
            case 'apiDocs': return <ApiDocsPage />;
            
            // Create
            case 'blogPost': return <BlogPostView />;
            case 'adCopy': return <AdCopyView />;
            case 'productDesc': return <ProductDescriptionView />;
            case 'storyWriter': return <StoryWriterView />;
            case 'scriptWriter': return <ScriptWriterView />;
            case 'seoKeywords': return <SeoKeywordsView />;

            // Business
            case 'businessPlan': return <BusinessPlanView />;
            case 'swotAnalysis': return <SwotAnalysisView />;
            case 'marketResearch': return <MarketResearchView />;
            case 'brandNamer': return <BrandNamerView />;
            case 'sloganMaker': return <SloganMakerView />;
            case 'coldEmail': return <ColdEmailView />;
            case 'jobDescription': return <JobDescriptionView />;
            case 'pressRelease': return <PressReleaseView />;

            // Developer
            case 'regexGenerator': return <RegexGeneratorView />;
            case 'cronGenerator': return <CronGeneratorView />;
            case 'apiDocsWriter': return <ApiDocsWriterView />;
            case 'unitTestWriter': return <UnitTestWriterView />;
            case 'dbSchema': return <DbSchemaView />;
            case 'colorPalette': return <ColorPaletteView />;
            case 'commitMessage': return <CommitMessageView />;

            // Education
            case 'lessonPlanner': return <LessonPlannerView />;
            case 'studyGuide': return <StudyGuideView />;
            case 'quizMaker': return <QuizMakerView />;
            case 'topicSimplifier': return <TopicSimplifierView />;
            case 'historicalExplainer': return <HistoricalExplainerView />;
            case 'flashcards': return <FlashcardsView />;

            // Lifestyle
            case 'mealPlanner': return <MealPlannerView />;
            case 'dreamInterpreter': return <DreamInterpreterView />;
            case 'workoutGenerator': return <WorkoutGeneratorView />;
            case 'giftIdeas': return <GiftIdeasView />;
            case 'horoscope': return <HoroscopeView />;
            case 'recipeGenerator': return <RecipeGeneratorView />;
            case 'speechWriter': return <SpeechWriterView />;

            // Fun & Creative
            case 'poemGenerator': return <PoemGeneratorView />;
            case 'songLyricWriter': return <SongLyricWriterView />;
            case 'dndCharacter': return <DndCharacterView />;
            case 'jokeWriter': return <JokeWriterView />;
            case 'moviePitch': return <MoviePitchView />;
            case 'tattooDesigner': return <TattooDesignerView />;

            default: return <ChatView {...chatViewProps} />;
        }
    };

    if (!isLoggedIn) {
        return <AuthPage onLoginSuccess={handleLogin} />;
    }

    return (
        <div className="flex h-screen w-screen bg-bg-primary text-text-primary font-sans antialiased">
            <Sidebar 
              currentView={currentView} 
              setCurrentView={setCurrentView} 
              onNewChat={handleNewChat}
              user={user}
              onLogout={handleLogout}
            />
            <main className="flex-1 flex flex-col overflow-hidden">
                {renderView()}
            </main>
        </div>
    );
};

export default App;