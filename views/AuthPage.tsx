import React, { useState } from 'react';
import { LogoIcon, GoogleIcon, FacebookIcon, GitHubIcon } from '../components/Icons';

interface AuthPageProps {
    onLoginSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
    const [isLoginView, setIsLoginView] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLoginSuccess();
    };

    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-slate-50 p-4">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-2xl glass-pane">
                <div className="text-center">
                    <div className="w-16 h-16 bg-black rounded-xl shadow-md flex items-center justify-center p-2 text-brand-purple mx-auto">
                        <LogoIcon />
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        {isLoginView ? 'Welcome Back!' : 'Create Your Account'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {isLoginView ? 'Sign in to continue to SnakeEngine.AI' : 'Get started with the most powerful AI suite'}
                    </p>
                </div>
                
                <div className="flex justify-center gap-4">
                    <button onClick={onLoginSuccess} className="flex-1 inline-flex justify-center items-center gap-2 py-2 px-4 border border-slate-300 rounded-md shadow-sm bg-white text-sm font-medium text-slate-500 hover:bg-slate-50"><GoogleIcon className="w-5 h-5"/> Google</button>
                    <button onClick={onLoginSuccess} className="flex-1 inline-flex justify-center items-center gap-2 py-2 px-4 border border-slate-300 rounded-md shadow-sm bg-white text-sm font-medium text-slate-500 hover:bg-slate-50"><FacebookIcon className="w-5 h-5 text-blue-600"/> Facebook</button>
                    <button onClick={onLoginSuccess} className="flex-1 inline-flex justify-center items-center gap-2 py-2 px-4 border border-slate-300 rounded-md shadow-sm bg-white text-sm font-medium text-slate-500 hover:bg-slate-50"><GitHubIcon className="w-5 h-5"/> GitHub</button>
                </div>

                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-sm">Or continue with email</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        {!isLoginView && (
                             <div>
                                <label htmlFor="full-name" className="sr-only">Full Name</label>
                                <input id="full-name" name="name" type="text" required className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-purple focus:border-brand-purple sm:text-sm" placeholder="Full Name" />
                            </div>
                        )}
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input id="email-address" name="email" type="email" required className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-purple focus:border-brand-purple sm:text-sm" placeholder="Email address" />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input id="password" name="password" type="password" required className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-purple focus:border-brand-purple sm:text-sm" placeholder="Password" />
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-purple hover:bg-brand-purple/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple">
                           {isLoginView ? 'Sign in' : 'Create Account'}
                        </button>
                    </div>
                </form>

                 <p className="text-center text-sm text-gray-600">
                    {isLoginView ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={() => setIsLoginView(!isLoginView)} className="font-medium text-brand-purple hover:text-brand-purple/80 ml-1">
                        {isLoginView ? 'Sign up' : 'Sign in'}
                    </button>
                </p>
            </div>
        </div>
    );
};
