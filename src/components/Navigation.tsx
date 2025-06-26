'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
    // Get the current pathname using the usePathname hook
    const pathname = usePathname();

    // Function to check if a link is active
    const isActive = (href: string) => {
        // Check if the current pathname matches the link href
        // or if the pathname starts with the href for nested routes
        return pathname === href || pathname.startsWith(href);
    };

    const navItems = [
        { href: '#airport', label: 'airport' },
        { href: '#transport', label: 'transportation' }
    ];

    return (
        <nav>
            <ul className="flex items-center justify-center gap-6">
                {navItems.map((item) => (
                    <li key={item.href}>
                        <Link
                            href={item.href}
                            className={`uppercase text-sm font-medium transition-all duration-200 ease-in-out ${isActive(item.href) ? 'text-primary' : 'text-neutral-500 hover:text-primary'
                                }`}
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}