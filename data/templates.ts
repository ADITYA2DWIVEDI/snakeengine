import { Page, Feature } from '../types';

export interface Template {
    category: string;
    title: string;
    description: string;
    prompt: string;
    icon: 'speaker' | Page | 'brain' | 'grid' | 'send';
}

export const templates: Template[] = [
    {
        category: 'Marketing',
        title: 'Social Media Post',
        description: 'Generate an engaging social media post for a new product launch.',
        prompt: 'Write an exciting and engaging social media post for a new product launch. The product is [Your Product Name], and its key features are [Feature 1], [Feature 2], and [Feature 3]. The target audience is [Your Target Audience]. Include relevant hashtags.',
        icon: 'speaker'
    },
    {
        category: 'Marketing',
        title: 'Ad Copy',
        description: 'Create compelling ad copy that drives conversions.',
        prompt: 'Create three versions of a compelling ad copy for a [Product/Service]. The main benefit is [Main Benefit]. The target audience is [Target Audience]. The tone should be [Tone, e.g., urgent, friendly, professional].',
        icon: 'speaker'
    },
    {
        category: 'Content Creation',
        title: 'Blog Post Idea',
        description: 'Brainstorm a list of blog post ideas for a specific topic.',
        prompt: 'Generate 5 blog post ideas for the topic "[Your Topic]". The ideas should be creative, SEO-friendly, and appeal to an audience of [Target Audience].',
        icon: Page.TEMPLATES
    },
    {
        category: 'Content Creation',
        title: 'Summarize Text',
        description: 'Summarize a long piece of text into key bullet points.',
        prompt: 'Summarize the following text into 5 key bullet points:\n\n[Paste your text here]',
        icon: Page.TEMPLATES
    },
    {
        category: 'Coding',
        title: 'Write a Python Function',
        description: 'Generate a Python function to perform a specific task.',
        prompt: 'Write a Python function that takes a list of integers as input and returns the sum of all even numbers in the list. Include docstrings and an example of how to use it.',
        icon: 'brain'
    },
    {
        category: 'Coding',
        title: 'Explain Code',
        description: 'Get a clear explanation of what a piece of code does.',
        prompt: 'Explain what the following code does, line by line:\n\n[Paste your code here]',
        icon: 'brain'
    },
    {
        category: 'Productivity',
        title: 'Meeting Agenda',
        description: 'Quickly generate a structured agenda for a meeting.',
        prompt: 'Create a meeting agenda for a [Meeting Type] about [Topic]. Attendees are [List of Attendees]. The key objectives are [Objective 1] and [Objective 2]. The meeting is scheduled for [Date/Time] and will last [Duration].',
        icon: 'grid'
    },
    {
        category: 'Productivity',
        title: 'Email Reply',
        description: 'Draft a professional reply to an email.',
        prompt: 'Draft a professional email reply to the following email. My key response points are: [Point 1], [Point 2], and [Point 3]. My desired tone is [e.g., formal, friendly, concise].\n\nOriginal Email:\n"""\n[Paste email text here]\n"""',
        icon: 'send'
    },
];
