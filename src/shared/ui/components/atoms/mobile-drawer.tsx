import { type ReactNode, useState } from 'react';

import { FileText, Home, Info, Menu, X } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@ui/components/atoms/button';

interface NavLink {
  label: string;
  href: string;
}

interface MobileDrawerProps {
  navLinks: NavLink[];
}

const iconMap: Record<string, ReactNode> = {
  HOME: <Home className="h-4 w-4" />,
  BLOG: <FileText className="h-4 w-4" />,
  ABOUT: <Info className="h-4 w-4" />,
};

const MobileDrawer = ({ navLinks }: MobileDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button */}
      <Button
        variant="ghost"
        size="icon"
        className="text-white hover:bg-white/10 md:hidden"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsOpen(false)} />}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-80 transform bg-gray-50 shadow-xl transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-full flex-col">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b bg-white p-4">
            <h2 className="text-xl font-bold text-gray-800">Menu</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {/* Apps Section */}
            <div className="flex flex-col gap-2 overflow-hidden rounded-xl border border-gray-100 bg-white p-2 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800">Apps</h3>
              <div className="align-center flex bg-white">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex h-10 items-center gap-3 rounded-lg p-3 text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                    onClick={handleLinkClick}
                  >
                    {iconMap[link.label] ?? <span className="h-4 w-4" />}
                  </Link>
                ))}
              </div>
            </div>

            {/* TODO 외부에서 주입된 메뉴 컴포넌트 */}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileDrawer;
