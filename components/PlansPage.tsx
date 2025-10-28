import React from 'react';
import { BookOpenIcon } from '../constants';

const CheckIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const PlanCard: React.FC<{ plan: any, isHighlighted?: boolean }> = ({ plan, isHighlighted = false }) => {
    return (
        <div className={`border rounded-2xl p-8 flex flex-col ${isHighlighted ? 'bg-white shadow-2xl scale-105 border-purple-400' : 'bg-white shadow-lg'}`}>
            <h3 className="text-xl font-semibold text-gray-800">{plan.name}</h3>
            <p className="text-gray-500 mt-2 h-12">{plan.description}</p>
            <div className="mt-6">
                <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                {plan.period && <span className="text-gray-500">/{plan.period}</span>}
            </div>
            <ul className="mt-8 space-y-4 flex-grow">
                {plan.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center">
                        <CheckIcon className="h-5 w-5 text-green-500" />
                        <span className="ml-3 text-gray-600">{feature}</span>
                    </li>
                ))}
            </ul>
            <button className={`mt-8 w-full py-3 rounded-lg font-semibold transition-colors ${isHighlighted ? 'bg-gradient-to-r from-purple-500 to-cyan-400 text-white hover:opacity-90' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {plan.cta}
            </button>
        </div>
    );
};


const PlansPage: React.FC = () => {
    const plans = [
        {
            name: 'Free',
            price: '$0',
            period: 'month',
            description: 'Perfect for individuals starting out with AI.',
            features: [
                'Basic text chat',
                '10 image generations per month',
                'Standard access to models',
                'Community support',
            ],
            cta: 'Get Started'
        },
        {
            name: 'Pro',
            price: '$20',
            period: 'month',
            description: 'For power users and professionals who need more.',
            features: [
                'All features in Free',
                'Unlimited image & video generations',
                'Access to "Thinking Mode"',
                'Excel Co-Pilot access',
                'Priority email support',
            ],
            cta: 'Upgrade to Pro'
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            description: 'For businesses and teams that need advanced control and support.',
            features: [
                'All features in Pro',
                'Admin Dashboard',
                'Team management tools',
                'Dedicated support & onboarding',
                'Custom security reviews',
            ],
            cta: 'Contact Sales'
        },
    ];

    return (
        <div className="min-h-full p-4 md:p-12 bg-gray-50">
            <div className="text-center mb-12 max-w-2xl mx-auto">
                <div className="inline-block p-3 bg-purple-100 rounded-full mb-4">
                     {/* FIX: BookOpenIcon was used without being imported. */}
                     <BookOpenIcon className="h-8 w-8 text-purple-600" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                    Find the Right Plan for You
                </h1>
                <p className="text-gray-500 mt-4 text-lg">Unlock more features and power as you grow. Choose the plan that fits your needs.</p>
            </div>
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <PlanCard plan={plans[0]} />
                <PlanCard plan={plans[1]} isHighlighted={true} />
                <PlanCard plan={plans[2]} />
            </div>
        </div>
    );
};

export default PlansPage;