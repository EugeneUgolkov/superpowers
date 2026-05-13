'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NewBadge } from './NewBadge';
import { NavDropdown } from './NavDropdown';
import { TreatmentsMegaMenu } from './TreatmentsMegaMenu';
import { navConfig } from './nav.config';

const SCROLL_THRESHOLD_PX = 80;

export function NavBar() {
  const pathname = usePathname();
  const [openId, setOpenId] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD_PX);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpenId(null);
  }, [pathname]);

  const setOpen = (id: string) => setOpenId(id);
  const close = () => setOpenId(null);

  return (
    <div
      className={`hidden lg:block bg-slate-900 transition-shadow ${
        scrolled ? 'border-b border-white/10' : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
        >
          Humanaut Health
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-1">
          {navConfig.primary.map((item) => {
            if (item.type === 'flyout') {
              return (
                <NavDropdown
                  key={item.label}
                  section={item}
                  isOpen={openId === item.label}
                  onOpen={() => setOpen(item.label)}
                  onClose={close}
                />
              );
            }
            if (item.type === 'mega') {
              return (
                <TreatmentsMegaMenu
                  key={item.label}
                  label={item.label}
                  href={item.href}
                  isOpen={openId === item.label}
                  onOpen={() => setOpen(item.label)}
                  onClose={close}
                />
              );
            }
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`relative inline-flex items-center px-3 py-2 text-sm font-medium text-white/90 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded ${
                  isActive
                    ? 'after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-0.5 after:bg-orange-500'
                    : ''
                }`}
              >
                {item.label}
                {item.badge === 'new' && <NewBadge />}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href={navConfig.utility.login}
            className="text-sm font-medium text-white/85 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded"
          >
            Login
          </Link>
          <Link
            href={navConfig.utility.book}
            className="inline-flex items-center rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            Book a Consultation
          </Link>
        </div>
      </div>
    </div>
  );
}
