
import React from 'react';
import { Page } from '../../types';
import { Icon } from '../icons';

const creators = [
    {
        name: 'Alex Johnson',
        role: 'Founder & CEO',
        bio: 'Visionary leader with a passion for making complex AI accessible to everyone.'
    },
    {
        name: 'Ben Carter',
        role: 'Lead AI Engineer',
        bio: 'The brains behind our core models, constantly pushing the boundaries of what\'s possible.'
    },
    {
        name: 'Chloe Davis',
        role: 'Head of Design',
        bio: 'The creative force shaping the beautiful and intuitive user experience you love.'
    }
];

const CreatorsView: React.FC = () => {
    return (
        <div className="animate-fade-in">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                     <Icon name="logo" className="w-20 h-20 mx-auto mb-4" />
                    <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">Meet the Creators</h1>
                    <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
                        We are <span className="font-bold gradient-text">SnakeEngineOfficial</span>, a passionate team dedicated to pushing the boundaries of AI and creating powerful, user-friendly tools that empower everyone.
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {creators.map(creator => (
                            <div key={creator.name} className="text-center">
                                <div className="w-24 h-24 mx-auto rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mb-4">
                                    <Icon name="profile" className="w-12 h-12 text-slate-500" />
                                </div>
                                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{creator.name}</h3>
                                <p className="text-sm font-semibold text-purple-600 dark:text-teal-400">{creator.role}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{creator.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl text-center">
                     <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">Our Mission</h2>
                     <p className="mt-4 text-slate-600 dark:text-slate-300">
                        Our mission is to democratize access to cutting-edge artificial intelligence. We believe that AI should be an intuitive and accessible tool for creators, developers, and businesses of all sizes. SnakeEngine.AI is our first step towards building a comprehensive platform that not only showcases the power of AI but also makes it a joy to use.
                     </p>
                     
                     <div className="mt-8">
                        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">Connect With Us</h3>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Follow our journey and get the latest updates on our social media.</p>
                        <div className="flex justify-center gap-6 mt-4">
                            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-teal-400 transition-colors">
                                <Icon name="instagram" className="w-8 h-8" />
                            </a>
                             <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-teal-400 transition-colors">
                                <Icon name="facebook" className="w-8 h-8" />
                            </a>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default CreatorsView;
