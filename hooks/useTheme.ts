import { useState, useEffect, useCallback } from 'react';

export const useTheme = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined') {
            const storedTheme = localStorage.getItem('theme');
            if (storedTheme === 'dark' || storedTheme === 'light') {
                return storedTheme;
            }
        }
        // Always default to light mode for new users
        return 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        try {
            localStorage.setItem('theme', theme);
        } catch (error) {
            console.error("Could not save theme to localStorage", error);
        }
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    }, []);
    
    const clearTheme = () => {
        try {
            localStorage.removeItem('theme');
            // Reset to light mode default
            setTheme('light');
        } catch (error) {
            console.error("Could not clear theme from localStorage", error);
        }
    };

    return { theme, toggleTheme, clearTheme };
};