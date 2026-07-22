'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Sidebar — Optional sidebar navigation for settings pages.
 */
export interface SidebarItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export interface SidebarProps {
  items: SidebarItem[];
  className?: string;
}

export default function Sidebar({ items, className = '' }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`w-full shrink-0 md:w-60 ${className}`} aria-label="Settings navigation">
      <nav>
        <ul className="flex flex-col gap-1">
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-4 py-2.5 font-body text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-offwhite/70 hover:bg-surface hover:text-white'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.icon && <span className="h-5 w-5">{item.icon}</span>}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
