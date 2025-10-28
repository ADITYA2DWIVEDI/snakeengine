import { useState, useEffect, useCallback } from 'react';
import { Chat, Message } from '../types';

const defaultChat: Chat = {
    id: `chat_${Date.now()}`,
    title: 'New Chat',
    messages: [{ sender: 'ai', text: 'Hello! I am SnakeEngine AI. How can I help you today?' }]
};

export const useChatHistory = () => {
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [activeChat, setActiveChat] = useState<Chat | null>(null);
    
    // Load active chat ID from local storage on initial render
    useEffect(() => {
        const storedId = localStorage.getItem('activeChatId');
        if (storedId) {
            setActiveChatId(storedId);
        } else {
            // If no active chat, create a new one
            createNewChat();
        }
    }, []);
    
    // When activeChatId changes, load the corresponding chat from local storage
    useEffect(() => {
        if (activeChatId) {
            const storedChat = localStorage.getItem(activeChatId);
            if (storedChat) {
                setActiveChat(JSON.parse(storedChat));
            } else {
                // If the ID is invalid or chat is missing, create a new one
                createNewChat();
            }
        }
    }, [activeChatId]);
    
    // When activeChat changes, save it to local storage
    const updateActiveChat = useCallback((updater: Chat | ((prev: Chat | null) => Chat)) => {
        setActiveChat(prevChat => {
            const newChat = typeof updater === 'function' ? updater(prevChat) : updater;
            if (newChat && newChat.id) {
                localStorage.setItem(newChat.id, JSON.stringify(newChat));
            }
            return newChat;
        });
    }, []);

    const createNewChat = useCallback(() => {
        const newChat: Chat = {
            id: `chat_${Date.now()}`,
            title: 'New Chat',
            messages: [{ sender: 'ai', text: 'Hello! I am SnakeEngine AI. How can I help you today?' }]
        };
        localStorage.setItem('activeChatId', newChat.id);
        localStorage.setItem(newChat.id, JSON.stringify(newChat));
        setActiveChatId(newChat.id);
        setActiveChat(newChat);
    }, []);

    return {
        activeChat,
        createNewChat,
        updateActiveChat
    };
};