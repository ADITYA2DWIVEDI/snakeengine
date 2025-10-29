import { useState, useEffect } from 'react';

const AI_PERSONA_KEY = 'aiPersona';

export const useAiPersona = () => {
    const [aiPersona, setAiPersona] = useState<string>(() => {
        try {
            return localStorage.getItem(AI_PERSONA_KEY) || '';
        } catch (error) {
            console.error('Failed to read AI persona from localStorage', error);
            return '';
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(AI_PERSONA_KEY, aiPersona);
        } catch (error) {
            console.error('Failed to save AI persona to localStorage', error);
        }
    }, [aiPersona]);

    const clearAiPersona = () => {
        try {
            localStorage.removeItem(AI_PERSONA_KEY);
            setAiPersona('');
        } catch (error) {
            console.error('Failed to clear AI persona from localStorage', error);
        }
    };

    return { aiPersona, setAiPersona, clearAiPersona };
};
