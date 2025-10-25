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
}

type AuthStep = 'credentials' | 'otp' | 'forgotPassword';

const InputField: React.FC<{ 
    id: string, 
    type: string, 
    placeholder: string, 
    icon: 'email' | 'lock' | 'profile',
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void,
    disabled?: boolean,
    error?: string,
}> = ({ id, type, placeholder, icon, value, onChange, onBlur, disabled, error }) => {
    const isPassword = type === 'password';
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

    const togglePasswordVisibility = () => setIsPasswordVisible(prev => !prev);
    const currentType = isPassword ? (isPasswordVisible ? 'text' : 'password') : type;
    
    const borderClasses = error 
        ? 'border-red-500 dark:border-red-500 focus:ring-red-500' 
        : 'border-slate-200 dark:border-slate-600 focus:ring-purple-500 dark:focus:ring-teal-500';

    return (
        <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 transition-colors group-focus-within:text-purple-600 dark:group-focus-within:text-teal-400">
                <Icon name={icon} className="w-5 h-5" />
            </span>
            <input
                id={id}
                name={id}
                type={currentType}
                placeholder={placeholder}
                className={`w-full pl-10 py-2.5 bg-slate-100 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 transition-all ${isPassword ? 'pr-10' : 'pr-3'} ${borderClasses}`}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
                aria-invalid={!!error}
            />
            {isPassword && (
                <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600">
                    <Icon name={isPasswordVisible ? 'eye-slash' : 'eye'} className="w-5 h-5" />
                </button>
            )}
        </div>
    );
};

const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
    const [authStep, setAuthStep] = React.useState<AuthStep>('credentials');
    const [isSignUp, setIsSignUp] = React.useState(false);
    const [isAuthenticating, setIsAuthenticating] = React.useState(false);
    
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('snakeengineofficial@gmail.com');
    const [password, setPassword] = React.useState('');
    const [rememberMe, setRememberMe] = React.useState(true);
    const [otp, setOtp] = React.useState('');
    const [errors, setErrors] = React.useState<{ name?: string; email?: string; password?: string; otp?: string; general?: string }>({});

    const handleGoogleSignIn = React.useCallback((response: any) => {
        setIsAuthenticating(true);
        setTimeout(() => onLoginSuccess(true), 1000);
    }, [onLoginSuccess]);

    React.useEffect(() => {
        if (window.google?.accounts?.id) {
            window.google.accounts.id.initialize({
                client_id: '43207759969-q4kmbo51pkvihoo03efd4kladk8oshhq.apps.googleusercontent.com',
                callback: handleGoogleSignIn,
            });
            window.google.accounts.id.renderButton(document.getElementById('google-signin-button'), { theme: 'outline', size: 'large', type: 'standard', text: 'continue_with', width: '300' });
        }
    }, [handleGoogleSignIn]);

    const handleCredentialsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if (!email.trim() || !password.trim()) {
            setErrors({ general: 'Please fill in all fields.' });
            return;
        }
        setIsAuthenticating(true);
        // Simulate sending credentials and receiving OTP prompt
        setTimeout(() => {
            setIsAuthenticating(false);
            setAuthStep('otp');
        }, 1000);
    };
    
    const handleOtpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp === '123456') { // Mock OTP
            setIsAuthenticating(true);
            setTimeout(() => onLoginSuccess(rememberMe), 1000);
        } else {
            setErrors({ otp: 'Invalid verification code.' });
        }
    };
    
    if (authStep === 'otp') {
        return (
             <div className="flex items-center justify-center min-h-screen w-full p-4 premium-background">
                <div className="w-full max-w-sm bg-white/30 dark:bg-slate-800/30 backdrop-blur-xl border border-white/40 dark:border-slate-700/60 rounded-2xl shadow-xl p-8 animate-fade-in text-center">
                    <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-slate-100">Check your email</h2>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">We've sent a 6-digit code to <span className="font-semibold">{email}</span>. The code expires shortly, so please enter it soon.</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 -mt-2 mb-4">(For this demo, please use the code: <span className="font-bold">123456</span>)</p>
                    <form onSubmit={handleOtpSubmit} className="space-y-4">
                        <input 
                            value={otp} 
                            onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                            maxLength={6}
                            placeholder="— — — — — —"
                            autoComplete="one-time-code"
                            className="w-full text-center tracking-[0.5em] sm:tracking-[0.75em] font-mono text-2xl bg-white dark:bg-slate-800 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-inner border border-slate-200 dark:border-slate-700"
                        />
                        {errors.otp && <p className="text-red-500 text-sm font-semibold">{errors.otp}</p>}
                        <button type="submit" disabled={isAuthenticating} className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-teal-500 hover:opacity-90 disabled:opacity-70 flex justify-center shadow-lg !mt-6">
                            {isAuthenticating ? <Spinner /> : 'Verify'}
                        </button>
                    </form>
                    <button onClick={() => setAuthStep('credentials')} className="text-sm text-slate-600 dark:text-slate-400 hover:underline mt-6">Back to login</button>
                </div>
             </div>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-screen w-full p-4 premium-background">
            <div className="w-full max-w-sm bg-white/30 dark:bg-slate-800/30 backdrop-blur-xl border border-white/40 dark:border-slate-700/60 rounded-2xl shadow-xl p-8 animate-fade-in">
                <div className="text-center mb-6">
                    <Icon name="logo" className="w-16 h-16 mx-auto mb-2" />
                    <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 gradient-text">
                        SNAKEENGINE.AI
                    </h1>
                </div>

                <div className="flex mb-6 border-b border-slate-300 dark:border-slate-600">
                    <button onClick={() => setIsSignUp(false)} className={`flex-1 pb-2 font-semibold text-sm transition-colors ${!isSignUp ? 'text-purple-600 dark:text-teal-400 border-b-2 border-purple-600 dark:border-teal-400' : 'text-slate-500'}`}>Sign In</button>
                    <button onClick={() => setIsSignUp(true)} className={`flex-1 pb-2 font-semibold text-sm transition-colors ${isSignUp ? 'text-purple-600 dark:text-teal-400 border-b-2 border-purple-600 dark:border-teal-400' : 'text-slate-500'}`}>Sign Up</button>
                </div>
                
                <div id="google-signin-button" className="flex justify-center mb-6"></div>

                <div className="my-6 flex items-center">
                    <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
                    <span className="flex-shrink mx-4 text-slate-400 dark:text-slate-500 text-xs uppercase">OR</span>
                    <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
                </div>
                
                <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                    {isSignUp && <InputField id="name" type="text" placeholder="Full Name" icon="profile" value={name} onChange={e => setName(e.target.value)} disabled={isAuthenticating} />}
                    <InputField id="email" type="email" placeholder="Email Address" icon="email" value={email} onChange={e => setEmail(e.target.value)} disabled={isAuthenticating} />
                    <InputField id="password" type="password" placeholder="Password" icon="lock" value={password} onChange={e => setPassword(e.target.value)} disabled={isAuthenticating} />

                    {!isSignUp && (
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center cursor-pointer"><input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} /><span className="ml-2 text-slate-600 dark:text-slate-300">Remember me</span></label>
                            <a href="#" onClick={(e) => { e.preventDefault(); setAuthStep('otp'); }} className="font-medium text-purple-600 hover:text-purple-500 dark:text-teal-400">Forgot password?</a>
                        </div>
                    )}
                    
                    <button type="submit" disabled={isAuthenticating} className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-teal-500 hover:opacity-90 flex justify-center disabled:opacity-70 !mt-6">
                        {isAuthenticating ? <Spinner /> : (isSignUp ? 'Create Account' : 'Sign In')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginView;