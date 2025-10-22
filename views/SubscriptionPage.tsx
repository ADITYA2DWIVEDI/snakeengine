import React from 'react';

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-purple" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const PlanCard = ({ plan, price, features, popular }: { plan: string, price: string, features: string[], popular?: boolean }) => (
    <div className={`relative p-8 rounded-2xl glass-pane flex flex-col transition-all duration-300 ${popular ? 'border-brand-purple/80 shadow-glow-purple scale-105' : 'border-border-color shadow-lg hover:border-slate-300'}`}>
        {popular && <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand-purple text-white text-sm font-semibold rounded-full shadow-lg">Most Popular</div>}
        <h3 className="text-2xl font-semibold text-text-primary">{plan}</h3>
        <p className="mt-4 text-4xl font-bold text-text-primary">{price}<span className="text-base font-medium text-text-secondary">/month</span></p>
        <ul className="mt-6 space-y-4 flex-1">
            {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                    <CheckIcon />
                    <span className="text-text-secondary">{feature}</span>
                </li>
            ))}
        </ul>
        <button className={`mt-8 w-full py-3 px-6 font-semibold rounded-lg shadow-lg transition-all transform hover:-translate-y-0.5 ${popular ? 'bg-gradient-to-br from-brand-purple to-brand-pink text-white hover:shadow-glow-purple' : 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-50'}`}>
            {plan === 'Free' ? 'Current Plan' : 'Upgrade Plan'}
        </button>
    </div>
);

export const SubscriptionPage: React.FC = () => {
    return (
        <div className="h-full w-full p-4 md:p-8 overflow-y-auto">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-bold text-text-primary gradient-text">Find the perfect plan</h1>
                <p className="text-text-secondary mt-2 max-w-2xl mx-auto">Unlock more features and power with our Pro and Enterprise plans. Start for free, upgrade anytime.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
                <PlanCard 
                    plan="Free"
                    price="$0"
                    features={["10 chats/day", "50 image generations", "50 video generations", "Standard AI model", "Access to basic templates"]}
                />
                <PlanCard 
                    plan="Pro"
                    price="$20"
                    features={["Unlimited chats", "Unlimited image & video", "Advanced AI model", "Access to all templates", "Advanced AI Tools", "Priority support"]}
                    popular
                />
                <PlanCard 
                    plan="Enterprise"
                    price="Contact Us"
                    features={["Everything in Pro", "Team collaboration features", "Dedicated infrastructure", "API Access", "Custom integrations", "24/7 priority support"]}
                />
            </div>
        </div>
    );
};