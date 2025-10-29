import { useState, useEffect, useCallback } from 'react';
import { Chat, Message } from '../types';

export const useChatHistory = () => {
    const [chats, setChats] = useState<Chat[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);

    // Load chats from localStorage on initial mount
    useEffect(() => {
        try {
            const storedChatIds = JSON.parse(localStorage.getItem('chatIds') || '[]');
            const loadedChats = storedChatIds.map((id: string) => {
                const chatData = localStorage.getItem(id);
                return chatData ? JSON.parse(chatData) : null;
            }).filter((c: Chat | null): c is Chat => c !== null);
            
            setChats(loadedChats);

            const storedActiveId = localStorage.getItem('activeChatId');
            if (storedActiveId && storedChatIds.includes(storedActiveId)) {
                setActiveChatId(storedActiveId);
            } else if (loadedChats.length > 0) {
                setActiveChatId(loadedChats[0].id);
            } else {
                // If no chats exist, create a new one
                createNewChat();
            }
        } catch (error) {
            console.error("Failed to load chats from localStorage", error);
            createNewChat();
        }
    }, []);

    const saveChats = (updatedChats: Chat[], activeId: string | null) => {
        try {
            const chatIds = updatedChats.map(c => c.id);
            localStorage.setItem('chatIds', JSON.stringify(chatIds));
            updatedChats.forEach(chat => {
                localStorage.setItem(chat.id, JSON.stringify(chat));
            });
            if (activeId) {
                localStorage.setItem('activeChatId', activeId);
            }
        } catch (error) {
            console.error("Failed to save chats to localStorage", error);
        }
    };

    const createNewChat = useCallback(() => {
        const newChat: Chat = {
            id: `chat_${Date.now()}`,
            title: 'New Chat',
            messages: [{ sender: 'ai', text: 'Hello! I am SnakeEngine AI. How can I help you today?' }]
        };
        setChats(prev => {
            const newChats = [newChat, ...prev];
            saveChats(newChats, newChat.id);
            return newChats;
        });
        setActiveChatId(newChat.id);
        return newChat;
    }, []);
    
    const deleteChat = useCallback((chatId: string) => {
        setChats(prev => {
            const newChats = prev.filter(c => c.id !== chatId);
            try {
                localStorage.removeItem(chatId);
                const chatIds = newChats.map(c => c.id);
                localStorage.setItem('chatIds', JSON.stringify(chatIds));
            } catch (error) {
                console.error("Failed to delete chat from localStorage", error);
            }
            
            if (activeChatId === chatId) {
                const newActiveId = newChats[0]?.id || null;
                setActiveChatId(newActiveId);
                 if (newActiveId) {
                    localStorage.setItem('activeChatId', newActiveId);
                } else {
                    localStorage.removeItem('activeChatId');
                    // This will be handled by the effect in App.tsx to create a new chat if none exist
                }
            }
            return newChats;
        });
    }, [activeChatId]);

    const updateActiveChat = useCallback((updater: (prevChat: Chat) => Chat) => {
        setChats(prevChats => {
            const newChats = prevChats.map(chat => {
                if (chat.id === activeChatId) {
                    const updatedChat = updater(chat);
                    // Auto-generate title from first user message if it doesn't have one
                    if (!updatedChat.title || updatedChat.title === 'New Chat') {
                        const firstUserMessage = updatedChat.messages.find(m => m.sender === 'user');
                        if (firstUserMessage) {
                             const newTitle = firstUserMessage.text.split(' ').slice(0, 5).join(' ');
                             updatedChat.title = newTitle.length > 30 ? newTitle.substring(0, 27) + '...' : newTitle;
                        }
                    }
                    return updatedChat;
                }
                return chat;
            });
            saveChats(newChats, activeChatId);
            return newChats;
        });
    }, [activeChatId]);

    const clearAllChats = () => {
        try {
            chats.forEach(chat => localStorage.removeItem(chat.id));
            localStorage.removeItem('chatIds');
            localStorage.removeItem('activeChatId');
            setChats([]);
            setActiveChatId(null);
        } catch (error) {
            console.error("Failed to clear chat history from localStorage", error);
        }
    };
    
    const activeChat = chats.find(c => c.id === activeChatId) || null;

    return {
        chats,
        activeChat,
        createNewChat,
        deleteChat,
        setActiveChatId,
        updateActiveChat,
        clearAllChats,
    };
};