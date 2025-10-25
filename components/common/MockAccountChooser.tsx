import React from 'react';
import { Icon } from '../icons';
import Spinner from './Spinner';

interface MockAccountChooserProps {
    onAccountSelect: (email: string) => void;
    onCancel: () => void;
    isAuthenticating: boolean;
    selectedEmail: string | null;
}

const mockAccounts = [
    { name: 'User One', email: 'user.one@example.com', initial: 'U', color: 'bg-purple-500' },
    { name: 'User Two', email: 'user.two@example.com', initial: 'U', color: 'bg-green-500' },
    { name: 'Admin User', email: 'admin@example.com', initial: 'A', color: 'bg-indigo-500' },
];

const MockAccountChooser: React.FC<MockAccountChooserProps> = ({ onAccountSelect, onCancel, isAuthenticating, selectedEmail }) => (
    <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 animate-fade-in border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 mb-8">
            <Icon name="google" className="w-5 h-5"/>
            <span>Sign in with Google</span>
        </div>
        
        <div className="flex gap-6 items-start mb-6">
            <Icon name="logo" className="w-10 h-10 flex-shrink-0" />
            <div>
                 <h2 className="text-3xl font-semibold text-slate-800 dark:text-slate-100">Choose an account</h2>
                 <p className="text-slate-500 dark:text-slate-400 mt-1">to continue to <span className="font-semibold text-slate-700 dark:text-slate-200">SnakeEngine.AI</span></p>
            </div>
        </div>

        <div className="my-6 space-y-1">
            {mockAccounts.map(account => (
                 <button
                    key={account.email}
                    onClick={() => onAccountSelect(account.email)}
                    disabled={isAuthenticating}
                    className={`w-full flex items-center gap-4 p-3 rounded-lg text-left transition-colors border ${
                        selectedEmail === account.email ? 'bg-blue-50 dark:bg-blue-900/50 border-blue-500' : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                >
                    <div className={`w-8 h-8 rounded-full ${account.color} text-white flex items-center justify-center font-bold text-sm flex-shrink-0`}>
                        {account.initial}
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">{account.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{account.email}</p>
                    </div>
                    {isAuthenticating && selectedEmail === account.email && <Spinner />}
                </button>
            ))}

            <button disabled={isAuthenticating} className="w-full flex items-center gap-4 p-3 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center flex-shrink-0">
                     <Icon name="profile" className="w-5 h-5 text-slate-500 dark:text-slate-300" />
                </div>
                <div>
                     <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">Use another account</p>
                </div>
            </button>
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500 mt-8">
             Before using this app, you can review SnakeEngine.AI's <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">privacy policy</a> and <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</a>.
        </p>
        <button onClick={onCancel} className="mt-6 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
            <Icon name="back-arrow" className="w-4 h-4" />
            Back to login
        </button>
    </div>
);

export default MockAccountChooser;