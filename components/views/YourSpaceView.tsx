// Fix: Changed React import to `import * as React from 'react'` to resolve JSX typing issues.
import * as React from 'react';
import { Page } from '../../types';
import { Icon } from '../icons';

const YourSpaceView: React.FC = () => {
    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Icon name={Page.YOUR_SPACE} className="w-8 h-8 gradient-text" />
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Your Personal Space</h1>
                </div>
                 <button className="px-4 py-2 bg-purple-600 dark:bg-teal-600 text-white font-semibold rounded-lg hover:bg-purple-500 dark:hover:bg-teal-500 transition-colors flex items-center gap-2">
                    <Icon name="brain" className="w-5 h-5"/>
                    <span>Create New Project</span>
                </button>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
                This is your personal dashboard to manage projects, review past conversations, and access your files. All your work, organized in one place.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">My Projects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                            <h3 className="font-bold text-purple-600 dark:text-teal-400">Q3 Marketing Campaign</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Generating ad copy, social media posts, and video scripts.</p>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-4">
                                <div className="bg-purple-600 dark:bg-teal-500 h-2 rounded-full" style={{width: '75%'}}></div>
                            </div>
                       </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                            <h3 className="font-bold text-purple-600 dark:text-teal-400">New App Feature</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Drafting user stories, brainstorming UI/UX, and writing documentation.</p>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-4">
                                <div className="bg-purple-600 dark:bg-teal-500 h-2 rounded-full" style={{width: '45%'}}></div>
                            </div>
                        </div>
                    </div>
                     <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 pt-4">Recent Chats</h2>
                     <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                        <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                            <li className="py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 px-2 rounded-md transition-colors">
                                <p className="text-slate-600 dark:text-slate-300">"Brainstorm names for a coffee shop..."</p>
                                <span className="text-xs text-slate-400">2 hours ago</span>
                            </li>
                            <li className="py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 px-2 rounded-md transition-colors">
                                <p className="text-slate-600 dark:text-slate-300">"Generate an image of a futuristic city..."</p>
                                <span className="text-xs text-slate-400">1 day ago</span>
                            </li>
                             <li className="py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 px-2 rounded-md transition-colors">
                                <p className="text-slate-600 dark:text-slate-300">"Explain quantum computing simply..."</p>
                                <span className="text-xs text-slate-400">3 days ago</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Files Column */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4">My Files</h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg">
                            <Icon name="photo" className="w-5 h-5 text-purple-500 dark:text-teal-400"/>
                            <span className="text-sm text-slate-600 dark:text-slate-300 truncate">logo-concept.png</span>
                        </div>
                         <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg">
                            <Icon name="grid" className="w-5 h-5 text-purple-500 dark:text-teal-400"/>
                            <span className="text-sm text-slate-600 dark:text-slate-300 truncate">q3-budget.csv</span>
                        </div>
                         <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg">
                            <Icon name="video" className="w-5 h-5 text-purple-500 dark:text-teal-400"/>
                            <span className="text-sm text-slate-600 dark:text-slate-300 truncate">promo-video-v1.mp4</span>
                        </div>
                         <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg">
                            <Icon name="microphone" className="w-5 h-5 text-purple-500 dark:text-teal-400"/>
                            <span className="text-sm text-slate-600 dark:text-slate-300 truncate">meeting-notes.mp3</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default YourSpaceView;