'use client';

import Link from 'next/link';

import MobileDrawer from '@ui/components/atoms/mobile-drawer';

interface NavLink {
  label: string;
  href: string;
}

const defaultNavLinks: NavLink[] = [
  { label: 'HOME', href: '/' },
  { label: 'BLOG', href: '/blog' },
  { label: 'ABOUT', href: '/about' },
];

interface HeaderProps {
  navLinks?: NavLink[];
}

const Header: React.FC<HeaderProps> = ({ navLinks = defaultNavLinks }) => (
  <nav className="bg-[#2C4E9C]">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
      <div className="flex items-center gap-8 text-white">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="hidden text-sm font-medium tracking-wider transition-opacity hover:opacity-80 md:block"
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <MobileDrawer navLinks={navLinks} />
      </div>
    </div>
  </nav>
);

export default Header;
