import React from 'react';
import { LogoIcon, CubeIcon, InstagramIcon, FacebookIcon, YoutubeIcon, ThreadsIcon } from '../constants';

const PromoPage: React.FC = () => {
    return (
        // Main container: full screen, dark background, centered content
        <div className="h-full flex flex-col items-center justify-center p-4 bg-gray-900 dark:bg-[#0d1117] text-white overflow-hidden">
            {/* Content wrapper with vertical spacing */}
            <div className="w-full max-w-4xl text-center flex flex-col items-center space-y-10">
                
                {/* 1. Logo and Main Title */}
                <div className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
                    {/* Logo with glow effect */}
                    <div className="inline-block relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-cyan-400 rounded-full blur-2xl opacity-40"></div>
                        <LogoIcon className="h-24 w-24 relative" />
                    </div>
                    {/* Main Title */}
                    <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mt-6">SnakeEngine.AI</h1>
                </div>

                {/* 2. Tagline */}
                <div className="animate-fade-in-up flex items-center space-x-3 text-gray-300" style={{ animationDelay: '0.8s' }}>
                    <CubeIcon className="h-5 w-5"/>
                    <p className="text-lg">Powered by the most advanced AI models</p>
                </div>
                
                {/* 3. Socials and URL Group */}
                <div className="animate-fade-in-up flex flex-col items-center space-y-4" style={{ animationDelay: '1.4s' }}>
                    {/* Social Media Bar */}
                    <div className="inline-flex items-center px-6 py-3 bg-black/20 backdrop-blur-md rounded-full border border-white/10">
                        <div className="flex items-center space-x-5">
                            <a href="https://www.instagram.com/SNAKEENGINEOFFICIAL" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><InstagramIcon className="h-6 w-6"/></a>
                            <a href="https://www.facebook.com/SNAKEENGINEOFFICIAL" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><FacebookIcon className="h-6 w-6"/></a>
                            <a href="https://www.youtube.com/@SNAKEENGINEOFFICIAL" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><YoutubeIcon className="h-6 w-6"/></a>
                            <a href="https://www.threads.net/@SNAKEENGINEOFFICIAL" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><ThreadsIcon className="h-6 w-6"/></a>
                            <span className="text-md font-medium tracking-wider text-gray-400 pl-2">@SNAKEENGINEOFFICIAL</span>
                        </div>
                    </div>
                    {/* Website URL */}
                    <p className="text-md text-cyan-400 font-semibold tracking-wider">snakeengine.vercel.app</p>
                </div>

                {/* 4. Call to Action */}
                 <div className="animate-fade-in" style={{ animationDelay: '2.0s', paddingTop: '1rem' }}>
                    <h2 className="text-3xl md:text-4xl font-semibold text-gray-400">
                        Discover SnakeEngine.AI for your success.
                    </h2>
                </div>
            </div>
        </div>
    );
};

export default PromoPage;
