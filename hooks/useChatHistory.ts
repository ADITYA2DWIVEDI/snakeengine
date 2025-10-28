import { useState, useEffect, useCallback } from 'react';
import { Chat, Message } from '../types';

export const useChatHistory = () => {
    const [activeChat, setActiveChat] = useState<Chat | null>(() => {
        // Lazy initializer for synchronous loading
        try {
            const activeId = localStorage.getItem('activeChatId');
            if (activeId) {
                const storedChat = localStorage.getItem(activeId);
                if (storedChat) {
                    return JSON.parse(storedChat);
                }
            }
        } catch (error) {
            console.error("Failed to load chat from localStorage on init", error);
        }
        return null; // Return null if nothing is found
    });
    
    // Effect to create a new chat if none exists on mount
    useEffect(() => {
        if (!activeChat) {
            createNewChat();
        }
    }, []);

    // Effect to save the active chat whenever it changes
    useEffect(() => {
        if (activeChat && activeChat.id) {
            try {
                localStorage.setItem(activeChat.id, JSON.stringify(activeChat));
                localStorage.setItem('activeChatId', activeChat.id);
            } catch (error) {
                console.error("Failed to save chat to localStorage", error);
            }
        }
    }, [activeChat]);

    const createNewChat = useCallback(() => {
        const newChat: Chat = {
            id: `chat_${Date.now()}`,
            title: 'New Chat',
            messages: [{ sender: 'ai', text: 'Hello! I am SnakeEngine AI. How can I help you today?' }]
        };
        setActiveChat(newChat);
    }, []);

    return {
        activeChat,
        createNewChat,
        setActiveChat // Expose the raw setter for more complex updates
    };
};