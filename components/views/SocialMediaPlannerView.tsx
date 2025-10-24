

import React, { useState } from 'react';
import { Page, ScheduledPost, SocialPlatform, Feature } from '../../types';
import { Icon } from '../icons';
import { generateSocialMediaPost } from '../../services/geminiService';
import Spinner from '../common/Spinner';

const platforms: { name: SocialPlatform; icon: 'instagram' | 'facebook' | 'twitter' | 'linkedin'; color: string }[] = [
    { name: 'Instagram', icon: 'instagram', color: 'bg-gradient-to-br from-yellow-400 via-red-500 to-purple-600' },
    { name: 'Facebook', icon: 'facebook', color: 'bg-[#4267B2]' },
    { name: 'Twitter', icon: 'twitter', color: 'bg-black' },
    { name: 'LinkedIn', icon: 'linkedin', color: 'bg-[#0077B5]' },
];

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Mock data for initial view
const initialPosts: ScheduledPost[] = [
    { id: '1', platform: 'Instagram', content: 'Launching our new AI-powered feature next week! Get ready. #AI #Tech #Innovation', scheduledAt: new Date(new Date().setDate(new Date().getDate() + 2)), imageUrl: 'https://images.unsplash.com/photo-1620712943543-285f726a9a52?auto=format&fit=crop&w=600&q=60' },
    { id: '2', platform: 'Twitter', content: 'Just released a new tutorial on prompt engineering. Check it out on our website! #AI #Education', scheduledAt: new Date(new Date().setDate(new Date().getDate() + 1))},
    { id: '3', platform: 'LinkedIn', content: 'We are proud to announce our new partnership with a leading tech innovator to advance the future of AI. This collaboration will focus on developing ethical and accessible AI solutions for businesses worldwide. Read more on our blog. #AI #Partnership #Business', scheduledAt: new Date(new Date().setDate(new Date().getDate() + 4))},
];


const SocialMediaPlannerView: React.FC = () => {
    const [posts, setPosts] = useState<ScheduledPost[]>(initialPosts);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const weekDates = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        return date;
    });

    const handleOpenModal = (date: Date, post: ScheduledPost | null = null) => {
        setSelectedDate(date);
        setSelectedPost(post);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPost(null);
        setSelectedDate(null);
    };

    const handleSavePost = (post: ScheduledPost) => {
        if (selectedPost) {
            setPosts(posts.map(p => p.id === post.id ? post : p));
        } else {
            setPosts([...posts, post]);
        }
        handleCloseModal();
    };

    const handleDeletePost = (postId: string) => {
        setPosts(posts.filter(p => p.id !== postId));
        handleCloseModal();
    };
    
    const PostModal: React.FC = () => {
        const [platform, setPlatform] = useState<SocialPlatform>(selectedPost?.platform || 'Instagram');
        const [content, setContent] = useState(selectedPost?.content || '');
        const [scheduledAt, setScheduledAt] = useState(selectedPost?.scheduledAt || selectedDate || new Date());
        const [aiPrompt, setAiPrompt] = useState('');
        const [isGenerating, setIsGenerating] = useState(false);

        const handleGenerateContent = async () => {
            if (!aiPrompt.trim()) return;
            setIsGenerating(true);
            try {
                const response = await generateSocialMediaPost(aiPrompt, platform);
                setContent(response.text);
            } catch (error) {
                console.error("Failed to generate content:", error);
                alert("Sorry, I couldn't generate content. Please try again.");
            } finally {
                setIsGenerating(false);
            }
        };
        
        const handleSubmit = () => {
            handleSavePost({
                id: selectedPost?.id || Date.now().toString(),
                platform,
                content,
                scheduledAt,
            });
        };

        return (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={handleCloseModal}>
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                    <div className="p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-lg">{selectedPost ? 'Edit Post' : 'Schedule Post'}</h3>
                        <button onClick={handleCloseModal} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"><Icon name="close" className="w-5 h-5" /></button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="text-sm font-medium">Platform</label>
                            <div className="flex gap-2 mt-2">
                                {platforms.map(p => (
                                    <button key={p.name} onClick={() => setPlatform(p.name)} className={`w-10 h-10 rounded-lg flex items-center justify-center text-white transition-all ${platform === p.name ? 'ring-2 ring-offset-2 dark:ring-offset-slate-800 ring-purple-500 dark:ring-teal-400' : 'opacity-60 hover:opacity-100'} ${p.color}`}>
                                        <Icon name={p.icon} />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Content</label>
                            <textarea value={content} onChange={e => setContent(e.target.value)} rows={5} className="w-full mt-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Write your post..."></textarea>
                        </div>
                         <div className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg space-y-2">
                             <label className="text-sm font-medium flex items-center gap-1"><Icon name="brain" className="w-4 h-4 text-purple-500 dark:text-teal-400" /> AI Assistant</label>
                             <div className="flex gap-2">
                                <input value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} className="w-full bg-white dark:bg-slate-800 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500" placeholder="e.g., A post about our new feature"/>
                                <button onClick={handleGenerateContent} disabled={isGenerating} className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-500 disabled:bg-slate-400 flex items-center justify-center">
                                    {isGenerating ? <Spinner /> : 'Generate'}
                                </button>
                            </div>
                         </div>
                        <div className="flex justify-between items-center pt-4">
                            <div>
                                {selectedPost && <button onClick={() => handleDeletePost(selectedPost.id)} className="text-sm text-red-500 hover:underline">Delete Post</button>}
                            </div>
                            <button onClick={handleSubmit} className="px-5 py-2 bg-purple-600 dark:bg-teal-500 text-white font-semibold rounded-lg hover:bg-purple-500 dark:hover:bg-teal-600">
                                {selectedPost ? 'Save Changes' : 'Schedule'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            {isModalOpen && <PostModal />}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    {/* Fix: Replace non-existent Page.SOCIAL_MEDIA_PLANNER with Feature.SOCIAL_PLANNER. */}
                    <Icon name={Feature.SOCIAL_PLANNER} className="w-8 h-8 gradient-text" />
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Social Media Planner</h1>
                </div>
                <button onClick={() => handleOpenModal(new Date())} className="px-4 py-2 bg-purple-600 dark:bg-teal-600 text-white font-semibold rounded-lg hover:bg-purple-500 dark:hover:bg-teal-500 transition-colors flex items-center gap-2 text-sm">
                    <Icon name="edit" className="w-4 h-4"/>
                    <span>New Post</span>
                </button>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
                Organize your social media content. Click on a day to schedule a new post, or click an existing post to edit.
            </p>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
                <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
                    <button onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)))} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><Icon name="chevron-left" /></button>
                    <h2 className="text-lg font-bold">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                    <button onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)))} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><Icon name="chevron-right" /></button>
                </div>

                <div className="overflow-x-auto">
                    <div className="min-w-[56rem]">
                        <div className="grid grid-cols-7">
                            {daysOfWeek.map(day => (
                                <div key={day} className="text-center font-bold p-2 border-r border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">{day}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7">
                            {weekDates.map(date => {
                                const postsForDay = posts.filter(p => p.scheduledAt.toDateString() === date.toDateString());
                                const isToday = date.toDateString() === new Date().toDateString();
                                return (
                                    <div key={date.toISOString()} onClick={() => handleOpenModal(date)} className="h-48 border-r border-b border-slate-200 dark:border-slate-700 p-2 overflow-y-auto space-y-1.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <span className={`flex items-center justify-center w-6 h-6 rounded-full text-sm font-semibold ${isToday ? 'bg-purple-600 dark:bg-teal-500 text-white' : ''}`}>{date.getDate()}</span>
                                        {postsForDay.map(post => {
                                            const platformInfo = platforms.find(p => p.name === post.platform);
                                            return (
                                                <button key={post.id} onClick={(e) => { e.stopPropagation(); handleOpenModal(date, post); }} className="w-full p-1.5 rounded-md text-left text-xs bg-slate-200 dark:bg-slate-700 hover:ring-2 ring-purple-500">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className={`w-4 h-4 rounded ${platformInfo?.color} flex items-center justify-center text-white flex-shrink-0`}><Icon name={platformInfo!.icon} className="w-3 h-3"/></div>
                                                        <p className="truncate text-slate-800 dark:text-slate-200">{post.content}</p>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialMediaPlannerView;