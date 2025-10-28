import React, { useState } from 'react';
import { HelpIcon } from '../constants';


const AccordionItem: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-200">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left py-4 px-2"
            >
                <span className="font-medium text-gray-800">{title}</span>
                <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <div className="p-4 pt-0 text-gray-600">
                    {children}
                </div>
            </div>
        </div>
    );
};


const HelpPage: React.FC = () => {
    const faqs = [
        {
            q: "What is SnakeEngine.AI?",
            a: "SnakeEngine.AI is a comprehensive platform that provides a suite of powerful, user-friendly AI tools. You can engage in smart text and voice chats, generate and edit images, create videos, analyze files, and much more."
        },
        { q: "Which AI models do you use?", a: "We leverage a variety of state-of-the-art models, including Google's Gemini family, to provide the best performance for different tasks." },
        { q: "Is my data secure?", a: "Yes, we prioritize data security and privacy. All data is encrypted in transit and at rest, and we adhere to strict privacy policies." },
        { q: "How do I manage my subscription?", a: "You can manage your subscription, upgrade, or cancel your plan at any time from the 'Plans & Subscription' section in your account settings." },
        { q: "Do you offer an API for developers?", a: "We are working on a developer API. Please contact us through the support form to be notified when it becomes available." },
    ];

    return (
        <div className="min-h-full p-4 md:p-8 bg-gray-50">
            <div className="flex items-center mb-10">
                <HelpIcon className="h-8 w-8 text-gray-700" />
                <h1 className="text-3xl font-bold text-gray-800 ml-3">Help & Support</h1>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
                    <div className="bg-white rounded-2xl shadow-lg p-4">
                        <AccordionItem title={faqs[0].q}>
                            <p>{faqs[0].a}</p>
                        </AccordionItem>
                        {faqs.slice(1).map((faq, i) => (
                             <div key={i} className="border-b border-gray-200 last:border-b-0">
                                <button className="w-full flex justify-between items-center text-left py-4 px-2">
                                    <span className="font-medium text-gray-800">{faq.q}</span>
                                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Contact Support</h2>
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                <input type="text" id="name" className="w-full p-3 bg-gray-100 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-400" />
                            </div>
                             <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                                <input type="email" id="email" className="w-full p-3 bg-gray-100 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-400" />
                            </div>
                             <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea id="message" rows={5} className="w-full p-3 bg-gray-100 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-400"></textarea>
                            </div>
                            <button type="submit" className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpPage;
