import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/shared/ui/components/atoms/button';

const Footer: React.FC = () => (
  <footer className="mt-16 bg-[#2C4E9C] text-white">
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* About Column */}
        <div>
          <h3 className="mb-4 text-lg font-bold">About</h3>
          <p className="text-sm leading-relaxed text-white/80">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas mattis est eu odio sagittis tristique.
          </p>
        </div>

        {/* Quick Links Column */}
        <div>
          <h3 className="mb-4 text-lg font-bold">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/shop" className="text-white/80 transition-colors hover:text-white">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-white/80 transition-colors hover:text-white">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-white/80 transition-colors hover:text-white">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-white/80 transition-colors hover:text-white">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Column */}
        <div>
          <h3 className="mb-4 text-lg font-bold">Follow Us</h3>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon-sm" className="text-white hover:bg-white/10" asChild>
              <a href="#" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon-sm" className="text-white hover:bg-white/10" asChild>
              <a href="#" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon-sm" className="text-white hover:bg-white/10" asChild>
              <a href="#" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon-sm" className="text-white hover:bg-white/10" asChild>
              <a href="#" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/20 pt-8 text-center">
        <p className="text-sm text-white/60">© 2025 Minimal Blog. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
