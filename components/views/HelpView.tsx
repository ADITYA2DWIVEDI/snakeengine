import React from 'react';
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
        answer: 'Yes, security is our top priority. We do not store your conversations or uploaded files unless you explicitly save them to "Your Space". All data is transmitted securely over SSL, and our infrastructure follows industry best practices.'
    },
    {
        question: 'How do I manage my subscription?',
        answer: 'You can manage your subscription, upgrade your plan, or view billing history from the "Plans & Subscription" page in the main menu. From there, you can easily change or cancel your plan at any time.'
    },
    {
        question: 'Do you offer an API for developers?',
        answer: 'While we don\'t currently offer a public API for SnakeEngine.AI itself, many of the features are powered by models that do have APIs (like the Gemini API). You can manage your keys for these services in the "API Keys" section if you are an admin.'
    }
];

const HelpView: React.FC = () => {
    const [openIndex, setOpenIndex] = React.useState<number | null>(0);
    const [formSubmitted, setFormSubmitted] = React.useState(false);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };
    
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormSubmitted(true);
    }

    return (
        <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-8">
                <Icon name={Page.HELP_SUPPORT} className="w-8 h-8 gradient-text" />
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{Page.HELP_SUPPORT}</h1>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqData.map((faq, index) => (
                            <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden">
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full flex justify-between items-center text-left p-4 font-semibold text-slate-700 dark:text-slate-200"
                                >
                                    <span>{faq.question}</span>
                                    <Icon name="chevron-right" className={`w-5 h-5 transition-transform ${openIndex === index ? 'rotate-90' : ''}`} />
                                </button>
                                {openIndex === index && (
                                    <div className="px-4 pb-4 text-slate-500 dark:text-slate-400 text-sm">
                                        <p>{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4">Contact Support</h2>
                        {formSubmitted ? (
                            <div className="text-center p-6 bg-green-50 dark:bg-green-900/50 rounded-lg">
                                <Icon name="checkmark" className="w-10 h-10 text-green-500 mx-auto mb-2" />
                                <p className="font-semibold text-green-700 dark:text-green-300">Thank you!</p>
                                <p className="text-sm text-green-600 dark:text-green-400">Your message has been sent. We'll get back to you shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="text-sm font-medium text-slate-600 dark:text-slate-300">Your Name</label>
                                    <input type="text" id="name" required className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-md focus:ring-purple-500"/>
                                </div>
                                <div>
                                    <label htmlFor="email" className="text-sm font-medium text-slate-600 dark:text-slate-300">Your Email</label>
                                    <input type="email" id="email" required className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-md focus:ring-purple-500"/>
                                </div>
                                <div>
                                    <label htmlFor="message" className="text-sm font-medium text-slate-600 dark:text-slate-300">Message</label>
                                    <textarea id="message" rows={4} required className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-md focus:ring-purple-500"></textarea>
                                </div>
                                <button type="submit" className="w-full py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-500 transition-colors">
                                    Send Message
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpView;