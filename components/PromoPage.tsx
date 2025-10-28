import React from 'react';
import { LogoIcon, CubeIcon, InstagramIcon, FacebookIcon, YoutubeIcon, ThreadsIcon } from '../constants';

const PromoPage: React.FC = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center p-4 bg-gray-900 text-white overflow-hidden">
            <div className="w-full max-w-4xl text-center space-y-12">
                
                {/* Intro */}
                <div className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
                    <div className="inline-block relative">
                        <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-cyan-400 rounded-full blur-xl opacity-50"></div>
                        <LogoIcon className="h-32 w-32 relative" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mt-4">SnakeEngine.AI</h1>
                </div>

                {/* Features */}
                <div className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                    <div className="flex justify-center items-center space-x-4 text-gray-300">
                        <CubeIcon className="h-6 w-6"/>
                        <p className="text-xl">Powered by the most advanced AI models</p>
                    </div>
                </div>
                
                {/* Socials */}
                <div className="animate-fade-in-up" style={{ animationDelay: '1.4s' }}>
                    <div className="inline-block px-8 py-4 bg-black/20 backdrop-blur-md rounded-full border border-white/10">
                        <div className="flex items-center space-x-6">
                            <a href="https://www.instagram.com/SNAKEENGINEOFFICIAL" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors"><InstagramIcon className="h-7 w-7"/></a>
                            <a href="https://www.facebook.com/SNAKEENGINEOFFICIAL" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors"><FacebookIcon className="h-7 w-7"/></a>
                            <a href="https://www.youtube.com/@SNAKEENGINEOFFICIAL" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors"><YoutubeIcon className="h-7 w-7"/></a>
                            <a href="https://www.threads.net/@SNAKEENGINEOFFICIAL" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors"><ThreadsIcon className="h-7 w-7"/></a>
                            <span className="text-lg font-medium tracking-wider text-gray-400">@SNAKEENGINEOFFICIAL</span>
                        </div>
                    </div>
                    <p className="mt-4 text-lg text-cyan-400 font-semibold tracking-widest">snakeengine.vercel.app</p>
                </div>

                {/* CTA */}
                 <div className="animate-fade-in" style={{ animationDelay: '2.0s' }}>
                    <h2 className="text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">
                        Discover SnakeEngine.AI for your success.
                    </h2>
                </div>
            </div>
        </div>
    );
};

export default PromoPage;