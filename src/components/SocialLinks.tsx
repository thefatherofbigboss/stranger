'use client';

import { Instagram, Youtube, Twitter, Linkedin, Facebook } from 'lucide-react';

const socialLinks = [
    {
        name: 'Instagram',
        url: 'https://www.instagram.com/strangermingle/',
        icon: Instagram,
        color: 'text-pink-600 hover:text-pink-700',
        bg: 'bg-pink-100'
    },
    {
        name: 'YouTube',
        url: 'https://www.youtube.com/@strangermingle',
        icon: Youtube,
        color: 'text-red-600 hover:text-red-700',
        bg: 'bg-red-100'
    },
    {
        name: 'X (Twitter)',
        url: 'https://x.com/strangermingle',
        icon: Twitter,
        color: 'text-gray-800 hover:text-gray-900',
        bg: 'bg-gray-100'
    },
    {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/company/strangermingle',
        icon: Linkedin,
        color: 'text-blue-700 hover:text-blue-800',
        bg: 'bg-blue-100'
    },
    {
        name: 'Facebook',
        url: 'https://www.facebook.com/strangermingle',
        icon: Facebook,
        color: 'text-blue-600 hover:text-blue-700',
        bg: 'bg-blue-50'
    }
];

export default function SocialLinks({ className = '', variant = 'default' }: { className?: string, variant?: 'default' | 'footer' }) {
    if (variant === 'footer') {
        return (
            <div className={`flex gap-4 ${className}`}>
                {socialLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label={`Follow us on ${link.name}`}
                    >
                        <link.icon className="w-5 h-5" />
                    </a>
                ))}
            </div>
        );
    }

    return (
        <div className={`flex flex-wrap justify-center gap-4 ${className}`}>
            {socialLinks.map((link) => (
                <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 flex items-center justify-center rounded-full ${link.bg} ${link.color} transition-transform hover:scale-110 shadow-sm`}
                    aria-label={`Follow us on ${link.name}`}
                >
                    <link.icon className="w-6 h-6" />
                </a>
            ))}
        </div>
    );
}
