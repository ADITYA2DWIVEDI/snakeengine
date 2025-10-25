import * as React from 'react';
import { Page } from '../../types';
import { Icon } from '../icons';

const plans = [
    {
        name: 'Free',
        price: '$0',
        period: '/ month',
        description: 'Perfect for individuals starting out with AI.',
        features: [
            'Basic text chat',
            '10 image generations per month',
            'Standard access to models',
            'Community support',
        ],
        cta: 'Get Started',
        primary: false,
    },
    {
        name: 'Pro',
        price: '$20',
        period: '/ month',
        description: 'For power users and professionals who need more.',
        features: [
            'All features in Free',
            'Unlimited image & video generations',
            'Access to "Thinking Mode"',
            'Excel Co-Pilot access',
            'Priority email support',
        ],
        cta: 'Upgrade to Pro',
        primary: true,
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        description: 'For businesses and teams that need advanced control and support.',
        features: [
            'All features in Pro',
            'Admin Dashboard',
            'Team management tools',
            'Dedicated support & onboarding',
            'Custom security reviews',
        ],
        cta: 'Contact Sales',
        primary: false,
    },
];

const PlansView: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto animate-fade-in">
            <div className="text-center mb-12">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center text-white mb-4 shadow-lg">
                    <Icon name={Page.PLANS_SUBSCRIPTIONS} className="w-10 h-10" />
                </div>
                <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">Find the Right Plan for You</h1>
                <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
                    Unlock more features and power as you grow. Choose the plan that fits your needs.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                {plans.map((plan) => (
                    <div 
                        key={plan.name}
                        className={`bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border-2 transition-all duration-300 flex flex-col h-full ${plan.primary ? 'border-purple-500 dark:border-teal-400 md:transform lg:scale-105' : 'border-slate-200 dark:border-slate-700'}`}
                    >
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{plan.name}</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{plan.description}</p>
                        <div className="mt-6">
                            <span className="text-4xl font-extrabold text-slate-900 dark:text-slate-50">{plan.price}</span>
                            <span className="text-base font-medium text-slate-500 dark:text-slate-400">{plan.period}</span>
                        </div>
                        <ul className="mt-8 space-y-4">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-start">
                                    <Icon name="checkmark" className="w-5 h-5 text-green-500 flex-shrink-0 mr-3 mt-0.5" />
                                    <span className="text-slate-600 dark:text-slate-300">{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="flex-1" />
                         <button className={`w-full py-3 mt-8 font-semibold rounded-lg transition-colors ${plan.primary ? 'bg-gradient-to-r from-purple-500 to-teal-500 text-white hover:opacity-90' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>
                            {plan.cta}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlansView;