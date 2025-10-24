/// <reference types="react" />
import React, { useState } from 'react';
import { Page } from '../../types';
import { Icon } from '../icons';

const faqData = [
    {
        question: 'What is SnakeEngine.AI?',
        answer: 'SnakeEngine.AI is a comprehensive platform that provides a suite of powerful, user-friendly AI tools. You can engage in smart text and voice chats, generate and edit images, create videos, analyze files, and much more.'
    },
    {
        question: 'Which AI models do you use?',
        answer: 'We leverage a variety of state-of-the-art models from Google, including the Gemini family for text, voice, and analysis, Imagen for high-quality image generation, and Veo for video creation. We use the best model for each specific task to ensure top performance.'
    },
    {
        question: 'Is my data secure?',
        answer: 'Yes, security is our top priority. We do not store your conversations or uploaded files unless you explicitly save them to "Your Space". All data is transmitted securely, and we adhere to strict privacy policies.'
    },
    {
        question: 'Do I need my own API key?',
        answer: 'For most features, you can get started right away without an API key. However, for features with higher computational costs, like Veo video generation, you will be prompted to use your own API key. This ensures fair usage and allows you to track your own consumption.'
    },
    {
        question: 'What are the subscription plans?',
        answer: 'We offer a range of plans to suit different needs, from a free tier for casual users to Pro and Enterprise plans for power users and businesses. You can see the full comparison on our "Plans & Subscription" page.'
    }
];

const AccordionItem: React.FC<{ q: string, a: string }> = ({ q, a }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-slate-200 dark:border-slate-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left py-4"
            >
                <span className="font-semibold text-slate-700 dark:text-slate-200">{q}</span>
                <Icon name="chevron-right" className={`w-5 h-5 text-slate-500 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <p className="pb-4 text-slate-600 dark:text-slate-300">{a}</p>
            </div>
        </div>
    );
};

const HelpView: React.FC = () => {
    return (
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center text-white mb-4">
                    <Icon name={Page.HELP_SUPPORT} className="w-10 h-10" />
                </div>
                <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">Help & Support</h1>
                <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
                    Have questions? We're here to help. Check out our frequently asked questions below.
                </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg mb-8">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Frequently Asked Questions</h2>
                <div>
                    {faqData.map((item, index) => (
                        <AccordionItem key={index} q={item.question} a={item.answer} />
                    ))}
                </div>
            </div>
            
             <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Contact Support</h2>
                 <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Can't find the answer you're looking for? Fill out the form below and our team will get back to you as soon as possible.</p>
                <form className="space-y-4">
                     <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Name</label>
                        <input type="text" id="name" className="mt-1 block w-full bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Email Address</label>
                        <input type="email" id="email" className="mt-1 block w-full bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50" />
                    </div>
                     <div>
                        <label htmlFor="message" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Message</label>
                         <textarea id="message" rows={4} className="mt-1 block w-full bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"></textarea>
                    </div>
                    <div className="text-right">
                         <button type="submit" className="px-6 py-2 bg-purple-600 dark:bg-teal-600 text-white font-semibold rounded-lg hover:bg-purple-500 dark:hover:bg-teal-500 transition-colors">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HelpView;