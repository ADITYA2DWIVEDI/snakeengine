/// <reference types="react" />
import React from 'react';
import { Icon } from '../icons';
import Spinner from '../common/Spinner';

declare global {
  interface Window {
    google?: any;
  }
}

interface LoginViewProps {
    onLoginSuccess: (remember: boolean) => void;
    isModal?: boolean;
    onClose?: () => void;
}

const InputField: React.FC<{ 
    id: string, 
    type: string, 
    placeholder: string, 
    icon: 'email' | 'lock' | 'profile',
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void 
}> = ({ id, type, placeholder, icon, value, onChange }) => {
    const isPassword = type === 'password';
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(prev => !prev);
    };

    const currentType = isPassword ? (isPasswordVisible ? 'text' : 'password') : type;

    return (
        <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 transition-colors duration-300 ease-in-out group-focus-within:text-purple-600 dark:group-focus-within:text-teal-400">
                <Icon name={icon} className="w-5 h-5" />
            </span>
            <input
                id={id}
                type={currentType}
                placeholder={placeholder}
                className={`w-full pl-10 py-2.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-teal-500 focus:border-purple-500 dark:focus:border-teal-500 transition-all duration-300 ease-in-out ${isPassword ? 'pr-10' : 'pr-3'}`}
                required
                value={value}
                onChange={onChange}
            />
            {isPassword && (
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none"
                    aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                >
                    <Icon name={isPasswordVisible ? 'eye-slash' : 'eye'} className="w-5 h-5" />
                </button>
            )}
        </div>
    );
};

const calculatePasswordStrength = (password: string): { score: number, label: string } => {
    let score = 0;
    if (!password) return { score: 0, label: '' };

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    const labels = ['', 'Weak', 'Medium', 'Strong', 'Very Strong'];
    
    return { score, label: labels[score] };
};

const PasswordStrengthIndicator: React.FC<{ score: number, label: string }> = ({ score, label }) => {
    const strength = {
        color: 'bg-slate-300 dark:bg-slate-600',
    };

    if (score >= 4) {
        strength.color = 'bg-green-500';
    } else if (score === 3) {
        strength.color = 'bg-yellow-500';
    } else if (score > 0) {
        strength.color = 'bg-red-500';
    }

    return (
        <div className="mt-2 space-y-1">
            <div className="flex gap-1.5">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div 
                        key={index}
                        className={`h-1.5 flex-1 rounded-full ${index < score ? strength.color : 'bg-slate-200 dark:bg-slate-600'}`}
                    ></div>
                ))}
            </div>
            {label && <p className="text-xs text-right text-slate-500 dark:text-slate-400">{label}</p>}
        </div>
    );
};

const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, isModal, onClose }) => {
    const [isSignUp, setIsSignUp] = React.useState(false);
    const [isAuthenticating, setIsAuthenticating] = React.useState(false);
    
    const [fullName, setFullName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [rememberMe, setRememberMe] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [passwordStrength, setPasswordStrength] = React.useState({ score: 0, label: '' });

    const googleButtonDiv = React.useRef<HTMLDivElement>(null);

    const handleGoogleSignIn = (response: any) => {
        console.log("Google Sign-In successful. Encoded JWT ID token: " + response.credential);
        
        setIsAuthenticating(true);
        setError(null);
        setTimeout(() => {
            onLoginSuccess(true);
        }, 1500);
    };
    
    React.useEffect(() => {
        if (isSignUp) {
            setPasswordStrength(calculatePasswordStrength(password));
        }
    }, [password, isSignUp]);
    
    React.useEffect(() => {
        const renderError = (message: string) => {
            if (googleButtonDiv.current) {
                googleButtonDiv.current.innerHTML = `<div class="p-4 border border-dashed border-red-300 rounded-md text-center"><p class="text-sm text-red-500">${message}</p></div>`;
            }
        };

        if (window.google?.accounts?.id) {
            // Fix: Added a mock Google Client ID to ensure the Google Sign-In button renders correctly for demonstration purposes.
            const clientId = "1234567890-mockclientid.apps.googleusercontent.com";

            if (!clientId || clientId.startsWith('YOUR_')) {
                console.warn("Google Client ID is not configured. Google Sign-In button will not be displayed.");
                renderError("Google Sign-In is not configured by the administrator.");
                return;
            }

            try {
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: handleGoogleSignIn,
                });
                if (googleButtonDiv.current) {
                    window.google.accounts.id.renderButton(
                        googleButtonDiv.current,
                        { theme: "outline", size: "large", type: "standard", text: "signin_with", width: "320" }
                    );
                }
            } catch (err) {
                 console.error("Error initializing Google Sign-In:", err);
                 renderError("Could not initialize Google Sign-In.");
            }
        } else {
            // Use a timeout to wait for the google script to potentially load
            const timeoutId = setTimeout(() => {
                if (!window.google?.accounts?.id) {
                    console.warn("Google Sign-In script not found or failed to load.");
                    renderError("Google Sign-In is not available.");
                }
            }, 1500); // Wait 1.5 seconds
            return () => clearTimeout(timeoutId);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!/\S+@\S+\.\S+/.test(email)) return setError("Please enter a valid email address.");
        if (isSignUp) {
            if (!fullName.trim()) return setError("Please enter your full name.");
            if (passwordStrength.score < 3) return setError("Password is too weak.");
            if (password !== confirmPassword) return setError("Passwords do not match.");
        } else {
            if (!password) return setError("Please enter your password.");
        }

        setIsAuthenticating(true);
        setTimeout(() => {
            onLoginSuccess(isSignUp || rememberMe);
        }, 1500);
    };

    const toggleFormMode = () => {
        setIsSignUp(!isSignUp);
        setFullName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setError(null);
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 premium-background">
             {isModal && (
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white hover:text-slate-200 transition-colors z-10 p-1 rounded-full"
                    aria-label="Close login"
                >
                    <Icon name="close" className="w-6 h-6" />
                </button>
            )}

            <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 animate-fade-in">
                <div className="text-center mb-8">
                    <Icon name="logo" className="w-16 h-16 mx-auto mb-2" />
                    <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
                        {isSignUp ? 'Create Your Account' : 'Welcome Back'}
                    </h1>
                    <p className="mt-1 text-slate-500 dark:text-slate-400">
                        {isSignUp ? 'Join SnakeEngine.AI today.' : 'Sign in to continue.'}
                    </p>
                </div>
                
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    {isSignUp && (
                         <InputField id="name" type="text" placeholder="Full Name" icon="profile" value={fullName} onChange={e => setFullName(e.target.value)} />
                    )}
                    <InputField id="email" type="email" placeholder="Email Address" icon="email" value={email} onChange={e => setEmail(e.target.value)} />
                    <div>
                        <InputField id="password" type="password" placeholder="Password" icon="lock" value={password} onChange={e => setPassword(e.target.value)} />
                        {isSignUp && <PasswordStrengthIndicator score={passwordStrength.score} label={passwordStrength.label} />}
                    </div>
                    {isSignUp && (
                        <InputField id="confirm-password" type="password" placeholder="Confirm Password" icon="lock" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                    )}

                    {!isSignUp && (
                        <div className="flex items-center justify-between text-sm">
                            <label htmlFor="remember" className="flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    id="remember" 
                                    className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500" 
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <span className="ml-2 text-slate-600 dark:text-slate-300">Remember me</span>
                            </label>
                            <a href="#" className="font-medium text-purple-600 hover:text-purple-500 dark:text-teal-400 dark:hover:text-teal-300">
                                Forgot password?
                            </a>
                        </div>
                    )}

                    {error && <p className="text-red-500 text-sm text-center !mt-3">{error}</p>}
                    
                    <button
                        type="submit"
                        disabled={isAuthenticating}
                        className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 bg-gradient-to-r from-purple-500 to-teal-500 hover:opacity-90 flex items-center justify-center disabled:opacity-70 !mt-6"
                    >
                       {isAuthenticating ? (
                           <React.Fragment>
                               <Spinner/>
                               <span className="ml-2">{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                           </React.Fragment>
                       ) : (isSignUp ? 'Create Account' : 'Sign In')}
                    </button>
                </form>

                <div className="my-6 flex items-center">
                    <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
                    <span className="flex-shrink mx-4 text-slate-400 dark:text-slate-500 text-xs uppercase">OR</span>
                    <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
                </div>

                <div className="flex justify-center">
                    <div ref={googleButtonDiv}></div>
                </div>

                <p className="mt-8 text-sm text-center text-slate-500 dark:text-slate-400">
                    {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                    <button onClick={toggleFormMode} className="font-semibold text-purple-600 hover:text-purple-500 dark:text-teal-400 dark:hover:text-teal-300">
                        {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginView;