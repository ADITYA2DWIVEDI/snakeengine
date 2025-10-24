// Fix: Add React types reference to resolve JSX compilation errors.
/// <reference types="react" />
import React from 'react';
import { ApiProvider } from '../../types';
import { Icon } from '../icons';

export const ProviderIcon: React.FC<{ provider: ApiProvider; className?: string }> = ({ provider, className = "w-5 h-5" }) => {
    switch (provider) {
        case 'Google':
            return <Icon name="google" className={className} />;
        case 'OpenAI':
            return <Icon name="openai" className={className} />;
        case 'Anthropic':
            return <Icon name="anthropic" className={className} />;
        case 'Perplexity':
            return <Icon name="perplexity" className={className} />;
        case 'DeepSeek':
            return <Icon name="deepseek" className={className} />;
        case 'Grok':
            return <Icon name="grok" className={className} />;
        default:
            return <Icon name="key" className={`${className} text-slate-400`} />;
    }
};