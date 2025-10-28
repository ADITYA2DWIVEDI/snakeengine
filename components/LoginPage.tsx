import React, { useState } from 'react';
import { LogoIcon } from '../constants';

interface LoginPageProps {
    onLogin: () => void;
}

const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);
const EyeOffIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a10.05 10.05 0 013.4-5.118m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a9.953 9.953 0 01-1.923 3.864m-1.42-1.42A3.98 3.98 0 0012 14.5a3.98 3.98 0 00-3.517-2.075m0 0a3 3 0 00-3.517 2.075" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
    </svg>
);

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-500 p-4">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-white">
                <div className="flex flex-col items-center mb-8">
                    <LogoIcon className="h-12 w-12 mb-2" />
                    <h1 className="text-2xl font-bold tracking-wider">SNAKEENGINE.AI</h1>
                </div>

                <div className="mb-6">
                    <div className="flex border-b border-white/20">
                        <button
                            onClick={() => setActiveTab('signin')}
                            className={`flex-1 py-2 text-center font-semibold transition-all duration-300 ${activeTab === 'signin' ? 'text-white border-b-2 border-white' : 'text-white/60'}`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setActiveTab('signup')}
                            className={`flex-1 py-2 text-center font-semibold transition-all duration-300 ${activeTab === 'signup' ? 'text-white border-b-2 border-white' : 'text-white/60'}`}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>

                <div className="text-center text-sm text-white/50 mb-6">OR</div>

                <form onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
                    <div className="space-y-6">
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            </span>
                            <input type="email" placeholder="Email Address" required className="w-full bg-white/20 rounded-lg py-3 pl-12 pr-4 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50" />
                        </div>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            </span>
                            <input type={showPassword ? "text" : "password"} placeholder="Password" required className="w-full bg-white/20 rounded-lg py-3 pl-12 pr-12 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70">
                                {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 text-sm">
                        <label className="flex items-center">
                            <input type="checkbox" className="h-4 w-4 rounded bg-white/30 border-none text-purple-500 focus:ring-purple-500" />
                            <span className="ml-2">Remember me</span>
                        </label>
                        <a href="#" className="font-semibold hover:underline">Forgot password?</a>
                    </div>

                    <button type="submit" className="w-full mt-8 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-400 font-bold text-lg tracking-wider hover:opacity-90 transition-opacity">
                        Sign In
                    </button>
                </form>
                
                <div className="text-center text-sm text-white/50 my-4">OR</div>
                
                <button 
                    onClick={onLogin} 
                    className="w-full text-center font-semibold text-white/80 hover:text-white hover:underline transition-colors"
                >
                    Continue as Guest
                </button>
            </div>
        </div>
    );
};

export default LoginPage;