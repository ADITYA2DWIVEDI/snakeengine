import React, { useState } from 'react';

const AccordionItem = ({ title, children }: { title: string, children?: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-border-color">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left py-4">
                <span className="font-medium text-text-primary">{title}</span>
                <svg className={`w-5 h-5 text-text-secondary transform transition-transform ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && <div className="pb-4 text-text-secondary prose prose-sm max-w-none prose-p:text-slate-500">{children}</div>}
        </div>
    );
};

export const HelpPage: React.FC = () => {
    return (
        <div className="h-full w-full p-4 md:p-8 overflow-y-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary">Help & Support</h1>
                <p className="text-text-secondary mt-1">Have questions? We're here to help.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="p-6 rounded-2xl glass-pane">
                         <h2 className="text-xl font-semibold text-text-primary mb-4">Frequently Asked Questions</h2>
                         <AccordionItem title="How does the AI chat work?">
                             <p>Our chat is powered by advanced large language models. You can ask it questions, request summaries, generate text, and much more. Just type your query and the AI will respond in a conversational manner.</p>
                         </AccordionItem>
                         <AccordionItem title="What kind of images can I generate?">
                             <p>You can generate a wide variety of images, from photorealistic scenes to abstract art. Be descriptive in your prompt and choose a style to guide the AI towards your desired output.</p>
                         </AccordionItem>
                         <AccordionItem title="Is my data secure?">
                             <p>Yes, we prioritize your privacy and security. All conversations and data are encrypted. We do not use your personal data to train our models. Please refer to our privacy policy for more details.</p>
                         </AccordionItem>
                    </div>
                </div>
                 <div>
                    <div className="p-6 rounded-2xl glass-pane">
                         <h2 className="text-xl font-semibold text-text-primary mb-4">Still need help?</h2>
                         <form className="space-y-4">
                            <div>
                               <label htmlFor="email" className="block text-sm font-medium text-text-primary">Your Email</label>
                               <input type="email" id="email" className="mt-1 block w-full bg-white border-border-color rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-red" />
                            </div>
                             <div>
                               <label htmlFor="message" className="block text-sm font-medium text-text-primary">Your Message</label>
                               <textarea id="message" rows={4} className="mt-1 block w-full bg-white border-border-color rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-red resize-none"></textarea>
                            </div>
                            <button type="submit" className="w-full py-2 px-4 bg-brand-red text-white font-semibold rounded-lg shadow-lg hover:bg-brand-red/80 transition-all">Send Message</button>
                         </form>
                    </div>
                </div>
            </div>
        </div>
    );
};