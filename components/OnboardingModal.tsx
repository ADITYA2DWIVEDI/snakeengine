import React, { useState } from 'react';

interface OnboardingModalProps {
    onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
    const [step, setStep] = useState(0);
    const steps = [
        {
            title: "Welcome to SnakeEngine.AI!",
            content: "This is your new all-in-one AI workspace. Let's take a quick tour of the key features."
        },
        {
            title: "The Sidebar",
            content: "Use the sidebar to navigate between main sections like the Smart Studio, your Courses, and Settings. Your chat history will also appear here."
        },
        {
            title: "Simple Navigation",
            content: "Clicking any item in the sidebar will take you directly to that page. To access a tool, go to the Smart Studio and click on it."
        },
        {
            title: "The Smart Studio",
            content: "This is the heart of the platform. Here you'll find a powerful suite of AI tools for image generation, video analysis, code reviews, and much more!"
        },
        {
            title: "You're All Set!",
            content: "Enjoy exploring the future of AI. Your workspace is ready."
        }
    ];

    const currentStep = steps[step];

    const nextStep = () => {
        if (step < steps.length - 1) {
            setStep(s => s + 1);
        } else {
            onClose();
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-gray-200 dark:border-gray-700 animate-scale-in" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{currentStep.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-4">{currentStep.content}</p>

                <div className="mt-8 flex items-center justify-between">
                    <div className="flex space-x-2">
                        {steps.map((_, index) => (
                            <div key={index} className={`h-2 w-2 rounded-full transition-colors ${index === step ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                        ))}
                    </div>
                    <button onClick={nextStep} className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-400 text-white font-semibold">
                        {step === steps.length - 1 ? "Get Started" : "Next"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OnboardingModal;