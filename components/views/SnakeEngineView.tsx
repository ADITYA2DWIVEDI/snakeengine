import React from 'react';
import { Page, Feature } from '../../types';
import { Icon } from '../icons';

const keyCharacteristics = [
    { icon: 'game-controller' as const, title: 'Automatic Gameplay', description: 'Plays matches automatically, aiming and shooting without user input.' },
    { icon: 'grid' as const, title: 'Precision', description: 'Designed for surgical precision in executing shots.' },
    { icon: 'eye-slash' as const, title: 'Ad Blocking', description: 'Can block annoying in-game advertisements.' },
    { icon: 'android' as const, title: 'Compatibility', description: 'Works on specific Android versions (e.g., Android 9-15, 64-bit) and requires a subscription. Not for tablets or emulators.' },
    { icon: 'lock' as const, title: 'No Root Required', description: 'Does not require rooting the device or modifying game files.' },
];

const otherContexts = [
     { icon: 'photo' as const, title: 'AI-Generated Illustrations', description: 'The term is sometimes used in descriptions for AI-generated images featuring snakes and engines, or realistic snake illustrations.' },
    // Fix: Use the `Feature.CODE_CONVERTER` enum for the icon name to match the allowed types.
     { icon: Feature.CODE_CONVERTER, title: 'Game Development', description: 'An open-source project on GitHub called "PiXeL16/SnakeClassic" is a snake engine written in SpriteKit for Apple devices.' },
]

const SnakeEngineView: React.FC = () => {
    return (
        <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
                <Icon name={Page.SNAKE_ENGINE} className="w-8 h-8 gradient-text" />
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">SnakeEngine: The Ultimate Aim Tool</h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-3xl">
                "Snake Engine" primarily refers to a powerful aim tool designed to enhance gameplay in mobile games like 8 Ball Pool and Carrom Pool. This tool offers an "Auto Play" feature that automatically aims and executes shots with precision, removing the need for manual screen interaction.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-6">Key Characteristics</h2>
                    <div className="space-y-6">
                        {keyCharacteristics.map(item => (
                            <div key={item.title} className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 text-purple-600 dark:text-teal-400 flex items-center justify-center">
                                    <Icon name={item.icon} className="w-5 h-5"/>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">{item.title}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                 <div className="space-y-8">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-6">Beyond the Game Tool</h2>
                        <div className="space-y-6">
                             {otherContexts.map(item => (
                                <div key={item.title} className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 text-purple-600 dark:text-teal-400 flex items-center justify-center">
                                        <Icon name={item.icon} className="w-5 h-5"/>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800 dark:text-slate-100">{item.title}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SnakeEngineView;
