import React from 'react';
import { InstagramIcon, FacebookIcon, YoutubeIcon, ThreadsIcon } from '../constants';

const Footer: React.FC = () => {
    return (
        <footer className="flex-shrink-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-3">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <div className="mb-2 sm:mb-0">
                    <a href="https://snakeengine.vercel.app" target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                        snakeengine.vercel.app
                    </a>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="font-medium hidden md:inline">@SNAKEENGINEOFFICIAL</span>
                    <a href="https://www.instagram.com/SNAKEENGINEOFFICIAL" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"><InstagramIcon className="h-5 w-5"/></a>
                    <a href="https://www.facebook.com/SNAKEENGINEOFFICIAL" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"><FacebookIcon className="h-5 w-5"/></a>
                    <a href="https://www.youtube.com/@SNAKEENGINEOFFICIAL" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"><YoutubeIcon className="h-5 w-5"/></a>
                    <a href="https://www.threads.net/@SNAKEENGINEOFFICIAL" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"><ThreadsIcon className="h-5 w-5"/></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;