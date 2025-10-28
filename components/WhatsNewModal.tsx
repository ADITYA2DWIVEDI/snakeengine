import React from 'react';

interface WhatsNewModalProps {
    onClose: () => void;
}

const FeatureItem: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
    <div className="flex items-start space-x-4 py-4 border-b border-gray-200 last:border-b-0">
        <div className="flex-shrink-0 text-purple-500 bg-purple-100 p-2 rounded-lg">
            {icon}
        </div>
        <div>
            <h3 className="font-semibold text-gray-800">{title}</h3>
            <p className="text-gray-500 text-sm mt-1">{description}</p>
        </div>
    </div>
);


const WhatsNewModal: React.FC<WhatsNewModalProps> = ({ onClose }) => {
    const features = [
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 12.728l-.707-.707M6.343 17.657l-.707.707M12 21v-1" /></svg>,
            title: 'Comprehensive Feature Overhaul',
            description: 'We’ve upgraded every feature! From smarter image editing and persistent chat history to a dynamic homepage and streamlined workflows, the entire platform is now more powerful and intuitive.'
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
            title: 'New Live Chat',
            description: 'The old AI voice chat has been replaced with a brand new human-to-human live chat platform. Connect and communicate seamlessly.'
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" /></svg>,
            title: 'All New Courses Section',
            description: 'Explore a vast library of courses with a brand new interface, complete with powerful search and filtering to help you learn faster.'
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
            title: 'Enhanced Security with 2FA',
            description: 'Your account is now more secure. We’ve added a 2-factor authentication step via email for logins and password recoveries.'
        },
    ];

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8" onClick={(e) => e.stopPropagation()}>
                <div className="text-center mb-6">
                    <div className="inline-block p-3 bg-purple-100 rounded-full mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">What's New at SnakeEngine.AI</h2>
                    <p className="text-gray-500 mt-1">We've been busy making things even better for you!</p>
                </div>
                
                <div className="max-h-80 overflow-y-auto pr-2">
                    {features.map((feature, i) => (
                        <FeatureItem key={i} icon={feature.icon} title={feature.title} description={feature.description} />
                    ))}
                </div>

                <button 
                    onClick={onClose} 
                    className="w-full mt-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors">
                    Got it, thanks!
                </button>
            </div>
        </div>
    );
};

export default WhatsNewModal;
